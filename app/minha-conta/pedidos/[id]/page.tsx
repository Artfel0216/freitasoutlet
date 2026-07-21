import { getCustomerSession } from '@/lib/customer-auth'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOrderById } from '@/lib/db'
import type { Metadata } from 'next'
import { OrderActions } from './OrderActions'
import { UnboxingVideoPlayer } from '@/components/ui/UnboxingVideoPlayer'

export const metadata: Metadata = {
  title: 'Detalhes do Pedido | Freitas Outlet',
}

const statusLabel: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Recusado',
  refunded: 'Reembolsado',
  shipped: 'Enviado',
  delivered: 'Entregue',
}

const statusColor: Record<string, string> = {
  pending: 'border-yellow-500 text-yellow-600',
  approved: 'border-green-500 text-green-600',
  rejected: 'border-red-500 text-red-600',
  refunded: 'border-gray-500 text-gray-600',
  shipped: 'border-blue-500 text-blue-600',
  delivered: 'border-emerald-500 text-emerald-600',
}

export default async function PedidoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = await getCustomerSession()
  if (!customer) redirect('/login')

  const order = await getOrderById(id)
  if (!order) notFound()
  if (order.customer.email.toLowerCase() !== customer.email.toLowerCase()) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Link href="/minha-conta/pedidos" className="text-xs underline hover:no-underline mb-6 inline-block">&larr; VOLTAR</Link>

      <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-2">
        {order.orderNumber}
      </h1>
      <span className={`text-xs font-medium px-2 py-0.5 border inline-block mb-2 ${statusColor[order.status] || 'border-gray-300 text-gray-600'}`}>
        {statusLabel[order.status] || order.status}
      </span>

      <OrderActions orderNumber={order.orderNumber} status={order.status} />

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="font-heading font-bold text-xs uppercase tracking-wider mb-2">Informações</h2>
          <dl className="space-y-1 text-sm">
            <div className="flex gap-2"><dt className="text-muted-foreground w-20">Data:</dt><dd>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</dd></div>
            <div className="flex gap-2"><dt className="text-muted-foreground w-20">Pagamento:</dt><dd className="capitalize">{order.payment.method === 'pix' ? 'Pix' : order.payment.method === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito'}</dd></div>
            <div className="flex gap-2"><dt className="text-muted-foreground w-20">Total:</dt><dd className="font-medium">R$ {order.total.toFixed(2).replace('.', ',')}</dd></div>
          </dl>
        </div>
        <div>
          <h2 className="font-heading font-bold text-xs uppercase tracking-wider mb-2">Endereço de Entrega</h2>
          <p className="text-sm">{order.address.street}, {order.address.number}</p>
          <p className="text-sm">{order.address.neighborhood}</p>
          <p className="text-sm">{order.address.city} — {order.address.state}</p>
          <p className="text-sm text-muted-foreground">CEP: {order.address.cep}</p>
        </div>
      </div>

      <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">Itens</h2>
      <div className="border border-border divide-y divide-border">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-xs text-muted-foreground">
                {item.brand} — Tam: {item.size} | Qtd: {item.quantity}
              </p>
            </div>
            <span>R$ {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border mt-6 pt-4 flex justify-between text-sm font-heading font-bold">
        <span>Total</span>
        <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
      </div>

      {order.unboxingVideoUrl ? (
        <div className="mt-10">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">Seu vídeo de unboxing</h2>
          <div className="aspect-video bg-muted rounded overflow-hidden">
            <UnboxingVideoPlayer url={order.unboxingVideoUrl} />
          </div>
        </div>
      ) : (
        <div className="mt-10 border border-dashed border-border rounded p-6 text-center">
          <p className="text-sm text-muted-foreground">Em breve você receberá seu vídeo de unboxing personalizado</p>
        </div>
      )}
    </div>
  )
}
