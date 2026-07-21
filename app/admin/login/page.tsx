'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao autenticar')
      }

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-muted">
      <div className="w-full max-w-sm bg-white border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="font-heading font-black text-xl uppercase tracking-tighter">Freitas Outlet</h1>
          <p className="text-sm text-muted-foreground mt-1">Área do Administrador</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1">Senha de Acesso</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
              autoFocus
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button variant="primary" size="lg" fullWidth type="submit" disabled={loading}>
            {loading ? 'AUTENTICANDO...' : 'ENTRAR'}
          </Button>
        </form>
      </div>
    </div>
  )
}
