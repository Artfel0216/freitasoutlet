'use client'

import { motion } from 'framer-motion'
import { SizeGuide } from '@/components/product/SizeGuide'
import { SizeRecommendation } from '@/components/product/SizeRecommendation'
import type { ProductInfoProps } from './shared'

export function SizePicker({ product, purchase }: ProductInfoProps) {
  const { selectedSize, setSelectedSize } = purchase
  if (product.sizes[0] === 'Único') return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-wider">
            Tamanho: <span className="text-muted-foreground font-normal normal-case">{selectedSize}</span>
          </p>
          <SizeRecommendation sizeGuide={product.sizeGuide} />
        </div>
        <SizeGuide type={product.sizeGuide} />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {product.sizes.map((size) => (
          <motion.button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`py-2 text-sm font-medium border transition-all ${
              selectedSize === size ? 'bg-black text-white border-black' : 'border-border hover:border-black'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {size}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}