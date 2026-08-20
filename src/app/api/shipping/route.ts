import { NextResponse } from 'next/server'
import { calculateShipping } from '@/lib/shipping'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { getClientIp } from '@/lib/client-ip'
import { readJsonBody } from '@/lib/read-json'

export async function GET() {
  return NextResponse.json({ error: 'Método não permitido. Use POST.' }, {
    status: 405,
    headers: { Allow: 'POST' },
  })
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rl = await rateLimit(`shipping:${ip}`, 30, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas requisições. Tente novamente em instantes.' }, { status: 429 })
    }

    const body = await readJsonBody<{ state?: string; items?: number; subtotal?: number }>(request)
    if (!body) {
      return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 })
    }

    const { state, items, subtotal } = body

    if (!state || typeof state !== 'string' || state.length !== 2) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }

    const totalItems = typeof items === 'number' ? items : 1
    const options = calculateShipping(state.toUpperCase(), totalItems, typeof subtotal === 'number' ? subtotal : undefined)

    logger.info('Shipping calculated', { state, totalItems, options })

    return NextResponse.json({ options })
  } catch (error) {
    logger.error('Shipping calculation error', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao calcular frete' }, { status: 500 })
  }
}
