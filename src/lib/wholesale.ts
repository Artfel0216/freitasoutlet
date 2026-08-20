export const WHOLESALE_MIN_QUANTITY = 5
export const WHOLESALE_DISCOUNT_PERCENT = 15

export function isWholesaleQuantity(quantity: number): boolean {
  return quantity >= WHOLESALE_MIN_QUANTITY
}

export function getUnitPrice(basePrice: number, quantity: number): number {
  if (!isWholesaleQuantity(quantity)) return basePrice
  return Math.round(basePrice * (1 - WHOLESALE_DISCOUNT_PERCENT / 100) * 100) / 100
}

export function getLineTotal(basePrice: number, quantity: number): number {
  return getUnitPrice(basePrice, quantity) * quantity
}