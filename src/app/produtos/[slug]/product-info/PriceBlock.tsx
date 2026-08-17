'use client'

import { motion } from 'framer-motion'
import { formatPrice, type ProductInfoProps } from './shared'

export function PriceBlock({ product, purchase }: ProductInfoProps) {
  const { flashSale, flashSalePrice, hasDiscount, discountPercent } = purchase
  const isFlashSale = flashSale && flashSalePrice

  return (
    <motion.div
      className="flex items-baseline gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {isFlashSale ? (
        <>
          <span className="font-heading font-bold text-3xl text-red-600">
            {formatPrice(flashSalePrice)}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(product.price)}
          </span>
          <motion.span
            className="text-xs font-heading font-bold bg-red-600 text-white px-2 py-0.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            -{flashSale.discountPercent}%
          </motion.span>
        </>
      ) : (
        <>
          <span className="font-heading font-bold text-3xl">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
              <motion.span
                className="text-xs font-heading font-bold bg-black text-white px-2 py-0.5"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                -{discountPercent}%
              </motion.span>
            </>
          )}
        </>
      )}
    </motion.div>
  )
}