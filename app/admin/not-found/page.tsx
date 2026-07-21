import Link from 'next/link'

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="font-heading font-black text-4xl uppercase tracking-tighter mb-4">404</h1>
      <p className="text-muted-foreground mb-8">Página não encontrada no painel administrativo.</p>
      <Link href="/admin" className="bg-black text-white px-6 py-3 text-sm font-heading font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">
        VOLTAR AO ADMIN
      </Link>
    </div>
  )
}
