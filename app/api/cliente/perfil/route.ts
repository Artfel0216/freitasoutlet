import { getCustomerSession, createCustomerSession } from '@/lib/customer-auth'
import { findCustomerById, hashPassword, verifyPassword, findCustomerByEmail, updateCustomer } from '@/lib/customer-db'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const rl = await rateLimit(`profile:${ip}`, 10, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas requisições. Tente novamente em instantes.' }, { status: 429 })
    }

    const session = await getCustomerSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { name, email, phone, currentPassword, newPassword } = await request.json()
    const customer = await findCustomerById(session.id)
    if (!customer) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Senha atual é obrigatória para alterar a senha' }, { status: 400 })
      }
      const valid = await verifyPassword(currentPassword, customer.passwordHash)
      if (!valid) {
        return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 401 })
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Nova senha deve ter no mínimo 6 caracteres' }, { status: 400 })
      }
    }

    if (email && email.toLowerCase() !== customer.email) {
      const existing = await findCustomerByEmail(email)
      if (existing) {
        return NextResponse.json({ error: 'E-mail já cadastrado por outro usuário' }, { status: 409 })
      }
    }

    const updateData: Record<string, unknown> = {}
    if (name) updateData.name = name
    if (email) updateData.email = email.toLowerCase()
    if (phone !== undefined) updateData.phone = phone
    if (newPassword) updateData.passwordHash = await hashPassword(newPassword)

    const updated = await updateCustomer(session.id, updateData)
    if (!updated) {
      return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
    }

    await createCustomerSession({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
    })

    logger.info('Profile updated', { email: updated.email })

    return NextResponse.json({ success: true, customer: { name: updated.name, email: updated.email, phone: updated.phone } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    logger.error('Profile update error', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
