import 'server-only'
import { getStripe } from './stripe'
import { generatePixPayload } from './pix'
import type { PaymentInfo } from './db'

export async function createStripePaymentIntent(params: {
  amount: number
  currency: string
  orderId: string
  orderNumber: string
  installments?: number
}): Promise<{
  success: boolean
  clientSecret: string | null
  paymentIntentId: string | null
  error?: string
}> {
  try {
    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100),
      currency: params.currency || 'brl',
      metadata: {
        orderId: params.orderId,
        orderNumber: params.orderNumber,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    return {
      success: false,
      clientSecret: null,
      paymentIntentId: null,
      error: error instanceof Error ? error.message : 'Erro ao criar pagamento',
    }
  }
}

export async function confirmStripePayment(paymentIntentId: string): Promise<{
  success: boolean
  status: string
  error?: string
}> {
  try {
    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return {
      success: true,
      status: paymentIntent.status,
    }
  } catch (error) {
    return {
      success: false,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Erro ao confirmar pagamento',
    }
  }
}

export async function processPixPayment(
  cpf: string,
  amount: number,
  customerName: string
): Promise<{
  success: boolean
  transactionId: string
  status: string
  paymentInfo: Pick<PaymentInfo, 'pixKey' | 'pixQrCode'>
}> {
  const pix = generatePixPayload(cpf, amount, customerName)

  return {
    success: true,
    transactionId: pix.txId,
    status: 'pending',
    paymentInfo: {
      pixKey: pix.pixKey,
      pixQrCode: pix.qrCode,
    },
  }
}
