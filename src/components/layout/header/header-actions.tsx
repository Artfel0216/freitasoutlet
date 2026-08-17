'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'

export function HeaderActions() {
  const { totalItems } = useCart()

  return (
    <div className="flex items-center gap-4">
      <div className="relative hidden sm:block">
        <form action="/busca" method="GET" className="glass flex items-center gap-2 px-3 py-1.5 rounded-lg">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            name="q"
            placeholder="Buscar produtos..."
            className="w-36 lg:w-48 bg-transparent text-sm focus:outline-none placeholder-muted-foreground"
            aria-label="Buscar produtos"
          />
          <button type="submit" className="sr-only">Buscar</button>
        </form>
      </div>

      <Link href="/busca" className="sm:hidden p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Buscar">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </Link>

      <Link href="/favoritos" className="p-2 text-muted-foreground hover:text-gold transition-colors" aria-label="Favoritos">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      </Link>

      <Link href="/minha-conta" className="hidden sm:block p-2 text-muted-foreground hover:text-gold transition-colors" aria-label="Minha conta">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </Link>

      <Link href="/carrinho" className="relative p-2 text-muted-foreground hover:text-gold transition-colors" aria-label="Carrinho">
        <motion.svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          whileHover={{ scale: 1.1 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </motion.svg>
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 bg-gold text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-heading font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {totalItems > 9 ? '9+' : totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </div>
  )
}