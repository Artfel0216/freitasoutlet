'use client'

import dynamic from 'next/dynamic'
import type { Product } from '@/types'
import { ProductGallery } from './ProductGallery'
import { ProductInfo } from './ProductInfo'
import { useProductPurchase } from './use-product-purchase'

const ProductReviews = dynamic(
  () => import('@/components/product/ProductReviews').then((mod) => mod.ProductReviews),
  { ssr: false, loading: () => null },
)

const RecentlyViewed = dynamic(
  () => import('@/components/product/RecentlyViewed').then((mod) => mod.RecentlyViewed),
  { ssr: false, loading: () => null },
)

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const purchase = useProductPurchase(product)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-20">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <ProductGallery product={product} selectedColor={purchase.selectedColor} />
        <ProductInfo product={product} purchase={purchase} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-24">
        <div className="max-w-3xl">
          <ProductReviews productId={product.id} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-24">
        <RecentlyViewed />
      </div>
    </div>
  )
}