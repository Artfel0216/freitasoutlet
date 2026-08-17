'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Product } from '@/types'
import { staggerItem } from '@/components/animations'
import { WishlistButton } from '@/components/product/WishlistButton'
import { CompareButton } from '@/components/product/CompareButton'
import { OfferBadge } from '@/components/product/OfferBadge'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0

  return (
    <motion.div variants={staggerItem}>
      <Link href={`/produtos/${product.slug}`} className="group block">
        <div className="product-card-media relative card-3d aspect-square bg-muted overflow-hidden mb-3">
          {product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Sem imagem</span>
            </div>
          )}

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          <div className="card-shine" />

          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <motion.span
                className="relative overflow-hidden bg-white text-foreground text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                style={{ boxShadow: '0 0 8px rgba(212, 175, 55, 0.3)' }}
              >
                <span className="relative z-10">Novo</span>
                <span className="absolute inset-0 bg-gradient-to-r from-gold/20 to-silver/20 opacity-50" />
              </motion.span>
            )}
            <OfferBadge offerStatus={product.offerStatus} />
          </div>
          {discountPercent > 0 && (
            <motion.span
              className={`${discountPercent >= 25 ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' : 'bg-gradient-to-r from-gold to-silver text-white'} text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 absolute top-2 right-2 relative overflow-hidden`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 300 }}
            >
              <span className="relative z-10">-{discountPercent}%</span>
              <motion.span
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
                }}
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.span>
          )}
          <span className="absolute bottom-2 right-2 z-10">
            <WishlistButton productId={product.id} className="bg-white/60 backdrop-blur-sm rounded-full text-foreground hover:text-red-400 transition-colors" />
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.brand.name}</p>
          <h3 className="text-sm font-semibold leading-tight group-hover:text-gold transition-colors">{product.name}</h3>
          <div className="flex items-center gap-2">
            <motion.span
              className="text-sm font-heading font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              R$ {product.price.toFixed(2).replace('.', ',')}
            </motion.span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                R$ {product.compareAtPrice!.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1 pt-1">
              {product.colors.slice(0, 4).map((color, i) => (
                <motion.span
                  key={color.hex}
                  className="relative block w-4 h-4 rounded-full border-2 border-background"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                />
              ))}
            </div>
          )}
          <div className="pt-1">
            <CompareButton product={product} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
