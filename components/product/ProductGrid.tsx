'use client'

import type { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { StaggerGrid } from '@/components/animations'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Nenhum produto encontrado com esses filtros.</p>
      </div>
    )
  }

  return (
    <StaggerGrid className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </StaggerGrid>
  )
}
