import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso | Freitas Outlet',
}

export default function TermosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-heading font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-8">
        Termos de Uso
      </h1>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-heading font-bold text-base text-black mb-2">1. Aceitação</h2>
          <p>Ao utilizar o site Freitas Outlet, você declara estar de acordo com estes termos. Se não concordar, não utilize nossos serviços.</p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-base text-black mb-2">2. Produtos</h2>
          <p>Todos os produtos anunciados são 100% originais. As imagens são meramente ilustrativas. Cores e dimensões podem variar ligeiramente conforme o lote e a calibragem do monitor.</p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-base text-black mb-2">3. Preços e Pagamento</h2>
          <p>Os preços podem ser alterados sem aviso prévio. O pedido é confirmado apenas após a aprovação do pagamento pela instituição financeira.</p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-base text-black mb-2">4. Entrega</h2>
          <p>O prazo de entrega começa a contar após a confirmação do pagamento. A Freitas Outlet não se responsabiliza por atrasos decorrentes de grepostais ou casos fortuitos.</p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-base text-black mb-2">5. Troca e Devolução</h2>
          <p>O cliente tem até 7 dias para desistir da compra (CDC Art. 49) e até 30 dias para solicitar troca por defeito. O produto deve estar em perfeito estado, com etiquetas e embalagem original.</p>
        </section>

        <p className="text-xs pt-4 border-t border-border">Última atualização: Julho de 2026.</p>
      </div>
    </div>
  )
}
