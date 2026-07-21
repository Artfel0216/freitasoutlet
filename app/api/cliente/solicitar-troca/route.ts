import { NextRequest, NextResponse } from 'next/server'
import { queryRun } from '@/lib/database'
import { getCustomerSession } from '@/lib/customer-auth'
import { getOrderByNumber } from '@/lib/db'

export async function POST(request: NextRequest) {
  const session = await getCustomerSession()
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const { orderNumber, reason, details } = await request.json()

    if (!orderNumber || !reason) {
      return NextResponse.json({ error: 'Pedido e motivo são obrigatórios' }, { status: 400 })
    }

    const order = await getOrderByNumber(orderNumber)
    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    if (order.customer.email.toLowerCase() !== session.email.toLowerCase()) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    await queryRun('INSERT INTO return_requests (id, order_id, order_number, customer_email, reason, details, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [
      id, order.id, orderNumber, session.email, reason, details || '', 'pending', now, now
    ])

    return NextResponse.json({ success: true, message: 'Solicitação registrada. Entraremos em contato em até 2 dias úteis.' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }
}
