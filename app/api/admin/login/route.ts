import { NextResponse } from 'next/server'
import { verifyPassword, setSession } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const rl = await rateLimit(`admin-login:${ip}`, 5, 300_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas tentativas. Tente novamente em 5 minutos.' }, { status: 429 })
    }

    const { password } = await request.json()

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Senha é obrigatória' }, { status: 400 })
    }

    if (!await verifyPassword(password)) {
      logger.warn('Admin login failed', { ip })
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 })
    }

    await setSession()

    logger.info('Admin login successful', { ip })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Admin login error', { error: String(error) })
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
