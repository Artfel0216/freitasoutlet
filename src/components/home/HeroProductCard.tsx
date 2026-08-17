'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { container, heroProduct, item } from './hero-data'

export function HeroProductCard() {
  return (
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
        <div className="absolute -inset-6 animate-spin-slow rounded-full border-2 border-dashed border-foreground/15" />

        <div className="relative mx-auto aspect-square h-[420px] w-full max-w-md overflow-hidden rounded-3xl bg-muted">
          <Image
            src={heroProduct.image}
            alt={heroProduct.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 28rem"
            className="object-cover"
          />
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
            className="group flex flex-col items-end gap-1 font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="text-base text-foreground">{heroProduct.price}</span>
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground group-hover:text-foreground">
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
  )
}