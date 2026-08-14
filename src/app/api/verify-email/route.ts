import { NextResponse } from 'next/server'
import { findCustomerByEmail, updateCustomer } from '@/lib/customer-db'
import { consumeToken } from '@/lib/tokens'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token é obrigatório' }, { status: 400 })
    }

    const email = await consumeToken(token, 'email-verification')
    if (!email) {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 400 })
    }

    const customer = await findCustomerByEmail(email)
    if (!customer) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    await updateCustomer(customer.id, { emailVerified: true })

    logger.info('Email verified', { email })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Email verification error', { error: String(error) })
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
