import { NextRequest, NextResponse } from 'next/server'
import { queryAll, queryRun } from '@/lib/database'
import { getSession } from '@/lib/auth'
import { logger } from '@/lib/logger'

async function initReturnsTable() {
  const { sql } = await import('@/lib/database')
  await sql`
    CREATE TABLE IF NOT EXISTS return_requests (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      order_number TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      reason TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `
}

export async function GET() {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  await initReturnsTable()
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

  let body: { id?: string; status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const { id, status } = body

  if (typeof id !== 'string' || !id || typeof status !== 'string' || !status) {
    return NextResponse.json({ error: 'ID e status são obrigatórios' }, { status: 400 })
  }

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
  }

  try {
    await queryRun('UPDATE return_requests SET status = $1, updated_at = $2 WHERE id = $3', [
      status, new Date().toISOString(), id
    ])
  } catch (error) {
    logger.error('Return update error', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao atualizar devolução' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
