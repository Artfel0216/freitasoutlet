import { z } from 'zod'

function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digits)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i)
  let remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== parseInt(digits[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i)
  remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== parseInt(digits[10])) return false

  return true
}

export const personalInfoSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(120, 'Nome muito longo'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().refine((v) => isValidCPF(v), { message: 'CPF inválido' }),
  phone: z.string().refine((v) => {
    const digits = v.replace(/\D/g, '')
    return digits.length >= 10 && digits.length <= 11
  }, { message: 'Telefone inválido' }),
})

export const addressSchema = z.object({
  cep: z.string().refine((v) => {
    const digits = v.replace(/\D/g, '')
    return digits.length === 8
  }, { message: 'CEP inválido' }),
  street: z.string().min(3, 'Endereço deve ter no mínimo 3 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').toUpperCase(),
})

export const checkoutSchema = z.object({
  ...personalInfoSchema.shape,
  ...addressSchema.shape,
  lgpdConsent: z.boolean().refine((v) => v === true, { message: 'Você precisa aceitar a política de privacidade' }),
})

export const cardSchema = z.object({
  token: z.string().min(1, 'Token de pagamento inválido'),
  installments: z.coerce.number().int().min(1).max(12),
})

export const pixSchema = z.object({
  cpf: z.string().refine((v) => isValidCPF(v), { message: 'CPF inválido' }),
})

export type CheckoutData = z.infer<typeof checkoutSchema>
export type CardData = z.infer<typeof cardSchema>
export type PixData = z.infer<typeof pixSchema>
