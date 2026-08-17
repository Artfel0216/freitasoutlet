'use client'

import { motion } from 'framer-motion'
import type { Step } from '@/components/checkout/checkout-utils'

const steps: { id: Step; label: string }[] = [
  { id: 'info', label: 'Dados' },
  { id: 'payment', label: 'Pagamento' },
]

export function CheckoutStepper({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-4 text-xs font-medium">
      {steps.map((s, i) => {
        const isActive = step === s.id
        const isDone = step === 'payment' && s.id === 'info'
        return (
          <div key={s.id} className="flex items-center gap-2">
            <motion.div
              className={`w-6 h-6 flex items-center justify-center text-xs font-heading font-bold ${
                isActive || isDone ? 'bg-black text-white' : 'bg-muted text-muted-foreground'
              }`}
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {i + 1}
            </motion.div>
            <span className={isActive || isDone ? 'text-black' : 'text-muted-foreground'}>
              {s.label}
            </span>
            {i === 0 && <span className="text-muted-foreground mx-1">—</span>}
          </div>
        )
      })}
    </div>
  )
}