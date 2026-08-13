'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Hero } from '@/components/home/Hero'
import { ProductGrid } from '@/components/product/ProductGrid'
import { RecentlyViewed } from '@/components/product/RecentlyViewed'
import { Button } from '@/components/ui/Button'
import { products } from '@/data/products'
import { FlashSaleTimer } from '@/components/product/FlashSaleTimer'
import { getActiveFlashSales } from '@/lib/flash-sales'
import { FadeIn, FadeUp, staggerItem, stagger, fadeUp } from '@/components/animations'

const categories = [
  { label: 'Calçados', href: '/categorias/calcados-masculinos', count: '12 itens', color: '#d4af37' },
  { label: 'Vestuário Premium', href: '/categorias/vestuario-premium', count: '8 itens', color: '#c0c0c0' },
  { label: 'Futebol', href: '/categorias/futebol-performance', count: '6 itens', color: '#3b82f6' },
  { label: 'Alta Costura', href: '/marcas/gucci', count: '4 itens', color: '#d4af37' },
]

const luxuryBrands = [
  { name: 'Alexander McQueen', color: '#000000', bg: '#f5f5f5' },
  { name: 'Gucci', color: '#000000', bg: '#f5f5f5' },
  { name: 'Louis Vuitton', color: '#000000', bg: '#f5f5f5' },
  { name: 'Hugo Boss', color: '#000000', bg: '#f5f5f5' },
]

const trustItems = [
  { title: 'Frete Grátis', desc: 'Acima de R$ 299' },
  { title: 'Parcele em Até 12x', desc: 'Sem juros no cartão' },
  { title: 'Garantia Original', desc: '100% autêntico' },
  { title: 'Troca Fácil', desc: 'Em até 30 dias' },
  ]

export default function HomePage() {
  const trendingProducts = products.filter((p) => p.isTrending)
  const newProducts = products.filter((p) => p.isNew)
  const activeFlashSales = getActiveFlashSales()

  return (
    <div>
      <Hero />

      {activeFlashSales.length > 0 && (
        <div>
          {activeFlashSales.map((sale) => {
            const product = products.find((p) => p.slug === sale.productSlug)
            if (!product) return null
            return (
              <Link key={sale.productSlug} href={`/produtos/${sale.productSlug}`}>
                <FlashSaleTimer endsAt={sale.endsAt} label={sale.label} variant="banner" />
              </Link>
            )
          })}
        </div>
      )}

      <motion.section
        className="border-b border-border bg-gradient-to-b from-muted/30 to-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={stagger}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.h2
            variants={staggerItem}
            className="font-heading text-center text-2xl font-black uppercase tracking-tighter text-muted-foreground/50 mb-8 lg:text-3xl"
          >
            Categorias
          </motion.h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((cat) => (
              <motion.div
                key={cat.label}
                variants={staggerItem}
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Link
                  href={cat.href}
                  className="group relative block overflow-hidden rounded-2xl border border-border bg-white"
                >
                  <div className="relative flex h-32 flex-col items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gold/20 to-silver/20 mb-2" />
                    <motion.h3
                      className="font-heading text-center text-lg font-black uppercase tracking-tight group-hover:text-gold transition-all"
                      style={{ textShadow: '0 0 8px currentColor' }}
                    >
                      {cat.label}
                    </motion.h3>
                    <motion.p
                      className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors"
                      initial={{ opacity: 0.7 }}
                    >
                      {cat.count}
                    </motion.p>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <motion.span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}` }}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span
                        className="text-xs font-bold"
                        style={{ color: cat.color }}
                      >
                        •
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <FadeUp>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Destaques
              </p>
              <h2 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mt-1">
                Mais Vendidos
              </h2>
            </div>
            <Link href="/produtos" className="text-sm font-medium underline hover:no-underline">
              Ver Todos
            </Link>
          </div>
          <ProductGrid products={trendingProducts} />
        </section>
      </FadeUp>

      <motion.section
        className="relative isolate overflow-hidden border-y border-border"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-muted/30" />

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
                  background: 'linear-gradient(90deg, #000000 0%, #d4af37 50%, #000000 100%)',
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
                Alexander McQueen, Gucci, Louis Vuitton, Hugo Boss. Artigos de alta-costura com garantia de autenticidade e procedência.
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
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold/30 to-silver/30 mb-1" />
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

      <FadeUp>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Acabaram de Chegar
              </p>
              <h2 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mt-1">
                Novidades
              </h2>
            </div>
            <Link href="/produtos?sort=newest" className="text-sm font-medium underline hover:no-underline">
              Ver Todos
            </Link>
          </div>
          <ProductGrid products={newProducts} />
        </section>
      </FadeUp>

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
                    className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-silver/20 group-hover:from-gold/40 group-hover:to-silver/40 transition-all"
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

      <div className="px-4 sm:px-6 lg:px-8">
        <RecentlyViewed />
      </div>
    </div>
  )
}
