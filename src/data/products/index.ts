import type { Product } from '@/types'
import { chuteiras } from './chuteiras'
import { tenis } from './tenis'
import {
  getProductBySlug as findProductBySlug,
  getProductById as findProductById,
  getProductsByCategory as findProductsByCategory,
  getProductsByBrand as findProductsByBrand,
  getFilteredProducts as applyFilters,
  type ProductFilters,
} from './queries'

export const products: Product[] = [...chuteiras, ...tenis]

export function getProductBySlug(slug: string): Product | undefined {
  return findProductBySlug(products, slug)
}

export function getProductById(id: string): Product | undefined {
  return findProductById(products, id)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return findProductsByCategory(products, categorySlug)
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return findProductsByBrand(products, brandSlug)
}

export function getFilteredProducts(filters: ProductFilters): Product[] {
  return applyFilters(products, filters)
}

export { chuteiras, tenis }
export type { ProductFilters }