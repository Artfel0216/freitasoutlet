'use client'

import { motion } from 'framer-motion'
import { FadeIn } from '@/components/animations'
import { trustItems } from '../home-data'

export function TrustBadges() {
  return (
    <FadeIn>
      <section className="bg-muted border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <motion.div
                  className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-gold/20 to-silver/20 group-hover:from-gold/40 group-hover:to-silver/40 transition-all"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                >
                  <motion.span
                    className="block h-4 w-4 rounded-full bg-gold"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                </motion.div>
                <p className="font-heading font-bold text-sm uppercase tracking-wider">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  )
}