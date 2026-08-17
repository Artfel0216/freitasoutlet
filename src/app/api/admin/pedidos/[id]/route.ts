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

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const status = body.status as string | undefined
    const trackingCode = body.trackingCode as string | undefined
    const shippedAt = body.shippedAt as string | undefined
    const deliveredAt = body.deliveredAt as string | undefined
    const unboxingVideoUrl = body.unboxingVideoUrl as string | undefined

    const validStatuses: OrderStatus[] = ['pending', 'approved', 'rejected', 'refunded', 'shipped', 'delivered']
    if (status && typeof status === 'string' && !validStatuses.includes(status as OrderStatus)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }

    const newStatus: OrderStatus =
      typeof status === 'string' && validStatuses.includes(status as OrderStatus) ? status as OrderStatus : order.status

    const extra: Record<string, unknown> = {}
    if (trackingCode) extra.trackingCode = trackingCode
    if (shippedAt) extra.shippedAt = shippedAt
    if (deliveredAt) extra.deliveredAt = deliveredAt
    if (unboxingVideoUrl !== undefined) extra.unboxingVideoUrl = unboxingVideoUrl

    const updated = await updateOrderStatus(id, newStatus, extra as Partial<import('@/lib/db').Order>)

    if (newStatus !== order.status) {
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
        status: statusLabel[newStatus] || newStatus,
      }).catch((err) => logger.error('Failed to send shipping update', { error: String(err) }))
    }

    logger.info('Order status updated by admin', { orderId: id, status: newStatus, admin: true })

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
