'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { menuItems } from './menu-data'

interface MobileMenuPanelProps {
  open: boolean
  onClose: () => void
}

const utilityLinks = [
  { label: 'Favoritos', href: '/favoritos' },
  { label: 'Minha Conta', href: '/minha-conta' },
]

export function MobileMenuPanel({ open, onClose }: MobileMenuPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="lg:hidden border-t site-mega overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <nav className="px-4 py-4 space-y-3">
            {menuItems.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="block text-sm font-medium uppercase tracking-wider py-2 text-foreground hover:text-gold transition-colors"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <hr className="border-border my-2" />
            {utilityLinks.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (menuItems.length + i) * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="block text-sm font-medium uppercase tracking-wider py-2 text-foreground hover:text-gold transition-colors"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}