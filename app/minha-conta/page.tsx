import { getCustomerSession } from '@/lib/customer-auth'
import { findCustomerById } from '@/lib/customer-db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { LoyaltyAccountCard } from '@/components/loyalty/LoyaltyAccountCard'
import { LogoutButton } from './LogoutButton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Minha Conta | Freitas Outlet',
}

export default async function MinhaContaPage() {
  const session = await getCustomerSession()
  if (!session) redirect('/login')

  const customer = await findCustomerById(session.id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Breadcrumbs items={[{ label: 'Minha Conta' }]} />
      <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-2">
        Olá, {session.name}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">{session.email}</p>

      <div className="mb-12">
        <LoyaltyAccountCard />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        <div className="border border-border p-6">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-1">Meus Pedidos</h2>
          <p className="text-xs text-muted-foreground mb-4">Acompanhe o status dos seus pedidos.</p>
          <Link href="/minha-conta/pedidos" className="text-xs underline hover:no-underline">VER PEDIDOS</Link>
        </div>
        <div className="border border-border p-6">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-1">Meus Endereços</h2>
          <p className="text-xs text-muted-foreground mb-4">
            {customer?.addresses.length
              ? `${customer.addresses.length} ${customer.addresses.length === 1 ? 'endereço salvo' : 'endereços salvos'}`
              : 'Nenhum endereço cadastrado'}
          </p>
          <Link href="/minha-conta/enderecos" className="text-xs underline hover:no-underline">GERENCIAR ENDEREÇOS</Link>
        </div>
        <div className="border border-border p-6">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-1">Favoritos</h2>
          <p className="text-xs text-muted-foreground mb-4">Seus produtos salvos.</p>
          <Link href="/favoritos" className="text-xs underline hover:no-underline">VER FAVORITOS</Link>
        </div>
        <div className="border border-border p-6">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-1">Dados da Conta</h2>
          <p className="text-xs text-muted-foreground mb-4">Nome, e-mail e telefone. Altere sua senha.</p>
          <Link href="/minha-conta/editar" className="text-xs underline hover:no-underline">EDITAR PERFIL</Link>
        </div>
      </div>

      <LogoutButton />
    </div>
  )
}
