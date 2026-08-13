'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FlashSaleTimerProps {
  endsAt: string
  label?: string
  variant?: 'badge' | 'banner'
}

function getTimeLeft(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diff / (1000 * 60)) % 60),
    segundos: Math.floor((diff / 1000) % 60),
  }
}

export function FlashSaleTimer({ endsAt, label = 'OFERTA RELÂMPAGO', variant = 'badge' }: FlashSaleTimerProps) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(getTimeLeft(endsAt))
    const interval = setInterval(() => {
      const tl = getTimeLeft(endsAt)
      setTimeLeft(tl)
      if (!tl) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {timeLeft && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {variant === 'banner' ? (
            <div className="relative overflow-hidden border-b border-border bg-gradient-to-r from-red-600 to-orange-600 px-4 py-3 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]" />
              <p className="font-heading font-bold text-sm uppercase tracking-widest relative z-10">{label}</p>
              <div className="flex items-center justify-center gap-3 mt-1 relative z-10">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="flex items-center gap-1">
                    <span className="font-heading font-black text-xl tabular-nums">{String(value).padStart(2, '0')}</span>
                    <span className="text-xs uppercase opacity-80">{unit}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 px-3 py-2 rounded-lg">
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-red-600 shrink-0">
                {label}
              </span>
              <div className="flex items-center gap-2 text-red-600">
                {Object.entries(timeLeft).map(([unit, value], i) => (
                  <div key={unit} className="flex items-center gap-1">
                    <span className="font-heading font-black text-sm tabular-nums">{String(value).padStart(2, '0')}</span>
                    <span className="text-[10px] uppercase opacity-70">{unit}</span>
                    {i < Object.keys(timeLeft).length - 1 && <span className="text-[10px] opacity-50">:</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
