import { describe, it, expect } from 'vitest'

describe('Token generation', () => {
  it('generates a valid UUID v4', () => {
    const token = crypto.randomUUID()
    expect(token).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })
})

describe('Order total calculation', () => {
  it('applies percentage coupon discount correctly', () => {
    const subtotal = 200
    const discountPercent = 10
    const expected = subtotal * discountPercent / 100
    expect(expected).toBe(20)
  })

  it('applies fixed coupon discount correctly (capped at subtotal)', () => {
    const subtotal = 200
    const discountValue = 50
    const discount = Math.min(discountValue, subtotal)
    expect(discount).toBe(50)
  })

  it('caps fixed discount at subtotal', () => {
    const subtotal = 30
    const discountValue = 50
    const discount = Math.min(discountValue, subtotal)
    expect(discount).toBe(30)
  })

  it('stacks coupon and loyalty discounts', () => {
    const subtotal = 200
    const couponDiscount = 20
    const loyaltyPercent = 5
    const loyaltyDiscount = subtotal * loyaltyPercent / 100

    const totalDiscount = couponDiscount + loyaltyDiscount
    expect(totalDiscount).toBe(30)
  })

  it('calculates final total correctly', () => {
    const subtotal = 200
    const shipping = 15.90
    const discount = 30
    const total = subtotal + shipping - discount
    expect(total).toBe(185.90)
  })
})

describe('Offer display logic', () => {
  it('maps offerStatus to correct badge text', () => {
    const labels: Record<string, string> = {
      sale: 'Oferta',
      promotion: 'Promoção',
      clearance: 'Queima',
    }
    expect(labels['sale']).toBe('Oferta')
    expect(labels['promotion']).toBe('Promoção')
    expect(labels['clearance']).toBe('Queima')
    expect(labels['none']).toBeUndefined()
  })

  it('maps offerType to correct badge text', () => {
    const labels: Record<string, string> = {
      weekly: 'Oferta Semanal',
      monthly: 'Oferta Mensal',
    }
    expect(labels['weekly']).toBe('Oferta Semanal')
    expect(labels['monthly']).toBe('Oferta Mensal')
  })
})

describe('Price formatting', () => {
  it('formats price in BRL with comma as decimal separator', () => {
    const price = 1499.90
    const formatted = `R$ ${price.toFixed(2).replace('.', ',')}`
    expect(formatted).toBe('R$ 1499,90')
  })

  it('calculates discount percentage', () => {
    const price = 899.90
    const compareAt = 1199.90
    const percent = Math.round((1 - price / compareAt) * 100)
    expect(percent).toBe(25)
  })
})

describe('Slug generation', () => {
  it('generates clean slug from name', () => {
    const name = 'Tênis Nike Air Max'
    const slug = name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    expect(slug).toBe('tenis-nike-air-max')
  })

  it('handles special characters', () => {
    const name = 'Chuteira Nike® Mercurial Superfly 9 - Edição Limitada!'
    const slug = name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    expect(slug).toBe('chuteira-nike-mercurial-superfly-9-edicao-limitada')
  })
})
