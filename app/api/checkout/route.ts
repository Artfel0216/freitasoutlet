import { NextResponse } from 'next/server'
import { checkoutSchema } from '@/lib/validations'
import { createOrder, updatePaymentInfo } from '@/lib/db'
import { createStripePaymentIntent, processPixPayment } from '@/lib/payment'
import { analyzeOrder } from '@/lib/fraud'
import { getProductById } from '@/data/products'
import { sendOrderConfirmation } from '@/lib/email'
import { calculateShipping } from '@/lib/shipping'
import { rateLimit } from '@/lib/rate-limit'
import { decrementStock } from '@/lib/stock'
import { logger } from '@/lib/logger'
import { queryOne, queryRun } from '@/lib/database'

async function validateCoupon(code: string, orderTotal: number): Promise<{ valid: boolean; discount: number; error?: string }> {
  if (!code) return { valid: false, discount: 0, error: 'Cupom obrigatório' }
  try {
    const row = await queryOne('SELECT * FROM coupons WHERE code = $1', [code.toUpperCase()])
    if (!row) return { valid: false, discount: 0, error: 'Cupom inválido' }
    if (!row.active) return { valid: false, discount: 0, error: 'Cupom inativo' }
    if (row.expires_at && new Date(row.expires_at as string) < new Date()) return { valid: false, discount: 0, error: 'Cupom expirado' }
    if (row.max_uses && (row.used_count as number) >= (row.max_uses as number)) return { valid: false, discount: 0, error: 'Cupom atingiu o limite de uso' }
    if (row.min_order && orderTotal < Number(row.min_order)) return { valid: false, discount: 0, error: `Pedido mínimo de R$ ${Number(row.min_order).toFixed(2).replace('.', ',')}` }

    let discount = 0
    if (row.discount_type === 'percent') {
      discount = orderTotal * Number(row.discount_value) / 100
    } else {
      discount = Math.min(Number(row.discount_value), orderTotal)
    }
    return { valid: true, discount }
  } catch {
    return { valid: false, discount: 0, error: 'Erro ao validar cupom' }
  }
}

