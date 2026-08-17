'use client'

import { useQuiz } from './use-quiz'
import { QuizResults } from './components/QuizResults'
import { QuizStepView } from './components/QuizStepView'

export default function QuizPage() {
  const quiz = useQuiz()

  if (quiz.showResults) {
    return <QuizResults filteredProducts={quiz.filteredProducts} onRestart={quiz.handleRestart} />
  }

  return (
    <QuizStepView
      step={quiz.step}
      currentStep={quiz.currentStep}
      progress={quiz.progress}
      onAnswer={quiz.handleAnswer}
      onBack={quiz.handleBack}
    />
  )
}