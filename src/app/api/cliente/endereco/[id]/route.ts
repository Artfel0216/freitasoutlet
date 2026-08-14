import { getCustomerSession } from '@/lib/customer-auth'
import { findCustomerById, updateAddress, removeAddress } from '@/lib/customer-db'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getCustomerSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { id } = await params
    const customer = await findCustomerById(session.id)
    if (!customer) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    const hasAddress = customer.addresses.some((a) => a.id === id)
    if (!hasAddress) {
      return NextResponse.json({ error: 'Endereço não encontrado' }, { status: 404 })
    }

    const data = await request.json()
    const updated = await updateAddress(session.id, id, data)

    return NextResponse.json({ success: true, address: updated })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getCustomerSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { id } = await params
    const removed = await removeAddress(session.id, id)
    if (!removed) {
      return NextResponse.json({ error: 'Endereço não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
