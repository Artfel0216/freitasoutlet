'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Product } from '@/types'
import { toast } from 'sonner'

type CompareContextType = {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearAll: () => void
  isInCompare: (productId: string) => boolean
  maxItems: number
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])
  const maxItems = 4

  const addItem = useCallback((product: Product) => {
    setItems(prev => {
      if (prev.find(p => p.id === product.id)) {
        toast.info('Produto já está na comparação')
        return prev
      }
      if (prev.length >= maxItems) {
        toast.error(`Máximo de ${maxItems} produtos para comparar`)
        return prev
      }
      toast.success(`${product.name} adicionado à comparação`)
      return [...prev, product]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(p => p.id !== productId))
  }, [])

  const clearAll = useCallback(() => setItems([]), [])

  const isInCompare = useCallback((productId: string) => items.some(p => p.id === productId), [items])

  return (
    <CompareContext.Provider value={{ items, addItem, removeItem, clearAll, isInCompare, maxItems }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) throw new Error('useCompare must be used within a CompareProvider')
  return context
}
