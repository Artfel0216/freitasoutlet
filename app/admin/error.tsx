'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="text-center py-20">
      <p className="font-heading font-black text-6xl text-muted mb-4">500</p>
      <h1 className="font-heading font-black text-xl uppercase tracking-tighter mb-4">
        Erro no admin
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">
        Ocorreu um erro inesperado. Tente novamente.
      </p>
      <button onClick={reset} className="px-8 py-3 bg-black text-white text-sm font-medium hover:bg-black/90">
        TENTAR NOVAMENTE
      </button>
      {error.digest && (
        <p className="text-xs text-muted-foreground mt-8">Código: {error.digest}</p>
      )}
    </div>
  )
}
