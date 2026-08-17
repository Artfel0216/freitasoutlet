'use client'

import { useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { CheckoutPage } from './CheckoutPage'

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise =
  typeof window !== 'undefined' && stripeKey ? loadStripe(stripeKey) : null

export default function CheckoutPageWrapper() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: { theme: 'stripe' },
        ...(clientSecret ? { clientSecret } : {}),
      }}
      key={clientSecret || 'initial'}
    >
      <CheckoutPage clientSecret={clientSecret} onClientSecret={setClientSecret} />
    </Elements>
  )
}