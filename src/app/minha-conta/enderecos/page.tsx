import { getCustomerSession } from '@/lib/customer-auth'
import { findCustomerById } from '@/lib/customer-db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AddressClient } from './AddressClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meus Endereços | Freitas Outlet',
}

export default async function EnderecosPage() {
  const session = await getCustomerSession()
  if (!session) redirect('/login')

  const customer = await findCustomerById(session.id)
  if (!customer) redirect('/login')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Link href="/minha-conta" className="text-xs underline hover:no-underline mb-6 inline-block">&larr; VOLTAR</Link>

      <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-8">
        Meus Endereços
      </h1>

      <AddressClient addresses={customer.addresses} customerId={customer.id} />
    </div>
  )
}
