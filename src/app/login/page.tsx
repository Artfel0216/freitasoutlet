'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

type LoginMode = 'cliente' | 'admin'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<LoginMode>('cliente')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCustomerSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget as HTMLFormElement)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password'),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao entrar')

      router.push('/minha-conta')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdminSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget as HTMLFormElement)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: form.get('adminPassword'),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Senha inválida')

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16 lg:py-24">
      <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-2 text-center">Entrar</h1>
      <p className="text-sm text-muted-foreground mb-8 text-center">
        {mode === 'cliente' ? 'Acesse sua conta para acompanhar pedidos e gerenciar endereços.' : 'Acesse o painel administrativo da loja.'}
      </p>

      <div className="flex border border-border mb-8">
        <button
          type="button"
          onClick={() => { setMode('cliente'); setError('') }}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            mode === 'cliente' ? 'bg-black text-white' : 'bg-white text-black hover:bg-muted'
          }`}
        >
          Cliente
        </button>
        <button
          type="button"
          onClick={() => { setMode('admin'); setError('') }}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            mode === 'admin' ? 'bg-black text-white' : 'bg-white text-black hover:bg-muted'
          }`}
        >
          Administrador
        </button>
      </div>

      {mode === 'cliente' && (
        <form onSubmit={handleCustomerSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider mb-1">E-mail</label>
            <input id="email" name="email" type="email" required autoComplete="email"
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wider mb-1">Senha</label>
            <input id="password" name="password" type="password" required autoComplete="current-password"
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>

          <div className="flex justify-end">
            <Link href="/esqueci-senha" className="text-xs underline hover:no-underline">Esqueci minha senha</Link>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button variant="primary" size="lg" fullWidth type="submit" disabled={loading}>
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </Button>
        </form>
      )}

      {mode === 'admin' && (
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div>
            <label htmlFor="adminPassword" className="block text-xs font-medium uppercase tracking-wider mb-1">Senha de Administrador</label>
            <input id="adminPassword" name="adminPassword" type="password" required autoComplete="current-password"
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button variant="primary" size="lg" fullWidth type="submit" disabled={loading}>
            {loading ? 'ENTRANDO...' : 'ACESSAR ADMIN'}
          </Button>
        </form>
      )}

      {mode === 'cliente' && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">ou</span></div>
          </div>

          <button onClick={() => toast.info('Login com Google será disponível em breve!')} className="w-full border border-border px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Entrar com Google
          </button>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Ainda não tem conta?{' '}
            <Link href="/cadastro" className="underline hover:no-underline">Cadastre-se</Link>
          </p>
        </>
      )}
    </div>
  )
}
