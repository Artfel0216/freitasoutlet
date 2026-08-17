import type { CheckoutFormData } from '@/components/checkout/checkout-utils'

export type { CheckoutFormData }

export interface OrderResult {
  orderNumber: string
  status: string
  pixQrCode?: string
  pixKey?: string
}

export const emptyCheckoutFormData: CheckoutFormData = {
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
}