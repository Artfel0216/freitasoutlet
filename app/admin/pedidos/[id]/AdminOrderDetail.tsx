'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { UnboxingVideoPlayer } from '@/components/ui/UnboxingVideoPlayer'
import type { Order } from '@/lib/db'

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  refunded: 'Reembolsado',
  shipped: 'Enviado',
  delivered: 'Entregue',
}

export function AdminOrderDetail({ order }: { order: Order }) {
  const router = useRouter()
  const [unboxingUrl, setUnboxingUrl] = useState(order.unboxingVideoUrl || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSaveUnboxing() {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch(`/api/admin/pedidos/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: order.status, unboxingVideoUrl: unboxingUrl || null }),
      })
      if (!res.ok) {
        const err = await res.json()
        setMessage(err.error || 'Erro ao salvar')
      } else {
        setMessage('Vídeo de unboxing atualizado!')
        router.refresh()
      }
    } catch {
      setMessage('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Link href="/admin/pedidos" className="text-xs underline hover:no-underline mb-6 inline-block">&larr; Voltar para Pedidos</Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tighter">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(order.createdAt).toLocaleDateString('pt-BR')} &mdash;{' '}
            <span className="capitalize">{statusLabels[order.status] || order.status}</span>
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="border border-border rounded p-4">
          <h2 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Cliente</h2>
          <dl className="space-y-1 text-sm">
            <div className="flex gap-2"><dt className="text-muted-foreground w-16">Nome:</dt><dd>{order.customer.name}</dd></div>
            <div className="flex gap-2"><dt className="text-muted-foreground w-16">Email:</dt><dd>{order.customer.email}</dd></div>
            <div className="flex gap-2"><dt className="text-muted-foreground w-16">CPF:</dt><dd>{order.customer.cpf}</dd></div>
            <div className="flex gap-2"><dt className="text-muted-foreground w-16">Tel:</dt><dd>{order.customer.phone}</dd></div>
          </dl>
        </div>

        <div className="border border-border rounded p-4">
          <h2 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Entrega</h2>
          <p className="text-sm">{order.address.street}, {order.address.number}</p>
          <p className="text-sm">{order.address.neighborhood}</p>
          <p className="text-sm">{order.address.city} &mdash; {order.address.state}</p>
          <p className="text-sm text-muted-foreground">CEP: {order.address.cep}</p>
          {order.trackingCode && (
            <p className="text-sm mt-2"><span className="text-muted-foreground">Código de rastreio:</span> {order.trackingCode}</p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Pagamento</h2>
        <div className="border border-border rounded p-4 text-sm">
          <p><span className="text-muted-foreground">Método:</span> {order.payment.method === 'pix' ? 'Pix' : order.payment.method === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito'}</p>
          {order.payment.cardLastDigits && <p><span className="text-muted-foreground">Cartão:</span> **** {order.payment.cardLastDigits}</p>}
          {order.payment.installments && <p><span className="text-muted-foreground">Parcelas:</span> {order.payment.installments}x</p>}
          <p className="mt-2"><span className="text-muted-foreground">Subtotal:</span> R$ {order.subtotal.toFixed(2).replace('.', ',')}</p>
          <p><span className="text-muted-foreground">Frete:</span> R$ {order.shipping.toFixed(2).replace('.', ',')}</p>
          {order.discount > 0 && <p><span className="text-muted-foreground">Desconto:</span> -R$ {order.discount.toFixed(2).replace('.', ',')}</p>}
          <p className="font-heading font-bold mt-1">Total: R$ {order.total.toFixed(2).replace('.', ',')}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Itens</h2>
        <div className="border border-border rounded divide-y divide-border">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-xs text-muted-foreground">{item.brand} &mdash; Tam: {item.size} | Qtd: {item.quantity}</p>
              </div>
              <span>R$ {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-border rounded p-4 mb-8">
        <h2 className="font-heading font-bold text-xs uppercase tracking-wider mb-4">Unboxing</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">URL do vídeo (YouTube, Vimeo ou MP4)</label>
            <input
              type="text"
              value={unboxingUrl}
              onChange={(e) => setUnboxingUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="black" size="sm" onClick={handleSaveUnboxing} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
            {message && (
              <span className={`text-xs ${message.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </span>
            )}
          </div>

          {unboxingUrl && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Pré-visualização:</p>
              <div className="aspect-video bg-muted rounded overflow-hidden max-w-lg">
                <UnboxingVideoPlayer url={unboxingUrl} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
