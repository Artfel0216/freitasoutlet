'use client'

import { useRecentlyViewed } from '@/lib/recently-viewed'
import { ProductGrid } from '@/components/product/ProductGrid'

export function RecentlyViewed() {
  const { items } = useRecentlyViewed()
  if (items.length === 0) return null

  return (
    <section className="mt-16 lg:mt-24">
      <h2 className="font-heading font-black text-xl lg:text-2xl uppercase tracking-tighter mb-6">
        Vistos Recentemente
      </h2>
      <ProductGrid products={items} />
    </section>
  )
}
