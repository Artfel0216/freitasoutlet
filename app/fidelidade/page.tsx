'use client'

import { motion } from 'framer-motion'
import { useLoyalty } from '@/context/LoyaltyContext'
import { TierBadge } from '@/components/loyalty/TierBadge'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import Link from 'next/link'
import type { LoyaltyTier } from '@/context/LoyaltyContext'

const tierThresholds: Record<LoyaltyTier, number> = {
  bronze: 0,
  prata: 500,
  ouro: 2000,
  diamante: 5000,
}

const tierNames: Record<LoyaltyTier, string> = {
  bronze: 'Bronze',
  prata: 'Prata',
  ouro: 'Ouro',
  diamante: 'Diamante',
}

const nextTierMap: Record<LoyaltyTier, LoyaltyTier | null> = {
  bronze: 'prata',
  prata: 'ouro',
  ouro: 'diamante',
  diamante: null,
}

export default function FidelidadePage() {
  const { points, tier, totalSpent, getDiscount, getTierBenefits, history } = useLoyalty()
  const discount = getDiscount()
  const benefits = getTierBenefits()
  const next = nextTierMap[tier]
  const nextThreshold = next ? tierThresholds[next] : 0
  const progress = next ? Math.min(100, (points / nextThreshold) * 100) : 100

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Breadcrumbs items={[{ label: 'Programa de Fidelidade' }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-2">
              Programa de Fidelidade
            </h1>
            <p className="text-sm text-muted-foreground">
              Acumule pontos a cada compra e suba de nível para desbloquear benefícios exclusivos.
            </p>
          </div>
          <TierBadge tier={tier} size="lg" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            className="border border-border p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Seus Pontos</p>
            <p className="font-heading font-black text-3xl">{points}</p>
          </motion.div>
          <motion.div
            className="border border-border p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Gasto</p>
            <p className="font-heading font-black text-3xl">R$ {totalSpent.toFixed(2).replace('.', ',')}</p>
          </motion.div>
          <motion.div
            className="border border-border p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Desconto Atual</p>
            <p className="font-heading font-black text-3xl text-green-700">{discount}%</p>
          </motion.div>
        </div>

        {next && (
          <motion.div
            className="border border-border p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">Progresso para <span className="font-bold">{tierNames[next]}</span></span>
              <span className="text-muted-foreground">{points} / {nextThreshold} pts</span>
            </div>
            <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-black"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Faltam {nextThreshold - points} pontos para atingir o nível {tierNames[next]}.
            </p>
          </motion.div>
        )}

        {!next && (
          <motion.div
            className="border border-border p-6 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <p className="font-heading font-bold text-lg">Nível Máximo Alcançado!</p>
            <p className="text-sm text-muted-foreground mt-1">Você está no nível Diamante, o mais alto do programa.</p>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            className="border border-border p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">Benefícios do {tierNames[tier]}</h2>
            <ul className="space-y-3">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  className="text-sm flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                >
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="border border-border p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">Como Ganhar Pontos</h2>
            <ul className="space-y-3">
              {[
                { icon: '🛒', text: 'Ganhe 1 ponto a cada R$ 10,00 gastos em produtos.' },
                { icon: '⭐', text: 'Bônus de aniversário: 100 pontos extras no seu mês.' },
                { icon: '📝', text: 'Avalie produtos comprados e ganhe 5 pontos por avaliação.' },
                { icon: '🏆', text: 'Subindo de nível: bônus de pontos ao alcançar novo tier.' },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  className="text-sm flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                >
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <span className="text-muted-foreground">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-6 border-b border-border">
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider">Histórico de Pontos</h2>
          </div>
          {history.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <p>Você ainda não acumulou pontos. Faça sua primeira compra para começar!</p>
              <Link href="/produtos" className="text-xs underline hover:no-underline mt-2 inline-block">
                VER PRODUTOS
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Data</th>
                    <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Origem</th>
                    <th className="text-right p-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {[...history].reverse().map((entry, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                      <td className="p-4 text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4 text-xs">{entry.source}</td>
                      <td className="p-4 text-xs font-bold text-right text-green-700">+{entry.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <motion.div
          className="mt-8 p-6 bg-muted text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-muted-foreground">
            Seus pontos nunca expiram. Continue comprando para acumular mais pontos e desbloquear novos benefícios.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
