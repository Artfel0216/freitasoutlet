import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline - Freitas Outlet',
}

export default function OfflinePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="font-heading font-black text-3xl uppercase tracking-tighter mb-4">Você está offline</h1>
      <p className="text-muted-foreground mb-8">
        Conecte-se à internet para continuar navegando na Freitas Outlet.
      </p>
      <Link href="/" className="text-sm font-medium underline hover:no-underline">
        Voltar para o início
      </Link>
    </div>
  )
}
