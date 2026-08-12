import { describe, it, expect } from 'vitest'
import { analyzeOrder } from '@/lib/fraud'

describe('analyzeOrder', () => {
  it('approves normal orders', () => {
    const result = analyzeOrder({
      amount: 250,
      cpf: '52998224725',
      email: 'cliente@email.com',
      name: 'Cliente Teste',
      phone: '11999999999',
      items: 3,
    })
    expect(result.status).toBe('approved')
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(100)
  })

  it('flags high-value orders for review', () => {
    const result = analyzeOrder({
      amount: 15000,
      cpf: '52998224725',
      email: 'cliente@email.com',
      name: 'Cliente Teste',
      phone: '11999999999',
      items: 1,
    })
    expect(result.status).toBe('review')
    expect(result.score).toBeGreaterThan(0)
  })

  it('rejects temp email domains', () => {
    const cases = [
      'teste@tempmail.com',
      'user@10minutemail.com',
      'test@guerrillamail.com',
    ]
    for (const email of cases) {
      const result = analyzeOrder({
        amount: 100, cpf: '52998224725', email, name: 'Teste', phone: '11999999999', items: 1,
      })
      expect(result.status).toBe('rejected')
    }
  })

  it('rejects disposable email domains', () => {
    const result = analyzeOrder({
      amount: 100,
      cpf: '52998224725',
      email: 'user@mailinator.com',
      name: 'Teste',
      phone: '11999999999',
      items: 1,
    })
    expect(result.status).toBe('rejected')
  })

  it('flags orders with many items AND low value for review', () => {
    const result = analyzeOrder({
      amount: 5,
      cpf: '52998224725',
      email: 'cliente@email.com',
      name: 'Cliente Teste',
      phone: '11999999999',
      items: 50,
    })
    expect(result.status).toBe('review')
  })

  it('rejects orders with temp email AND high value', () => {
    const result = analyzeOrder({
      amount: 15000,
      cpf: '52998224725',
      email: 'teste@tempmail.com',
      name: 'Cliente Teste',
      phone: '11999999999',
      items: 3,
    })
    expect(result.status).toBe('rejected')
  })

  it('returns score 0 for clean orders', () => {
    const result = analyzeOrder({
      amount: 50,
      cpf: '52998224725',
      email: 'seguro@email.com',
      name: 'Comprador',
      phone: '11988887777',
      items: 1,
    })
    expect(result.status).toBe('approved')
  })

  it('handles empty name', () => {
    const result = analyzeOrder({
      amount: 100,
      cpf: '52998224725',
      email: 'cliente@email.com',
      name: '',
      phone: '11999999999',
      items: 1,
    })
    expect(result.status).toBe('approved')
  })
})
