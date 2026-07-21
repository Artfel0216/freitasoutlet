'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function SolicitarTrocaPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim() || !reason) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/cliente/solicitar-troca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, reason, details }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        toast.success('Solicitação registrada!')
      } else {
        toast.error(data.error || 'Erro ao registrar solicitação')
      }
    } catch {
      toast.error('Erro ao registrar solicitação')
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
        <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-4">Solicitação Enviada!</h1>
        <p className="text-sm text-muted-foreground mb-6">Sua solicitação foi registrada. Entraremos em contato em até 2 dias úteis pelo e-mail.</p>
        <Link href="/minha-conta/pedidos">
          <Button variant="primary">VER MEUS PEDIDOS</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 lg:py-20">
      <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-2">Solicitar Troca ou Devolução</h1>
      <p className="text-sm text-muted-foreground mb-8">Preencha os dados abaixo para solicitar uma troca ou devolução.</p>

      <form onSubmit={handleRequest} className="space-y-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-1">Número do Pedido *</label>
          <input
            type="text"
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            placeholder="Ex: FO-XXXXX-XXXX"
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-1">Motivo *</label>
          <select
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
            required
          >
            <option value="">Selecione o motivo</option>
            <option value="size">Tamanho não serviu</option>
            <option value="defect">Produto com defeito</option>
            <option value="wrong">Produto errado</option>
            <option value="not-as-described">Não corresponde à descrição</option>
            <option value="changed-mind">Arrependimento</option>
            <option value="other">Outro motivo</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-1">Detalhes</label>
          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
            rows={4}
            placeholder="Descreva o motivo da troca/devolução..."
          />
        </div>
        <Button variant="primary" size="lg" fullWidth type="submit" disabled={loading}>
          {loading ? 'ENVIANDO...' : 'ENVIAR SOLICITAÇÃO'}
        </Button>
      </form>
    </div>
  )
}
