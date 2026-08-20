import 'server-only'
import { cache } from 'react'
import type { Product } from '@/types'
import { products as staticProducts } from '@/data/products'
import { readStoredProducts, type StoredProduct } from '@/lib/admin-products'

export function storedToProduct(p: StoredProduct): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: { ...p.brand, segment: p.brand.segment as Product['brand']['segment'] },
    category: p.category,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? undefined,
    images: p.images,
    video: p.video,
    colors: p.colors,
    sizes: p.sizes,
    sizeGuide: p.sizeGuide as Product['sizeGuide'],
    tags: p.tags,
    isNew: p.isNew,
    isTrending: p.isTrending,
    offerStatus: p.offerStatus,
    offerType: p.offerType,
    offerDiscount: p.offerDiscount,
    featured: p.featured,
    createdAt: p.createdAt,
    stock: p.stock,
  }
}

export const getPublicProducts = cache(async (): Promise<Product[]> => {
  const stored = await readStoredProducts()
  const hiddenSlugs = new Set(stored.filter((s) => s.active === false).map((s) => s.slug))

  return [
    ...stored.filter((s) => s.active !== false).map(storedToProduct),
    ...staticProducts.filter((p) => !hiddenSlugs.has(p.slug)),
  ]
})