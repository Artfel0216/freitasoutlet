import { describe, it, expect } from 'vitest'
import { calculateShipping } from '../lib/shipping'

describe('calculateShipping', () => {
  it('should return PAC and SEDEX options for SP', () => {
    const options = calculateShipping('SP', 1)
    expect(options).toHaveLength(2)
    expect(options[0].service).toBe('PAC')
    expect(options[1].service).toBe('SEDEX')
    expect(options[0].price).toBeGreaterThan(0)
    expect(options[1].price).toBeGreaterThan(options[0].price)
  })

  it('should apply volume surcharge for more than 3 items', () => {
    const options1 = calculateShipping('SP', 1)
    const options5 = calculateShipping('SP', 5)
    expect(options5[0].price).toBeGreaterThan(options1[0].price)
  })

  it('should offer free PAC for orders above R$ 499.90', () => {
    const options = calculateShipping('SP', 1, 500)
    expect(options[0].price).toBe(0)
    expect(options[0].description).toContain('Grátis')
  })

  it('should not offer free SEDEX for orders above R$ 499.90', () => {
    const options = calculateShipping('SP', 1, 500)
    expect(options[1].price).toBeGreaterThan(0)
  })

  it('should handle unknown state', () => {
    const options = calculateShipping('XX', 1)
    expect(options).toHaveLength(2)
    expect(options[0].price).toBeGreaterThan(0)
  })
})
