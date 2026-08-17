'use client'

import { motion, type Variants, type HTMLMotionProps } from 'framer-motion'

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function getTransition(delay: number = 0) {
  return { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as const }
}

type MotionDivProps = HTMLMotionProps<'div'> & {
  delay?: number
}

export function FadeIn({ children, delay = 0, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: getTransition(delay) } }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FadeUp({ children, delay = 0, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: getTransition(delay) } }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerGrid({ children, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={stagger}
      {...props}
    >
      {children}
    </motion.div>
  )
}
