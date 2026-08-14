'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product, ProductColor } from '@/types'

interface ProductShowcaseProps {
  product: Product
}

export function ProductShowcase({ product }: ProductShowcaseProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0]
  )

  const currentImage = selectedColor.image || product.images[0]

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/produtos/${product.slug}`} className="block">
        <div className="relative aspect-square bg-muted overflow-hidden mb-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedColor.hex}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={currentImage}
                alt={`${product.name} - ${selectedColor.name}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.05 }}
            transition={{ duration: 0.3 }}
          />

          {product.isNew && (
            <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-1">
              Novo
            </span>
          )}
          {discountPercent > 0 && (
            <span className="absolute top-2 right-2 bg-black text-white text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-1">
              -{discountPercent}%
            </span>
          )}
        </div>
      </Link>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {product.brand.name}
        </p>
        <h3 className="text-sm font-semibold leading-tight">{product.name}</h3>

        <div className="flex items-center gap-2">
          <span className="text-sm font-heading font-bold">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              R$ {product.compareAtPrice!.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>

        {product.colors.length > 1 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.map((color) => (
              <button
                key={color.hex}
                onClick={(e) => {
                  e.preventDefault()
                  setSelectedColor(color)
                }}
                className={`
                  w-5 h-5 rounded-full border-2 transition-all duration-200
                  ${selectedColor.hex === color.hex
                    ? 'border-foreground scale-110 ring-1 ring-foreground/20'
                    : 'border-border hover:scale-105'
                  }
                `}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground">
          Cor: {selectedColor.name}
        </p>
      </div>
    </motion.div>
  )
}
