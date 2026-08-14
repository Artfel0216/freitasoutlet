'use client'

import { useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
}

export function TiltCard({ children, className = '', intensity = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const rotateXSpring = useSpring(rotateX, { stiffness: 180, damping: 22, mass: 0.6 })
  const rotateYSpring = useSpring(rotateY, { stiffness: 180, damping: 22, mass: 0.6 })

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * intensity)
    rotateX.set(-py * intensity)
  }

  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      className={className}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  )
}
