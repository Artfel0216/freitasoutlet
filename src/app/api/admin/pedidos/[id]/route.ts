import { NextResponse } from 'next/server'
import { getOrderById, updateOrderStatus, type OrderStatus } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { sendShippingUpdate } from '@/lib/email'
import { logger } from '@/lib/logger'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session.authenticated) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const order = await getOrderById(id)
    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    const { status, trackingCode, shippedAt, deliveredAt, unboxingVideoUrl } = await request.json()

    const validStatuses: OrderStatus[] = ['pending', 'approved', 'rejected', 'refunded', 'shipped', 'delivered']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }

    const extra: Record<string, unknown> = {}
    if (trackingCode) extra.trackingCode = trackingCode
    if (shippedAt) extra.shippedAt = shippedAt
    if (deliveredAt) extra.deliveredAt = deliveredAt
    if (unboxingVideoUrl !== undefined) extra.unboxingVideoUrl = unboxingVideoUrl

    const updated = await updateOrderStatus(id, status || order.status, extra as Partial<import('@/lib/db').Order>)

    if (status && status !== order.status) {
      const statusLabel: Record<string, string> = {
        pending: 'Pendente',
        approved: 'Aprovado',
        rejected: 'Rejeitado',
        refunded: 'Reembolsado',
        shipped: 'Enviado',
        delivered: 'Entregue',
      }
      sendShippingUpdate({
        to: order.customer.email,
        name: order.customer.name,
        orderNumber: order.orderNumber,
        status: statusLabel[status] || status,
      }).catch((err) => logger.error('Failed to send shipping update', { error: String(err) }))
    }

    logger.info('Order status updated by admin', { orderId: id, status, admin: true })

    return NextResponse.json({
      success: true,
      order: {
        id: updated!.id,
        orderNumber: updated!.orderNumber,
        status: updated!.status,
        trackingCode: updated!.trackingCode,
        shippedAt: updated!.shippedAt,
        deliveredAt: updated!.deliveredAt,
        unboxingVideoUrl: updated!.unboxingVideoUrl,
      },
    })
  } catch (error) {
    logger.error('Admin order update error', { error: String(error) })
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
