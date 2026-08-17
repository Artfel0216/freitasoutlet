import type { z } from 'zod'
import { checkoutSchema } from '@/lib/validations'
import type { CheckoutItem } from './idempotency'
import type { Totals } from './pricing'

export type CheckoutData = z.infer<typeof checkoutSchema>

export interface FraudResult {
  score: number
  status: string
  recommendation: string
}

export interface PaymentHandlerInput {
  payment: 'pix' | 'credit' | 'debit'
  checkoutData: CheckoutData
  checkoutItems: CheckoutItem[]
  totals: Totals
  idempotencyKey: string
  fraudResult: FraudResult
  couponCode?: string | null
}

export interface CardPaymentInput extends PaymentHandlerInput {
  paymentMethodId?: string
  installments?: number
}