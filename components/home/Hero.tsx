'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRef, useState, useEffect, type ReactNode } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { HeroCanvas } from './HeroCanvas'

const Hero3D = dynamic(() => import('./Hero3D').then((mod) => mod.Hero3D), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
})

function DeferredMount({ children, delay = 500 }: { children: ReactNode; delay?: number }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), delay)
    return () => window.clearTimeout(id)
  }, [delay])

  return <>{ready ? children : <div className="h-full w-full" />}</>
}

const heroProduct = {
  name: 'Nike Air Max Infinity',
  slug: 'tenis-nike-air-max-infinity',
  price: 'R$ 799,90',
  compareAtPrice: 'R$ 999,90',
  image: '/images/products/catalogo/tenis/nike/air-max-infinity/cinza-lateral.jpg',
}

const brands = [
  'Nike',
  'Adidas',
  'Gucci',
  'Alexander McQueen',
  'Louis Vuitton',
  'Hugo Boss',
  'On',
  'Puma',
]

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const lineGrow: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
}

function BrandMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-border" aria-hidden="true">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((n) => (
          <div key={n} className="flex shrink-0 items-center">
            {brands.map((brand) => (
              <span
                key={`${n}-${brand}`}
                className="flex items-center gap-6 px-6 py-4 font-heading text-sm font-black uppercase tracking-[0.35em] text-muted-foreground/30"
              >
                {brand}
                <span className="h-1.5 w-1.5 rotate-45 bg-gold/40" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const heroTags = [
  { label: 'Frete Grátis +R$ 299' },
  { label: '12x sem juros' },
  { label: '100% original' },
]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -110])
  const shoeY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -70])
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, reduceMotion ? 1 : 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.94])

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden text-foreground" onMouseMove={(e) => {
      if (reduceMotion) return
      const rect = e.currentTarget.getBoundingClientRect()
      setMousePos({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      })
    }}>
      <HeroCanvas />

      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[calc(100svh-5rem)] items-center gap-12 pb-16 pt-10 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-16">
            <motion.div style={{ y: textY, opacity: fade }}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={container}
                className="max-w-2xl"
              >
                <motion.div variants={item} className="mb-6 flex items-center gap-3">
                  <motion.span variants={lineGrow} className="block h-px w-12 origin-left bg-foreground/60" />
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    Coleção Inverno 2026
                  </p>
                </motion.div>

                <motion.h1
                  variants={item}
                  className="font-heading text-[13vw] font-black uppercase leading-[0.92] tracking-tighter sm:text-6xl lg:text-7xl xl:text-8xl"
                >
                  <span className="block">Streetwear</span>
                  <span className="block">Luxo &amp;</span>
                  <motion.span
                    className="inline-block"
                    animate={reduceMotion ? undefined : { rotateY: mousePos.x * 15 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  >
                    Performance
                  </motion.span>
                </motion.h1>

                <motion.p variants={item} className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
                  As marcas mais desejadas do mundo em um só lugar. Nike, Gucci, Alexander
                  McQueen, On Cloud e muito mais — agora com visualização 3D interativa.
                </motion.p>

                <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-3d"
                  >
                    <Link
                      href="/produtos"
                      className="btn-3d-inner relative inline-flex items-center gap-3 bg-gold px-10 py-4 font-heading text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-gold/90"
                    >
                      <span>Comprar Agora</span>
                      <motion.svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </motion.svg>
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-3d"
                  >
                    <Link
                      href="/categorias/futebol-performance"
                      className="btn-3d-inner relative inline-flex items-center gap-2 border-2 border-foreground/20 px-10 py-4 font-heading text-sm font-bold uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:border-gold hover:bg-gold/5"
                    >
                      <span>Futebol</span>
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={item}
                  className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  {heroTags.map((tag, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                      {tag.label}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              style={{ y: shoeY, opacity: fade, scale }}
              className="relative lg:pl-6"
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={container}
                className="relative"
              >
                <motion.span
                  variants={item}
                  aria-hidden
                  className="pointer-events-none absolute -top-10 left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap font-heading text-[clamp(5rem,16vw,11rem)] font-black uppercase leading-none text-stroke-strong"
                >
                  LUXO
                </motion.span>

                <motion.div variants={item} className="relative z-[1]">
                  <div className="absolute -inset-6 animate-spin-slow rounded-full border-2 border-dashed border-gold/15" />

                  <div className="relative mx-auto aspect-square h-[420px] w-full max-w-md overflow-hidden rounded-3xl">
                    <DeferredMount>
                      <Hero3D />
                    </DeferredMount>
                  </div>

                  <motion.div
                    variants={item}
                    className="glass-card absolute bottom-3 left-0 right-0 z-10 flex items-end justify-between gap-4 rounded-xl px-4 py-3 text-xs"
                  >
                    <div>
                      <p className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                        Destaque da Semana
                      </p>
                      <p className="mt-1 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                        {heroProduct.name}
                      </p>
                    </div>
                    <Link
                      href={`/produtos/${heroProduct.slug}`}
                      className="group flex flex-col items-end gap-1 font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold"
                    >
                      <span className="text-base text-foreground">{heroProduct.price}</span>
                      <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground group-hover:text-gold">
                        <span className="line-through">{heroProduct.compareAtPrice}</span>
                        <svg
                          className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-20 left-6 z-10 hidden items-center gap-3 lg:flex">
          <span className="font-heading text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Scroll
          </span>
          <span className="block h-10 w-px overflow-hidden bg-border">
            <motion.span
              className="block h-4 w-px bg-foreground"
              animate={{ y: [-16, 16] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </div>

        <BrandMarquee />
      </div>
    </section>
  )
}
