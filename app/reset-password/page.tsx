'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-4">Link Inválido</h1>
        <p className="text-sm text-muted-foreground mb-6">Este link de redefinição de senha é inválido ou expirou.</p>
        <Link href="/login">
          <Button variant="primary">VOLTAR AO LOGIN</Button>
        </Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao redefinir senha')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Erro ao redefinir senha')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>
        <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-4">Senha Redefinida!</h1>
        <p className="text-sm text-muted-foreground mb-6">Sua senha foi alterada com sucesso. Faça login para continuar.</p>
        <Link href="/login">
          <Button variant="primary">FAZER LOGIN</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 lg:py-20">
      <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-2">Redefinir Senha</h1>
      <p className="text-sm text-muted-foreground mb-8">Digite sua nova senha abaixo.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-1">Nova Senha</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
            placeholder="Mínimo 8 caracteres"
            required
            minLength={8}
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-1">Confirmar Senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
            placeholder="Repita a senha"
            required
            minLength={8}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Button variant="primary" size="lg" fullWidth type="submit" disabled={loading}>
          {loading ? 'REDEFININDO...' : 'REDEFINIR SENHA'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-xs text-muted-foreground hover:text-black underline">Voltar ao login</Link>
      </div>
    </div>
  )
}
