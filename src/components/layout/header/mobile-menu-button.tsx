'use client'

import { motion } from 'framer-motion'

interface MobileMenuButtonProps {
  isOpen: boolean
  onToggle: () => void
}

export function MobileMenuButton({ isOpen, onToggle }: MobileMenuButtonProps) {
  return (
    <motion.button
      className="lg:hidden p-2 -ml-2"
      onClick={onToggle}
      aria-label="Abrir menu"
      whileTap={{ scale: 0.9 }}
    >
      <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isOpen ? (
          <motion.path
            key="close"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <motion.path
            key="menu"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </motion.button>
  )
}