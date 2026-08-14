import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { queryAll, queryOne, queryRun } from '@/lib/database'
import { logger } from '@/lib/logger'

export type SiteOffer = {
  id: string
  type: 'weekly' | 'monthly'
  title: string
  description: string
  discountPercent: number
  active: boolean
  startsAt: string
  endsAt: string
  createdAt: string
  updatedAt: string
}

async function initSiteOffersTable() {
  const { sql } = await import('@/lib/database')
  await sql`
    CREATE TABLE IF NOT EXISTS site_offers (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('weekly', 'monthly')),
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      discount_percent REAL NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      starts_at TEXT NOT NULL,
      ends_at TEXT NOT NULL,
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

  await initSiteOffersTable()
  const rows = await queryAll('SELECT * FROM site_offers ORDER BY created_at DESC')
  const offers = rows.map(rowToOffer)
  return NextResponse.json(offers)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, title, description, discountPercent, startsAt, endsAt } = body

    if (!type || !title || discountPercent == null || !startsAt || !endsAt) {
      return NextResponse.json({ error: 'Todos os campos obrigatórios devem ser preenchidos' }, { status: 400 })
    }

    if (!['weekly', 'monthly'].includes(type)) {
      return NextResponse.json({ error: 'Tipo deve ser weekly ou monthly' }, { status: 400 })
    }

    const id = `offer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const now = new Date().toISOString()

    await queryRun(`
      INSERT INTO site_offers (id, type, title, description, discount_percent, active, starts_at, ends_at, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [id, type, title, description || '', Number(discountPercent), 1, startsAt, endsAt, now, now])

    const row = await queryOne('SELECT * FROM site_offers WHERE id = $1', [id])
    return NextResponse.json(row ? rowToOffer(row) : null, { status: 201 })
  } catch (error) {
    logger.error('[ADMIN_OFERTAS_POST]', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao criar oferta' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, type, title, description, discountPercent, active, startsAt, endsAt } = body

    if (!id) return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })

    const now = new Date().toISOString()
    await queryRun(`
      UPDATE site_offers SET
        type = $1, title = $2, description = $3, discount_percent = $4,
        active = $5, starts_at = $6, ends_at = $7, updated_at = $8
      WHERE id = $9
    `, [type, title, description || '', Number(discountPercent), active ? 1 : 0, startsAt, endsAt, now, id])

    const row = await queryOne('SELECT * FROM site_offers WHERE id = $1', [id])
    return NextResponse.json(row ? rowToOffer(row) : null)
  } catch (error) {
    logger.error('[ADMIN_OFERTAS_PUT]', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao atualizar oferta' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })

    await queryRun('DELETE FROM site_offers WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('[ADMIN_OFERTAS_DELETE]', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao deletar oferta' }, { status: 500 })
  }
}

function rowToOffer(row: Record<string, unknown>): SiteOffer {
  return {
    id: row.id as string,
    type: row.type as 'weekly' | 'monthly',
    title: row.title as string,
    description: (row.description as string) || '',
    discountPercent: Number(row.discount_percent),
    active: (row.active as number) === 1,
    startsAt: row.starts_at as string,
    endsAt: row.ends_at as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}
