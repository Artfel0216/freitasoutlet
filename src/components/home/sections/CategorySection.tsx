'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { stagger, staggerItem } from '@/components/animations'
import { categories } from '../home-data'

export function CategorySection() {
  return (
    <motion.section
      className="border-b border-border bg-linear-to-b from-muted/30 to-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={stagger}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <motion.h2
          variants={staggerItem}
          className="font-heading text-center text-2xl font-black uppercase tracking-tighter text-muted-foreground/50 mb-8 lg:text-3xl"
        >
          Categorias
        </motion.h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.label}
              variants={staggerItem}
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Link
                href={cat.href}
                className="group relative block overflow-hidden rounded-2xl border border-border bg-white"
              >
                <div className="relative flex h-32 flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-linear-to-br from-gold/20 to-silver/20 mb-2" />
                  <motion.h3
                    className="font-heading text-center text-lg font-black uppercase tracking-tight group-hover:text-gold transition-all"
                    style={{ textShadow: '0 0 8px currentColor' }}
                  >
                    {cat.label}
                  </motion.h3>
                  <motion.p
                    className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors"
                    initial={{ opacity: 0.7 }}
                  >
                    {cat.count}
                  </motion.p>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <motion.span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}` }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-xs font-bold" style={{ color: cat.color }}>
                      •
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}