import type { CartItem } from '@/types'
import type { PaymentMethod } from '@/components/checkout/checkout-utils'
import type { CheckoutFormData } from './checkout-types'

export interface BuildCheckoutPayloadOptions {
  formData: CheckoutFormData
  paymentMethod: PaymentMethod
  installments: string
  items: CartItem[]
  shipping: string
  couponCode: string | null
  loyaltyDiscountPercent: number
}

export function buildCheckoutPayload(options: BuildCheckoutPayloadOptions) {
  const cartItems = options.items.map((item) => ({
    productId: item.product.id,
    productName: item.product.name,
    brand: item.product.brand.name,
    size: item.selectedSize,
    color: item.selectedColor.name,
    quantity: item.quantity,
    unitPrice: item.product.price,
  }))

  return {
    action: 'process',
    data: { ...options.formData, lgpdConsent: true },
    paymentMethod: options.paymentMethod,
    installments: options.paymentMethod === 'credit' ? parseInt(options.installments) : 1,
    items: cartItems,
    shipping: options.shipping || undefined,
    couponCode: options.couponCode,
    loyaltyDiscountPercent: options.loyaltyDiscountPercent,
  }
}

export function getStoredCoupon(): { code?: string; discount?: number } | null {
  try {
    return JSON.parse(localStorage.getItem('fo_coupon') || 'null')
  } catch {
    return null
  }
}