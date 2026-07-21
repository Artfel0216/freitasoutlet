'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

type ReturnRequest = {
  id: string
  orderId: string
  orderNumber: string
  customerEmail: string
  reason: string
  details: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export function AdminReturnsTable() {
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/returns')
      .then(r => r.json())
      .then(data => { setReturns(data.returns || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/returns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        setReturns(prev => prev.map(r => r.id === id ? { ...r, status } : r))
        toast.success(status === 'approved' ? 'Devolução aprovada' : 'Devolução rejeitada')
      }
    } catch {
      toast.error('Erro ao atualizar')
    }
  }

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando...</div>

  return (
    <div>
      <h2 className="font-heading font-bold text-lg uppercase mb-6">Devoluções / Trocas</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Pedido</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Cliente</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Motivo</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Detalhes</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Data</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {returns.map(r => (
              <tr key={r.id} className="border-b border-border">
                <td className="p-3 font-mono text-xs">{r.orderNumber}</td>
                <td className="p-3 text-xs">{r.customerEmail}</td>
                <td className="p-3">{r.reason}</td>
                <td className="p-3 text-xs text-muted-foreground max-w-xs truncate">{r.details || '—'}</td>
                <td className="p-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    r.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                    r.status === 'approved' ? 'bg-green-50 text-green-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {r.status === 'pending' ? 'Pendente' : r.status === 'approved' ? 'Aprovada' : 'Rejeitada'}
                  </span>
                </td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="p-3">
                  {r.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleStatus(r.id, 'approved')} className="text-xs text-green-600 hover:underline">Aprovar</button>
                      <button onClick={() => handleStatus(r.id, 'rejected')} className="text-xs text-red-500 hover:underline">Rejeitar</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {returns.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">Nenhuma solicitação de devolução.</p>}
      </div>
    </div>
  )
}
