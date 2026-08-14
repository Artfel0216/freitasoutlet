export type SavedAddress = {
  id: string
  label: string
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  isDefault: boolean
}

export type PaymentMethod = 'pix' | 'credit' | 'debit'
export type Step = 'info' | 'payment' | 'success' | 'error'
export type FieldErrors = Record<string, string>

export type ShippingOption = {
  service: string
  description: string
  price: number
  deliveryDays: string
}

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(?=\d)/g, '$1.')
    .replace(/(\d{3})\.(\d{3})(?=\d)/g, '$1.$2.')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(?=\d)/g, '$1.$2.$3-')
}

export function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
}

export function getStepTitle(step: Step): string {
  switch (step) {
    case 'info': return 'Dados Pessoais e Endereço'
    case 'payment': return 'Pagamento'
    case 'success': return 'Pedido Confirmado'
    case 'error': return 'Pagamento Não Aprovado'
  }
}

export function formatBRL(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`
}