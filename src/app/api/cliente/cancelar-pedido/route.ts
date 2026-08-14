import { NextRequest, NextResponse } from 'next/server'
import { getOrderByNumber, updateOrderStatus } from '@/lib/db'
import { getCustomerSession } from '@/lib/customer-auth'

export async function POST(request: NextRequest) {
  const session = await getCustomerSession()
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const { orderNumber } = await request.json()
    if (!orderNumber) {
      return NextResponse.json({ error: 'Número do pedido é obrigatório' }, { status: 400 })
    }

    const order = await getOrderByNumber(orderNumber)
    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    if (order.customer.email.toLowerCase() !== session.email.toLowerCase()) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    if (order.status !== 'pending') {
      return NextResponse.json({ error: 'Apenas pedidos pendentes podem ser cancelados' }, { status: 400 })
    }

    await updateOrderStatus(order.id, 'rejected')
    return NextResponse.json({ success: true, message: 'Pedido cancelado com sucesso' })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
