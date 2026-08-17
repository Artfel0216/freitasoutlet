import { NextResponse } from 'next/server'
import { createOrder, getOrderByIdempotencyKey } from '@/lib/db'
import { checkoutSchema } from '@/lib/validations'
import { analyzeOrder } from '@/lib/fraud'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { getClientIp } from '@/lib/client-ip'
import { getLoyaltyDiscount } from '@/lib/loyalty-server'
import { buildIdempotencyKey, type CheckoutItem } from './idempotency'
import { verifyItems } from './items'
import { computeTotals } from './pricing'
import { buildExistingOrderResponse, buildRejectedOrderResponse } from './order-response'
import { handleCardPayment, handlePixPayment } from './payment-handlers'
import type { CheckoutData } from './types'

type PaymentMethod = 'pix' | 'credit' | 'debit'

export async function processCheckout(
  request: Request,
  body: Record<string, unknown>,
): Promise<NextResponse> {
  const ip = getClientIp(request)
  const rl = await rateLimit(`checkout:${ip}`, 10, 60_000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente em instantes.' },
      { status: 429 },
    )
  }

  const { data, paymentMethod, items, shipping: shippingOption, couponCode, paymentMethodId } = body
  const payment = paymentMethod as PaymentMethod
  const checkoutItems = items as CheckoutItem[]
  const rawData = data as CheckoutData

  const idempotencyKey = buildIdempotencyKey({
    data: rawData,
    items: checkoutItems,
    paymentMethod: payment,
    shipping: shippingOption as string | undefined,
    couponCode: couponCode as string | null,
  })

  const existingOrder = await getOrderByIdempotencyKey(idempotencyKey)
  if (existingOrder) {
    if (existingOrder.status === 'rejected') {
      return buildRejectedOrderResponse(existingOrder)
    }
    return buildExistingOrderResponse(existingOrder)
  }

  const parsedData = checkoutSchema.safeParse(rawData)
  if (!parsedData.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', details: parsedData.error.flatten().fieldErrors },
      { status: 400 },
    )
  }
  const checkoutData = parsedData.data

  if (!checkoutItems || !Array.isArray(checkoutItems) || checkoutItems.length === 0) {
    return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 })
  }

  const verification = await verifyItems(checkoutItems)
  if (!verification.ok) {
    return NextResponse.json({ error: verification.error }, { status: verification.status })
  }

  const loyaltyDiscountPercent = await getLoyaltyDiscount(checkoutData.email)
  const { totals, error: totalsError } = await computeTotals({
    items: checkoutItems,
    couponCode: couponCode as string | null,
    loyaltyDiscountPercent,
    shippingOption: shippingOption as string | undefined,
    state: checkoutData.state,
  })
  if (totalsError) {
    return NextResponse.json({ error: totalsError }, { status: 400 })
  }

  const fraudResult = analyzeOrder({
    amount: totals.subtotal,
    cpf: checkoutData.cpf,
    email: checkoutData.email,
    name: checkoutData.name,
    phone: checkoutData.phone,
    items: checkoutItems.length,
  })

  if (fraudResult.status === 'rejected') {
    const order = await createOrder(
      {
        status: 'rejected',
        customer: {
          name: checkoutData.name,
          email: checkoutData.email,
          cpf: checkoutData.cpf,
          phone: checkoutData.phone,
        },
        address: {
          cep: checkoutData.cep,
          street: checkoutData.street,
          number: checkoutData.number,
          neighborhood: checkoutData.neighborhood,
          city: checkoutData.city,
          state: checkoutData.state,
        },
        items: checkoutItems,
        payment: { method: payment },
        subtotal: totals.subtotal,
        shipping: totals.shippingCost,
        discount: totals.discountValue,
        total: totals.total,
        fraudAnalysis: fraudResult,
      },
      idempotencyKey,
    )

    logger.warn('Order rejected by fraud analysis', { orderId: order.id, score: fraudResult.score })

    return NextResponse.json(
      {
        error: 'Transação rejeitada pela análise de segurança',
        orderId: order.id,
        orderNumber: order.orderNumber,
        fraudResult,
      },
      { status: 403 },
    )
  }

  const common = {
    payment,
    checkoutData,
    checkoutItems,
    totals,
    idempotencyKey,
    fraudResult,
    couponCode: couponCode as string | null,
  }

  if (payment === 'credit' || payment === 'debit') {
    return handleCardPayment({
      ...common,
      paymentMethodId: paymentMethodId as string | undefined,
      installments: body.installments as number | undefined,
    })
  }

  if (payment === 'pix') {
    return handlePixPayment(common)
  }

  return NextResponse.json({ error: 'Método de pagamento inválido' }, { status: 400 })
}