'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import type { Step, FieldErrors } from '@/components/checkout/checkout-utils'
import { pageVariants } from '@/components/checkout/checkout-utils'

interface StatusScreensProps {
  step: Step
  errors: FieldErrors
  orderNumber?: string
  email?: string
  onRetry: () => void
}

export function StatusScreens({ step, errors, orderNumber, email, onRetry }: StatusScreensProps) {
  if (step === 'error' && orderNumber) {
    return (
      <motion.div
        key="error"
        {...pageVariants}
        className="max-w-md mx-auto text-center py-16"
      >
        <motion.div
          className="w-16 h-16 bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.div>
        <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-4">
          Pagamento Não Aprovado
        </h1>
        <p className="text-muted-foreground mb-2">{errors.fraud || errors.server || 'Erro desconhecido'}</p>
        {orderNumber && (
          <p className="text-xs text-muted-foreground mb-8">Pedido: #{orderNumber}</p>
        )}
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={onRetry}>TENTAR OUTRO PAGAMENTO</Button>
          <Link href="/carrinho"><Button variant="primary">VOLTAR AO CARRINHO</Button></Link>
        </div>
      </motion.div>
    )
  }

  if (step === 'success') {
    return (
      <motion.div
        key="success"
        {...pageVariants}
        className="max-w-md mx-auto text-center py-16"
      >
        <motion.div
          className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-4">
          Pedido Confirmado!
        </h1>
        <p className="text-muted-foreground mb-1">
          Pedido <span className="font-bold">#{orderNumber}</span> registrado com sucesso.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Você receberá a confirmação no e-mail <strong>{email}</strong>.
        </p>
        <Link href="/produtos">
          <Button variant="primary" size="lg">CONTINUAR COMPRANDO</Button>
        </Link>
      </motion.div>
    )
  }

  return null
}