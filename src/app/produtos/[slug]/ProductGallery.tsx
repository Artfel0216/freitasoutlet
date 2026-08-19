'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import type { Product } from '@/types'
import { stagger, staggerItem } from '@/components/animations'

const UnboxingVideoPlayer = dynamic(
  () => import('@/components/ui/UnboxingVideoPlayer').then((mod) => mod.UnboxingVideoPlayer),
  { ssr: false, loading: () => null },
)

export function ProductGallery({ product, selectedColor }: { product: Product; selectedColor: Product['colors'][number] | undefined }) {
  const mainImage = selectedColor?.image ?? product.images[0]
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="aspect-square relative overflow-hidden bg-muted"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Sem imagem</span>
          </div>
        )}
      </motion.div>

      <motion.div
        className="grid grid-cols-4 gap-2"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {product.images.map((img, i) => (
          <motion.div
            key={i}
            className={`relative aspect-square bg-muted overflow-hidden rounded-lg ${
              selectedColor?.image === img ? 'ring-2 ring-foreground' : ''
            }`}
            variants={staggerItem}
          >
            <Image
              src={img}
              alt={`${product.name} - Foto ${i + 1}`}
              fill
              sizes="(max-width: 768px) 25vw, 10vw"
              className="object-cover"
            />
          </motion.div>
        ))}
      </motion.div>

      {product.video && (
        <motion.div
          className="aspect-video relative overflow-hidden bg-black"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <UnboxingVideoPlayer url={product.video} />
        </motion.div>
      )}
    </motion.div>
  )
}