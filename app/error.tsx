'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
      <p className="font-heading font-black text-8xl lg:text-9xl text-muted mb-4">500</p>
      <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-4">
        Erro interno
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Ocorreu um erro inesperado. Nossa equipe foi notificada e estamos trabalhando para resolver.
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="primary" size="lg" onClick={reset}>TENTAR NOVAMENTE</Button>
        <Link href="/"><Button variant="outline" size="lg">VOLTAR AO INÍCIO</Button></Link>
      </div>
      {error.digest && (
        <p className="text-xs text-muted-foreground mt-8">Código: {error.digest}</p>
      )}
    </div>
  )
}
