import { getCustomerSession } from '@/lib/customer-auth'
import { findCustomerById, addAddress } from '@/lib/customer-db'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getCustomerSession()
  if (!session) {
    return NextResponse.json({ addresses: [] })
  }

  const customer = await findCustomerById(session.id)
  return NextResponse.json({ addresses: customer?.addresses || [] })
}

export async function POST(request: Request) {
  const session = await getCustomerSession()
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { label, cep, street, number, complement, neighborhood, city, state, isDefault } = body

    if (!cep || !street || !number || !neighborhood || !city || !state) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const address = await addAddress(session.id, {
      label: label || 'Casa',
      cep,
      street,
      number,
      complement: complement || '',
      neighborhood,
      city,
      state: state.toUpperCase(),
      isDefault: isDefault || false,
    })

    if (!address) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    return NextResponse.json(address, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar endereço' }, { status: 500 })
  }
}
