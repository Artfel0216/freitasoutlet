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
  })

  it('rejects orders with high value', () => {
    const result = analyzeOrder({
      amount: 15000,
      cpf: '52998224725',
      email: 'cliente@email.com',
      name: 'Cliente Teste',
      phone: '11999999999',
      items: 1,
    })
    expect(result.status).toBe('review')
  })

  it('rejects orders with temp email', () => {
    const result = analyzeOrder({
      amount: 100,
      cpf: '52998224725',
      email: 'teste@tempmail.com',
      name: 'Cliente Teste',
      phone: '11999999999',
      items: 1,
    })
    expect(result.status).toBe('rejected')
  })
})
