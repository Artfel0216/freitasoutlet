'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useLoyalty } from '@/context/LoyaltyContext'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import Link from 'next/link'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'
import { PaymentElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js'

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = typeof window !== 'undefined' && stripeKey
  ? loadStripe(stripeKey)
  : null

type SavedAddress = {
  id: string
  label: string
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  isDefault: boolean
}

type PaymentMethod = 'pix' | 'credit' | 'debit'
type Step = 'info' | 'payment' | 'success' | 'error'
type FieldErrors = Record<string, string>

type ShippingOption = {
  service: string
  description: string
  price: number
  deliveryDays: string
}

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(?=\d)/g, '$1.')
    .replace(/(\d{3})\.(\d{3})(?=\d)/g, '$1.$2.')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(?=\d)/g, '$1.$2.$3-')
}

function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
}

function getStepTitle(step: Step): string {
  switch (step) {
    case 'info': return 'Dados Pessoais e Endereço'
    case 'payment': return 'Pagamento'
    case 'success': return 'Pedido Confirmado'
    case 'error': return 'Pagamento Não Aprovado'
  }
}

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

  async function handleInfoSubmit(e: React.FormEvent) {
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

      <AnimatePresence mode="wait">
        {step === 'error' && orderResult && (
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
            {orderResult?.orderNumber && (
              <p className="text-xs text-muted-foreground mb-8">Pedido: #{orderResult.orderNumber}</p>
            )}
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setStep('payment')}>TENTAR OUTRO PAGAMENTO</Button>
              <Link href="/carrinho"><Button variant="primary">VOLTAR AO CARRINHO</Button></Link>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
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
              Pedido <span className="font-bold">#{orderResult?.orderNumber}</span> registrado com sucesso.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Você receberá a confirmação no e-mail <strong>{formData.email}</strong>.
            </p>
            <Link href="/produtos">
              <Button variant="primary" size="lg">CONTINUAR COMPRANDO</Button>
            </Link>
          </motion.div>
        )}

        {step !== 'error' && step !== 'success' && (
          <motion.div
            key="checkout"
            {...pageVariants}
            className="grid lg:grid-cols-5 gap-8 lg:gap-12"
          >
            <div className="lg:col-span-3">
              <form onSubmit={step === 'info' ? handleInfoSubmit : handlePaymentSubmit} className="space-y-8">

                {}
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
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h2 className="font-heading font-bold text-sm uppercase tracking-wider pb-2 border-b border-border">
                        1. Dados Pessoais
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium uppercase tracking-wider mb-1">Nome Completo</label>
                          <input type="text" required value={formData.name} onChange={(e) => updateField('name', e.target.value)}
                            className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.name ? 'border-red-500' : 'border-border'}`} />
                          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-wider mb-1">E-mail</label>
                          <input type="email" required value={formData.email} onChange={(e) => updateField('email', e.target.value)}
                            className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.email ? 'border-red-500' : 'border-border'}`} />
                          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-wider mb-1">CPF</label>
                          <input type="text" required value={formData.cpf} onChange={(e) => updateField('cpf', formatCPF(e.target.value))}
                            className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.cpf ? 'border-red-500' : 'border-border'}`}
                            placeholder="000.000.000-00" maxLength={14} />
                          {errors.cpf && <p className="text-xs text-red-500 mt-1">{errors.cpf}</p>}
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium uppercase tracking-wider mb-1">Telefone</label>
                          <input type="tel" required value={formData.phone} onChange={(e) => updateField('phone', formatPhone(e.target.value))}
                            className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.phone ? 'border-red-500' : 'border-border'}`}
                            placeholder="(11) 99999-9999" maxLength={16} />
                          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                        </div>
                      </div>

                      <h2 className="font-heading font-bold text-sm uppercase tracking-wider pb-2 border-b border-border pt-4">
                        2. Endereço de Entrega
                      </h2>

                      {savedAddresses.length > 0 && (
                        <div className="space-y-2">
                          <label className="block text-xs font-medium uppercase tracking-wider mb-1">Endereço Salvo</label>
                          {savedAddresses.map((addr) => (
                            <motion.label
                              key={addr.id}
                              className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${
                                selectedAddressId === addr.id ? 'border-black bg-black/5' : 'border-border hover:border-black'
                              }`}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <input type="radio" name="savedAddress" checked={selectedAddressId === addr.id}
                                onChange={() => selectAddress(addr.id)} className="mt-0.5 accent-black" />
                              <div>
                                <p className="text-xs font-semibold">{addr.label}</p>
                                <p className="text-xs text-muted-foreground">{addr.street}, {addr.number} — {addr.neighborhood}, {addr.city} — {addr.state}</p>
                              </div>
                            </motion.label>
                          ))}
                          <button type="button" onClick={() => { setSelectedAddressId(''); setFormData((prev) => ({ ...prev, cep: '', street: '', number: '', neighborhood: '', city: '', state: '' })) }}
                            className="text-xs underline hover:no-underline text-muted-foreground">
                            Usar outro endereço
                          </button>
                        </div>
                      )}

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-wider mb-1">CEP</label>
                          <input type="text" required value={formData.cep} onChange={(e) => updateField('cep', formatCEP(e.target.value))}
                            className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.cep ? 'border-red-500' : 'border-border'}`}
                            placeholder="00000-000" maxLength={9} />
                          {errors.cep && <p className="text-xs text-red-500 mt-1">{errors.cep}</p>}
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium uppercase tracking-wider mb-1">Endereço</label>
                          <input type="text" required value={formData.street} onChange={(e) => updateField('street', e.target.value)}
                            className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.street ? 'border-red-500' : 'border-border'}`} />
                          {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-wider mb-1">Número</label>
                          <input type="text" required value={formData.number} onChange={(e) => updateField('number', e.target.value)}
                            className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.number ? 'border-red-500' : 'border-border'}`} />
                          {errors.number && <p className="text-xs text-red-500 mt-1">{errors.number}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-wider mb-1">Bairro</label>
                          <input type="text" required value={formData.neighborhood} onChange={(e) => updateField('neighborhood', e.target.value)}
                            className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.neighborhood ? 'border-red-500' : 'border-border'}`} />
                          {errors.neighborhood && <p className="text-xs text-red-500 mt-1">{errors.neighborhood}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-wider mb-1">Cidade</label>
                          <input type="text" required value={formData.city} onChange={(e) => updateField('city', e.target.value)}
                            className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.city ? 'border-red-500' : 'border-border'}`} />
                          {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-wider mb-1">Estado</label>
                          <input type="text" required value={formData.state} onChange={(e) => updateField('state', e.target.value.toUpperCase().slice(0, 2))}
                            className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.state ? 'border-red-500' : 'border-border'}`}
                            placeholder="SP" maxLength={2} />
                          {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                        </div>
                      </div>

                      {shippingOptions.length > 0 && (
                        <div className="space-y-2">
                          <h2 className="font-heading font-bold text-sm uppercase tracking-wider pb-2 border-b border-border pt-4">
                            3. Frete
                          </h2>
                          {shippingOptions.map((opt) => (
                            <motion.label
                              key={opt.service}
                              className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                                selectedShipping === opt.service ? 'border-black bg-black/5' : 'border-border hover:border-black'
                              }`}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <input type="radio" name="shipping" checked={selectedShipping === opt.service}
                                onChange={() => setSelectedShipping(opt.service)} className="accent-black" />
                              <div className="flex-1 flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-semibold">{opt.service}</p>
                                  <p className="text-xs text-muted-foreground">{opt.description} — {opt.deliveryDays} dias úteis</p>
                                </div>
                                <span className="text-sm font-bold">R$ {opt.price.toFixed(2).replace('.', ',')}</span>
                              </div>
                            </motion.label>
                          ))}
                        </div>
                      )}

                      {formData.state.length === 2 && shippingOptions.length === 0 && (
                        <div className="text-xs text-muted-foreground py-2">Calculando frete...</div>
                      )}

                      <motion.label
                        className="flex items-start gap-3 cursor-pointer"
                        whileTap={{ scale: 0.99 }}
                      >
                        <input type="checkbox" checked={lgpdConsent} onChange={(e) => setLgpdConsent(e.target.checked)}
                          className="mt-0.5 accent-black" />
                        <span className={`text-xs leading-relaxed ${errors.lgpd ? 'text-red-500' : 'text-muted-foreground'}`}>
                          Autorizo o tratamento dos meus dados pessoais (nome, CPF, e-mail, telefone e endereço) para fins de
                          processamento do pedido, conforme a <a href="#" className="underline">Política de Privacidade</a>.
                          Seus dados estão protegidos e não serão compartilhados sem seu consentimento.
                        </span>
                      </motion.label>
                      {errors.lgpd && <p className="text-xs text-red-500">{errors.lgpd}</p>}

                      <motion.div whileTap={{ scale: 0.98 }}>
                        <Button variant="primary" size="lg" fullWidth type="submit">
                          CONTINUAR PARA PAGAMENTO
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}

                  {step === 'payment' && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h2 className="font-heading font-bold text-sm uppercase tracking-wider pb-2 border-b border-border">
                        3. Pagamento
                      </h2>

                      <div className="space-y-3">
                        {([
                          { value: 'pix' as const, label: 'Pix', desc: 'Pagamento instantâneo — aprovado na hora' },
                          { value: 'credit' as const, label: 'Cartão de Crédito', desc: 'Parcele em até 12x' },
                          { value: 'debit' as const, label: 'Cartão de Débito', desc: 'Débito à vista' },
                        ]).map((method) => (
                          <motion.label
                            key={method.value}
                            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                              paymentMethod === method.value ? 'border-black bg-black/5' : 'border-border hover:border-black'
                            }`}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <input type="radio" name="payment" checked={paymentMethod === method.value}
                              onChange={() => { setPaymentMethod(method.value); setErrors({}) }} className="accent-black" />
                            <div>
                              <p className="text-sm font-semibold">{method.label}</p>
                              <p className="text-xs text-muted-foreground">{method.desc}</p>
                            </div>
                          </motion.label>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        {paymentMethod === 'pix' && orderResult?.pixQrCode && (
                          <motion.div
                            key="pix-qr"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="border border-border p-6 lg:p-8 text-center space-y-6"
                          >
                            <motion.div
                              className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                            </motion.div>
                            <p className="font-heading font-bold text-lg">PIX GERADO</p>
                            <p className="text-sm text-muted-foreground">
                              Leia o QR Code abaixo com seu app bancário ou copie a chave Pix.
                            </p>
                            <div className="font-heading font-black text-2xl">R$ {totalPrice.toFixed(2).replace('.', ',')}</div>
                            <div className="w-48 h-48 mx-auto bg-white flex items-center justify-center border-2 border-border">
                              {orderResult.pixQrCode && (
                                <Image
                                  src={`/api/qrcode?data=${encodeURIComponent(orderResult.pixQrCode)}`}
                                  alt="QR Code PIX"
                                  className="w-full h-full"
                                  width={192}
                                  height={192}
                                />
                              )}
                            </div>
                            <div className="bg-muted p-4 text-left">
                              <p className="text-xs font-medium uppercase tracking-wider mb-1">Chave Pix (Copiar e Colar)</p>
                              <div className="flex items-center gap-2">
                                <code className="flex-1 text-xs bg-white border border-border px-2 py-1.5 truncate select-all font-mono">
                                  {orderResult.pixQrCode}
                                </code>
                                <motion.button
                                  type="button"
                                  onClick={() => navigator.clipboard.writeText(orderResult.pixQrCode || '')}
                                  className="text-xs font-medium underline hover:no-underline shrink-0"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  Copiar
                                </motion.button>
                              </div>
                            </div>
                            <motion.div whileTap={{ scale: 0.97 }}>
                              <Button variant="primary" size="lg" fullWidth onClick={confirmPixPayment}>
                                JÁ PAGUEI — CONFIRMAR PEDIDO
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}

                        {paymentMethod === 'pix' && !orderResult?.pixQrCode && (
                          <motion.div
                            key="pix-pending"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-8"
                          >
                            <p className="text-muted-foreground mb-4">Clique em &quot;Gerar Pagamento PIX&quot; para continuar.</p>
                            <motion.div whileTap={{ scale: 0.97 }}>
                              <Button variant="primary" size="lg" fullWidth type="submit" disabled={processing}>
                                {processing ? 'GERANDO...' : 'GERAR PAGAMENTO PIX'}
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}

                        {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                          <motion.div
                            key="card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="border border-border p-6 lg:p-8 space-y-5"
                          >
                            {clientSecret ? (
                              <div className="space-y-4">
                                <PaymentElement options={{
                                  layout: 'tabs',
                                  business: { name: 'Freitas Outlet' },
                                }} />
                                {paymentMethod === 'credit' && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <label className="block text-xs font-medium uppercase tracking-wider mb-1">Parcelamento</label>
                                    <select value={installments}
                                      onChange={(e) => setInstallments(e.target.value)}
                                      className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-white">
                                      {Array.from({ length: 12 }, (_, i) => {
                                        const num = i + 1
                                        const value = totalPrice / num
                                        return value >= 50 || num === 1 ? (
                                          <option key={num} value={num}>
                                            {num}x de R$ {value.toFixed(2).replace('.', ',')}{num === 1 ? '' : ' sem juros'}
                                          </option>
                                        ) : null
                                      })}
                                    </select>
                                  </motion.div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-sm text-muted-foreground">Preparando pagamento...</p>
                              </div>
                            )}

                            <div className="text-xs text-muted-foreground p-3 bg-muted">
                              Seus dados de pagamento são processados de forma segura pela Stripe.
                              O número completo do cartão não é armazenado em nossos servidores.
                            </div>

                            <div className="flex gap-4">
                              <motion.div whileTap={{ scale: 0.97 }}>
                                <Button variant="outline" size="lg" onClick={() => setStep('info')} type="button">
                                  VOLTAR
                                </Button>
                              </motion.div>
                              <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
                                {clientSecret ? (
                                  <Button variant="primary" size="lg" fullWidth type="button" onClick={handleStripeConfirm} disabled={processing || !stripe}>
                                    {processing ? 'PROCESSANDO...' : `PAGAR R$ ${totalPrice.toFixed(2).replace('.', ',')}`}
                                  </Button>
                                ) : (
                                  <Button variant="primary" size="lg" fullWidth type="submit" disabled={processing}>
                                    {processing ? 'PREPARANDO...' : 'CONTINUAR PARA PAGAMENTO'}
                                  </Button>
                                )}
                              </motion.div>
                            </div>
                            {errors.card && <p className="text-xs text-red-500 text-center">{errors.card}</p>}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <div className="border border-border p-6 lg:sticky lg:top-24">
                <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">
                  Resumo do Pedido ({items.length} {items.length === 1 ? 'item' : 'itens'})
                </h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedSize}`}
                      className="flex gap-3 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <motion.div
                        className="w-12 h-12 bg-muted shrink-0 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-[8px] text-muted-foreground text-center">{item.product.brand.name}</span>
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.product.name}</p>
                        <p className="text-[11px] text-muted-foreground">{item.selectedSize} / Qtd: {item.quantity}</p>
                        <p className="text-xs font-bold mt-0.5">R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium">
                      {selectedShipping && shippingOptions.length > 0
                        ? `R$ ${shippingOptions.find((o) => o.service === selectedShipping)?.price.toFixed(2).replace('.', ',') || '0,00'}`
                        : 'Calcular após o CEP'}
                    </span>
                  </div>
                  {getDiscount() > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Desconto Fidelidade ({tier} — {getDiscount()}%)</span>
                      <span className="font-medium">- R$ {(totalPrice * getDiscount() / 100).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Cupom de Desconto</span>
                      <span className="font-medium">- R$ {(totalPrice * couponDiscount).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  {totalPrice > 0 && getDiscount() === 0 && couponDiscount === 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Desconto</span>
                      <span className="font-medium">R$ 0,00</span>
                    </div>
                  )}
                  {points > 0 && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Seus pontos</span>
                      <span>{points} pts</span>
                    </div>
                  )}
                  <motion.div
                    className="flex justify-between font-heading font-bold text-lg border-t border-border pt-4"
                    key={totalPrice + (shippingOptions.find((o) => o.service === selectedShipping)?.price || 0) - (totalPrice * getDiscount() / 100) - (totalPrice * couponDiscount)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span>Total</span>
                    <span>R$ {(totalPrice + (shippingOptions.find((o) => o.service === selectedShipping)?.price || 0) - (totalPrice * getDiscount() / 100) - (totalPrice * couponDiscount)).toFixed(2).replace('.', ',')}</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
