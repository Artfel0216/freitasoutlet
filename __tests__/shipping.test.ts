import { describe, it, expect } from 'vitest'
import { calculateShipping } from '../lib/shipping'

describe('calculateShipping', () => {
  it('returns PAC and SEDEX options for SP', () => {
    const options = calculateShipping('SP', 1)
    expect(options).toHaveLength(2)
    expect(options[0].service).toBe('PAC')
    expect(options[1].service).toBe('SEDEX')
    expect(options[0].price).toBeGreaterThan(0)
    expect(options[1].price).toBeGreaterThan(options[0].price)
  })

  it('applies volume surcharge for more than 3 items', () => {
    const options1 = calculateShipping('SP', 1)
    const options5 = calculateShipping('SP', 5)
    expect(options5[0].price).toBeGreaterThan(options1[0].price)
  })

  it('offers free PAC above R$ 299', () => {
    const options = calculateShipping('SP', 1, 300)
    expect(options[0].price).toBe(0)
    expect(options[0].description).toContain('Grátis')
  })

  it('charges PAC below R$ 299', () => {
    const options = calculateShipping('SP', 1, 298)
    expect(options[0].price).toBeGreaterThan(0)
    expect(options[0].description).not.toContain('Grátis')
  })

  it('does not offer free SEDEX even above R$ 299', () => {
    const options = calculateShipping('SP', 1, 500)
    expect(options[1].price).toBeGreaterThan(0)
  })

  it('applies exact free shipping threshold at R$ 299', () => {
    const options = calculateShipping('SP', 1, 299)
    expect(options[0].price).toBe(0)
  })

  it('applies volume surcharge correctly', () => {
    const base = calculateShipping('SP', 1)
    const surcharged = calculateShipping('SP', 6)
    const surchargeAmount = (6 - 3) * 2.5
    expect(surcharged[0].price).toBeCloseTo(base[0].price + surchargeAmount, 2)
  })

  it('handles unknown state with fallback rate', () => {
    const options = calculateShipping('XX', 1)
    expect(options).toHaveLength(2)
    expect(options[0].price).toBeGreaterThan(0)
    expect(options[1].price).toBeGreaterThan(options[0].price)
  })

  it('handles lowercase state input', () => {
    const upper = calculateShipping('SP', 1)
    const lower = calculateShipping('sp', 1)
    expect(upper[0].price).toBe(lower[0].price)
  })

  it('returns higher prices for distant states', () => {
    const sp = calculateShipping('SP', 1)
    const rr = calculateShipping('RR', 1)
    expect(rr[0].price).toBeGreaterThan(sp[0].price)
    expect(rr[1].price).toBeGreaterThan(sp[1].price)
  })

  it('returns correct SEDEX multiplier without free shipping', () => {
    const options = calculateShipping('SP', 1)
    expect(options[1].price).toBeCloseTo(options[0].price * 2.5, 0)
  })

  it('returns correct SEDEX multiplier with free shipping', () => {
    const options = calculateShipping('SP', 1, 300)
    expect(options[1].price).toBeCloseTo(15.90 * 1.5, 2)
  })

  it('SEDEX delivery days are shorter for SP', () => {
    const sp = calculateShipping('SP', 1)
    const others = calculateShipping('RJ', 1)
    expect(sp[1].deliveryDays).toBe('1-2')
    expect(others[1].deliveryDays).toBe('2-4')
  })
})
