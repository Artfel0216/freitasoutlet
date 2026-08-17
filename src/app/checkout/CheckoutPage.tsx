'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CheckoutInfoForm } from '@/components/checkout/CheckoutInfoForm'
import { CheckoutPayment } from '@/components/checkout/CheckoutPayment'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { StatusScreens } from '@/components/checkout/StatusScreens'
import { pageVariants, getStepTitle } from '@/components/checkout/checkout-utils'
import { useCheckout } from './use-checkout'
import { CheckoutStepper } from './components/CheckoutStepper'
import { ServerErrorBanner } from './components/ServerErrorBanner'

export function CheckoutPage({ clientSecret, onClientSecret }: {
  clientSecret: string | null
  onClientSecret: (secret: string) => void
}) {
  const c = useCheckout({ onClientSecret })

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
          key={c.step}
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          / {getStepTitle(c.step)}
        </motion.span>
      </motion.div>

      <ServerErrorBanner message={c.errors.server} />

      <StatusScreens
        step={c.step}
        errors={c.errors}
        orderNumber={c.orderResult?.orderNumber}
        email={c.formData.email}
        onRetry={() => c.setStep('payment')}
      />

      {c.step !== 'error' && c.step !== 'success' && (
        <motion.div
          key="checkout"
          {...pageVariants}
          className="grid lg:grid-cols-5 gap-8 lg:gap-12"
        >
          <div className="lg:col-span-3">
            <form onSubmit={c.step === 'info' ? c.handleInfoSubmit : c.handlePaymentSubmit} className="space-y-8">
              <CheckoutStepper step={c.step} />

              <AnimatePresence mode="wait">
                {c.step === 'info' && (
                  <CheckoutInfoForm
                    formData={c.formData}
                    errors={c.errors}
                    updateField={c.updateField}
                    savedAddresses={c.savedAddresses}
                    selectedAddressId={c.selectedAddressId}
                    selectAddress={c.selectAddress}
                    clearSelectedAddress={c.clearSelectedAddress}
                    shippingOptions={c.shippingOptions}
                    selectedShipping={c.selectedShipping}
                    setSelectedShipping={c.setSelectedShipping}
                    lgpdConsent={c.lgpdConsent}
                    setLgpdConsent={c.setLgpdConsent}
                  />
                )}

                {c.step === 'payment' && (
                  <CheckoutPayment
                    paymentMethod={c.paymentMethod}
                    onPaymentMethodChange={(m) => {
                      c.setPaymentMethod(m)
                      c.setErrors({})
                    }}
                    installments={c.installments}
                    setInstallments={c.setInstallments}
                    clientSecret={clientSecret}
                    orderResult={c.orderResult}
                    processing={c.processing}
                    errors={c.errors}
                    totalPrice={c.totalPrice}
                    onStripeConfirm={c.handleStripeConfirm}
                    onPixConfirmed={c.confirmPixPayment}
                    onBack={() => c.setStep('info')}
                  />
                )}
              </AnimatePresence>
            </form>
          </div>

          <OrderSummary
            items={c.items}
            totalPrice={c.totalPrice}
            selectedShipping={c.selectedShipping}
            shippingOptions={c.shippingOptions}
            getDiscount={c.getDiscount}
            tier={c.tier}
            points={c.points}
            couponDiscount={c.couponDiscount}
          />
        </motion.div>
      )}
    </div>
  )
}