import 'server-only'

type FraudResult = {
  score: number
  status: 'approved' | 'review' | 'rejected'
  recommendation: string
}

export function analyzeOrder(data: {
  amount: number
  cpf: string
  email: string
  name: string
  phone: string
  items: number
}): FraudResult {
  let score = 0
  const reasons: string[] = []

  if (data.amount > 10000) {
    score += 20
    reasons.push('Valor alto')
  }

  if (data.amount < 10) {
    score += 15
    reasons.push('Valor muito baixo')
  }

  const emailDomain = data.email.split('@')[1]?.toLowerCase()
  if (emailDomain && /(tempmail|throwaway|mailinator|guerrilla|10minutemail)/i.test(emailDomain)) {
    score += 50
    reasons.push('Domínio de e-mail temporário')
  }

  if (data.phone.replace(/\D/g, '').length < 10) {
    score += 10
    reasons.push('Telefone inválido')
  }

  if (data.items > 20) {
    score += 15
    reasons.push('Muitos itens')
  }

  if (score >= 50) {
    return { score, status: 'rejected', recommendation: `Rejeitado: ${reasons.join(', ')}` }
  }

  if (score >= 20) {
    return { score, status: 'review', recommendation: `Revisão manual necessária: ${reasons.join(', ')}` }
  }

  return { score, status: 'approved', recommendation: 'Transação aprovada sem restrições' }
}
