'use client'

import { motion } from 'framer-motion'
import type { ProductInfoProps } from './shared'

export function ColorPicker({ product, purchase }: ProductInfoProps) {
  const { selectedColor, setSelectedColor } = purchase
  if (product.colors.length <= 1) return null
  if (!selectedColor) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <p className="text-xs font-bold uppercase tracking-wider mb-2">
        Cor: <span className="text-muted-foreground font-normal normal-case">{selectedColor.name}</span>
      </p>
      <div className="flex gap-2">
        {product.colors.map((color) => (
          <motion.button
            key={color.hex}
            onClick={() => setSelectedColor(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor.hex === color.hex ? 'border-black scale-110' : 'border-border hover:border-black'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
            aria-label={color.name}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </motion.div>
  )
}