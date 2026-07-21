import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Freitas Outlet',
}

export default function PrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-heading font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-8">
        Política de Privacidade
      </h1>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-heading font-bold text-base text-black mb-2">1. Coleta de Dados</h2>
          <p>Coletamos os seguintes dados pessoais durante a navegação e compra: nome, CPF, e-mail, telefone, endereço e dados de navegação (cookies).</p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-base text-black mb-2">2. Uso dos Dados</h2>
          <p>Seus dados são utilizados exclusivamente para: processar pedidos, realizar entregas, enviar confirmações de compra, melhorar sua experiência de navegação e cumprir obrigações legais.</p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-base text-black mb-2">3. Compartilhamento</h2>
          <p>Não compartilhamos seus dados com terceiros não essenciais ao serviço. Parceiros de logística e pagamento recebem apenas os dados necessários para a operação.</p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-base text-black mb-2">4. Segurança</h2>
          <p>Utilizamos criptografia SSL/TLS, tokenização de dados sensíveis e monitoramento contínuo para proteger suas informações contra acessos não autorizados.</p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-base text-black mb-2">5. Seus Direitos (LGPD)</h2>
          <p>Você pode solicitar a qualquer momento: acesso, correção, exclusão, portabilidade ou revogação do consentimento dos seus dados. Envie um e-mail para contato@freitasoutlet.com.br.</p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-base text-black mb-2">6. Cookies</h2>
          <p>Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para melhorar sua experiência. Você pode gerenciar as preferências de cookie nas configurações do seu navegador.</p>
        </section>

        <p className="text-xs pt-4 border-t border-border">Última atualização: Julho de 2026.</p>
      </div>
    </div>
  )
}
