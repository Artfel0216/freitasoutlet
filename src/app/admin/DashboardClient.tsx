'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RevenueData, RevenuePeriod } from '@/lib/revenue'
import { stagger, staggerItem } from '@/components/animations'

interface DashboardClientProps {
  weekly: RevenueData
  monthly: RevenueData
  yearly: RevenueData
  productCount: number
}

export function DashboardClient({ weekly, monthly, yearly, productCount }: DashboardClientProps) {
  const [period, setPeriod] = useState<RevenuePeriod>('monthly')

  const dataMap: Record<RevenuePeriod, RevenueData> = { weekly, monthly, yearly }
  const data = dataMap[period]

  const maxRevenue = Math.max(...data.byPeriod.map((p) => p.revenue), 1)

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <motion.div
        className="border border-border bg-white p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Receita</p>
            <motion.p
              className="font-heading font-black text-2xl mt-1"
              key={`revenue-${period}-${data.total}`}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              R$ {data.total.toFixed(2).replace('.', ',')}
            </motion.p>
          </div>
          <div className="flex gap-1">
            {(['weekly', 'monthly', 'yearly'] as const).map((p) => (
              <motion.button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-xs px-2 py-1 uppercase tracking-wider font-medium transition-colors ${
                  period === p ? 'bg-black text-white' : 'bg-muted hover:bg-muted/80'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {p === 'weekly' ? 'Semana' : p === 'monthly' ? 'Mês' : 'Ano'}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={period}
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {data.byPeriod.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium capitalize">{item.label}</span>
                  <span className="text-muted-foreground">
                    R$ {item.revenue.toFixed(2).replace('.', ',')} ({item.orders} pedidos)
                  </span>
                </div>
                <div className="h-2 bg-muted">
                  <motion.div
                    className="h-full bg-black"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {data.byPeriod.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Nenhum dado no período selecionado.</p>
            <p className="text-xs text-muted-foreground mt-1">Os dados aparecerão quando houver pedidos.</p>
          </div>
        )}
      </motion.div>

      <motion.div
        className="border border-border bg-white p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-6">Resumo</p>
        <motion.div
          className="space-y-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: 'Ticket Médio', value: `R$ ${data.averageTicket.toFixed(2).replace('.', ',')}` },
            { label: 'Total de Pedidos (período)', value: String(data.orders) },
            { label: 'Produtos no Catálogo', value: String(productCount || '—') },
          ].map((item) => (
            <motion.div key={item.label} variants={staggerItem}>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <motion.p
                className="font-heading font-black text-xl"
                key={item.value}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {item.value}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
