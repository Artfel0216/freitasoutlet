'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'

export default function ContatoPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form)
    data.message = `[${data.subject}] ${data.message}`
    try {
      await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setSent(true)
    } catch {
      
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-4">Mensagem Enviada!</h1>
        <p className="text-muted-foreground">Recebemos sua mensagem e responderemos em até 24h úteis.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-heading font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-2">Contato</h1>
      <p className="text-sm text-muted-foreground mb-8">Tire suas dúvidas, envie sugestões ou fale com nosso time.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wider mb-1">Nome</label>
            <input id="name" name="name" required type="text"
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider mb-1">E-mail</label>
            <input id="email" name="email" required type="email"
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-xs font-medium uppercase tracking-wider mb-1">Telefone / WhatsApp</label>
            <input id="phone" name="phone" type="tel"
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label htmlFor="subject" className="block text-xs font-medium uppercase tracking-wider mb-1">Assunto</label>
            <select id="subject" name="subject" required
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-white">
              <option value="">Selecione...</option>
              <option value="duvida">Dúvida sobre produto</option>
              <option value="pedido">Pedido / Entrega</option>
              <option value="troca">Troca ou devolução</option>
              <option value="sugestao">Sugestão</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-medium uppercase tracking-wider mb-1">Mensagem</label>
          <textarea id="message" name="message" required rows={5}
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black resize-vertical" />
        </div>

        <Button variant="primary" size="lg" type="submit" disabled={loading}>
          {loading ? 'ENVIANDO...' : 'ENVIAR MENSAGEM'}
        </Button>
      </form>
    </div>
  )
}
