import { NextResponse } from 'next/server'
import { findCustomerByEmail } from '@/lib/customer-db'
import { generateToken } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { getClientIp } from '@/lib/client-ip'

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rl = await rateLimit(`forgot-password:${ip}`, 3, 300_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas tentativas. Tente novamente em 5 minutos.' }, { status: 429 })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 })
    }

    const customer = await findCustomerByEmail(email)

    if (!customer) {
      return NextResponse.json({ success: true })
    }

    const token = await generateToken(customer.email, 'password-reset')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (!siteUrl) throw new Error('NEXT_PUBLIC_SITE_URL não configurado')
    const resetUrl = `${siteUrl}/reset-password?token=${token}`

    await sendPasswordResetEmail({
      to: customer.email,
      name: customer.name,
      resetUrl,
    })

    logger.info('Password reset email sent', { email: customer.email })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Forgot password error', { error: String(error) })
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
