'use client'

import { useState } from 'react'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import type { CartItem } from '@/types'
import { useCart } from '@/context/CartContext'
import { useLoyalty, type LoyaltyTier } from '@/context/LoyaltyContext'
import type { PaymentMethod, Step } from '@/components/checkout/checkout-utils'
import { buildCheckoutPayload, getStoredCoupon } from './checkout-payload'
import type { OrderResult } from './checkout-types'
import { useCheckoutForm, type CheckoutFormController } from './use-checkout-form'

export interface CheckoutController extends CheckoutFormController {
  step: Step
  paymentMethod: PaymentMethod
  processing: boolean
  installments: string
  setInstallments: (value: string) => void
  couponDiscount: number
  orderResult: OrderResult | null
  items: CartItem[]
  totalPrice: number
  tier: LoyaltyTier
  points: number
  getDiscount: () => number
  handleInfoSubmit: (e: React.FormEvent) => void
  handlePaymentSubmit: (e: React.FormEvent) => Promise<void>
  handleStripeConfirm: () => Promise<void>
  confirmPixPayment: () => void
  setStep: React.Dispatch<React.SetStateAction<Step>>
  setPaymentMethod: (method: PaymentMethod) => void
}

export function useCheckout({
  onClientSecret,
}: {
  onClientSecret: (secret: string) => void
}): CheckoutController {
  const stripe = useStripe()
  const elements = useElements()
  const { items, totalPrice, clearCart } = useCart()
  const { getDiscount, tier, points, addPoints } = useLoyalty()

  const form = useCheckoutForm(items.length, totalPrice)

  const [step, setStep] = useState<Step>('info')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [processing, setProcessing] = useState(false)
  const [installments, setInstallments] = useState('1')
  const [couponDiscount] = useState(() => {
    const stored = getStoredCoupon()
    return stored?.discount || 0
  })
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null)

  function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.validateForm()) return
    setStep('payment')
  }

  async function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault()
    setProcessing(true)
    form.setErrors({})

    try {
      const storedCoupon = getStoredCoupon()
      const payload = buildCheckoutPayload({
        formData: form.formData,
        paymentMethod,
        installments,
        items,
        shipping: form.selectedShipping,
        couponCode: storedCoupon?.code || null,
        loyaltyDiscountPercent: getDiscount(),
      })

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          form.setErrors({ fraud: result.error || 'Transação rejeitada pela análise de segurança' })
          setStep('error')
          return
        }
        throw new Error(result.error || 'Erro ao processar pagamento')
      }

      setOrderResult({
        orderNumber: result.orderNumber,
        status: result.status,
        pixQrCode: result.pix?.qrCode,
        pixKey: result.pix?.pixKey,
      })

      if (paymentMethod === 'pix') {
        setStep('payment')
      } else if (result.clientSecret) {
        onClientSecret(result.clientSecret)
      } else {
        finishOrder(result.orderNumber)
      }
    } catch (err) {
      form.setErrors({ server: err instanceof Error ? err.message : 'Erro ao processar pagamento' })
    } finally {
      setProcessing(false)
    }
  }

  function finishOrder(orderNumber?: string) {
    clearCart()
    localStorage.removeItem('fo_coupon')
    const orderSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    if (orderNumber) {
      addPoints(orderSubtotal, `Pedido #${orderNumber}`)
    }
  }

  async function handleStripeConfirm() {
    if (!stripe || !elements) return
    setProcessing(true)
    form.setErrors({})
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
      },
      redirect: 'if_required',
    })
    if (error) {
      form.setErrors({ card: error.message || 'Erro ao processar pagamento' })
      setProcessing(false)
      return
    }
    setStep('success')
    finishOrder(orderResult?.orderNumber)
    setProcessing(false)
  }

  function confirmPixPayment() {
    setStep('success')
    finishOrder(orderResult?.orderNumber)
  }

  return {
    step,
    paymentMethod,
    processing,
    installments,
    setInstallments,
    couponDiscount,
    orderResult,
    items,
    totalPrice,
    tier,
    points,
    getDiscount,
    handleInfoSubmit,
    handlePaymentSubmit,
    handleStripeConfirm,
    confirmPixPayment,
    setStep,
    setPaymentMethod,
    ...form,
  }
}