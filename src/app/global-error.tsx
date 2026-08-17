'use client'

import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="min-h-screen bg-background font-sans text-foreground antialiased">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
            <p className="font-heading font-black text-8xl lg:text-9xl text-muted mb-4">500</p>
            <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-4">
              Erro interno
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Ocorreu um erro inesperado. Nossa equipe foi notificada e estamos trabalhando para resolver.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={reset}
                className="bg-black text-white text-sm font-medium uppercase tracking-wider px-6 py-3 hover:bg-black/80 transition-colors"
              >
                TENTAR NOVAMENTE
              </button>
              <Link
                href="/"
                className="text-sm font-medium uppercase tracking-wider border border-border px-6 py-3 inline-block hover:bg-muted transition-colors"
              >
                VOLTAR AO INÍCIO
              </Link>
            </div>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-8">Código: {error.digest}</p>
            )}
          </div>
        </main>
      </body>
    </html>
  )
}
