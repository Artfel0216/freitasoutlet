'use client'

import { motion } from 'framer-motion'
import { formatPrice, type ProductInfoProps } from './shared'
import { WHOLESALE_DISCOUNT_PERCENT } from '@/lib/wholesale'

export function PriceBlock({ product, purchase }: ProductInfoProps) {
  const { flashSale, flashSalePrice, hasDiscount, discountPercent, unitPrice, isWholesale } = purchase
  const isFlashSale = flashSale && flashSalePrice

  const mainPrice = unitPrice
  const showCompare = isFlashSale || isWholesale ? product.price : hasDiscount ? product.compareAtPrice : undefined

  return (
    <motion.div
      className="flex items-baseline gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <span className="font-heading font-bold text-3xl text-red-600">
        {formatPrice(mainPrice)}
      </span>
      {showCompare != null && showCompare > mainPrice && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(showCompare)}
        </span>
      )}
      {isFlashSale ? (
        <motion.span
          className="text-xs font-heading font-bold bg-red-600 text-white px-2 py-0.5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          -{flashSale.discountPercent}%
        </motion.span>
      ) : isWholesale ? (
        <motion.span
          className="text-xs font-heading font-bold bg-green-700 text-white px-2 py-0.5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          ATACADO -{WHOLESALE_DISCOUNT_PERCENT}%
        </motion.span>
      ) : hasDiscount ? (
        <motion.span
          className="text-xs font-heading font-bold bg-black text-white px-2 py-0.5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          -{discountPercent}%
        </motion.span>
      ) : null}
    </motion.div>
  )
}