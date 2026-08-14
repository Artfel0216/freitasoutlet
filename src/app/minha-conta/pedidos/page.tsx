import { getCustomerSession } from '@/lib/customer-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { readOrders } from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meus Pedidos | Freitas Outlet',
}

const statusLabel: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Recusado',
  refunded: 'Reembolsado',
}

const statusColor: Record<string, string> = {
  pending: 'border-yellow-500 text-yellow-600',
  approved: 'border-green-500 text-green-600',
  rejected: 'border-red-500 text-red-600',
  refunded: 'border-gray-500 text-gray-600',
}

export default async function PedidosPage() {
  const customer = await getCustomerSession()
  if (!customer) redirect('/login')

  const allOrders = await readOrders()
  const orders = allOrders.filter((o) => o.customer.email.toLowerCase() === customer.email.toLowerCase())

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Link href="/minha-conta" className="text-xs underline hover:no-underline mb-6 inline-block">&larr; VOLTAR</Link>

      <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-8">
        Meus Pedidos
      </h1>

      {orders.length === 0 ? (
        <div className="border border-border p-8 text-center">
          <p className="text-muted-foreground mb-4">Nenhum pedido ainda.</p>
          <Link href="/produtos" className="text-sm underline hover:no-underline">VER PRODUTOS</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/minha-conta/pedidos/${order.id}`}
              className="block border border-border p-4 sm:p-6 hover:border-black transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading font-bold text-sm">{order.orderNumber}</span>
                <span className={`text-xs font-medium px-2 py-0.5 border ${statusColor[order.status] || 'border-gray-300 text-gray-600'}`}>
                  {statusLabel[order.status] || order.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
