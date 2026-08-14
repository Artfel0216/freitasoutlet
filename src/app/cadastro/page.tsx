'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function CadastroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const password = form.get('password') as string
    const confirm = form.get('confirmPassword') as string

    if (password !== confirm) {
      setError('As senhas não conferem')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          phone: form.get('phone'),
          password,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar')

      router.push('/minha-conta')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16 lg:py-24">
      <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-2 text-center">Criar Conta</h1>
      <p className="text-sm text-muted-foreground mb-8 text-center">Cadastre-se para acompanhar seus pedidos e salvar seu endereço.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wider mb-1">Nome</label>
          <input id="name" name="name" type="text" required autoComplete="name"
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider mb-1">E-mail</label>
          <input id="email" name="email" type="email" required autoComplete="email"
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs font-medium uppercase tracking-wider mb-1">Telefone</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel"
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wider mb-1">Senha</label>
          <input id="password" name="password" type="password" required minLength={6} autoComplete="new-password"
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-medium uppercase tracking-wider mb-1">Confirmar Senha</label>
          <input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} autoComplete="new-password"
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <Button variant="primary" size="lg" fullWidth type="submit" disabled={loading}>
          {loading ? 'CADASTRANDO...' : 'CRIAR CONTA'}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-6">
        Já tem conta?{' '}
        <Link href="/login" className="underline hover:no-underline">Entrar</Link>
      </p>
    </div>
  )
}
