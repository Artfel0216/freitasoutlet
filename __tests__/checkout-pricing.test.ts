import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { computeTotals } from '@/lib/checkout/pricing'

vi.mock('@/lib/checkout/coupons', () => ({
  validateCoupon: vi.fn(async () => ({ valid: true, discount: 0 })),
}))

const items = [
  {
    productId: 'p1',
    productName: 'Produto 1',
    brand: 'Adidas',
    unitPrice: 150,
    size: '42',
    color: 'Preto',
    quantity: 2,
  },
]

describe('computeTotals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetModules()
  })

  it('computes subtotal and total for a cart', async () => {
    const { totals } = await computeTotals({
      items,
      loyaltyDiscountPercent: 0,
    })
    expect(totals.subtotal).toBe(300)
    expect(totals.shippingCost).toBe(0)
    expect(totals.total).toBe(300)
  })

  it('applies free shipping (PAC = 0) when subtotal >= R$ 299 on the server', async () => {
    const { totals } = await computeTotals({
      items,
      loyaltyDiscountPercent: 0,
      shippingOption: 'PAC',
      state: 'SP',
    })
    expect(totals.shippingCost).toBe(0)
    expect(totals.total).toBe(totals.subtotal)
  })

  it('charges shipping when subtotal < R$ 299 on the server', async () => {
    const { totals } = await computeTotals({
      items: [{ ...items[0], unitPrice: 100, quantity: 1 }],
      loyaltyDiscountPercent: 0,
      shippingOption: 'PAC',
      state: 'SP',
    })
    expect(totals.subtotal).toBe(100)
    expect(totals.shippingCost).toBeGreaterThan(0)
    expect(totals.total).toBe(100 + totals.shippingCost)
  })

  it('applies loyalty discount', async () => {
    const { totals } = await computeTotals({
      items,
      loyaltyDiscountPercent: 10,
    })
    expect(totals.loyaltyDiscount).toBe(30)
    expect(totals.discountValue).toBe(30)
    expect(totals.total).toBe(270)
  })
})