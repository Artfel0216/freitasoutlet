import { describe, it, expect } from 'vitest'
import { personalInfoSchema, addressSchema, cardSchema, pixSchema } from '@/lib/validations'

describe('personalInfoSchema', () => {
  it('validates correct data', () => {
    const result = personalInfoSchema.safeParse({
      name: 'Cliente Teste',
      email: 'cliente@email.com',
      cpf: '52998224725',
      phone: '11999999999',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid CPF', () => {
    const result = personalInfoSchema.safeParse({
      name: 'Cliente Teste',
      email: 'cliente@email.com',
      cpf: '00000000000',
      phone: '11999999999',
    })
    expect(result.success).toBe(false)
  })
})

describe('addressSchema', () => {
  it('validates correct address', () => {
    const result = addressSchema.safeParse({
      cep: '01001000',
      street: 'Rua Teste',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
    })
    expect(result.success).toBe(true)
  })
})

describe('cardSchema', () => {
  it('validates card data', () => {
    const result = cardSchema.safeParse({ token: 'tok_123', installments: 3 })
    expect(result.success).toBe(true)
  })
})

describe('pixSchema', () => {
  it('validates CPF for Pix', () => {
    const result = pixSchema.safeParse({ cpf: '52998224725' })
    expect(result.success).toBe(true)
  })
})
