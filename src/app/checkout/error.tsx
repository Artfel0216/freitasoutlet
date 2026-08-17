'use client'

export default function ErrorPage({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
      <p className="font-heading font-black text-8xl lg:text-9xl text-muted mb-4">500</p>
      <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-4">
        Erro no checkout
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Ocorreu um erro ao processar seu checkout. Tente novamente ou entre em contato.
      </p>
      <button onClick={reset} className="px-8 py-3 bg-black text-white text-sm font-medium hover:bg-black/90">
        TENTAR NOVAMENTE
      </button>
    </div>
  )
}
