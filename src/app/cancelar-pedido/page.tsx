'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function CancelarPedidoPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim()) {
      toast.error('Digite o número do pedido')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/cliente/cancelar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        toast.success('Pedido cancelado!')
      } else {
        toast.error(data.error || 'Erro ao cancelar pedido')
      }
    } catch {
      toast.error('Erro ao cancelar pedido')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>
        <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-4">Pedido Cancelado</h1>
        <p className="text-sm text-muted-foreground mb-6">Seu pedido foi cancelado com sucesso.</p>
        <Link href="/minha-conta/pedidos">
          <Button variant="primary">VER MEUS PEDIDOS</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 lg:py-20">
      <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-2">Cancelar Pedido</h1>
      <p className="text-sm text-muted-foreground mb-8">Apenas pedidos com status &quot;Pendente&quot; podem ser cancelados.</p>

      <form onSubmit={handleCancel} className="space-y-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-1">Número do Pedido</label>
          <input
            type="text"
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            placeholder="Ex: FO-XXXXX-XXXX"
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
            required
          />
        </div>
        <Button variant="primary" size="lg" fullWidth type="submit" disabled={loading}>
          {loading ? 'CANCELANDO...' : 'CANCELAR PEDIDO'}
        </Button>
      </form>
    </div>
  )
}
