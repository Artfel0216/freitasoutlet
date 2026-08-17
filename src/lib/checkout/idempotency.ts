import { createHash } from 'crypto'

export interface CheckoutItem {
  productId: string
  productName: string
  brand: string
  unitPrice: number
  size: string
  color: string
  quantity: number
}

export interface IdempotencyInput {
  data?: { email?: string; cpf?: string; name?: string; phone?: string; cep?: string }
  items?: CheckoutItem[]
  paymentMethod?: string
  shipping?: string
  couponCode?: string | null
}

export function buildIdempotencyKey(input: IdempotencyInput): string {
  return createHash('sha256')
    .update(
      JSON.stringify({
        data: {
          email: input.data?.email,
          cpf: input.data?.cpf,
          name: input.data?.name,
          phone: input.data?.phone,
          cep: input.data?.cep,
        },
        items: (input.items || []).map((i) => [i.productId, i.size, i.color, i.quantity]),
        paymentMethod: input.paymentMethod,
        shipping: input.shipping,
        couponCode: input.couponCode,
      }),
    )
    .digest('hex')
}