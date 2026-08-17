'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useRecentlyViewed } from '@/lib/recently-viewed'
import { getFlashSaleForProduct } from '@/lib/flash-sales'

export interface ProductPurchaseState {
  selectedSize: string
  selectedColor: Product['colors'][number]
  quantity: number
  addedToCart: boolean
  hasDiscount: boolean
  discountPercent: number
  flashSale: ReturnType<typeof getFlashSaleForProduct>
  flashSalePrice: number | null
  stock: number
  isOutOfStock: boolean
  isLowStock: boolean
  setSelectedSize: (size: string) => void
  setSelectedColor: (color: Product['colors'][number]) => void
  setQuantity: (quantity: number) => void
  handleAddToCart: () => void
}

export function useProductPurchase(product: Product): ProductPurchaseState {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()
  const { add: addToRecentlyViewed } = useRecentlyViewed()

  useEffect(() => {
    addToRecentlyViewed(product)
  }, [addToRecentlyViewed, product])

  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price)
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0

  const flashSale = getFlashSaleForProduct(product.slug)
  const flashSalePrice = flashSale ? product.price * (1 - flashSale.discountPercent / 100) : null

  const stock = product.stock?.[selectedSize] ?? 0
  const isOutOfStock = stock === 0
  const isLowStock = stock > 0 && stock <= 5

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addItem(product, selectedSize, selectedColor, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return {
    selectedSize,
    selectedColor,
    quantity,
    addedToCart,
    hasDiscount,
    discountPercent,
    flashSale,
    flashSalePrice,
    stock,
    isOutOfStock,
    isLowStock,
    setSelectedSize,
    setSelectedColor,
    setQuantity,
    handleAddToCart,
  }
}