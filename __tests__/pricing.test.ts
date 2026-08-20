import { describe, it, expect } from 'vitest'
import { getEffectivePrice, getFlashSalePrice } from '@/lib/pricing'
import { WHOLESALE_MIN_QUANTITY } from '@/lib/wholesale'
import { flashSales } from '@/lib/flash-sales'

const base = { slug: 'adidas-ultra-boost-5', price: 399.9 }

describe('getFlashSalePrice', () => {
  it('returns discounted price when a flash sale is active for the slug', () => {
    const active = flashSales.find((fs) => fs.productSlug === base.slug)
    if (!active) throw new Error('flash sale slug not configured')
    const expected = Math.round(base.price * (1 - active.discountPercent / 100) * 100) / 100
    expect(getFlashSalePrice(base)).toBeCloseTo(expected, 2)
  })

  it('returns null when no flash sale matches', () => {
    expect(getFlashSalePrice({ slug: 'produto-sem-oferta', price: 100 })).toBeNull()
  })
})

describe('getEffectivePrice', () => {
  it('uses flash sale price when active, regardless of quantity', () => {
    const active = flashSales.find((fs) => fs.productSlug === base.slug)!
    const expected = Math.round(base.price * (1 - active.discountPercent / 100) * 100) / 100
    expect(getEffectivePrice(base, 1)).toBeCloseTo(expected, 2)
    expect(getEffectivePrice(base, WHOLESALE_MIN_QUANTITY)).toBeCloseTo(expected, 2)
  })

  it('applies wholesale discount when quantity reaches threshold and no flash sale', () => {
    const item = { slug: 'sem-flash-sale', price: 100 }
    expect(getEffectivePrice(item, WHOLESALE_MIN_QUANTITY)).toBeCloseTo(85, 2)
  })

  it('returns base price for single items without flash sale', () => {
    const item = { slug: 'sem-flash-sale', price: 100 }
    expect(getEffectivePrice(item, 1)).toBe(100)
  })
})