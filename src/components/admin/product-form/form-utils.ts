import { categories } from '@/data/categories'
import type { Brand, OfferStatus, OfferType } from '@/types'

export type ColorInput = {
  name: string
  hex: string
}

export const inputClass =
  'w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background'

export const fieldLabelClass = 'block text-xs font-medium uppercase tracking-wider mb-1'

export const brandSegments = [
  { value: 'sportswear', label: 'Sportswear' },
  { value: 'premium', label: 'Premium' },
  { value: 'high-end', label: 'High-End' },
  { value: 'streetwear', label: 'Streetwear' },
]

export function findCategory(slug: string) {
  for (const cat of categories) {
    if (cat.slug === slug) return cat
    const child = cat.children?.find((c) => c.slug === slug)
    if (child) return child
  }
  return null
}

export interface ProductFormInitial {
  slug?: string
  name: string
  brandSlug: string
  categorySlug: string
  description: string
  price: string
  compareAtPrice: string
  sizes: string
  sizeGuide: string
  tags: string
  isNew: boolean
  isTrending: boolean
  offerStatus: OfferStatus
  offerType: OfferType
  offerDiscount: string
  featured: boolean
  colors: ColorInput[]
  video: string
  existingImages?: string[]
}

export function createProductFormInitial(): ProductFormInitial {
  return {
    slug: undefined,
    name: '',
    brandSlug: '',
    categorySlug: '',
    description: '',
    price: '',
    compareAtPrice: '',
    sizes: '',
    sizeGuide: 'shirt',
    tags: '',
    isNew: false,
    isTrending: false,
    offerStatus: 'none',
    offerType: 'none',
    offerDiscount: '',
    featured: false,
    colors: [{ name: '', hex: '#000000' }],
    video: '',
  }
}

export function findBrand(brandOptions: Brand[], slug: string): Brand | undefined {
  return brandOptions.find((b) => b.slug === slug)
}