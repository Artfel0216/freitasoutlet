'use client'

import { AnimatePresence, motion } from 'framer-motion'
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
      <AnimatePresence mode="popLayout" initial={false}>
        {products.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </StaggerGrid>
  )
}
