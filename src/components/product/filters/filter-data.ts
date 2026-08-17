import { products } from '@/data/products'
import type { ProductColor } from '@/types'

export const allColors: ProductColor[] = Array.from(
  new Map(products.flatMap((p) => p.colors).map((c) => [c.hex, c])).values(),
).sort((a, b) => a.name.localeCompare(b.name))

export const allSizes = [
  'P',
  'M',
  'G',
  'GG',
  'XGG',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  'Único',
]

export const sortOptions = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'price-asc', label: 'Menor Preço' },
  { value: 'price-desc', label: 'Maior Preço' },
  { value: 'newest', label: 'Mais Recentes' },
]