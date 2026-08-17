'use client'

import type { OfferStatus, OfferType } from '@/types'
import { inputClass, fieldLabelClass } from './form-utils'

interface OfferStatusFieldsProps {
  offerStatus: OfferStatus
  offerType: OfferType
  offerDiscount: string
  featured: boolean
  setOfferStatus: (value: OfferStatus) => void
  setOfferType: (value: OfferType) => void
  setOfferDiscount: (value: string) => void
  setFeatured: (value: boolean) => void
}

export function OfferStatusFields({
  offerStatus,
  offerType,
  offerDiscount,
  featured,
  setOfferStatus,
  setOfferType,
  setOfferDiscount,
  setFeatured,
}: OfferStatusFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={fieldLabelClass}>Status da Oferta</label>
        <select value={offerStatus} onChange={(e) => setOfferStatus(e.target.value as OfferStatus)} className={inputClass}>
          <option value="none">Normal</option>
          <option value="sale">Em Oferta</option>
          <option value="promotion">Em Promoção</option>
          <option value="clearance">Queima de Estoque</option>
        </select>
      </div>

      <div>
        <label className={fieldLabelClass}>Tipo de Oferta</label>
        <select value={offerType} onChange={(e) => setOfferType(e.target.value as OfferType)} className={inputClass}>
          <option value="none">Nenhum</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensal</option>
        </select>
      </div>

      <div>
        <label className={fieldLabelClass}>Desconto (%)</label>
        <input type="number" min="0" max="100" value={offerDiscount} onChange={(e) => setOfferDiscount(e.target.value)} className={inputClass} />
      </div>

      <div className="flex items-end pb-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4" />
          Produto em Destaque
        </label>
      </div>
    </div>
  )
}