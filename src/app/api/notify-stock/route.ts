import { NextRequest, NextResponse } from 'next/server'
import { queryOne, queryRun } from '@/lib/database'
import { rateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/client-ip'
import { readJsonBody } from '@/lib/read-json'

async function initTable() {
  await queryRun("CREATE TABLE IF NOT EXISTS stock_notifications (id TEXT PRIMARY KEY, product_id TEXT NOT NULL, email TEXT NOT NULL, size TEXT, notified INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL)")
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rl = await rateLimit(`notify-stock:${ip}`, 10, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas requisições' }, { status: 429 })
    }

    await initTable()
    const body = await readJsonBody<{ productId?: string; email?: string; size?: string }>(request)
    if (!body) {
      return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 })
    }

    const { productId, email, size } = body

    if (!productId || !email) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 })
    }

    const existing = await queryOne(
      'SELECT id FROM stock_notifications WHERE product_id = $1 AND email = $2 AND size = $3',
      [productId, email.toLowerCase(), size || null]
    ) as { id: string } | undefined

    if (existing) {
      return NextResponse.json({ message: 'Já registrado' }, { status: 200 })
    }

    await queryRun(
      'INSERT INTO stock_notifications (id, product_id, email, size, notified, created_at) VALUES ($1, $2, $3, $4, 0, $5)',
      [crypto.randomUUID(), productId, email.toLowerCase(), size || null, new Date().toISOString()]
    )

    return NextResponse.json({ message: 'Notificação registrada' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
