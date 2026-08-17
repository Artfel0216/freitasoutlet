'use client'

import Link from 'next/link'
import type { Product } from '@/types'
import { FadeUp } from '@/components/animations'
import { ProductGrid } from '@/components/product/ProductGrid'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  viewAllHref: string
}

export function SectionHeader({ eyebrow, title, viewAllHref }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <p className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mt-1">
          {title}
        </h2>
      </div>
      <Link href={viewAllHref} className="text-sm font-medium underline hover:no-underline">
        Ver Todos
      </Link>
    </div>
  )
}

export function TrendingSection({ products }: { products: Product[] }) {
  return (
    <FadeUp>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <SectionHeader eyebrow="Destaques" title="Mais Vendidos" viewAllHref="/produtos" />
        <ProductGrid products={products} />
      </section>
    </FadeUp>
  )
}