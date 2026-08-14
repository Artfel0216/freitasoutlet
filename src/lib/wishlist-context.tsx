'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

type WishlistContextType = {
  items: string[]
  isWishlisted: (id: string) => boolean
  toggle: (id: string) => void
  count: number
}

const WishlistContext = createContext<WishlistContextType | null>(null)

const STORAGE_KEY = 'fo_wishlist'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const isWishlisted = useCallback((id: string) => items.includes(id), [items])

  const toggle = useCallback((id: string) => {
    setItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }, [])

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggle, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
