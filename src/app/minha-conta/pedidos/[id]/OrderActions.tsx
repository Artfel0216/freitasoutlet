'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface OrderActionsProps {
  orderNumber: string
  status: string
}

export function OrderActions({ orderNumber, status }: OrderActionsProps) {
  const [cancelling, setCancelling] = useState(false)
  const [returning, setReturning] = useState(false)
  const [showReturnForm, setShowReturnForm] = useState(false)
  const [returnReason, setReturnReason] = useState('')
  const [returnDetails, setReturnDetails] = useState('')

  const handleCancel = async () => {
    if (!confirm('Tem certeza que deseja cancelar este pedido?')) return
    setCancelling(true)
    try {
      const res = await fetch('/api/cliente/cancelar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber }),
      })
      if (res.ok) {
        toast.success('Pedido cancelado!')
        window.location.reload()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erro ao cancelar')
      }
    } catch {
      toast.error('Erro ao cancelar pedido')
    }
    setCancelling(false)
  }

  const handleReturn = async () => {
    if (!returnReason) {
      toast.error('Selecione o motivo')
      return
    }
    setReturning(true)
    try {
      const res = await fetch('/api/cliente/solicitar-troca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, reason: returnReason, details: returnDetails }),
      })
      if (res.ok) {
        toast.success('Solicitação enviada!')
        setShowReturnForm(false)
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erro ao enviar')
      }
    } catch {
      toast.error('Erro ao enviar solicitação')
    }
    setReturning(false)
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {status === 'pending' && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="text-xs font-medium uppercase tracking-wider border border-red-300 text-red-600 px-4 py-2 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {cancelling ? 'Cancelando...' : 'Cancelar Pedido'}
        </button>
      )}

      {status === 'approved' && (
        <>
          {!showReturnForm ? (
            <button
              onClick={() => setShowReturnForm(true)}
              className="text-xs font-medium uppercase tracking-wider border border-border px-4 py-2 hover:bg-muted transition-colors"
            >
              Solicitar Troca/Devolução
            </button>
          ) : (
            <div className="w-full bg-muted p-4 space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider">Solicitar Troca ou Devolução</p>
              <select
                value={returnReason}
                onChange={e => setReturnReason(e.target.value)}
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black"
              >
                <option value="">Selecione o motivo</option>
                <option value="size">Tamanho não serviu</option>
                <option value="defect">Produto com defeito</option>
                <option value="wrong">Produto errado</option>
                <option value="not-as-described">Não corresponde à descrição</option>
                <option value="changed-mind">Arrependimento</option>
              </select>
              <textarea
                value={returnDetails}
                onChange={e => setReturnDetails(e.target.value)}
                placeholder="Detalhes (opcional)"
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleReturn}
                  disabled={returning}
                  className="bg-black text-white text-xs font-medium uppercase tracking-wider px-4 py-2 hover:bg-black/80 transition-colors disabled:opacity-50"
                >
                  {returning ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
                <button
                  onClick={() => setShowReturnForm(false)}
                  className="text-xs text-muted-foreground hover:text-black px-3"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
