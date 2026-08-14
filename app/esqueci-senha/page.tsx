'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao solicitar redefinição de senha')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Erro ao solicitar redefinição de senha')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-4">Verifique seu e-mail</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Se existir uma conta cadastrada com este e-mail, enviaremos um link para redefinir sua senha.
        </p>
        <Link href="/login">
          <Button variant="primary">VOLTAR AO LOGIN</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 lg:py-20">
      <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-2">Esqueci Minha Senha</h1>
      <p className="text-sm text-muted-foreground mb-8">Digite seu e-mail e enviaremos um link para redefinir sua senha.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider mb-1">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
            placeholder="seu@email.com"
            required
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Button variant="primary" size="lg" fullWidth type="submit" disabled={loading}>
          {loading ? 'ENVIANDO...' : 'ENVIAR LINK'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-xs text-muted-foreground hover:text-black underline">Voltar ao login</Link>
      </div>
    </div>
  )
}
