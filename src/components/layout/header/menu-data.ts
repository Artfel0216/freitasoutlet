export interface MenuItem {
  label: string
  href: string
}

export const menuItems: MenuItem[] = [
  { label: 'Calçados Masculinos', href: '/categorias/calcados-masculinos' },
  { label: 'Vestuário Premium', href: '/categorias/vestuario-premium' },
  { label: 'Futebol & Performance', href: '/categorias/futebol-performance' },
  { label: 'Acessórios', href: '/categorias/acessorios' },
  { label: 'Modelos', href: '/modelos' },
  { label: 'Marcas', href: '/produtos?marcas=all' },
  { label: 'Quiz', href: '/quiz' },
]

export const megaCategorias: MenuItem[] = [
  { label: 'Calçados Masculinos', href: '/categorias/calcados-masculinos' },
  { label: 'Vestuário Premium', href: '/categorias/vestuario-premium' },
  { label: 'Futebol & Performance', href: '/categorias/futebol-performance' },
  { label: 'Acessórios', href: '/categorias/acessorios' },
  { label: 'Modelos', href: '/modelos' },
]

export const megaMarcas: MenuItem[] = [
  { label: 'Nike', href: '/produtos?marca=nike' },
  { label: 'Adidas', href: '/produtos?marca=adidas' },
  { label: 'Gucci', href: '/produtos?marca=gucci' },
  { label: 'Alexander McQueen', href: '/produtos?marca=alexander-mcqueen' },
  { label: 'Hugo Boss', href: '/produtos?marca=hugo-boss' },
  { label: 'Louis Vuitton', href: '/produtos?marca=louis-vuitton' },
]

export const megaAjuda: MenuItem[] = [
  { label: 'Programa de Fidelidade', href: '/fidelidade' },
  { label: 'Guia Interativo', href: '/quiz' },
  { label: 'Guia de Medidas', href: '/guia-de-medidas' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Fale Conosco', href: '/contato' },
  { label: 'Blog', href: '/blog' },
  { label: 'Rastrear Pedido', href: '/rastrear-pedido' },
  { label: 'Trocas e Devoluções', href: '/trocas-e-devolucoes' },
]