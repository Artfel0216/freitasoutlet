'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useLoyalty } from '@/context/LoyaltyContext'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { loadStripe } from '@stripe/stripe-js'
import { useStripe, useElements, Elements } from '@stripe/react-stripe-js'
import { CheckoutInfoForm } from '@/components/checkout/CheckoutInfoForm'
import { CheckoutPayment } from '@/components/checkout/CheckoutPayment'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { StatusScreens } from '@/components/checkout/StatusScreens'
import type { SavedAddress, PaymentMethod, Step, FieldErrors, ShippingOption } from '@/components/checkout/checkout-utils'
import { pageVariants, getStepTitle } from '@/components/checkout/checkout-utils'

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = typeof window !== 'undefined' && stripeKey
  ? loadStripe(stripeKey)
  : null

export default function CheckoutPageWrapper() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  return (
    <Elements stripe={stripePromise} options={{
      appearance: { theme: 'stripe' },
      ...(clientSecret ? { clientSecret } : {}),
    }} key={clientSecret || 'initial'}>
      <CheckoutPage clientSecret={clientSecret} onClientSecret={setClientSecret} />
    </Elements>
  )
}

function CheckoutPage({ clientSecret, onClientSecret }: { clientSecret: string | null; onClientSecret: (s: string) => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const { items, totalPrice, clearCart } = useCart()
  const { getDiscount, tier, points, addPoints } = useLoyalty()
  const [step, setStep] = useState<Step>('info')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [orderResult, setOrderResult] = useState<{
    orderNumber: string
    status: string
    pixQrCode?: string
    pixKey?: string
  } | null>(null)

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | ''>('')
  const [installments, setInstallments] = useState('1')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
  })

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] = useState('')
  const [lgpdConsent, setLgpdConsent] = useState(false)
  const [couponDiscount] = useState(() => {
    try {
      const stored = localStorage.getItem('fo_coupon')
      if (stored) {
        const c = JSON.parse(stored)
        return c.discount || 0
      }
    } catch {}
    return 0
  })

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me')
        const { customer } = await res.json()
        if (customer) {
          setFormData((prev) => ({
            ...prev,
            name: customer.name || '',
            email: customer.email || '',
            phone: customer.phone || '',
          }))
        }
        const addrRes = await fetch('/api/cliente/endereco')
        const { addresses } = await addrRes.json()
        if (addresses?.length) {
          setSavedAddresses(addresses)
          const defaultAddr = addresses.find((a: SavedAddress) => a.isDefault) || addresses[0]
          setSelectedAddressId(defaultAddr.id)
          setFormData((prev) => ({
            ...prev,
            cep: defaultAddr.cep || '',
            street: defaultAddr.street || '',
            number: defaultAddr.number || '',
            neighborhood: defaultAddr.neighborhood || '',
            city: defaultAddr.city || '',
            state: defaultAddr.state || '',
          }))
        }
      } catch {}
    })()
  }, [])

  function selectAddress(id: string) {
    const addr = savedAddresses.find((a) => a.id === id)
    if (!addr) return
    setSelectedAddressId(id)
    setFormData((prev) => ({
      ...prev,
      cep: addr.cep,
      street: addr.street,
      number: addr.number,
      neighborhood: addr.neighborhood,
      city: addr.city,
      state: addr.state,
    }))
  }

  function clearSelectedAddress() {
    setSelectedAddressId('')
    setFormData((prev) => ({ ...prev, cep: '', street: '', number: '', neighborhood: '', city: '', state: '' }))
  }

  const shippingFetchedRef = useRef('')

  useEffect(() => {
    if (formData.state.length !== 2 || items.length === 0) return
    const key = `${formData.state}:${items.length}:${totalPrice}`
    if (shippingFetchedRef.current === key) return
    shippingFetchedRef.current = key
    const controller = new AbortController()
    fetch('/api/shipping', {
      signal: controller.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: formData.state, items: items.length, subtotal: totalPrice }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.options) {
          setShippingOptions(data.options)
          setSelectedShipping((prev) => prev || data.options[0]?.service || '')
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [formData.state, items.length, totalPrice])

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
  }

  const validateForm = useCallback((): boolean => {
    const newErrors: FieldErrors = {}

    if (formData.name.trim().length < 3) newErrors.name = 'Nome deve ter no mínimo 3 caracteres'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'E-mail inválido'

    const cpfClean = formData.cpf.replace(/\D/g, '')
    if (cpfClean.length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos'
    }

    const phoneClean = formData.phone.replace(/\D/g, '')
    if (phoneClean.length < 10 || phoneClean.length > 11) newErrors.phone = 'Telefone inválido'

    const cepClean = formData.cep.replace(/\D/g, '')
    if (cepClean.length !== 8) newErrors.cep = 'CEP deve ter 8 dígitos'
    if (formData.street.trim().length < 3) newErrors.street = 'Endereço inválido'
    if (!formData.number.trim()) newErrors.number = 'Número é obrigatório'
    if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório'
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória'
    if (formData.state.trim().length !== 2) newErrors.state = 'Estado deve ter 2 caracteres'
    if (!lgpdConsent) newErrors.lgpd = 'Você precisa aceitar a política de privacidade'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, lgpdConsent])

  function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return
    setStep('payment')
  }

  async function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault()
    setProcessing(true)
    setErrors({})

    try {
      const cartItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        brand: item.product.brand.name,
        size: item.selectedSize,
        color: item.selectedColor.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
      }))

      const storedCoupon = (() => {
        try { return JSON.parse(localStorage.getItem('fo_coupon') || 'null') } catch { return null }
      })()

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process',
          data: { ...formData, lgpdConsent: true },
          paymentMethod,
          installments: paymentMethod === 'credit' ? parseInt(installments) : 1,
          items: cartItems,
          shipping: selectedShipping || undefined,
          couponCode: storedCoupon?.code || null,
          loyaltyDiscountPercent: getDiscount(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          setErrors({ fraud: result.error || 'Transação rejeitada pela análise de segurança' })
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
        setStep('success')
        clearCart()
        localStorage.removeItem('fo_coupon')
        const orderSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        addPoints(orderSubtotal, `Pedido #${result.orderNumber}`)
      }
    } catch (err) {
      setErrors({ server: err instanceof Error ? err.message : 'Erro ao processar pagamento' })
    } finally {
      setProcessing(false)
    }
  }

  async function handleStripeConfirm() {
    if (!stripe || !elements) return
    setProcessing(true)
    setErrors({})
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
      },
      redirect: 'if_required',
    })
    if (error) {
      setErrors({ card: error.message || 'Erro ao processar pagamento' })
      setProcessing(false)
      return
    }
    setStep('success')
    clearCart()
    localStorage.removeItem('fo_coupon')
    if (orderResult?.orderNumber) {
      const orderSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      addPoints(orderSubtotal, `Pedido #${orderResult.orderNumber}`)
    }
    setProcessing(false)
  }

  function confirmPixPayment() {
    clearCart()
    localStorage.removeItem('fo_coupon')
    setStep('success')

    if (orderResult?.orderNumber) {
      const orderSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      addPoints(orderSubtotal, `Pedido #${orderResult.orderNumber}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Breadcrumbs items={[{ label: 'Carrinho', href: '/carrinho' }, { label: 'Checkout' }]} />
      <motion.div
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter">
          Checkout
        </h1>
        <motion.span
          key={step}
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          / {getStepTitle(step)}
        </motion.span>
      </motion.div>

      <AnimatePresence mode="wait">
        {errors.server && (
          <motion.div
            key="server-error"
            className="mb-6 p-4 bg-red-50 border border-red-200 text-sm text-red-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {errors.server}
          </motion.div>
        )}
      </AnimatePresence>

      <StatusScreens
        step={step}
        errors={errors}
        orderNumber={orderResult?.orderNumber}
        email={formData.email}
        onRetry={() => setStep('payment')}
      />

      {step !== 'error' && step !== 'success' && (
        <motion.div
          key="checkout"
          {...pageVariants}
          className="grid lg:grid-cols-5 gap-8 lg:gap-12"
        >
          <div className="lg:col-span-3">
            <form onSubmit={step === 'info' ? handleInfoSubmit : handlePaymentSubmit} className="space-y-8">
              <div className="flex items-center gap-4 text-xs font-medium">
                {(['info', 'payment'] as const).map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <motion.div
                      className={`w-6 h-6 flex items-center justify-center text-xs font-heading font-bold ${
                        step === s ? 'bg-black text-white' : step === 'payment' && s === 'info' ? 'bg-black text-white' : 'bg-muted text-muted-foreground'
                      }`}
                      animate={step === s ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {s === 'info' ? '1' : '2'}
                    </motion.div>
                    <span className={step === s ? 'text-black' : 'text-muted-foreground'}>
                      {s === 'info' ? 'Dados' : 'Pagamento'}
                    </span>
                    {i === 0 && <span className="text-muted-foreground mx-1">—</span>}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 'info' && (
                  <CheckoutInfoForm
                    formData={formData}
                    errors={errors}
                    updateField={updateField}
                    savedAddresses={savedAddresses}
                    selectedAddressId={selectedAddressId}
                    selectAddress={selectAddress}
                    clearSelectedAddress={clearSelectedAddress}
                    shippingOptions={shippingOptions}
                    selectedShipping={selectedShipping}
                    setSelectedShipping={setSelectedShipping}
                    lgpdConsent={lgpdConsent}
                    setLgpdConsent={setLgpdConsent}
                  />
                )}

                {step === 'payment' && (
                  <CheckoutPayment
                    paymentMethod={paymentMethod}
                    onPaymentMethodChange={(m) => { setPaymentMethod(m); setErrors({}) }}
                    installments={installments}
                    setInstallments={setInstallments}
                    clientSecret={clientSecret}
                    orderResult={orderResult}
                    processing={processing}
                    errors={errors}
                    totalPrice={totalPrice}
                    onStripeConfirm={handleStripeConfirm}
                    onPixConfirmed={confirmPixPayment}
                    onBack={() => setStep('info')}
                  />
                )}
              </AnimatePresence>
            </form>
          </div>

          <OrderSummary
            items={items}
            totalPrice={totalPrice}
            selectedShipping={selectedShipping}
            shippingOptions={shippingOptions}
            getDiscount={getDiscount}
            tier={tier}
            points={points}
            couponDiscount={couponDiscount}
          />
        </motion.div>
      )}
    </div>
  )
}