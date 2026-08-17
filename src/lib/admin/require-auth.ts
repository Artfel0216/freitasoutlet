import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  return null
}