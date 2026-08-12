import { describe, it, expect } from 'vitest'
import { personalInfoSchema, addressSchema, cardSchema, pixSchema, checkoutSchema } from '@/lib/validations'

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

  it('rejects invalid CPF (all same digits)', () => {
    const result = personalInfoSchema.safeParse({
      name: 'Cliente Teste',
      email: 'cliente@email.com',
      cpf: '00000000000',
      phone: '11999999999',
    })
    expect(result.success).toBe(false)
  })

  it('rejects CPF with wrong check digits', () => {
    const result = personalInfoSchema.safeParse({
      name: 'Cliente Teste',
      email: 'cliente@email.com',
      cpf: '52998224726',
      phone: '11999999999',
    })
    expect(result.success).toBe(false)
  })

  it('rejects CPF with too few digits', () => {
    const result = personalInfoSchema.safeParse({
      name: 'Cliente Teste',
      email: 'cliente@email.com',
      cpf: '123456789',
      phone: '11999999999',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = personalInfoSchema.safeParse({
      name: '',
      email: 'cliente@email.com',
      cpf: '52998224725',
      phone: '11999999999',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = personalInfoSchema.safeParse({
      name: 'Cliente Teste',
      email: 'invalido',
      cpf: '52998224725',
      phone: '11999999999',
    })
    expect(result.success).toBe(false)
  })

  it('rejects phone with letters', () => {
    const result = personalInfoSchema.safeParse({
      name: 'Cliente Teste',
      email: 'cliente@email.com',
      cpf: '52998224725',
      phone: 'abc',
    })
    expect(result.success).toBe(false)
  })

  it('accepts CPF with dots and dashes', () => {
    const result = personalInfoSchema.safeParse({
      name: 'Cliente Teste',
      email: 'cliente@email.com',
      cpf: '529.982.247-25',
      phone: '11999999999',
    })
    expect(result.success).toBe(true)
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

  it('rejects missing required fields', () => {
    const result = addressSchema.safeParse({
      cep: '01001000',
      street: 'Rua Teste',
    })
    expect(result.success).toBe(false)
  })

  it('accepts complement as optional', () => {
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

  it('rejects state with fewer than 2 characters', () => {
    const result = addressSchema.safeParse({
      cep: '01001000',
      street: 'Rua Teste',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'S',
    })
    expect(result.success).toBe(false)
  })

  it('accepts any 2-letter state', () => {
    const result = addressSchema.safeParse({
      cep: '01001000',
      street: 'Rua Teste',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'xx',
    })
    expect(result.success).toBe(true)
  })
})

describe('cardSchema', () => {
  it('validates card data', () => {
    const result = cardSchema.safeParse({ token: 'tok_123', installments: 3 })
    expect(result.success).toBe(true)
  })

  it('rejects missing token', () => {
    const result = cardSchema.safeParse({ installments: 3 })
    expect(result.success).toBe(false)
  })
})

describe('pixSchema', () => {
  it('validates CPF for Pix', () => {
    const result = pixSchema.safeParse({ cpf: '52998224725' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid CPF for Pix', () => {
    const result = pixSchema.safeParse({ cpf: '00000000000' })
    expect(result.success).toBe(false)
  })
})

describe('checkoutSchema', () => {
  it('validates complete checkout data with lgpdConsent', () => {
    const result = checkoutSchema.safeParse({
      name: 'Cliente Teste',
      email: 'cliente@email.com',
      cpf: '52998224725',
      phone: '11999999999',
      cep: '01001000',
      street: 'Rua Teste',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      lgpdConsent: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects checkout without lgpdConsent', () => {
    const result = checkoutSchema.safeParse({
      name: 'Cliente Teste',
      email: 'cliente@email.com',
      cpf: '52998224725',
      phone: '11999999999',
      cep: '01001000',
      street: 'Rua Teste',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
    })
    expect(result.success).toBe(false)
  })

  it('rejects checkout with invalid data', () => {
    const result = checkoutSchema.safeParse({
      name: '',
      email: 'invalido',
      cpf: '00000000000',
      phone: '',
    })
    expect(result.success).toBe(false)
  })
})
