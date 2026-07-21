'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

export type LoyaltyTier = 'bronze' | 'prata' | 'ouro' | 'diamante'

type LoyaltyContextType = {
  points: number
  tier: LoyaltyTier
  totalSpent: number
  addPoints: (amount: number, source: string) => void
  getDiscount: () => number
  getTierBenefits: () => string[]
  history: { points: number; source: string; date: string }[]
}

const tierThresholds = {
  bronze: 0,
  prata: 500,
  ouro: 2000,
  diamante: 5000,
}

const tierDiscounts = {
  bronze: 0,
  prata: 3,
  ouro: 5,
  diamante: 10,
}

const tierBenefits = {
  bronze: ['Acumule pontos a cada compra', 'Acesso a promoções exclusivas'],
  prata: ['3% de desconto permanente', 'Frete grátis acima de R$ 500', 'Acesso a promoções exclusivas'],
  ouro: ['5% de desconto permanente', 'Frete grátis em qualquer compra', 'Acesso antecipado a lançamentos', 'Brinde de aniversário'],
  diamante: ['10% de desconto permanente', 'Frete grátis em qualquer compra', 'Acesso antecipado a lançamentos', 'Brinde de aniversário', 'Atendimento prioritário', 'Condições especiais em produtos selecionados'],
}

function getTier(points: number): LoyaltyTier {
  if (points >= tierThresholds.diamante) return 'diamante'
  if (points >= tierThresholds.ouro) return 'ouro'
  if (points >= tierThresholds.prata) return 'prata'
  return 'bronze'
}

const STORAGE_KEY = 'freitasoutlet_loyalty'

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined)

type LoyaltyData = { points: number; totalSpent: number; history: { points: number; source: string; date: string }[] }

function getInitialLoyalty(): LoyaltyData {
  if (typeof window === 'undefined') return { points: 0, totalSpent: 0, history: [] }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return { points: data.points || 0, totalSpent: data.totalSpent || 0, history: data.history || [] }
    }
  } catch {}
  return { points: 0, totalSpent: 0, history: [] }
}

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const initial = getInitialLoyalty()
  const [points, setPoints] = useState<number>(initial.points)
  const [totalSpent, setTotalSpent] = useState<number>(initial.totalSpent)
  const [history, setHistory] = useState<LoyaltyData['history']>(initial.history)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ points, totalSpent, history }))
    } catch {}
  }, [points, totalSpent, history])

  const addPoints = useCallback((amount: number, source: string) => {
    const earnedPoints = Math.floor(amount / 10) 
    setPoints(prev => prev + earnedPoints)
    setTotalSpent(prev => prev + amount)
    setHistory(prev => [...prev, { points: earnedPoints, source, date: new Date().toISOString() }])
  }, [])

  const tier = getTier(points)
  const getDiscount = useCallback(() => tierDiscounts[tier], [tier])
  const getTierBenefits = useCallback(() => tierBenefits[tier], [tier])

  return (
    <LoyaltyContext.Provider value={{ points, tier, totalSpent, addPoints, getDiscount, getTierBenefits, history }}>
      {children}
    </LoyaltyContext.Provider>
  )
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext)
  if (!context) throw new Error('useLoyalty must be used within a LoyaltyProvider')
  return context
}
