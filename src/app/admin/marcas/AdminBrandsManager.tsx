'use client'

import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import type { Brand } from '@/types'
import type { StoredBrand } from '@/lib/admin-brands'

interface AdminBrandsManagerProps {
  brands: (Brand | StoredBrand)[]
}

const segments = [
  { value: 'sportswear', label: 'Sportswear' },
  { value: 'premium', label: 'Premium' },
  { value: 'high-end', label: 'High-End' },
  { value: 'streetwear', label: 'Streetwear' },
]

function isStored(brand: Brand | StoredBrand): brand is StoredBrand {
  return 'createdAt' in brand
}

export function AdminBrandsManager({ brands }: AdminBrandsManagerProps) {
  const [name, setName] = useState('')
  const [segment, setSegment] = useState('premium')
  const [loading, setLoading] = useState(false)
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), segment }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao criar marca')
      }
      toast.success('Marca cadastrada com sucesso')
      setName('')
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar marca')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(slug: string) {
    setDeletingSlug(slug)
    try {
      const res = await fetch('/api/admin/brands', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao excluir marca')
      }
      toast.success('Marca excluída')
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir marca')
    } finally {
      setDeletingSlug(null)
    }
  }

  return (
    <div className="space-y-8">
      <motion.form
        onSubmit={handleCreate}
        className="border border-border bg-white p-6 space-y-4 rounded-sm shadow-card max-w-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-heading font-bold text-sm uppercase tracking-wider">Cadastrar Nova Marca</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1">Nome da Marca *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Oakley"
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1">Segmento</label>
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background"
            >
              {segments.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Button variant="primary" size="sm" type="submit" disabled={loading}>
            {loading ? 'SALVANDO...' : 'SALVAR MARCA'}
          </Button>
        </div>
      </motion.form>

      <div className="border border-border bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Marca</th>
              <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Segmento</th>
              <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Origem</th>
              <th className="text-right px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand, i) => (
              <motion.tr
                key={brand.slug}
                className="border-b border-border/50 hover:bg-muted/30 transition-opacity"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02, duration: 0.25 }}
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{brand.name}</p>
                  <p className="text-xs text-muted-foreground">{brand.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {segments.find((s) => s.value === brand.segment)?.label || brand.segment}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 font-medium ${isStored(brand) ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground'}`}>
                    {isStored(brand) ? 'Cadastrada' : 'Padrão'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(brand.slug)}
                    disabled={!isStored(brand) || deletingSlug === brand.slug}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {deletingSlug === brand.slug ? 'Excluindo...' : 'Excluir'}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {brands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma marca cadastrada.</p>
          </div>
        )}
      </div>
    </div>
  )
}
