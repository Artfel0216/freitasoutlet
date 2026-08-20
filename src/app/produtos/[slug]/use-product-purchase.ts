'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useRecentlyViewed } from '@/lib/recently-viewed'
import { getFlashSaleForProduct } from '@/lib/flash-sales'
import { getEffectivePrice } from '@/lib/pricing'
import { isWholesaleQuantity } from '@/lib/wholesale'

export interface ProductPurchaseState {
  selectedSize: string
  selectedColor: Product['colors'][number] | undefined
  quantity: number
  addedToCart: boolean
  hasDiscount: boolean
  discountPercent: number
  flashSale: ReturnType<typeof getFlashSaleForProduct>
  flashSalePrice: number | null
  unitPrice: number
  isWholesale: boolean
  stock: number
  isOutOfStock: boolean
  isLowStock: boolean
  setSelectedSize: (size: string) => void
  setSelectedColor: (color: Product['colors'][number]) => void
  setQuantity: (quantity: number) => void
  handleAddToCart: () => void
}

export function useProductPurchase(product: Product): ProductPurchaseState {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? '')
  const [selectedColor, setSelectedColor] = useState<Product['colors'][number] | undefined>(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()
  const { add: addToRecentlyViewed } = useRecentlyViewed()

  useEffect(() => {
    addToRecentlyViewed(product)
  }, [addToRecentlyViewed, product])

  useEffect(() => {
    if (!addedToCart) return
    const timer = setTimeout(() => setAddedToCart(false), 2000)
    return () => clearTimeout(timer)
  }, [addedToCart])

  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price)
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0

  const flashSale = getFlashSaleForProduct(product.slug)
  const flashSalePrice = flashSale ? product.price * (1 - flashSale.discountPercent / 100) : null

  const unitPrice = getEffectivePrice(product, quantity)
  const isWholesale = isWholesaleQuantity(quantity)

  const stock = product.stock?.[selectedSize] ?? 0
  const isOutOfStock = stock === 0
  const isLowStock = stock > 0 && stock <= 5

  const handleAddToCart = () => {
    if (isOutOfStock) return
    if (!selectedSize || !selectedColor) return
    addItem(product, selectedSize, selectedColor, quantity)
    setAddedToCart(true)
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
    unitPrice,
    isWholesale,
    stock,
    isOutOfStock,
    isLowStock,
    setSelectedSize,
    setSelectedColor,
    setQuantity,
    handleAddToCart,
  }
}