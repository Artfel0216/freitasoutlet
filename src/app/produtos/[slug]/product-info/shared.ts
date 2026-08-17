import type { Product } from '@/types'
import type { ProductPurchaseState } from '../use-product-purchase'

export interface ProductInfoProps {
  product: Product
  purchase: ProductPurchaseState
}

export function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`
}