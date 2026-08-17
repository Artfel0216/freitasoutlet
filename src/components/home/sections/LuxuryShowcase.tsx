'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { fadeUp, stagger, staggerItem } from '@/components/animations'
import { luxuryBrands } from '../home-data'

export function LuxuryShowcase() {
  return (
    <motion.section
      className="relative isolate overflow-hidden border-y border-border"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-muted/50 via-background to-muted/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <motion.p
              className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4"
              variants={fadeUp}
            >
              100% Original
            </motion.p>
            <motion.h2
              className="font-heading font-black text-3xl lg:text-5xl uppercase leading-tight mb-6 relative"
              variants={fadeUp}
              style={{
                background: 'linear-gradient(90deg, #000000 0%, #ffffff 50%, #000000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              LUXO & EXCLUSIVIDADE
            </motion.h2>
            <motion.p
              className="text-muted-foreground mb-8 max-w-md"
              variants={fadeUp}
            >
              Alexander McQueen, Gucci, Louis Vuitton, Hugo Boss. Artigos de alta-costura com
              garantia de autenticidade e procedência.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/marcas/alexander-mcqueen">
                <Button variant="outline" size="lg" className="border-foreground hover:bg-gold hover:text-white">
                  Explorar Luxo
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={stagger}
          >
            {luxuryBrands.map((brand, i) => (
              <motion.div
                key={brand.name}
                className="glass-card relative flex h-24 items-center justify-center rounded-xl p-4"
                variants={staggerItem}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ backgroundColor: brand.bg }}
              >
                <div className="h-8 w-8 rounded-full bg-linear-to-br from-gold/30 to-silver/30 mb-1" />
                <motion.p
                  className="font-heading font-black text-xs uppercase tracking-wider"
                  style={{ color: brand.color, textShadow: '0 0 8px rgba(0,0,0,0.1)' }}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
                >
                  {brand.name}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}