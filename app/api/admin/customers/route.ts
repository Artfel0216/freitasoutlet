import { NextResponse } from 'next/server'
import { queryAll } from '@/lib/database'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const rows = await queryAll('SELECT id, name, email, phone, cpf, email_verified, created_at FROM customers ORDER BY created_at DESC')
  const customers = rows.map(r => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    cpf: (r.cpf as string)?.replace(/(\d{3})\d{6}(\d{2})/, '$1******$2'),
    emailVerified: Boolean(r.email_verified),
    createdAt: r.created_at,
  }))
  return NextResponse.json({ customers })
}
