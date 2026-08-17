import type { FieldErrors } from '@/components/checkout/checkout-utils'
import type { CheckoutFormData } from './checkout-types'

export function validateCheckoutForm(
  formData: CheckoutFormData,
  lgpdConsent: boolean,
): FieldErrors {
  const newErrors: FieldErrors = {}

  if (formData.name.trim().length < 3) newErrors.name = 'Nome deve ter no mínimo 3 caracteres'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'E-mail inválido'

  const cpfClean = formData.cpf.replace(/\D/g, '')
  if (cpfClean.length !== 11) {
    newErrors.cpf = 'CPF deve ter 11 dígitos'
  }

  const phoneClean = formData.phone.replace(/\D/g, '')
  if (phoneClean.length < 10 || phoneClean.length > 11) newErrors.phone = 'Telefone inválido'

  const cepClean = formData.cep.replace(/\D/g, '')
  if (cepClean.length !== 8) newErrors.cep = 'CEP deve ter 8 dígitos'
  if (formData.street.trim().length < 3) newErrors.street = 'Endereço inválido'
  if (!formData.number.trim()) newErrors.number = 'Número é obrigatório'
  if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório'
  if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória'
  if (formData.state.trim().length !== 2) newErrors.state = 'Estado deve ter 2 caracteres'
  if (!lgpdConsent) newErrors.lgpd = 'Você precisa aceitar a política de privacidade'

  return newErrors
}