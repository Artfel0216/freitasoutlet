import { getCustomerSession } from '@/lib/customer-auth'
import { findCustomerById } from '@/lib/customer-db'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getCustomerSession()
  if (!session) {
    return NextResponse.json({ customer: null })
  }

  const customer = await findCustomerById(session.id)
  return NextResponse.json({
    customer: {
      ...session,
      emailVerified: customer?.emailVerified ?? false,
    },
  })
}
