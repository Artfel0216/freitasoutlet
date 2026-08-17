import type { Product } from '@/types'
import type { StoredProduct } from '@/lib/admin-products'

export function createInactiveCopy(product: Product, now = new Date().toISOString()): StoredProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: {
      id: product.brand.slug,
      name: product.brand.name,
      slug: product.brand.slug,
      segment: product.brand.segment,
    },
    category: {
      id: product.category.slug,
      name: product.category.name,
      slug: product.category.slug,
      parentId: product.category.parentId,
    },
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    images: product.images,
    video: product.video || '',
    colors: product.colors,
    sizes: product.sizes,
    sizeGuide: product.sizeGuide,
    tags: product.tags,
    isNew: product.isNew ?? false,
    isTrending: product.isTrending ?? false,
    offerStatus: product.offerStatus || 'none',
    offerType: product.offerType || 'none',
    offerDiscount: product.offerDiscount || 0,
    featured: product.featured || false,
    stock: product.stock ?? {},
    active: false,
    createdAt: now,
    updatedAt: now,
  }
}