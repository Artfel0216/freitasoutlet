'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Product } from '@/types'

type RecentlyViewedContextType = {
  items: Product[]
  add: (product: Product) => void
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | null>(null)

const STORAGE_KEY = 'fo_recently_viewed'
const MAX_ITEMS = 8

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as Product[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const add = useCallback((product: Product) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id)
      return [product, ...filtered].slice(0, MAX_ITEMS)
    })
  }, [])

  return (
    <RecentlyViewedContext.Provider value={{ items, add }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext)
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider')
  return ctx
}
