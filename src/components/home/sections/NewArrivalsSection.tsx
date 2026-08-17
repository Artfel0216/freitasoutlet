'use client'

import type { Product } from '@/types'
import { FadeUp } from '@/components/animations'
import { ProductGrid } from '@/components/product/ProductGrid'
import { SectionHeader } from './TrendingSection'

export function NewArrivalsSection({ products }: { products: Product[] }) {
  return (
    <FadeUp>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <SectionHeader
          eyebrow="Acabaram de Chegar"
          title="Novidades"
          viewAllHref="/produtos?sort=newest"
        />
        <ProductGrid products={products} />
      </section>
    </FadeUp>
  )
}