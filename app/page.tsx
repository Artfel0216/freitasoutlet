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

export default function HomePage() {
  const trendingProducts = products.filter((p) => p.isTrending)
  const newProducts = products.filter((p) => p.isNew)

  const categories = [
    { label: 'Calçados', href: '/categorias/calcados-masculinos', count: '12 itens' },
    { label: 'Vestuário Premium', href: '/categorias/vestuario-premium', count: '8 itens' },
    { label: 'Futebol', href: '/categorias/futebol-performance', count: '6 itens' },
    { label: 'Alta Costura', href: '/marcas/gucci', count: '4 itens' },
  ]

  const luxuryBrands = ['Alexander McQueen', 'Gucci', 'Louis Vuitton', 'Hugo Boss']

  const trustItems = [
    { title: 'Frete Grátis', desc: 'Acima de R$ 299' },
    { title: 'Parcele em Até 12x', desc: 'Sem juros no cartão' },
    { title: 'Garantia Original', desc: '100% autêntico' },
    { title: 'Troca Fácil', desc: 'Em até 30 dias' },
  ]

  return (
    <div>
      <Hero />

      {getActiveFlashSales().length > 0 && (
        <div>
          {getActiveFlashSales().map((sale) => {
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
        className="border-b border-border"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={stagger}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {categories.map((cat) => (
              <motion.div key={cat.label} variants={staggerItem}>
                <Link
                  href={cat.href}
                  className="bg-white p-6 lg:p-8 hover:bg-muted transition-colors group block"
                >
                  <p className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    {cat.count}
                  </p>
                  <h3 className="font-heading font-black text-xl lg:text-2xl uppercase tracking-tight group-hover:underline">
                    {cat.label}
                  </h3>
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
        className="bg-black text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <motion.p
                className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-white/70 mb-4"
                variants={fadeUp}
              >
                100% Original
              </motion.p>
              <motion.h2
                className="font-heading font-black text-3xl lg:text-5xl uppercase leading-tight mb-6"
                variants={fadeUp}
              >
                LUXO &<br />EXCLUSIVIDADE
              </motion.h2>
              <motion.p
                className="text-white/70 mb-8 max-w-md"
                variants={fadeUp}
              >
                Alexander McQueen, Gucci, Louis Vuitton, Hugo Boss. Artigos de alta-costura com garantia de autenticidade e procedência.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link href="/marcas/alexander-mcqueen">
                  <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-black">
                    EXPLORAR LUXO
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={stagger}
            >
              {luxuryBrands.map((brand) => (
                <motion.div
                  key={brand}
                  className="bg-white/5 p-6 text-center"
                  variants={staggerItem}
                >
                  <p className="font-heading font-black text-xs uppercase tracking-wider">{brand}</p>
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
              {trustItems.map((item) => (
                <div key={item.title}>
                  <p className="font-heading font-bold text-sm uppercase tracking-wider">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
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
