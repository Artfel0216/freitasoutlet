'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { products as allProducts } from '@/data/products'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/Button'
import { fadeUp, staggerItem, stagger } from '@/components/animations'

type QuizAnswer = string | null

const steps = [
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

function mapEstiloToCategories(estilo: string): string[] {
  const map: Record<string, string[]> = {
    casual: ['casuais-m', 'casuais-f'],
    esportivo: ['esportivos-m', 'esportivos-f'],
    corrida: ['esportivos-m', 'corrida-m'],
    'sneaker-hype': ['sneakers-hype-m'],
  }
  return map[estilo] || []
}

function mapOcasiaoToCategories(ocasiao: string): string[] {
  const map: Record<string, string[]> = {
    'dia-a-dia': ['casuais-m', 'casuais-f', 'esportivos-m', 'esportivos-f'],
    academia: ['esportivos-m', 'esportivos-f'],
    futebol: ['chuteiras-campo', 'futebol-performance'],
    eventos: ['sneakers-hype-m'],
  }
  return map[ocasiao] || []
}

function getPriceRange(orcamento: string): [number, number] | null {
  const map: Record<string, [number, number]> = {
    'ate-300': [0, 300],
    '300-600': [300, 600],
    '600-1000': [600, 1000],
    'acima-1000': [1000, Infinity],
  }
  return map[orcamento] || null
}

function getColorFilter(cor: string): string[] | null {
  const neutras = ['#F5F5F5', '#C0C0C0', '#808080', '#FFFFFF', '#F5E6CA']
  const escuras = ['#1a1a1a', '#000000', '#2a1a3a']
  const coloridas = ['#FFD700', '#FF69B4', '#87CEEB', '#FF2020']
  const map: Record<string, string[]> = {
    neutras: neutras,
    escuras: escuras,
    coloridas: coloridas,
  }
  return map[cor] || null
}

export default function QuizPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({})
  const [showResults, setShowResults] = useState(false)

  const currentStep = steps[step]
  const progress = ((step) / steps.length) * 100

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentStep.key]: value }
    setAnswers(newAnswers)

    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      setAnswers(newAnswers)
      setShowResults(true)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleRestart = () => {
    setStep(0)
    setAnswers({})
    setShowResults(false)
  }

  const filteredProducts = useMemo(() => {
    if (!showResults) return []
    const estilo = answers.estilo
    const orcamento = answers.orcamento
    const cor = answers.cor
    const ocasiao = answers.ocasiao

    let result = [...allProducts]

    if (estilo) {
      const catSlugs = mapEstiloToCategories(estilo)
      if (catSlugs.length > 0) {
        result = result.filter((p) => catSlugs.includes(p.category.slug) || catSlugs.includes(p.category.parentId || ''))
      }
    }

    if (ocasiao) {
      const catSlugs = mapOcasiaoToCategories(ocasiao)
      if (catSlugs.length > 0) {
        result = result.filter((p) => catSlugs.includes(p.category.slug) || catSlugs.includes(p.category.parentId || ''))
      }
    }

    if (orcamento) {
      const range = getPriceRange(orcamento)
      if (range) {
        result = result.filter((p) => p.price >= range[0] && p.price < range[1])
      }
    }

    if (cor && cor !== 'tanto-faz') {
      const colorHexes = getColorFilter(cor)
      if (colorHexes) {
        result = result.filter((p) => p.colors.some((c) => colorHexes.includes(c.hex)))
      }
    }

    return result
  }, [answers, showResults])

  if (showResults) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Quiz Finalizado
          </p>
          <h1 className="font-heading font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-3">
            {filteredProducts.length > 0 ? 'Recomendados para você' : 'Nenhum resultado encontrado'}
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            {filteredProducts.length > 0
              ? 'Baseado nas suas respostas, selecionamos os melhores produtos para você.'
              : 'Tente novamente com respostas diferentes.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={handleRestart}>
              REFAZER QUIZ
            </Button>
            <Link href="/produtos">
              <Button variant="ghost" size="sm">VER TODOS OS PRODUTOS</Button>
            </Link>
          </div>
        </motion.div>

        {filteredProducts.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <ProductGrid products={filteredProducts} />
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="mb-8 text-center">
        <p className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Encontre o Tênis Perfeito
        </p>
        <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter">
          {currentStep.title}
        </h1>
      </div>

      <div className="w-full bg-muted h-1 mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-black"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      <div className="text-center mb-8">
        <span className="text-xs text-muted-foreground">
          Passo {step + 1} de {steps.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {currentStep.options.map((option, i) => (
            <motion.button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="w-full text-left p-4 lg:p-5 border border-border hover:border-black hover:bg-muted transition-all group"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {'icon' in option && option.icon && <span className="text-xl">{option.icon}</span>}
                  <span className="font-heading font-bold text-base uppercase tracking-wide group-hover:underline">
                    {option.label}
                  </span>
                </div>
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={handleBack}
            className="text-sm text-muted-foreground hover:text-black underline transition-colors"
          >
            Voltar
          </button>
        </motion.div>
      )}
    </div>
  )
}
