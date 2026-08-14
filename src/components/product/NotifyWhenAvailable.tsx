'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface NotifyWhenAvailableProps {
  productId: string
  selectedSize?: string
}

export function NotifyWhenAvailable({ productId, selectedSize }: NotifyWhenAvailableProps) {
  const [email, setEmail] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Digite seu e-mail')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/notify-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email, size: selectedSize }),
      })
      if (res.ok) {
        setSubmitted(true)
        toast.success('Você será notificado quando voltar!')
      }
    } catch {
      toast.error('Erro ao registrar notificação')
    }
    setLoading(false)
  }

  return (
    <div className="bg-muted p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium">Produto sem estoque{selectedSize ? ` no tamanho ${selectedSize}` : ''}</p>
          <p className="text-xs text-muted-foreground">Receba uma notificação quando estiver disponível</p>
        </div>
        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="text-xs font-medium uppercase tracking-wider border border-border px-3 py-1.5 hover:bg-white transition-colors"
          >
            Avise-me
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && !submitted && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <div className="flex gap-2 mt-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="flex-1 border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white text-xs font-medium uppercase tracking-wider px-4 py-2 hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {loading ? '...' : 'Notificar'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs text-muted-foreground hover:text-black px-2"
              >
                ✕
              </button>
            </div>
          </motion.form>
        )}
        {submitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-green-700 bg-green-50 p-2 mt-2 rounded"
          >
            ✓ Você será notificado por e-mail quando este produto ficar disponível.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
