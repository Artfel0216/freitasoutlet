'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Order } from '@/lib/db'

interface AdminOrdersTableProps {
  orders: Order[]
}

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  refunded: 'Reembolsado',
  shipped: 'Enviado',
  delivered: 'Entregue',
}

const statusColors: Record<string, string> = {
  pending: 'bg-zinc-100 text-zinc-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-emerald-100 text-emerald-700',
}

function getPaymentLabel(method: string) {
  const labels: Record<string, string> = {
    pix: 'Pix',
    credit: 'Cartão de Crédito',
    debit: 'Cartão de Débito',
  }
  return labels[method] || method
}

const nextStatuses: Record<string, string[]> = {
  pending: ['approved', 'rejected'],
  approved: ['shipped', 'refunded', 'rejected'],
  rejected: ['pending'],
  refunded: ['pending'],
  shipped: ['delivered'],
  delivered: [],
}

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [localOrders, setLocalOrders] = useState(orders)

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`/api/admin/pedidos/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || 'Erro ao atualizar')
        return
      }
      setLocalOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o))
      )
    } catch {
      alert('Erro ao atualizar status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="border border-border bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Pedido</th>
            <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Cliente</th>
            <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Data</th>
            <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Total</th>
            <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Pagamento</th>
            <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Fraude</th>
            <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Status</th>
            <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody>
          {localOrders.map((order, i) => {
            const fraudStatus = order.fraudAnalysis?.status
            const fraudColor = fraudStatus === 'approved' ? 'text-green-600' : fraudStatus === 'rejected' ? 'text-red-600' : 'text-zinc-600'
            const nextOps = nextStatuses[order.status] || []

            return (
              <motion.tr
                key={order.id}
                className="border-b border-border/50 hover:bg-muted/30"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02, duration: 0.2 }}
              >
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/pedidos/${order.id}`} className="hover:underline">{order.orderNumber}</Link>
                </td>
                <td className="px-4 py-3">
                  <p>{order.customer.name}</p>
                  <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3 font-medium">
                  R$ {order.total.toFixed(2).replace('.', ',')}
                </td>
                <td className="px-4 py-3">{getPaymentLabel(order.payment.method)}</td>
                <td className="px-4 py-3">
                  {fraudStatus ? (
                    <span className={`text-xs font-medium ${fraudColor}`}>
                      {fraudStatus === 'approved' ? 'Aprovada' : fraudStatus === 'rejected' ? 'Rejeitada' : 'Análise'}
                      {' '}({order.fraudAnalysis?.score ?? '—'})
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 font-medium inline-block ${statusColors[order.status] || ''}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {nextOps.map((status) => (
                      <button
                        key={status}
                        disabled={updatingId === order.id}
                        onClick={() => updateStatus(order.id, status)}
                        className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 border border-border hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                      >
                        {updatingId === order.id ? '...' : statusLabels[status]}
                      </button>
                    ))}
                  </div>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum pedido realizado.</p>
        </div>
      )}
    </div>
  )
}
