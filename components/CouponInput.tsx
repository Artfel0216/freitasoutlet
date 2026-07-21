'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export function CouponInput({ onApply, applied, orderTotal = 0 }: { onApply: (discount: number, code: string) => void; applied: { code: string; discount: number } | null; orderTotal?: number }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function apply() {
    const clean = code.trim().toUpperCase()
    if (!clean) { setError('Digite um cupom'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean, orderTotal }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Cupom inválido')
        toast.error(data.error || 'Cupom inválido')
        return
      }

      setError('')
      onApply(data.discount, clean)
      toast.success(`Cupom ${data.label || clean} aplicado!`)
    } catch {
      setError('Erro ao validar cupom')
      toast.error('Erro ao validar cupom')
    } finally {
      setLoading(false)
    }
  }

  function remove() {
    onApply(0, '')
    setCode('')
  }

  return (
    <div className="border-t border-border pt-4">
      <AnimatePresence mode="wait">
        {applied ? (
          <motion.div
            key="applied"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-green-600 font-medium">Cupom {applied.code} aplicado ({(applied.discount * 100).toFixed(0)}% OFF)</span>
            <button onClick={remove} className="text-xs underline text-muted-foreground hover:text-red-500">Remover</button>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError('') }}
              placeholder="Cupom de desconto"
              className="flex-1 border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
            <button onClick={apply} disabled={loading} className="bg-black text-white px-4 py-2 text-sm font-heading font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? '...' : 'OK'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
