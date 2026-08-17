export type QuizAnswer = string | null

export interface QuizStepOption {
  value: string
  label: string
  icon?: string
}

export interface QuizStep {
  title: string
  key: string
  options: QuizStepOption[]
}

export const steps: QuizStep[] = [
  {
    title: 'Qual o seu estilo?',
    key: 'estilo',
    options: [
      { value: 'casual', label: 'Casual', icon: '👟' },
      { value: 'esportivo', label: 'Esportivo', icon: '⚡' },
      { value: 'corrida', label: 'Corrida', icon: '🏃' },
      { value: 'sneaker-hype', label: 'Sneaker Hype', icon: '🔥' },
    ],
  },
  {
    title: 'Qual seu orçamento?',
    key: 'orcamento',
    options: [
      { value: 'ate-300', label: 'Até R$ 300' },
      { value: '300-600', label: 'R$ 300 - R$ 600' },
      { value: '600-1000', label: 'R$ 600 - R$ 1.000' },
      { value: 'acima-1000', label: 'Acima de R$ 1.000' },
    ],
  },
  {
    title: 'Qual cor prefere?',
    key: 'cor',
    options: [
      { value: 'neutras', label: 'Neutras' },
      { value: 'coloridas', label: 'Coloridas' },
      { value: 'escuras', label: 'Escuras' },
      { value: 'tanto-faz', label: 'Tanto faz' },
    ],
  },
  {
    title: 'Para qual ocasião?',
    key: 'ocasiao',
    options: [
      { value: 'dia-a-dia', label: 'Dia a dia', icon: '🏙️' },
      { value: 'academia', label: 'Academia', icon: '💪' },
      { value: 'futebol', label: 'Futebol', icon: '⚽' },
      { value: 'eventos', label: 'Eventos', icon: '✨' },
    ],
  },
]

export function mapEstiloToCategories(estilo: string): string[] {
  const map: Record<string, string[]> = {
    casual: ['casuais-m', 'casuais-f'],
    esportivo: ['esportivos-m', 'esportivos-f'],
    corrida: ['esportivos-m', 'corrida-m'],
    'sneaker-hype': ['sneakers-hype-m'],
  }
  return map[estilo] || []
}

export function mapOcasiaoToCategories(ocasiao: string): string[] {
  const map: Record<string, string[]> = {
    'dia-a-dia': ['casuais-m', 'casuais-f', 'esportivos-m', 'esportivos-f'],
    academia: ['esportivos-m', 'esportivos-f'],
    futebol: ['chuteiras-campo', 'futebol-performance'],
    eventos: ['sneakers-hype-m'],
  }
  return map[ocasiao] || []
}

export function getPriceRange(orcamento: string): [number, number] | null {
  const map: Record<string, [number, number]> = {
    'ate-300': [0, 300],
    '300-600': [300, 600],
    '600-1000': [600, 1000],
    'acima-1000': [1000, Infinity],
  }
  return map[orcamento] || null
}

export function getColorFilter(cor: string): string[] | null {
  const neutras = ['#F5F5F5', '#C0C0C0', '#808080', '#FFFFFF', '#F5E6CA']
  const escuras = ['#1a1a1a', '#000000', '#2a1a3a']
  const coloridas = ['#FFD700', '#FF69B4', '#87CEEB', '#FF2020']
  const map: Record<string, string[]> = {
    neutras,
    escuras,
    coloridas,
  }
  return map[cor] || null
}