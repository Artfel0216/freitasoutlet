'use client'

import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        const data = await res.json().catch(() => null)
        toast.error(data?.error || 'Não foi possível fazer o cadastro')
      }
    } catch {
      toast.error('Não foi possível fazer o cadastro')
    } finally {
      setLoading(false)
    }
  }

  if (sent) return <p className="text-sm text-white/70">Cadastrado! Fique de olho no e-mail.</p>

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Seu melhor e-mail"
        required
        className="flex-1 px-3 py-2 text-sm text-black focus:outline-none"
        aria-label="E-mail para newsletter"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-white text-black px-4 py-2 text-sm font-heading font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? '...' : 'OK'}
      </button>
    </form>
  )
}
