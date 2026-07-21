import { NextRequest, NextResponse } from 'next/server'
import { queryAll, queryRun } from '@/lib/database'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const rows = await queryAll('SELECT * FROM return_requests ORDER BY created_at DESC')
  const returns = rows.map(r => ({
    id: r.id,
    orderId: r.order_id,
    orderNumber: r.order_number,
    customerEmail: r.customer_email,
    reason: r.reason,
    details: r.details,
    status: r.status,
    createdAt: r.created_at,
  }))
  return NextResponse.json({ returns })
}

export async function PATCH(request: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'ID e status são obrigatórios' }, { status: 400 })
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }

    await queryRun('UPDATE return_requests SET status = $1, updated_at = $2 WHERE id = $3', [
      status, new Date().toISOString(), id
    ])

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }
}
