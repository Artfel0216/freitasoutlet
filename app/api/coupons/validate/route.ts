import { NextRequest, NextResponse } from 'next/server'
import { queryOne } from '@/lib/database'
import { rateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/client-ip'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rl = await rateLimit(`coupon-validate:${ip}`, 20, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas requisições. Tente novamente em instantes.' }, { status: 429 })
    }

    const { code, orderTotal } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Código do cupom é obrigatório' }, { status: 400 })
    }

    const row = await queryOne('SELECT * FROM coupons WHERE code = $1', [code.toUpperCase()])

    if (!row) {
      return NextResponse.json({ error: 'Cupom inválido' }, { status: 400 })
    }

    if (!row.active) {
      return NextResponse.json({ error: 'Cupom inativo' }, { status: 400 })
    }

    if (row.expires_at && new Date(row.expires_at as string) < new Date()) {
      return NextResponse.json({ error: 'Cupom expirado' }, { status: 400 })
    }

    if (row.max_uses && (row.used_count as number) >= (row.max_uses as number)) {
      return NextResponse.json({ error: 'Cupom atingiu o limite de uso' }, { status: 400 })
    }

    if (row.min_order && typeof orderTotal === 'number' && orderTotal < Number(row.min_order)) {
      return NextResponse.json({ error: `Pedido mínimo de R$ ${Number(row.min_order).toFixed(2).replace('.', ',')}` }, { status: 400 })
    }

    let discount = 0
    if (row.discount_type === 'percent') {
      discount = Number(row.discount_value) / 100
    } else {
      discount = typeof orderTotal === 'number' && orderTotal > 0 ? Number(row.discount_value) / orderTotal : 0
    }

    const label = row.discount_type === 'percent'
      ? `${row.discount_value}% OFF`
      : `R$ ${Number(row.discount_value).toFixed(2).replace('.', ',')} OFF`

    return NextResponse.json({ discount, label, code: row.code })
  } catch {
    return NextResponse.json({ error: 'Erro ao validar cupom' }, { status: 500 })
  }
}
