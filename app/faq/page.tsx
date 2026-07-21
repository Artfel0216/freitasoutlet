import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | Freitas Outlet',
  description: 'Perguntas frequentes sobre pedidos, pagamentos, entregas, trocas e muito mais.',
}

const faqItems = [
  {
    q: 'Os produtos são originais?',
    a: 'Sim. Trabalhamos apenas com produtos 100% originais importados. Cada item passa por verificação de autenticidade antes de ser enviado.',
  },
  {
    q: 'Quanto tempo leva a entrega?',
    a: 'O prazo varia de 7 a 20 dias úteis, dependendo da região. O código de rastreio é enviado no e-mail após a postagem.',
  },
  {
    q: 'Como faço para trocar um produto?',
    a: 'Entre em contato pelo formulário de contato em até 30 dias após o recebimento. O produto deve estar com etiquetas e sem sinais de uso.',
  },
  {
    q: 'Quais as formas de pagamento?',
    a: 'Aceitamos Pix (aprovação instantânea), cartão de crédito (parcelamos em até 12x sem juros) e cartão de débito.',
  },
  {
    q: 'O frete é gratuito?',
    a: 'Sim, para pedidos acima de R$ 299,00. Para valores inferiores, o frete é calculado no checkout com base no CEP.',
  },
  {
    q: 'Posso cancelar meu pedido?',
    a: 'Sim, desde que o pedido ainda não tenha sido postado. Após a postagem, é necessário aguardar o recebimento e solicitar devolução.',
  },
  {
    q: 'Como funciona o PIX?',
    a: 'Após finalizar o pedido, um QR Code é gerado para pagamento. O pedido é confirmado automaticamente assim que o pagamento é identificado.',
  },
  {
    q: 'Meus dados estão seguros?',
    a: 'Sim. Utilizamos criptografia SSL, tokenização de dados sensíveis e seguimos rigorosamente a LGPD. Seus dados nunca são compartilhados sem autorização.',
  },
]

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-heading font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-2">
        Perguntas Frequentes
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Tire suas principais dúvidas sobre compras, entregas e muito mais.
      </p>

      <div className="space-y-6">
        {faqItems.map((item, i) => (
          <div key={i}>
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-black mb-2">
              {item.q}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
