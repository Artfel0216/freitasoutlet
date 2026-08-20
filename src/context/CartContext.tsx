'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { CartItem, Product, ProductColor } from '@/types'
import { getEffectivePrice } from '@/lib/pricing'

const STORAGE_KEY = 'freitasoutlet_cart'

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product, selectedSize: string, selectedColor: ProductColor, quantity?: number) => void
  removeItem: (productId: string, size: string, colorName: string) => void
  updateQuantity: (productId: string, size: string, colorName: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as CartItem[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = useCallback((product: Product, selectedSize: string, selectedColor: ProductColor, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize && item.selectedColor.name === selectedColor.name
      )
      if (existing) {
        toast.success(`Quantidade atualizada: ${product.name}`)
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === selectedSize && item.selectedColor.name === selectedColor.name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      toast.success(`${product.name} adicionado ao carrinho`)
      return [...prev, { product, selectedSize, selectedColor, quantity }]
    })
  }, [])

  const removeItem = useCallback((productId: string, size: string, colorName: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId && i.selectedSize === size && i.selectedColor.name === colorName)
      if (item) toast.success(`${item.product.name} removido do carrinho`)
      return prev.filter((i) => !(i.product.id === productId && i.selectedSize === size && i.selectedColor.name === colorName))
    })
  }, [])

  const updateQuantity = useCallback((productId: string, size: string, colorName: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size && item.selectedColor.name === colorName
          ? { ...item, quantity: Math.max(1, Math.min(10, quantity)) }
          : item
      )
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + getEffectivePrice(item.product, item.quantity) * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
