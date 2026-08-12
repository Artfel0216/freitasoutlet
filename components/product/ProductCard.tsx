'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { motion } from 'framer-motion'
import type { Product } from '@/types'
import { staggerItem } from '@/components/animations'
import { WishlistButton } from '@/components/product/WishlistButton'
import { CompareButton } from '@/components/product/CompareButton'

const ZOOM = 2.4
const LENS_SIZE = 'h-40 w-40'
const LENS_RADIUS = 80

interface ProductCardProps {
  product: Product
}

interface ZoomState {
  x: number
  y: number
  on: boolean
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0

  const imageRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState<ZoomState>({ x: 0, y: 0, on: false })

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = imageRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setZoom({ x, y, on: true })
  }

  const handleMouseLeave = () => {
    setZoom((z) => ({ ...z, on: false }))
  }

  return (
    <motion.div variants={staggerItem}>
      <Link href={`/produtos/${product.slug}`} className="group block">
        <motion.div
          ref={imageRef}
          className="product-card-media relative aspect-square bg-muted overflow-hidden mb-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />

          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.05 }}
            transition={{ duration: 0.3 }}
          />

          <div className="card-shine" />

          {zoom.on && (
            <div
              className="pointer-events-none absolute inset-0 z-20"
              style={{ clipPath: `circle(${LENS_RADIUS}px at ${zoom.x}px ${zoom.y}px)` }}
            >
              <div
                className="absolute inset-0"
                style={{
                  transformOrigin: '0 0',
                  transform: `translate(${zoom.x * (1 - ZOOM)}px, ${zoom.y * (1 - ZOOM)}px) scale(${ZOOM})`,
                }}
              >
                <Image
                  src={product.images[0]}
                  alt=""
                  fill
                  draggable={false}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {zoom.on && (
            <div
              className={`pointer-events-none absolute z-30 ${LENS_SIZE} rounded-full border border-white/80 shadow-[0_2px_24px_rgba(0,0,0,0.35)]`}
              style={{ left: zoom.x, top: zoom.y, transform: 'translate(-50%, -50%)' }}
            />
          )}

          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <motion.span
                className="bg-black text-white text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-1"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Novo
              </motion.span>
            )}
            {product.offerStatus && product.offerStatus !== 'none' && (
              <motion.span
                className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-1 ${
                  product.offerStatus === 'sale' ? 'bg-blue-600 text-white' :
                  product.offerStatus === 'promotion' ? 'bg-purple-600 text-white' :
                  'bg-orange-600 text-white'
                }`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 }}
              >
                {product.offerStatus === 'sale' ? 'Oferta' :
                 product.offerStatus === 'promotion' ? 'Promoção' : 'Queima'}
              </motion.span>
            )}
          </div>
          {discountPercent > 0 && (
            <motion.span
              className="absolute top-2 right-2 bg-black text-white text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-1"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              -{discountPercent}%
            </motion.span>
          )}
          <span className="absolute bottom-2 right-2 z-10">
            <WishlistButton productId={product.id} className="text-white/80 hover:text-red-400 transition-colors bg-black/30 backdrop-blur-sm rounded-full" />
          </span>
        </motion.div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.brand.name}</p>
          <h3 className="text-sm font-semibold leading-tight">{product.name}</h3>
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
              {product.colors.map((color, i) => (
                <motion.span
                  key={color.hex}
                  className="block w-3 h-3 rounded-full border border-border"
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
