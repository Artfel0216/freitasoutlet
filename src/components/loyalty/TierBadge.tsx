'use client'

import { motion } from 'framer-motion'
import type { LoyaltyTier } from '@/context/LoyaltyContext'

const tierConfig = {
  bronze: {
    label: 'Bronze',
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
    dot: 'bg-amber-600',
  },
  prata: {
    label: 'Prata',
    bg: 'bg-zinc-100',
    text: 'text-zinc-700',
    border: 'border-zinc-300',
    dot: 'bg-zinc-400',
  },
  ouro: {
    label: 'Ouro',
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    dot: 'bg-yellow-500',
  },
  diamante: {
    label: 'Diamante',
    bg: 'bg-cyan-100',
    text: 'text-cyan-800',
    border: 'border-cyan-300',
    dot: 'bg-cyan-500',
  },
}

interface TierBadgeProps {
  tier: LoyaltyTier
  size?: 'sm' | 'md' | 'lg'
}

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const config = tierConfig[tier]
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5 gap-1' : size === 'lg' ? 'text-sm px-4 py-1.5 gap-2' : 'text-xs px-3 py-1 gap-1.5'

  return (
    <motion.span
      className={`inline-flex items-center font-heading font-bold uppercase tracking-wider rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </motion.span>
  )
}
