'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Product } from '@/types'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/Button'
import { stagger } from '@/components/animations'

export function QuizResults({
  filteredProducts,
  onRestart,
}: {
  filteredProducts: Product[]
  onRestart: () => void
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Quiz Finalizado
        </p>
        <h1 className="font-heading font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-3">
          {filteredProducts.length > 0 ? 'Recomendados para você' : 'Nenhum resultado encontrado'}
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
          {filteredProducts.length > 0
            ? 'Baseado nas suas respostas, selecionamos os melhores produtos para você.'
            : 'Tente novamente com respostas diferentes.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={onRestart}>
            REFAZER QUIZ
          </Button>
          <Link href="/produtos">
            <Button variant="ghost" size="sm">VER TODOS OS PRODUTOS</Button>
          </Link>
        </div>
      </motion.div>

      {filteredProducts.length > 0 && (
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <ProductGrid products={filteredProducts} />
        </motion.div>
      )}
    </div>
  )
}