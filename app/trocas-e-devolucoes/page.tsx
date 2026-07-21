import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trocas e Devoluções | Freitas Outlet',
  description: 'Política de trocas e devoluções da Freitas Outlet. Saiba como proceder.',
}

export default function TrocasDevolucoesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-heading font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-8">
        Trocas e Devoluções
      </h1>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-heading font-bold text-lg uppercase tracking-tight text-black mb-3">
            Prazo para Troca ou Devolução
          </h2>
          <p className="mb-4">
            Você tem até <strong className="text-black">30 dias corridos</strong> a partir da data de recebimento do produto para solicitar troca ou devolução.
          </p>
          <p>
            Para produtos com defeito de fabricação, o prazo é de <strong className="text-black">90 dias</strong> conforme o Código de Defesa do Consumidor.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-lg uppercase tracking-tight text-black mb-3">
            Condições para Troca/Devolução
          </h2>
          <ul className="space-y-3 list-disc pl-5">
            <li>O produto deve estar em <strong className="text-black">perfeitas condições</strong>, sem sinais de uso</li>
            <li>Todas as <strong className="text-black">etiquetas e embalagens originais</strong> devem estar intactas</li>
            <li>Produtos <strong className="text-black">personalizados</strong> ou sob encomenda não podem ser trocados</li>
            <li>Acessórios de higiene (como meias) não são passíveis de devolução por motivo de saúde</li>
            <li>O produto não pode apresentar sinais de lavagem, uso ou alterações</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading font-bold text-lg uppercase tracking-tight text-black mb-3">
            Como Solicitar
          </h2>
          <ol className="space-y-3 list-decimal pl-5">
            <li>
              <strong className="text-black">Entre em contato</strong> pelo e-mail <a href="mailto:trocas@freitasoutlet.com.br" className="underline">trocas@freitasoutlet.com.br</a> ou pelo WhatsApp
            </li>
            <li>
              Informe o <strong className="text-black">número do pedido</strong>, o motivo da troca/devolução e fotos do produto
            </li>
            <li>
              Nossa equipe analisará a solicitação em até <strong className="text-black">2 dias úteis</strong> e fornecerá as instruções para envio
            </li>
            <li>
              O <strong className="text-black">frete de devolução</strong> para defeito de fabricação é por nossa conta. Para arrependimento, o frete fica a cargo do cliente
            </li>
            <li>
              Após recebermos e conferirmos o produto, o <strong className="text-black">reembolso</strong> será processado em até 7 dias úteis
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-heading font-bold text-lg uppercase tracking-tight text-black mb-3">
            Reembolso
          </h2>
          <p className="mb-4">
            O reembolso é realizado pela <strong className="text-black">mesma forma de pagamento</strong> utilizada na compra:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-black">PIX:</strong> Devolução na chave PIX utilizada (até 5 dias úteis)</li>
            <li><strong className="text-black">Cartão de crédito:</strong> Estorno na fatura (até 2 faturas)</li>
            <li><strong className="text-black">Boleto:</strong> Transferência bancária (até 10 dias úteis)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading font-bold text-lg uppercase tracking-tight text-black mb-3">
            Troca por Tamanho
          </h2>
          <p>
            Se o produto não serviu, podemos trocar por outro tamanho disponível. Consulte nosso <a href="/guia-de-medidas" className="underline font-medium text-black">Guia de Medidas</a> antes de solicitar a troca para garantir que o novo tamanho atenda suas necessidades.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-lg uppercase tracking-tight text-black mb-3">
            Produto com Defeito
          </h2>
          <p>
            Caso o produto apresente defeito de fabricação, entre em contato imediatamente. Forneceremos opções de <strong className="text-black">troca, reembolso ou crédito na loja</strong> com valor acrescido de 10%.
          </p>
        </section>
      </div>
    </div>
  )
}
