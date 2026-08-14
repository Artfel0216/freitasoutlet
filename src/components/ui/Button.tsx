'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'black'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
}

const base = 'inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed btn-3d'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gold text-foreground hover:bg-white hover:text-gold hover:border-2 hover:border-gold relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-gold before:to-silver before:opacity-0 before:transition-opacity hover:before:opacity-10',
  outline: 'bg-transparent text-foreground border-2 border-foreground hover:bg-gold hover:text-white',
  ghost: 'bg-transparent text-foreground hover:bg-gold/10',
  black: 'bg-gradient-to-br from-gold to-silver text-foreground hover:brightness-110',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-8 py-3 text-sm',
  lg: 'px-12 py-4 text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  disabled,
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  )
}
