import { calculateShipping } from '@/lib/shipping'
import { calculateSubtotal, type CheckoutItem } from './items'
import { validateCoupon } from './coupons'

export interface Totals {
  subtotal: number
  couponDiscount: number
  loyaltyDiscount: number
  discountValue: number
  shippingCost: number
  total: number
}

export interface ComputeTotalsOptions {
  items: CheckoutItem[]
  couponCode?: string | null
  loyaltyDiscountPercent: number
  shippingOption?: string
  state?: string
}

export interface ComputeTotalsResult {
  totals: Totals
  error?: string
}

export async function computeTotals(options: ComputeTotalsOptions): Promise<ComputeTotalsResult> {
  const subtotal = calculateSubtotal(options.items)

  let couponDiscount = 0
  if (options.couponCode) {
    const couponResult = await validateCoupon(options.couponCode, subtotal)
    if (!couponResult.valid) {
      return { totals: buildTotals(subtotal, 0, 0, 0, 0), error: couponResult.error }
    }
    couponDiscount = couponResult.discount
  }

  const loyaltyDiscount =
    options.loyaltyDiscountPercent > 0 ? (subtotal * options.loyaltyDiscountPercent) / 100 : 0

  const discountValue = couponDiscount + loyaltyDiscount

  let shippingCost = 0
  if (options.shippingOption && options.state) {
    const selected = calculateShipping(options.state, options.items.length).find(
      (s) => s.service === options.shippingOption,
    )
    if (selected) {
      shippingCost = selected.price
    }
  }

  return { totals: buildTotals(subtotal, couponDiscount, loyaltyDiscount, discountValue, shippingCost) }
}

function buildTotals(
  subtotal: number,
  couponDiscount: number,
  loyaltyDiscount: number,
  discountValue: number,
  shippingCost: number,
): Totals {
  return {
    subtotal,
    couponDiscount,
    loyaltyDiscount,
    discountValue,
    shippingCost,
    total: subtotal + shippingCost - discountValue,
  }
}