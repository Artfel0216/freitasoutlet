import { clearCustomerSession } from '@/lib/customer-auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }

  await clearCustomerSession()
  return NextResponse.redirect(new URL('/', request.url))
}
