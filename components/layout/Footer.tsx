import Link from 'next/link'
import { NewsletterForm } from '@/components/NewsletterForm'

export function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading font-black text-lg uppercase tracking-wider mb-4">Freitas Outlet</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              Sua loja multimarcas premium. Streetwear, luxo e performance esportiva em um só lugar.
            </p>
            <NewsletterForm />
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">Categorias</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/categorias/calcados-masculinos" className="hover:text-white transition-colors">Calçados Masculinos</Link></li>
              <li><Link href="/categorias/vestuario-premium" className="hover:text-white transition-colors">Vestuário Premium</Link></li>
              <li><Link href="/categorias/futebol-performance" className="hover:text-white transition-colors">Futebol & Performance</Link></li>
              <li><Link href="/categorias/acessorios" className="hover:text-white transition-colors">Acessórios</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">Marcas</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/marcas/nike" className="hover:text-white transition-colors">Nike</Link></li>
              <li><Link href="/marcas/adidas" className="hover:text-white transition-colors">Adidas</Link></li>
              <li><Link href="/marcas/gucci" className="hover:text-white transition-colors">Gucci</Link></li>
              <li><Link href="/marcas/alexander-mcqueen" className="hover:text-white transition-colors">Alexander McQueen</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">Ajuda</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/guia-de-medidas" className="hover:text-white transition-colors">Guia de Medidas</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contato" className="hover:text-white transition-colors">Fale Conosco</Link></li>
              <li><Link href="/sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
              <li><Link href="/rastrear-pedido" className="hover:text-white transition-colors">Rastrear Pedido</Link></li>
              <li><Link href="/trocas-e-devolucoes" className="hover:text-white transition-colors">Trocas e Devoluções</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com/freitasoutlet" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
              <a href="https://youtube.com/@freitasoutlet" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">Formas de Pagamento</h4>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold bg-white/10 text-white/80">VISA</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold bg-white/10 text-white/80">MC</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold bg-white/10 text-white/80">ELO</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold bg-white/10 text-white/80">AMEX</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold bg-white/10 text-white/80">PIX</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold bg-white/10 text-white/80">BOLETO</span>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">Segurança</h4>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 text-xs text-white/70">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                SSL Seguro
              </span>
              <span className="inline-flex items-center gap-2 text-xs text-white/70">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Site Protegido
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex gap-4">
            <Link href="/politica-de-privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Freitas Outlet. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
