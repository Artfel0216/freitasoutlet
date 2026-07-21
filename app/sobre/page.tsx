import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre Nós | Freitas Outlet',
  description: 'Conheça a história da Freitas Outlet, sua loja multimarcas premium de streetwear, luxo e performance esportiva.',
}

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-heading font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-8">
        Sobre Nós
      </h1>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-heading font-bold text-lg uppercase tracking-tight text-black mb-3">
            Nossa História
          </h2>
          <p className="mb-4">
            A Freitas Outlet nasceu da paixão por moda autêntica e da crença de que estilo não precisa ter preço fixo.
            Desde 2024, conectamos nossos clientes às marcas mais desejadas do mundo — de sportswear performance
            a alta-costura — com preços que cabem no bolso.
          </p>
          <p>
            Somos uma plataforma 100% digital especializada em produtos originais importados.
            Cada peça do nosso catálogo passa por rigorosa verificação de autenticidade antes de chegar até você.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-lg uppercase tracking-tight text-black mb-3">
            Nossa Missão
          </h2>
          <p>
            Democratizar o acesso à moda premium, oferecendo produtos 100% originais com preços competitivos,
            experiência de compra impecável e entrega para todo o Brasil.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-lg uppercase tracking-tight text-black mb-3">
            Por que comprar conosco?
          </h2>
          <ul className="space-y-3 list-disc pl-5">
            <li><strong>Produtos 100% originais</strong> — Garantia de autenticidade em cada item</li>
            <li><strong>Parcele em até 12x</strong> — Sem juros no cartão de crédito</li>
            <li><strong>Frete para todo Brasil</strong> — Entrega rápida e segura</li>
            <li><strong>Troca fácil</strong> — Em até 30 dias após o recebimento</li>
            <li><strong>Atendimento personalizado</strong> — Suporte humano e ágil</li>
          </ul>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground mb-4">Quer falar conosco?</p>
        <Link href="/contato">
          <Button variant="primary" size="lg">ENTRE EM CONTATO</Button>
        </Link>
      </div>
    </div>
  )
}
