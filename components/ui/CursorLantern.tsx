'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion'

const CORE_RADIUS = 140
const CORE_OPACITY = 0.22
const GLOW_RADIUS = 380
const GLOW_OPACITY = 0.18
const DIM_RADIUS = 460
const DIM_OPACITY = 0.45

export function CursorLantern() {
  const x = useMotionValue(-1000)
  const y = useMotionValue(-1000)
  const sx = useSpring(x, { stiffness: 110, damping: 22, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 110, damping: 22, mass: 0.6 })

  const coreBg = useMotionTemplate`radial-gradient(circle ${CORE_RADIUS}px at ${sx}px ${sy}px, rgba(255,255,255,${CORE_OPACITY}), transparent 70%)`
  const glowBg = useMotionTemplate`radial-gradient(circle ${GLOW_RADIUS}px at ${sx}px ${sy}px, rgba(255,255,255,${GLOW_OPACITY}), transparent 70%)`
  const dimBg = useMotionTemplate`radial-gradient(circle ${DIM_RADIUS}px at ${sx}px ${sy}px, rgba(255,255,255,0) 0%, rgba(0,0,0,${DIM_OPACITY}) 100%)`

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] hidden lg:block" aria-hidden="true">
      <motion.div className="absolute inset-0" style={{ background: coreBg, mixBlendMode: 'plus-lighter' }} />
      <motion.div className="absolute inset-0" style={{ background: glowBg, mixBlendMode: 'plus-lighter' }} />
      <motion.div className="absolute inset-0" style={{ background: dimBg }} />
    </div>
  )
}
