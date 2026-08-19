import Link from 'next/link'
import { NewsletterForm } from '@/components/NewsletterForm'

const footerLinks = {
  Categorias: [
    { label: 'Calçados Masculinos', href: '/categorias/calcados-masculinos' },
    { label: 'Vestuário Premium', href: '/categorias/vestuario-premium' },
    { label: 'Futebol & Performance', href: '/categorias/futebol-performance' },
    { label: 'Acessórios', href: '/categorias/acessorios' },
  ],
  Marcas: [
    { label: 'Nike', href: '/marcas/nike' },
    { label: 'Adidas', href: '/marcas/adidas' },
    { label: 'Gucci', href: '/marcas/gucci' },
    { label: 'Alexander McQueen', href: '/marcas/alexander-mcqueen' },
    { label: 'Hugo Boss', href: '/marcas/hugo-boss' },
    { label: 'Louis Vuitton', href: '/marcas/louis-vuitton' },
  ],
  Ajuda: [
    { label: 'Guia de Medidas', href: '/guia-de-medidas' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Fale Conosco', href: '/contato' },
    { label: 'Blog', href: '/blog' },
    { label: 'Rastrear Pedido', href: '/rastrear-pedido' },
    { label: 'Trocas e Devoluções', href: '/trocas-e-devolucoes' },
    { label: 'Catálogo de Imagens', href: '/catalogo-imagens' },
    { label: 'Catálogo de Chuteiras', href: '/catalogo-imagens?categoria=Chuteiras' },
    { label: 'Política de Privacidade', href: '/politica-de-privacidade' },
    { label: 'Termos de Uso', href: '/termos-de-uso' },
  ],
}

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/freitasoutlet', icon: 'instagram' },
  { label: 'WhatsApp', href: 'https://wa.me/5511999999999', icon: 'whatsapp' },
  { label: 'YouTube', href: 'https://youtube.com/@freitasoutlet', icon: 'youtube' },
]

const paymentMethods = ['VISA', 'MC', 'ELO', 'AMEX', 'PIX', 'BOLETO']

function FooterIcon({ type }: { type: string }) {
  switch (type) {
    case 'instagram':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      )
    case 'whatsapp':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      )
    case 'youtube':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
        </svg>
      )
    default:
      return null
  }
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 pt-12 lg:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-heading font-black text-xl uppercase tracking-wider text-gold mb-4 relative inline-block">
              Freitas Outlet
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sua loja multimarcas premium. O luxo mais acessível em um só lugar.
            </p>
            <NewsletterForm />
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider mb-4 text-muted-foreground">
                {title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider mb-4 text-muted-foreground">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-gold hover:border-gold transition-all"
                  aria-label={social.label}
                >
                  <FooterIcon type={social.icon} />
                  <span className="absolute sr-only">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider mb-4 text-muted-foreground">
              Formas de Pagamento
            </h4>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold bg-white border border-border text-foreground"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider mb-4 text-muted-foreground">
              Segurança
            </h4>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                SSL Seguro
              </span>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Site Protegido
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex gap-4">
            <Link href="/politica-de-privacidade" className="hover:text-gold transition-colors">Privacidade</Link>
            <Link href="/termos-de-uso" className="hover:text-gold transition-colors">Termos de Uso</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Freitas Outlet. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}