'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { HeaderLogo } from '@/components/layout/HeaderLogo'

const menuItems = [
  { label: 'Calçados Masculinos', href: '/categorias/calcados-masculinos' },
  { label: 'Vestuário Premium', href: '/categorias/vestuario-premium' },
  { label: 'Futebol & Performance', href: '/categorias/futebol-performance' },
  { label: 'Acessórios', href: '/categorias/acessorios' },
  { label: 'Modelos', href: '/modelos' },
  { label: 'Marcas', href: '/produtos?marcas=all' },
  { label: 'Quiz', href: '/quiz' },
]

const megaCategorias = [
  { label: 'Calçados Masculinos', href: '/categorias/calcados-masculinos' },
  { label: 'Vestuário Premium', href: '/categorias/vestuario-premium' },
  { label: 'Futebol & Performance', href: '/categorias/futebol-performance' },
  { label: 'Acessórios', href: '/categorias/acessorios' },
  { label: 'Modelos', href: '/modelos' },
]

const megaMarcas = [
  { label: 'Nike', href: '/produtos?marca=nike' },
  { label: 'Adidas', href: '/produtos?marca=adidas' },
  { label: 'Gucci', href: '/produtos?marca=gucci' },
  { label: 'Alexander McQueen', href: '/produtos?marca=alexander-mcqueen' },
  { label: 'Hugo Boss', href: '/produtos?marca=hugo-boss' },
  { label: 'Louis Vuitton', href: '/produtos?marca=louis-vuitton' },
]

const megaAjuda = [
  { label: 'Programa de Fidelidade', href: '/fidelidade' },
  { label: 'Guia Interativo', href: '/quiz' },
  { label: 'Guia de Medidas', href: '/guia-de-medidas' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Fale Conosco', href: '/contato' },
  { label: 'Blog', href: '/blog' },
  { label: 'Rastrear Pedido', href: '/rastrear-pedido' },
  { label: 'Trocas e Devoluções', href: '/trocas-e-devolucoes' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const { totalItems } = useCart()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setMegaOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMegaOpen(false)
    }, 150)
  }

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <motion.button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
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

          <Link href="/" className="flex items-center">
            <HeaderLogo />
          </Link>

          <nav
            className="hidden lg:flex items-center gap-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {menuItems.map((item) => (
              <motion.div
                key={item.href}
                className="menu-item-3d"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Link
                  href={item.href}
                  className="relative block px-4 py-2 text-sm font-medium text-foreground hover:text-gold transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

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
        </div>
      </div>

      <AnimatePresence>
        {megaOpen && (
          <motion.div
            className="hidden lg:block absolute left-0 right-0 top-full site-mega border-b"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-4 gap-12">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-muted-foreground">
                    Categorias
                  </h3>
                  <ul className="space-y-3">
                    {megaCategorias.map((cat) => (
                      <li key={cat.href}>
                        <Link
                          href={cat.href}
                          className="text-sm font-medium hover:text-gold transition-colors"
                          onClick={() => setMegaOpen(false)}
                        >
                          {cat.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-muted-foreground">
                    Marcas
                  </h3>
                  <ul className="space-y-3">
                    {megaMarcas.map((marca) => (
                      <li key={marca.href}>
                        <Link
                          href={marca.href}
                          className="text-sm font-medium hover:text-gold transition-colors"
                          onClick={() => setMegaOpen(false)}
                        >
                          {marca.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Ajuda
                    </h3>
                  </div>
                  <ul className="grid grid-cols-2 gap-3">
                    {megaAjuda.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-sm font-medium hover:text-gold transition-colors"
                          onClick={() => setMegaOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
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
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <hr className="border-border my-2" />
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: menuItems.length * 0.05 }}
              >
                <Link
                  href="/favoritos"
                  className="block text-sm font-medium uppercase tracking-wider py-2 text-foreground hover:text-gold transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Favoritos
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (menuItems.length + 1) * 0.05 }}
              >
                <Link
                  href="/minha-conta"
                  className="block text-sm font-medium uppercase tracking-wider py-2 text-foreground hover:text-gold transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Minha Conta
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
