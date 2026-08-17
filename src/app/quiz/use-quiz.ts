'use client'

import { useMemo, useState } from 'react'
import { products as allProducts } from '@/data/products'
import {
  steps,
  getColorFilter,
  getPriceRange,
  mapEstiloToCategories,
  mapOcasiaoToCategories,
  type QuizAnswer,
} from './quiz-data'

export interface QuizController {
  step: number
  currentStep: (typeof steps)[number]
  progress: number
  showResults: boolean
  filteredProducts: typeof allProducts
  handleAnswer: (value: string) => void
  handleBack: () => void
  handleRestart: () => void
}

export function useQuiz(): QuizController {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({})
  const [showResults, setShowResults] = useState(false)

  const currentStep = steps[step]
  const progress = (step / steps.length) * 100

  function handleAnswer(value: string) {
    const newAnswers = { ...answers, [currentStep.key]: value }
    setAnswers(newAnswers)

    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      setAnswers(newAnswers)
      setShowResults(true)
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1)
  }

  function handleRestart() {
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
        result = result.filter(
          (p) => catSlugs.includes(p.category.slug) || catSlugs.includes(p.category.parentId || ''),
        )
      }
    }

    if (ocasiao) {
      const catSlugs = mapOcasiaoToCategories(ocasiao)
      if (catSlugs.length > 0) {
        result = result.filter(
          (p) => catSlugs.includes(p.category.slug) || catSlugs.includes(p.category.parentId || ''),
        )
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

  return {
    step,
    currentStep,
    progress,
    showResults,
    filteredProducts,
    handleAnswer,
    handleBack,
    handleRestart,
  }
}