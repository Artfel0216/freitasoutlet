import { NextRequest, NextResponse } from 'next/server'
import { getOrderByNumber } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const email = searchParams.get('email')

    if (!orderNumber || !email) {
      return NextResponse.json({ error: 'orderNumber and email are required' }, { status: 400 })
    }

    const order = await getOrderByNumber(orderNumber)

    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    if (order.customer.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: 'E-mail não corresponde ao pedido' }, { status: 403 })
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
      total: order.total,
      trackingCode: order.trackingCode,
    })
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar pedido' }, { status: 500 })
  }
}
