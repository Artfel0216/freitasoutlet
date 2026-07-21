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

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
}

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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

export const staggerItemLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
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

export function FadeLeft({ children, delay = 0, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: getTransition(delay) } }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FadeRight({ children, delay = 0, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: getTransition(delay) } }}
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

export function StaggerItem({ children, ...props }: MotionDivProps) {
  return (
    <motion.div variants={staggerItem} {...props}>
      {children}
    </motion.div>
  )
}

export function StaggerItemLeft({ children, ...props }: MotionDivProps) {
  return (
    <motion.div variants={staggerItemLeft} {...props}>
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, delay = 0, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: getTransition(delay) } }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
