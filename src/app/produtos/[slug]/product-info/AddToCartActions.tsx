'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { WishlistButton } from '@/components/product/WishlistButton'
import { CompareButton } from '@/components/product/CompareButton'
import { NotifyWhenAvailable } from '@/components/product/NotifyWhenAvailable'
import type { ProductInfoProps } from './shared'

export function AddToCartActions({ product, purchase }: ProductInfoProps) {
  const { addedToCart, isOutOfStock, handleAddToCart, isLowStock, stock, selectedSize } = purchase

  return (
    <>
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={addedToCart ? 'added' : 'add'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={addedToCart ? '!bg-green-600 !text-white !border-green-600' : ''}
              >
                {isOutOfStock ? 'FORA DE ESTOQUE' : addedToCart ? 'ADICIONADO AO CARRINHO' : 'ADICIONAR AO CARRINHO'}
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
        <WishlistButton productId={product.id} className="border border-border rounded-lg hover:border-black transition-colors" />
        <CompareButton product={product} />
      </motion.div>

      {isOutOfStock && (
        <NotifyWhenAvailable productId={product.id} selectedSize={selectedSize} />
      )}
      {isLowStock && !isOutOfStock && (
        <p className="text-xs text-orange-600 font-medium">
          Estoque baixo! Apenas {stock} {stock === 1 ? 'unidade' : 'unidades'} restante{stock === 1 ? '' : 's'}
        </p>
      )}
    </>
  )
}