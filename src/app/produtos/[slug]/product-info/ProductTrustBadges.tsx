'use client'

import { motion } from 'framer-motion'

const BADGES = [
  { d: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', label: 'Produto 100% original com garantia de autenticidade' },
  { d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Frete para todo Brasil' },
]

export function ProductTrustBadges() {
  return (
    <motion.div
      className="border-t border-border pt-6 space-y-3 text-xs text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      {BADGES.map((badge, i) => (
        <motion.div
          key={badge.label}
          className="flex items-center gap-2"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.65 + i * 0.05 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={badge.d} />
          </svg>
          {badge.label}
        </motion.div>
      ))}
    </motion.div>
  )
}