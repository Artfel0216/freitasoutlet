'use client'

import { motion } from 'framer-motion'
import { useLoyalty } from '@/context/LoyaltyContext'

const tierColors = {
  bronze: '#CD7F32',
  prata: '#C0C0C0',
  ouro: '#FFD700',
  diamante: '#B9F2FF',
}

const tierNames = {
  bronze: 'Bronze',
  prata: 'Prata',
  ouro: 'Ouro',
  diamante: 'Diamante',
}

export function LoyaltyCard() {
  const { points, tier, getDiscount, getTierBenefits } = useLoyalty()
  const discount = getDiscount()
  const benefits = getTierBenefits()

  const nextTier = tier === 'bronze' ? 'prata' : tier === 'prata' ? 'ouro' : tier === 'ouro' ? 'diamante' : null
  const nextThreshold = nextTier === 'prata' ? 500 : nextTier === 'ouro' ? 2000 : nextTier === 'diamante' ? 5000 : 0
  const progress = nextTier ? Math.min(100, (points / nextThreshold) * 100) : 100

  return (
    <div className="bg-muted p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Programa de Fidelidade</p>
          <div className="flex items-center gap-2 mt-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: tierColors[tier] }}
            />
            <span className="font-heading font-bold text-lg">{tierNames[tier]}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Pontos</p>
          <p className="font-heading font-black text-2xl">{points}</p>
        </div>
      </div>

      {discount > 0 && (
        <div className="bg-white p-3 mb-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Seu desconto</p>
          <p className="font-heading font-black text-xl text-green-700">{discount}% OFF</p>
        </div>
      )}

      {nextTier && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Próximo nível: {tierNames[nextTier]}</span>
            <span>{points}/{nextThreshold} pts</span>
          </div>
          <div className="w-full bg-white h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-black"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-2">Seus benefícios</p>
        <ul className="space-y-1.5">
          {benefits.map((benefit, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-[10px] text-muted-foreground">
          Ganhe 1 ponto a cada R$ 10,00 gastos. Seus pontos nunca expiram.
        </p>
      </div>
    </div>
  )
}
