import { describe, it, expect } from 'vitest'
import { verifyItems } from '@/lib/checkout/items'
import { flashSales } from '@/lib/flash-sales'

const productId = 'adidas-ultra-boost-5'
const flashSale = flashSales.find((fs) => fs.productSlug === productId)
if (!flashSale) throw new Error('flash sale not configured for test product')

const basePrice = 430
const flashPrice = Math.round(basePrice * (1 - flashSale.discountPercent / 100) * 100) / 100

function makeItem(unitPrice: number) {
  return {
    productId,
    productName: 'Adidas Ultra Boost 5',
    brand: 'Adidas',
    unitPrice,
    size: '42',
    color: 'Preto',
    quantity: 1,
  }
}

describe('verifyItems with flash sale (C1 server-side)', () => {
  it('accepts the flash sale effective price', async () => {
    const result = await verifyItems([makeItem(flashPrice)])
    expect(result.ok).toBe(true)
  })

  it('rejects the full price when a flash sale is active', async () => {
    const result = await verifyItems([makeItem(basePrice)])
    expect(result.ok).toBe(false)
    expect(result.ok ? '' : result.status).toBe(400)
  })
})