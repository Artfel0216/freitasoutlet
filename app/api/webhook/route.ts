import { NextResponse } from 'next/server'
import { updateOrderStatus, getOrderById, updatePaymentInfo, getOrderByNumber } from '@/lib/db'
import { sendOrderConfirmation } from '@/lib/email'
import { sendShippingUpdate } from '@/lib/email'
import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/rate-limit'
import { decrementStock } from '@/lib/stock'
import { getStripe } from '@/lib/stripe'
import { getClientIp } from '@/lib/client-ip'

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rl = await rateLimit(`webhook:${ip}`, 100, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const rawBody = await request.text()

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      logger.error('Webhook: STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    const signature = request.headers.get('stripe-signature')
    if (!signature) {
      logger.warn('Webhook: missing stripe-signature header')
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }

    let event: { type: string; data: { object: Record<string, unknown> } }

    try {
      const stripe = getStripe()
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret) as unknown as typeof event
    } catch (err) {
      logger.warn('Webhook: invalid signature', { ip, error: String(err) })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    logger.info('Webhook received', { type: event.type })

    const { type, data } = event

    if (type === 'payment_intent.succeeded') {
      const metadata = data.object?.metadata as Record<string, string> | undefined
      const orderId = metadata?.orderId || metadata?.order_id
      let order = orderId ? await getOrderById(orderId) : undefined

      if (!order && metadata?.orderNumber) {
        order = await getOrderByNumber(metadata.orderNumber)
      }

      if (!order) {
        logger.warn('Webhook: order not found', { orderId })
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      if (order.status === 'pending') {
        await decrementStock(order.items.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })))
        logger.info('Stock decremented for order', { orderId: order.id, orderNumber: order.orderNumber })
      }

      await updatePaymentInfo(order.id, {
        gatewayTransactionId: (data.object?.id as string) || '',
        gatewayStatus: 'approved',
      })

      await updateOrderStatus(order.id, 'approved')

      sendOrderConfirmation({
        to: order.customer.email,
        name: order.customer.name,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: 'Cartão de Crédito/Débito',
      }).catch((err) => logger.error('Failed to send webhook confirmation', { error: String(err) }))

      logger.info('Payment approved via webhook', { orderId: order.id, orderNumber: order.orderNumber })
    }

    if (type === 'payment_intent.payment_failed') {
      const metadata = data.object?.metadata as Record<string, string> | undefined
      const orderId = metadata?.orderId || metadata?.order_id
      let order = orderId ? await getOrderById(orderId) : undefined

      if (!order && metadata?.orderNumber) {
        order = await getOrderByNumber(metadata.orderNumber)
      }

      if (order) {
        await updatePaymentInfo(order.id, { gatewayStatus: 'rejected' })
        await updateOrderStatus(order.id, 'rejected')
        logger.info('Payment rejected via webhook', { orderId: order.id })
      }
    }

    if (type === 'charge.refunded') {
      const paymentIntentId = data.object?.payment_intent as string | undefined
      if (!paymentIntentId) {
        logger.warn('Webhook charge.refunded: missing payment_intent')
        return NextResponse.json({ received: true })
      }

      const order = await getOrderById(paymentIntentId)
      const orderByNumber = order ? undefined : await getOrderByNumber(paymentIntentId)

      const target = order || orderByNumber
      if (!target) {
        logger.warn('Webhook charge.refunded: order not found', { paymentIntentId })
        return NextResponse.json({ received: true })
      }

      await updateOrderStatus(target.id, 'refunded')
      await updatePaymentInfo(target.id, { gatewayStatus: 'refunded' })

      logger.info('Order refunded via webhook', { orderId: target.id, orderNumber: target.orderNumber })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Webhook error', { error: String(error) })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
