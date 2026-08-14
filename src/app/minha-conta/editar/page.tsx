'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function EditarPerfilPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const form = new FormData(e.currentTarget)
    const data: Record<string, string> = {}
    form.forEach((value, key) => { data[key] = value as string })

    if (data.newPassword && data.newPassword !== data.confirmPassword) {
      setMessage('As senhas não conferem')
      setSaving(false)
      return
    }

    try {
      const res = await fetch('/api/cliente/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          currentPassword: data.currentPassword || undefined,
          newPassword: data.newPassword || undefined,
        }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Erro ao salvar')

      setMessage('Dados atualizados com sucesso!')
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12 lg:py-20">
      <Link href="/minha-conta" className="text-xs underline hover:no-underline mb-6 inline-block">&larr; VOLTAR</Link>
      <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-8">Editar Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <hr className="border-border" />

        <p className="text-xs text-muted-foreground">Deixe em branco para manter a senha atual.</p>
        <div>
          <label htmlFor="currentPassword" className="block text-xs font-medium uppercase tracking-wider mb-1">Senha Atual</label>
          <input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password"
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-xs font-medium uppercase tracking-wider mb-1">Nova Senha</label>
          <input id="newPassword" name="newPassword" type="password" minLength={6} autoComplete="new-password"
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-medium uppercase tracking-wider mb-1">Confirmar Nova Senha</label>
          <input id="confirmPassword" name="confirmPassword" type="password" minLength={6} autoComplete="new-password"
            className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>

        {message && (
          <p className={`text-sm ${message.includes('sucesso') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>
        )}

        <Button variant="primary" size="lg" type="submit" disabled={saving}>
          {saving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
        </Button>
      </form>
    </div>
  )
}
