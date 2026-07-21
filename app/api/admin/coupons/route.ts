import { NextRequest, NextResponse } from 'next/server'
import { queryOne, queryAll, queryRun } from '@/lib/database'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const rows = await queryAll('SELECT * FROM coupons ORDER BY created_at DESC')
  const coupons = rows.map(r => ({
    id: r.id,
    code: r.code,
    discountType: r.discount_type,
    discountValue: Number(r.discount_value),
    minOrder: Number(r.min_order),
    maxUses: r.max_uses,
    usedCount: r.used_count,
    active: Boolean(r.active),
    expiresAt: r.expires_at,
    createdAt: r.created_at,
  }))
  return NextResponse.json({ coupons })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { code, discountType, discountValue, minOrder, maxUses, expiresAt } = body

  if (!code || !discountValue) {
    return NextResponse.json({ error: 'Código e valor são obrigatórios' }, { status: 400 })
  }

  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  try {
    await queryRun('INSERT INTO coupons (id, code, discount_type, discount_value, min_order, max_uses, active, expires_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, 1, $7, $8)', [
      id, code.toUpperCase(), discountType || 'percent', discountValue, minOrder || 0, maxUses || 0, expiresAt || null, now
    ])
  } catch {
    return NextResponse.json({ error: 'Cupom já existe' }, { status: 409 })
  }

  return NextResponse.json({
    id, code: code.toUpperCase(), discountType: discountType || 'percent', discountValue,
    minOrder: minOrder || 0, maxUses: maxUses || 0, usedCount: 0, active: true, expiresAt, createdAt: now,
  }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { id, code, discountType, discountValue, minOrder, maxUses, active, expiresAt } = body

  if (!id) {
    return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
  }

  const fields: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  if (code !== undefined) { fields.push(`code = $${paramIndex}`); values.push(code.toUpperCase()); paramIndex++ }
  if (discountType !== undefined) { fields.push(`discount_type = $${paramIndex}`); values.push(discountType); paramIndex++ }
  if (discountValue !== undefined) { fields.push(`discount_value = $${paramIndex}`); values.push(discountValue); paramIndex++ }
  if (minOrder !== undefined) { fields.push(`min_order = $${paramIndex}`); values.push(minOrder); paramIndex++ }
  if (maxUses !== undefined) { fields.push(`max_uses = $${paramIndex}`); values.push(maxUses); paramIndex++ }
  if (active !== undefined) { fields.push(`active = $${paramIndex}`); values.push(active ? 1 : 0); paramIndex++ }
  if (expiresAt !== undefined) { fields.push(`expires_at = $${paramIndex}`); values.push(expiresAt || null); paramIndex++ }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 })
  }

  values.push(id)
  await queryRun(`UPDATE coupons SET ${fields.join(', ')} WHERE id = $${paramIndex}`, values)

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { code, id } = await request.json()
  if (id) {
    await queryRun('DELETE FROM coupons WHERE id = $1', [id])
  } else if (code) {
    await queryRun('DELETE FROM coupons WHERE code = $1', [code?.toUpperCase()])
  }
  return NextResponse.json({ success: true })
}
