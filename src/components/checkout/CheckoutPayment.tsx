'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/Button'
import type { PaymentMethod, FieldErrors } from '@/components/checkout/checkout-utils'
import { formatBRL } from '@/components/checkout/checkout-utils'

interface CheckoutPaymentProps {
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (m: PaymentMethod) => void
  installments: string
  setInstallments: (s: string) => void
  clientSecret: string | null
  orderResult: { orderNumber?: string; pixQrCode?: string } | null
  processing: boolean
  errors: FieldErrors
  totalPrice: number
  onStripeConfirm: () => void
  onPixConfirmed: () => void
  onBack: () => void
}

const paymentMethods: { value: PaymentMethod; label: string; desc: string }[] = [
  { value: 'pix', label: 'Pix', desc: 'Pagamento instantâneo — aprovado na hora' },
  { value: 'credit', label: 'Cartão de Crédito', desc: 'Parcele em até 12x' },
  { value: 'debit', label: 'Cartão de Débito', desc: 'Débito à vista' },
]

export function CheckoutPayment({
  paymentMethod, onPaymentMethodChange, installments, setInstallments,
  clientSecret, orderResult, processing, errors, totalPrice,
  onStripeConfirm, onPixConfirmed, onBack,
}: CheckoutPaymentProps) {
  return (
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
        {paymentMethods.map((method) => (
          <motion.label
            key={method.value}
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
              paymentMethod === method.value ? 'border-black bg-black/5' : 'border-border hover:border-black'
            }`}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.99 }}
          >
            <input type="radio" name="payment" checked={paymentMethod === method.value}
              onChange={() => { onPaymentMethodChange(method.value); }} className="accent-black" />
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
            <div className="font-heading font-black text-2xl">{formatBRL(totalPrice)}</div>
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
              <Button variant="primary" size="lg" fullWidth onClick={onPixConfirmed}>
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
                            {num}x de {formatBRL(value)}{num === 1 ? '' : ' sem juros'}
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
                <Button variant="outline" size="lg" onClick={onBack} type="button">
                  VOLTAR
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
                {clientSecret ? (
                  <Button variant="primary" size="lg" fullWidth type="button" onClick={onStripeConfirm} disabled={processing}>
                    {processing ? 'PROCESSANDO...' : `PAGAR ${formatBRL(totalPrice)}`}
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
  )
}