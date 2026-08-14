import { findCustomerByEmail, verifyPassword } from '@/lib/customer-db'
import { createCustomerSession } from '@/lib/customer-auth'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { getClientIp } from '@/lib/client-ip'

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rl = await rateLimit(`customer-login:${ip}`, 5, 300_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas tentativas. Tente novamente em 5 minutos.' }, { status: 429 })
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios' }, { status: 400 })
    }

    const customer = await findCustomerByEmail(email)
    if (!customer) {
      logger.warn('Customer login failed: user not found', { ip, email })
      return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 })
    }

    const valid = await verifyPassword(password, customer.passwordHash)
    if (!valid) {
      logger.warn('Customer login failed: wrong password', { ip, email })
      return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 })
    }

    await createCustomerSession({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    })

    logger.info('Customer login successful', { ip, email })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Customer login error', { error: String(error) })
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
