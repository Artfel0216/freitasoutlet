import { createCustomer, findCustomerByEmail } from '@/lib/customer-db'
import { createCustomerSession } from '@/lib/customer-auth'
import { generateToken } from '@/lib/tokens'
import { sendWelcomeEmail, sendEmailVerification } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { getClientIp } from '@/lib/client-ip'
import { readJsonBody } from '@/lib/read-json'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rl = await rateLimit(`register:${ip}`, 5, 300_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas tentativas. Tente novamente em 5 minutos.' }, { status: 429 })
    }

    const body = await readJsonBody<{ name?: string; email?: string; phone?: string; password?: string }>(request)
    if (!body) {
      return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 })
    }

    const { name, email, phone, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nome, e-mail e senha são obrigatórios' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter no mínimo 6 caracteres' }, { status: 400 })
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const accountRl = await rateLimit(`register-account:${normalizedEmail}`, 3, 300_000)
    if (!accountRl.allowed) {
      return NextResponse.json({ error: 'Muitas tentativas para esta conta. Tente novamente em 5 minutos.' }, { status: 429 })
    }

    const existing = await findCustomerByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'Este e-mail já está cadastrado' }, { status: 409 })
    }

    const customer = await createCustomer({ name, email: email.toLowerCase(), phone: phone || '', password })
    const token = await generateToken(customer.email, 'email-verification')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (!siteUrl) throw new Error('NEXT_PUBLIC_SITE_URL não configurado')
    const verifyUrl = `${siteUrl}/verificar-email?token=${token}`

    sendWelcomeEmail({ to: customer.email, name: customer.name }).catch((err) =>
      logger.error('Failed to send welcome email', { error: String(err) })
    )

    sendEmailVerification({ to: customer.email, name: customer.name, verifyUrl }).catch((err) =>
      logger.error('Failed to send verification email', { error: String(err) })
    )

    await createCustomerSession({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    })

    logger.info('Customer registered', { email: customer.email, id: customer.id })

    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('Registration error', { error: String(err) })
    return NextResponse.json({ error: 'Não foi possível concluir o cadastro. Tente novamente.' }, { status: 500 })
  }
}
