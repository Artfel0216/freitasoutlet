'use client'

import { motion } from 'framer-motion'
import type { Product } from '@/types'
import { ProductShowcase } from './ProductShowcase'
import { stagger, staggerItem } from '@/components/animations'

const staggerContainer = stagger

interface ProductSectionProps {
  title: string
  products: Product[]
}

export function ProductSection({ title, products }: ProductSectionProps) {
  if (products.length === 0) return null

  return (
    <section className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-xl font-heading font-bold uppercase tracking-wider">
          {title}
        </h2>
        <div className="w-12 h-0.5 bg-foreground mt-2" />
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={staggerItem}>
            <ProductShowcase product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
