import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
      <p className="font-heading font-black text-8xl lg:text-9xl text-muted mb-4">404</p>
      <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-4">
        Página não encontrada
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        A página que você procura não existe, foi removida ou está temporariamente indisponível.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/"><Button variant="primary" size="lg">VOLTAR AO INÍCIO</Button></Link>
        <Link href="/produtos"><Button variant="outline" size="lg">VER PRODUTOS</Button></Link>
      </div>
    </div>
  )
}
