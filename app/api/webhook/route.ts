import { NextResponse } from 'next/server'
import { updateOrderStatus, getOrderById, updatePaymentInfo, getOrderByNumber } from '@/lib/db'
import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/rate-limit'
import { decrementStock } from '@/lib/stock'
import { getStripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const rl = await rateLimit(`webhook:${ip}`, 100, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const rawBody = await request.text()

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret && process.env.NODE_ENV === 'production') {
      logger.error('Webhook: STRIPE_WEBHOOK_SECRET not configured in production')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }
    if (webhookSecret) {
      const signature = request.headers.get('stripe-signature')
      if (!signature) {
        logger.warn('Webhook: missing stripe-signature header')
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
      }
      try {
        const stripe = getStripe()
        const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
        logger.info('Webhook: signature verified', { ip, type: event.type })
      } catch (err) {
        logger.warn('Webhook: invalid signature', { ip, error: String(err) })
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const body = JSON.parse(rawBody)

    logger.info('Webhook received', { type: body.type })

    const { type, data } = body

    if (type === 'payment_intent.succeeded') {
      const orderId = data.object?.metadata?.orderId || data.object?.metadata?.order_id
      let order = orderId ? await getOrderById(orderId) : undefined

      if (!order && data.object?.metadata?.orderNumber) {
        order = await getOrderByNumber(data.object.metadata.orderNumber)
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
        gatewayTransactionId: data.object?.id,
        gatewayStatus: 'approved',
      })

      await updateOrderStatus(order.id, 'approved')

      logger.info('Payment approved via webhook', { orderId: order.id, orderNumber: order.orderNumber })
    }

    if (type === 'payment_intent.payment_failed') {
      const orderId = data.object?.metadata?.orderId || data.object?.metadata?.order_id
      let order = orderId ? await getOrderById(orderId) : undefined

      if (!order && data.object?.metadata?.orderNumber) {
        order = await getOrderByNumber(data.object.metadata.orderNumber)
      }

      if (order) {
        await updatePaymentInfo(order.id, { gatewayStatus: 'rejected' })
        await updateOrderStatus(order.id, 'rejected')
        logger.info('Payment rejected via webhook', { orderId: order.id })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Webhook error', { error: String(error) })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
