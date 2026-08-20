import { getFlashSaleForProduct } from './flash-sales'
import { getUnitPrice } from './wholesale'

export interface PricedItem {
  slug: string
  price: number
}

export function getFlashSalePrice(item: PricedItem): number | null {
  const flashSale = getFlashSaleForProduct(item.slug)
  if (!flashSale) return null
  return Math.round(item.price * (1 - flashSale.discountPercent / 100) * 100) / 100
}

export function getEffectivePrice(item: PricedItem, quantity: number): number {
  const flashPrice = getFlashSalePrice(item)
  if (flashPrice !== null) return flashPrice
  return getUnitPrice(item.price, quantity)
}