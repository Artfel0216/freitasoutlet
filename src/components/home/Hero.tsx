'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { BrandMarquee } from './BrandMarquee'
import { HeroProductCard } from './HeroProductCard'
import { container, heroTags, item, lineGrow } from './hero-data'

const HeroCanvas = dynamic(() => import('./HeroCanvas').then((mod) => mod.HeroCanvas), {
  ssr: false,
  loading: () => null,
})

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
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden text-foreground"
      onMouseMove={(e) => {
        if (reduceMotion) return
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePos({
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        })
      }}
    >
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
                    Outlet Premium
                  </p>
                </motion.div>

                <motion.h1
                  variants={item}
                  className="font-heading text-[13vw] font-black uppercase leading-[0.92] tracking-tighter sm:text-6xl lg:text-7xl xl:text-8xl"
                >
                  <span className="block">O Luxo</span>
                  <span className="block">Mais</span>
                  <motion.span
                    className="inline-block"
                    animate={reduceMotion ? undefined : { rotateY: mousePos.x * 15 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  >
                    Acessível
                  </motion.span>
                </motion.h1>

                <motion.p variants={item} className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
                  As marcas mais desejadas do mundo em um só lugar. Nike, Gucci, Alexander
                  McQueen, On e muito mais — com preços de outlet.
                </motion.p>

                <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-3d"
                  >
                    <Link
                      href="/produtos"
                      className="btn-3d-inner relative inline-flex items-center gap-3 bg-foreground px-10 py-4 font-heading text-sm font-bold uppercase tracking-[0.2em] text-background transition-colors duration-300 hover:bg-foreground/90"
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
                      className="btn-3d-inner relative inline-flex items-center gap-2 border-2 border-foreground/20 px-10 py-4 font-heading text-sm font-bold uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground/5"
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
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
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
              <HeroProductCard />
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