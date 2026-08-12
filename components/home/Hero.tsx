'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { HeroCanvas } from './HeroCanvas'
import { TiltCard } from '@/components/ui/TiltCard'

const heroProduct = {
  name: 'Nike Air Max Infinity',
  slug: 'tenis-nike-air-max-infinity',
  price: 'R$ 799,90',
  compareAtPrice: 'R$ 999,90',
  image: '/images/products/catalogo/tenis/nike/air-max-infinity/preto-lateral.jpg',
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const lineGrow: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
}

function BrandMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-white/10" aria-hidden="true">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((n) => (
          <div key={n} className="flex shrink-0 items-center">
            {brands.map((brand) => (
              <span
                key={`${n}-${brand}`}
                className="flex items-center gap-6 px-6 py-4 font-heading text-sm font-black uppercase tracking-[0.35em] text-white/25"
              >
                {brand}
                <span className="h-1.5 w-1.5 rotate-45 bg-white/20" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -110])
  const shoeY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -70])
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, reduceMotion ? 1 : 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.94])

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-black text-white">
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
                  <motion.span variants={lineGrow} className="block h-px w-12 origin-left bg-white/60" />
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-white/70">
                    Coleção Inverno 2026
                  </p>
                </motion.div>

                <motion.h1
                  variants={item}
                  className="font-heading text-[13vw] font-black uppercase leading-[0.92] tracking-tighter sm:text-6xl lg:text-7xl xl:text-8xl"
                >
                  <span className="block">Streetwear</span>
                  <span className="block">Luxo &amp;</span>
                  <span className="block text-stroke text-glow">Performance</span>
                </motion.h1>

                <motion.p variants={item} className="mt-6 max-w-lg text-base text-white/70 sm:text-lg">
                  As marcas mais desejadas do mundo em um só lugar. Nike, Gucci, Alexander
                  McQueen, On Cloud e muito mais — agora com visualização 3D interativa.
                </motion.p>

                <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/produtos"
                    className="btn-shine group relative inline-flex items-center gap-3 bg-white px-10 py-4 font-heading text-sm font-bold uppercase tracking-[0.2em] text-black transition-colors duration-300 hover:bg-black hover:text-white hover:ring-1 hover:ring-inset hover:ring-white"
                  >
                    <span className="relative z-10">Comprar Agora</span>
                    <svg
                      className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/categorias/futebol-performance"
                    className="inline-flex items-center gap-2 border border-white/30 px-10 py-4 font-heading text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:border-white hover:bg-white/5"
                  >
                    Futebol
                  </Link>
                </motion.div>

                <motion.div
                  variants={item}
                  className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-white/50"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Frete Grátis +R$ 299
                  </span>
                  <span>12x sem juros</span>
                  <span>100% original</span>
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
                  className="pointer-events-none absolute -top-10 left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap font-heading text-[clamp(5rem,16vw,11rem)] font-black uppercase leading-none tracking-tighter text-stroke-strong"
                >
                  LUXO
                </motion.span>

                <motion.div variants={item} className="relative z-[1] aspect-[4/5]">
                  <span className="absolute -left-3 -top-3 h-8 w-8 border-l-2 border-t-2 border-white/40" />
                  <span className="absolute -right-3 -top-3 h-8 w-8 border-r-2 border-t-2 border-white/40" />
                  <span className="absolute -bottom-3 -left-3 h-8 w-8 border-b-2 border-l-2 border-white/40" />
                  <span className="absolute -bottom-3 -right-3 h-8 w-8 border-b-2 border-r-2 border-white/40" />

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.14),transparent_62%)]" />

                  <TiltCard intensity={9} className="relative h-full w-full">
                    <motion.div
                      animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative h-full w-full [transform-style:preserve-3d]"
                    >
                      <Image
                        src={heroProduct.image}
                        alt={heroProduct.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 45vw"
                        className="object-cover grayscale contrast-125 brightness-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.12)_45%,transparent_60%)]" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />
                    </motion.div>
                  </TiltCard>

                  <div className="pointer-events-none absolute -inset-6 animate-spin rounded-full border border-dashed border-white/15 [animation-duration:40s]" />

                  <motion.div
                    variants={item}
                    className="glass-dark absolute bottom-3 left-0 right-0 z-10 flex items-end justify-between gap-4 rounded-xl px-4 py-3 text-xs"
                  >
                    <div>
                      <p className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
                        Destaque da Semana
                      </p>
                      <p className="mt-1 font-heading text-sm font-bold uppercase tracking-wider text-white">
                        {heroProduct.name}
                      </p>
                    </div>
                    <Link
                      href={`/produtos/${heroProduct.slug}`}
                      className="group flex flex-col items-end gap-1 font-heading font-bold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
                    >
                      <span className="text-base text-white">
                        {heroProduct.price}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] text-white/50 group-hover:text-white">
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

        <div className="absolute bottom-20 left-6 z-10 hidden items-center gap-3 lg:flex" style={{ writingMode: 'vertical-rl' }}>
          <span className="font-heading text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            Scroll
          </span>
          <span className="block h-10 w-px overflow-hidden bg-white/20">
            <motion.span
              className="block h-4 w-px bg-white"
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
