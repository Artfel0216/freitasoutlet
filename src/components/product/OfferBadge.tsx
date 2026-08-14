'use client'

import type { OfferStatus, OfferType } from '@/types'

const offerStatusStyles: Record<Exclude<OfferStatus, 'none'>, string> = {
  sale: 'bg-gradient-to-r from-blue-500 to-electric text-white',
  promotion: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  clearance: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
}

const offerStatusLabels: Record<Exclude<OfferStatus, 'none'>, string> = {
  sale: 'Oferta',
  promotion: 'Promoção',
  clearance: 'Queima',
}

const offerStatusDetailLabels: Record<Exclude<OfferStatus, 'none'>, string> = {
  sale: 'Em Oferta',
  promotion: 'Em Promoção',
  clearance: 'Queima de Estoque',
}

const offerTypeLabels: Record<Exclude<OfferType, 'none'>, string> = {
  weekly: 'Oferta Semanal',
  monthly: 'Oferta Mensal',
}

const badgeBase = 'relative overflow-hidden text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1'

interface OfferBadgeProps {
  offerStatus?: OfferStatus
  offerType?: OfferType
  detailed?: boolean
}

export function OfferBadge({ offerStatus, offerType, detailed = false }: OfferBadgeProps) {
  if (!offerStatus && !offerType) return null

  return (
    <>
      {offerStatus && offerStatus !== 'none' && (
        <span className={`${badgeBase} ${offerStatusStyles[offerStatus]}`}>
          <span className="relative z-10">
            {detailed ? offerStatusDetailLabels[offerStatus] : offerStatusLabels[offerStatus]}
          </span>
        </span>
      )}
      {offerType && offerType !== 'none' && (
        <span className="relative overflow-hidden text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 bg-black text-white">
          <span className="relative z-10">{offerTypeLabels[offerType]}</span>
        </span>
      )}
    </>
  )
}