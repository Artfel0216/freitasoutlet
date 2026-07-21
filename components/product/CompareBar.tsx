'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCompare } from '@/context/CompareContext'

export function CompareBar() {
  const { items, removeItem, clearAll } = useCompare()

  if (items.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white border-t border-white/20 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <span className="text-xs font-medium uppercase tracking-wider whitespace-nowrap">
            Comparar ({items.length})
          </span>

          <div className="flex-1 flex items-center gap-3 overflow-x-auto">
            {items.map((product) => (
              <div key={product.id} className="relative flex items-center gap-2 bg-white/10 px-3 py-2 rounded shrink-0">
                <div className="relative w-8 h-8 bg-muted rounded overflow-hidden">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="32px" />
                </div>
                <span className="text-xs font-medium max-w-[120px] truncate">{product.name}</span>
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-white/50 hover:text-white ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearAll}
              className="text-xs text-white/50 hover:text-white uppercase tracking-wider"
            >
              Limpar
            </button>
            <Link
              href="/comparar"
              className="bg-white text-black text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white/90 transition-colors"
            >
              Comparar
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
