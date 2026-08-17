'use client'

import { motion } from 'framer-motion'
import type { ProductPurchaseState } from '../use-product-purchase'

export function QuantityStepper({ purchase }: { purchase: ProductPurchaseState }) {
  const { quantity, setQuantity } = purchase

  return (
    <motion.div
      className="flex items-center gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center border border-border">
        <motion.button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-3 py-2 text-sm hover:bg-muted transition-colors"
          aria-label="Diminuir quantidade"
          whileTap={{ scale: 0.9 }}
        >
          -
        </motion.button>
        <motion.span
          key={quantity}
          className="px-4 py-2 text-sm font-medium border-x border-border min-w-[3rem] text-center block"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {quantity}
        </motion.span>
        <motion.button
          onClick={() => setQuantity(quantity + 1)}
          className="px-3 py-2 text-sm hover:bg-muted transition-colors"
          aria-label="Aumentar quantidade"
          whileTap={{ scale: 0.9 }}
        >
          +
        </motion.button>
      </div>
    </motion.div>
  )
}