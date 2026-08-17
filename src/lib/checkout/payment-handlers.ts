import { NextResponse } from 'next/server'
import { createOrder, updatePaymentInfo } from '@/lib/db'
import { createStripePaymentIntent, processPixPayment } from '@/lib/payment'
import { sendOrderConfirmation } from '@/lib/email'
import { decrementStock } from '@/lib/stock'
import { logger } from '@/lib/logger'
import { incrementCouponUsage } from './coupons'
import type { CheckoutData, CardPaymentInput, PaymentHandlerInput } from './types'

function customerFrom(data: CheckoutData) {
  return { name: data.name, email: data.email, cpf: data.cpf, phone: data.phone }
}

function addressFrom(data: CheckoutData) {
  return {
    cep: data.cep,
    street: data.street,
    number: data.number,
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state,
  }
}

function paymentLabel(method: string): string {
  if (method === 'pix') return 'Pix'
  return method === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito'
}

function sendConfirmation(
  data: CheckoutData,
  orderNumber: string,
  total: number,
  paymentMethod: string,
) {
  sendOrderConfirmation({
    to: data.email,
    name: data.name,
    orderNumber,
    total,
    paymentMethod: paymentLabel(paymentMethod),
  }).catch((err) => logger.error('Failed to send order confirmation', { error: String(err) }))
}

export async function handleCardPayment(input: CardPaymentInput): Promise<NextResponse> {
  const {
    payment,
    checkoutData,
    checkoutItems,
    totals,
    idempotencyKey,
    fraudResult,
    paymentMethodId,
    installments,
    couponCode,
  } = input

  if (!paymentMethodId) {
    return NextResponse.json({ error: 'Dados do pagamento são obrigatórios' }, { status: 400 })
  }

  const order = await createOrder(
    {
      status: 'pending',
      customer: customerFrom(checkoutData),
      address: addressFrom(checkoutData),
      items: checkoutItems,
      payment: {
        method: payment,
        gatewayTransactionId: '',
        gatewayStatus: 'pending',
      },
      subtotal: totals.subtotal,
      shipping: totals.shippingCost,
      discount: totals.discountValue,
      total: totals.total,
      fraudAnalysis: fraudResult,
    },
    idempotencyKey,
  )

  const piResult = await createStripePaymentIntent({
    amount: totals.total,
    currency: 'brl',
    orderId: order.id,
    orderNumber: order.orderNumber,
    installments: payment === 'credit' ? installments || 1 : 1,
  })

  if (!piResult.success || !piResult.clientSecret) {
    await updatePaymentInfo(order.id, { gatewayStatus: 'failed' })
    logger.error('Failed to create Stripe PaymentIntent', { orderId: order.id, error: piResult.error })
    return NextResponse.json({ error: piResult.error || 'Erro ao processar pagamento' }, { status: 500 })
  }

  await updatePaymentInfo(order.id, {
    gatewayTransactionId: piResult.paymentIntentId || '',
    gatewayStatus: 'processing',
    clientSecret: piResult.clientSecret,
  })

  sendConfirmation(checkoutData, order.orderNumber, totals.total, payment)
  if (couponCode) await incrementCouponUsage(couponCode)
  logger.info('Stripe PaymentIntent created', { orderId: order.id, orderNumber: order.orderNumber })

  return NextResponse.json({
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: 'pending',
    clientSecret: piResult.clientSecret,
    paymentIntentId: piResult.paymentIntentId,
  })
}

export async function handlePixPayment(input: PaymentHandlerInput): Promise<NextResponse> {
  const { checkoutData, checkoutItems, totals, idempotencyKey, fraudResult, couponCode } = input

  const result = await processPixPayment(checkoutData.cpf, totals.total)

  const order = await createOrder(
    {
      status: 'pending',
      customer: customerFrom(checkoutData),
      address: addressFrom(checkoutData),
      items: checkoutItems,
      payment: {
        method: 'pix',
        pixKey: result.paymentInfo.pixKey,
        pixQrCode: result.paymentInfo.pixQrCode,
        gatewayTransactionId: result.transactionId,
        gatewayStatus: result.status,
      },
      subtotal: totals.subtotal,
      shipping: totals.shippingCost,
      discount: totals.discountValue,
      total: totals.total,
      fraudAnalysis: fraudResult,
    },
    idempotencyKey,
  )

  await updatePaymentInfo(order.id, {
    pixKey: result.paymentInfo.pixKey,
    pixQrCode: result.paymentInfo.pixQrCode,
  })

  await decrementStock(
    checkoutItems.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
  )

  sendConfirmation(checkoutData, order.orderNumber, totals.total, 'pix')
  if (couponCode) await incrementCouponUsage(couponCode)
  logger.info('Pix order created', { orderId: order.id, orderNumber: order.orderNumber })

  return NextResponse.json({
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: result.status,
    pix: {
      ...result.paymentInfo,
      pixKey: result.paymentInfo.pixKey?.replace(/(\d{3})\d{6}(\d{2})/, '$1******$2'),
    },
  })
}