async function incrementCouponUsage(code: string): Promise<void> {
  await queryRun('UPDATE coupons SET used_count = used_count + 1 WHERE code = $1', [code.toUpperCase()])
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'validate') {
      const parsed = checkoutSchema.safeParse(body.data)
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Dados inválidos', details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }
      return NextResponse.json({ valid: true })
    }

    if (action === 'process') {
      const ip = request.headers.get('x-forwarded-for') || 'anonymous'
      const rl = await rateLimit(`checkout:${ip}`, 10, 60_000)
      if (!rl.allowed) {
        return NextResponse.json({ error: 'Muitas requisições. Tente novamente em instantes.' }, { status: 429 })
      }

      const { data, paymentMethod, items, shipping: shippingOption, couponCode, loyaltyDiscountPercent, paymentMethodId } = body

      const parsedData = checkoutSchema.safeParse(data)
      if (!parsedData.success) {
        return NextResponse.json(
          { error: 'Dados inválidos', details: parsedData.error.flatten().fieldErrors },
          { status: 400 }
        )
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 })
      }

      for (const item of items) {
        let serverPrice: number | undefined
        let sizeStock: number | undefined

        const staticProduct = getProductById(item.productId)
        if (staticProduct) {
          serverPrice = staticProduct.price
          sizeStock = staticProduct.stock?.[item.size]
        } else {
          try {
            const row = await queryOne('SELECT price, stock FROM products WHERE id = $1 AND active = 1', [item.productId]) as { price: number; stock: string } | undefined
            if (row) {
              serverPrice = Number(row.price)
              const stock = JSON.parse(row.stock || '{}') as Record<string, number>
              sizeStock = stock[item.size]
            }
          } catch {}
        }

        if (serverPrice === undefined) {
          return NextResponse.json({ error: `Produto ${item.productName} não encontrado` }, { status: 400 })
        }

        if (Math.abs(item.unitPrice - serverPrice) > 0.01) {
          logger.warn('Price mismatch detected', { productId: item.productId, clientPrice: item.unitPrice, serverPrice })
          return NextResponse.json({ error: `Preço inválido para ${item.productName}` }, { status: 400 })
        }

        if (sizeStock === undefined) continue
        if (sizeStock < item.quantity) {
          return NextResponse.json({
            error: `Estoque insuficiente para ${item.productName} (tamanho ${item.size}). Disponível: ${sizeStock}`,
          }, { status: 409 })
        }
      }

      const subtotal = items.reduce((sum: number, item: { unitPrice: number; quantity: number }) => {
        return sum + item.unitPrice * item.quantity
      }, 0)

      let couponDiscount = 0
      if (couponCode) {
        const couponResult = await validateCoupon(couponCode, subtotal)
        if (!couponResult.valid) {
          return NextResponse.json({ error: couponResult.error }, { status: 400 })
        }
        couponDiscount = couponResult.discount
      }

      const loyaltyDiscount = typeof loyaltyDiscountPercent === 'number' && loyaltyDiscountPercent > 0
        ? subtotal * loyaltyDiscountPercent / 100
        : 0

      const discountValue = couponDiscount + loyaltyDiscount

      let shippingCost = 0
      if (shippingOption && data.state) {
        const shippingOptions = calculateShipping(data.state, items.length)
        const selected = shippingOptions.find((s) => s.service === shippingOption)
        if (selected) {
          shippingCost = selected.price
        }
      }

      const total = subtotal + shippingCost - discountValue

      const fraudResult = analyzeOrder({
        amount: subtotal,
        cpf: data.cpf,
        email: data.email,
        name: data.name,
        phone: data.phone,
        items: items.length,
      })

      if (fraudResult.status === 'rejected') {
        const order = await createOrder({
          status: 'rejected',
          customer: { name: data.name, email: data.email, cpf: data.cpf, phone: data.phone },
          address: { cep: data.cep, street: data.street, number: data.number, neighborhood: data.neighborhood, city: data.city, state: data.state },
          items,
          payment: { method: paymentMethod },
          subtotal,
          shipping: shippingCost,
          discount: discountValue,
          total,
          fraudAnalysis: fraudResult,
        })

        logger.warn('Order rejected by fraud analysis', { orderId: order.id, score: fraudResult.score })

        return NextResponse.json({
          error: 'Transação rejeitada pela análise de segurança',
          orderId: order.id,
          orderNumber: order.orderNumber,
          fraudResult,
        }, { status: 403 })
      }

      const customerName = data.name

      if (paymentMethod === 'credit' || paymentMethod === 'debit') {
        if (!paymentMethodId) {
          return NextResponse.json({ error: 'Dados do pagamento são obrigatórios' }, { status: 400 })
        }

        const order = await createOrder({
          status: 'pending',
          customer: { name: data.name, email: data.email, cpf: data.cpf, phone: data.phone },
          address: { cep: data.cep, street: data.street, number: data.number, neighborhood: data.neighborhood, city: data.city, state: data.state },
          items,
          payment: {
            method: paymentMethod,
            gatewayTransactionId: '',
            gatewayStatus: 'pending',
          },
          subtotal,
          shipping: shippingCost,
          discount: discountValue,
          total,
          fraudAnalysis: fraudResult,
        })

        const piResult = await createStripePaymentIntent({
          amount: total,
          currency: 'brl',
          orderId: order.id,
          orderNumber: order.orderNumber,
          installments: paymentMethod === 'credit' ? (body.installments || 1) : 1,
        })

        if (!piResult.success || !piResult.clientSecret) {
          await updatePaymentInfo(order.id, { gatewayStatus: 'failed' })
          logger.error('Failed to create Stripe PaymentIntent', { orderId: order.id, error: piResult.error })
          return NextResponse.json({ error: piResult.error || 'Erro ao processar pagamento' }, { status: 500 })
        }

        await updatePaymentInfo(order.id, {
          gatewayTransactionId: piResult.paymentIntentId || '',
          gatewayStatus: 'processing',
        })

        sendOrderConfirmation({
          to: data.email,
          name: data.name,
          orderNumber: order.orderNumber,
          total,
          paymentMethod: paymentMethod === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito',
        }).catch((err) => logger.error('Failed to send order confirmation', { error: String(err) }))

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

      if (paymentMethod === 'pix') {
        const result = await processPixPayment(data.cpf, total, customerName)

        const order = await createOrder({
          status: 'pending',
          customer: { name: data.name, email: data.email, cpf: data.cpf, phone: data.phone },
          address: { cep: data.cep, street: data.street, number: data.number, neighborhood: data.neighborhood, city: data.city, state: data.state },
          items,
          payment: {
            method: 'pix',
            pixKey: result.paymentInfo.pixKey,
            pixQrCode: result.paymentInfo.pixQrCode,
            gatewayTransactionId: result.transactionId,
            gatewayStatus: result.status,
          },
          subtotal,
          shipping: shippingCost,
          discount: discountValue,
          total,
          fraudAnalysis: fraudResult,
        })

        await updatePaymentInfo(order.id, {
          pixKey: result.paymentInfo.pixKey,
          pixQrCode: result.paymentInfo.pixQrCode,
        })

        await decrementStock(items.map((i: { productId: string; size: string; quantity: number }) => ({ productId: i.productId, size: i.size, quantity: i.quantity })))

        sendOrderConfirmation({
          to: data.email,
          name: data.name,
          orderNumber: order.orderNumber,
          total,
          paymentMethod: 'Pix',
        }).catch((err) => logger.error('Failed to send order confirmation', { error: String(err) }))

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

      return NextResponse.json({ error: 'Método de pagamento inválido' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (error) {
    logger.error('Checkout error', { error: String(error) })
    return NextResponse.json(
      { error: 'Erro interno ao processar pagamento' },
      { status: 500 }
    )
  }
}
