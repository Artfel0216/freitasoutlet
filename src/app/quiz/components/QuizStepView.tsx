'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { steps, type QuizStep } from '../quiz-data'

interface QuizStepViewProps {
  step: number
  currentStep: QuizStep
  progress: number
  onAnswer: (value: string) => void
  onBack: () => void
}

export function QuizStepView({ step, currentStep, progress, onAnswer, onBack }: QuizStepViewProps) {
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
              onClick={() => onAnswer(option.value)}
              className="w-full text-left p-4 lg:p-5 border border-border hover:border-black hover:bg-muted transition-all group"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {option.icon && <span className="text-xl">{option.icon}</span>}
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
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-black underline transition-colors"
          >
            Voltar
          </button>
        </motion.div>
      )}
    </div>
  )
}