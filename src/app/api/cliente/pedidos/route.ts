import { getCustomerSession } from '@/lib/customer-auth'
import { readOrders } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getCustomerSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const allOrders = await readOrders()
    const customerOrders = allOrders.filter((o) => o.customer.email.toLowerCase() === session.email.toLowerCase())

    return NextResponse.json({ orders: customerOrders })
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar pedidos' }, { status: 500 })
  }
}
