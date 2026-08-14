import { NextResponse } from 'next/server'
import { findCustomerByEmail, hashPassword, updateCustomer } from '@/lib/customer-db'
import { consumeToken } from '@/lib/tokens'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { getClientIp } from '@/lib/client-ip'

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rl = await rateLimit(`reset-password:${ip}`, 3, 300_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas tentativas. Tente novamente em 5 minutos.' }, { status: 429 })
    }

    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token e nova senha são obrigatórios' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter no mínimo 6 caracteres' }, { status: 400 })
    }

    const email = await consumeToken(token, 'password-reset')
    if (!email) {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 400 })
    }

    const customer = await findCustomerByEmail(email)
    if (!customer) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    const passwordHash = await hashPassword(password)
    await updateCustomer(customer.id, { passwordHash })

    logger.info('Password reset successful', { email })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Reset password error', { error: String(error) })
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
