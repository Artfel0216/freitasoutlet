'use client'

import { motion } from 'framer-motion'
import type { SiteOffer } from '../offers-types'

interface OfferCardProps {
  offer: SiteOffer
  index: number
  onEdit: (offer: SiteOffer) => void
  onToggleActive: (offer: SiteOffer) => void
  onDelete: (id: string) => void
}

function getOfferStatus(offer: SiteOffer, now: number) {
  const startTime = new Date(offer.startsAt).getTime()
  const endTime = new Date(offer.endsAt).getTime()

  if (offer.active && now >= startTime && now <= endTime) {
    return { label: 'Ativa', className: 'bg-green-100 text-green-700' }
  }
  if (offer.active && now < startTime) {
    return { label: 'Agendada', className: 'bg-blue-100 text-blue-700' }
  }
  return { label: 'Expirada', className: 'bg-gray-100 text-gray-500' }
}

export function OfferCard({ offer, index, onEdit, onToggleActive, onDelete }: OfferCardProps) {
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now()
  const status = getOfferStatus(offer, now)
  const isExpired = now > new Date(offer.endsAt).getTime()
  const dimmed = !offer.active || isExpired

  return (
    <motion.div
      className={`border p-4 rounded-sm shadow-card flex items-center justify-between gap-4 ${
        dimmed ? 'border-border opacity-60' : 'border-border'
      }`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-heading font-bold text-sm uppercase tracking-tight truncate">{offer.title}</h3>
          <span className={`text-xs px-2 py-0.5 font-medium whitespace-nowrap ${status.className}`}>
            {status.label}
          </span>
        </div>
        {offer.description && (
          <p className="text-xs text-muted-foreground truncate">{offer.description}</p>
        )}
        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
          <span className="text-red-600 font-bold">-{offer.discountPercent}%</span>
          <span>{offer.type === 'weekly' ? 'Semanal' : 'Mensal'}</span>
          <span>
            {new Date(offer.startsAt).toLocaleDateString('pt-BR')} -{' '}
            {new Date(offer.endsAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onToggleActive(offer)}
          className={`text-xs px-2 py-1 border transition-colors ${
            offer.active
              ? 'border-green-300 text-green-700 hover:bg-green-50'
              : 'border-gray-300 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {offer.active ? 'Desativar' : 'Ativar'}
        </button>
        <button onClick={() => onEdit(offer)} className="text-xs underline hover:no-underline">
          Editar
        </button>
        <button onClick={() => onDelete(offer.id)} className="text-xs underline hover:no-underline text-red-500">
          Excluir
        </button>
      </div>
    </motion.div>
  )
}