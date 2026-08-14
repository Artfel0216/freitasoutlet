'use client'

import { useCompare } from '@/context/CompareContext'
import type { Product } from '@/types'

interface CompareButtonProps {
  product: Product
}

export function CompareButton({ product }: CompareButtonProps) {
  const { addItem, removeItem, isInCompare } = useCompare()
  const inCompare = isInCompare(product.id)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (inCompare) {
          removeItem(product.id)
        } else {
          addItem(product)
        }
      }}
      className={`text-xs font-medium uppercase tracking-wider px-3 py-1.5 border transition-colors ${
        inCompare ? 'bg-black text-white border-black' : 'border-border hover:bg-muted'
      }`}
      title={inCompare ? 'Remover da comparação' : 'Comparar produto'}
    >
      {inCompare ? '✓ Comparando' : 'Comparar'}
    </button>
  )
}
