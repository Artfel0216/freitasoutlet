import { NextRequest, NextResponse } from 'next/server'
import { queryAll, queryRun } from '@/lib/database'
import { getSession } from '@/lib/auth'
import { logger } from '@/lib/logger'

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

  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 }) }

  const code = body.code as string | undefined
  const discountValue = (body.discountValue ?? body.discount_value) as number | undefined
  const discountType = (body.discountType ?? body.discount_type) as string | undefined
  const minOrder = (body.minOrder ?? body.min_order) as number | undefined
  const maxUses = (body.maxUses ?? body.max_uses) as number | undefined
  const expiresAt = (body.expiresAt ?? body.expires_at) as string | null | undefined

  if (typeof code !== 'string' || !code.trim() || typeof discountValue !== 'number') {
    return NextResponse.json({ error: 'Código e valor são obrigatórios' }, { status: 400 })
  }

  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  const normalizedCode = code.trim().toUpperCase()

  try {
    await queryRun('INSERT INTO coupons (id, code, discount_type, discount_value, min_order, max_uses, active, expires_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, 1, $7, $8)', [
      id, normalizedCode, discountType || 'percent', discountValue, minOrder || 0, maxUses || 0, expiresAt || null, now
    ])
  } catch (error) {
    logger.error('Coupon create error', { error: String(error) })
    return NextResponse.json({ error: 'Não foi possível criar o cupom' }, { status: 500 })
  }

  return NextResponse.json({
    id, code: normalizedCode, discountType: discountType || 'percent', discountValue,
    minOrder: minOrder || 0, maxUses: maxUses || 0, usedCount: 0, active: true, expiresAt, createdAt: now,
  }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 }) }

  const id = body.id as string | undefined
  const code = body.code as string | undefined
  const discountValue = (body.discountValue ?? body.discount_value) as number | undefined
  const discountType = (body.discountType ?? body.discount_type) as string | undefined
  const minOrder = (body.minOrder ?? body.min_order) as number | undefined
  const maxUses = (body.maxUses ?? body.max_uses) as number | undefined
  const active = body.active as boolean | undefined
  const expiresAt = (body.expiresAt ?? body.expires_at) as string | null | undefined

  if (typeof id !== 'string' || !id) {
    return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
  }

  const fields: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  if (typeof code === 'string') { fields.push(`code = $${paramIndex}`); values.push(code.trim().toUpperCase()); paramIndex++ }
  if (discountType !== undefined) { fields.push(`discount_type = $${paramIndex}`); values.push(discountType); paramIndex++ }
  if (typeof discountValue === 'number') { fields.push(`discount_value = $${paramIndex}`); values.push(discountValue); paramIndex++ }
  if (typeof minOrder === 'number') { fields.push(`min_order = $${paramIndex}`); values.push(minOrder); paramIndex++ }
  if (typeof maxUses === 'number') { fields.push(`max_uses = $${paramIndex}`); values.push(maxUses); paramIndex++ }
  if (active !== undefined) { fields.push(`active = $${paramIndex}`); values.push(active ? 1 : 0); paramIndex++ }
  if (expiresAt !== undefined) { fields.push(`expires_at = $${paramIndex}`); values.push(expiresAt || null); paramIndex++ }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 })
  }

  try {
    values.push(id)
    await queryRun(`UPDATE coupons SET ${fields.join(', ')} WHERE id = $${paramIndex}`, values)
  } catch (error) {
    logger.error('Coupon update error', { error: String(error) })
    return NextResponse.json({ error: 'Não foi possível atualizar o cupom' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  let body: { code?: string; id?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 }) }
  const { code, id } = body
  try {
    if (typeof id === 'string' && id) {
      await queryRun('DELETE FROM coupons WHERE id = $1', [id])
    } else if (typeof code === 'string' && code.trim()) {
      await queryRun('DELETE FROM coupons WHERE code = $1', [code.trim().toUpperCase()])
    } else {
      return NextResponse.json({ error: 'ID ou código é obrigatório' }, { status: 400 })
    }
  } catch (error) {
    logger.error('Coupon delete error', { error: String(error) })
    return NextResponse.json({ error: 'Não foi possível deletar o cupom' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
