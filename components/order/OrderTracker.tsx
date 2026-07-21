'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

type OrderInfo = {
  orderNumber: string
  status: string
  createdAt: string
  items: { productName: string; quantity: number; size: string; color: string }[]
  total: number
  trackingCode?: string
}

const statusSteps = [
  { key: 'pending', label: 'Pedido Recebido', icon: '📦' },
  { key: 'approved', label: 'Pagamento Aprovado', icon: '✅' },
  { key: 'shipped', label: 'Enviado', icon: '🚚' },
  { key: 'delivered', label: 'Entregue', icon: '🏠' },
]

function getStatusIndex(status: string): number {
  switch (status) {
    case 'pending': return 0
    case 'approved': return 1
    case 'shipped': return 2
    case 'delivered': return 3
    case 'rejected': return -1
    case 'refunded': return -1
    default: return 0
  }
}

export function OrderTracker() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<OrderInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim() || !email.trim()) {
      toast.error('Preencha o número do pedido e seu e-mail')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/pedido-rastreio?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
        setSearched(true)
      } else {
        setOrder(null)
        setSearched(true)
      }
    } catch {
      toast.error('Erro ao buscar pedido')
    }
    setLoading(false)
  }

  const currentStep = order ? getStatusIndex(order.status) : 0

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="bg-muted p-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider mb-1 block">Número do Pedido</label>
            <input
              type="text"
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              placeholder="Ex: FO-XXXXX-XXXX"
              className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider mb-1 block">E-mail da compra</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white text-sm font-medium uppercase tracking-wider py-3 hover:bg-black/80 transition-colors disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Rastrear Pedido'}
          </button>
        </div>
      </form>

      {searched && !order && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">Pedido não encontrado.</p>
          <p className="text-xs text-muted-foreground">Verifique o número do pedido e o e-mail used na compra.</p>
        </div>
      )}

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-muted p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Pedido</p>
                <p className="font-heading font-bold text-lg">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
                <p className="font-heading font-bold">R$ {order.total.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="space-y-2">
            {statusSteps.map((step, i) => (
              <div
                key={step.key}
                className={`flex items-center gap-4 p-4 border transition-colors ${
                  i <= currentStep ? 'border-black bg-black/5' : 'border-border bg-white'
                }`}
              >
                <span className="text-2xl">{step.icon}</span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${i <= currentStep ? 'text-black' : 'text-muted-foreground'}`}>{step.label}</p>
                </div>
                {i <= currentStep && (
                  <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                    {i === currentStep ? 'Atual' : 'Concluído'}
                  </span>
                )}
              </div>
            ))}
          </div>

          {order.trackingCode && (
            <div className="bg-muted p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Código de Rastreio</p>
              <p className="font-mono font-bold text-sm">{order.trackingCode}</p>
            </div>
          )}

          <div className="bg-muted p-6">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider mb-3">Itens do Pedido</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Tam: {item.size} | Cor: {item.color}</p>
                  </div>
                  <span className="text-muted-foreground">Qtd: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
