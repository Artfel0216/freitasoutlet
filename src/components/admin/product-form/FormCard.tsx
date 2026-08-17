'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function FormCard({
  title,
  delay,
  children,
  headerAction,
}: {
  title: string
  delay?: number
  children: ReactNode
  headerAction?: ReactNode
}) {
  return (
    <motion.div
      className="border border-border bg-white p-6 space-y-4 rounded-sm shadow-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay ?? 0.05, duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-sm uppercase tracking-wider">{title}</h2>
        {headerAction}
      </div>
      {children}
    </motion.div>
  )
}