'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import type { Address } from '@/lib/customer-db'

type Props = {
  addresses: Address[]
  customerId: string
}

type FieldErrors = Record<string, string>

const emptyAddress = {
  label: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  isDefault: false,
}

function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

export function AddressClient({ addresses: initial }: Props) {
  const router = useRouter()
  const [addresses, setAddresses] = useState(initial)
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState(emptyAddress)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  const startNew = useCallback(() => {
    setForm(emptyAddress)
    setErrors({})
    setEditing('new')
  }, [])

  const startEdit = useCallback((addr: Address) => {
    setForm(addr)
    setErrors({})
    setEditing(addr.id)
  }, [])

  const cancel = useCallback(() => {
    setEditing(null)
    setErrors({})
  }, [])

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  function validate(): boolean {
    const errs: FieldErrors = {}
    if (!form.label.trim()) errs.label = 'Identificação é obrigatória'
    if (form.cep.replace(/\D/g, '').length !== 8) errs.cep = 'CEP inválido'
    if (form.street.trim().length < 3) errs.street = 'Endereço inválido'
    if (!form.number.trim()) errs.number = 'Número obrigatório'
    if (!form.neighborhood.trim()) errs.neighborhood = 'Bairro obrigatório'
    if (!form.city.trim()) errs.city = 'Cidade obrigatória'
    if (form.state.trim().length !== 2) errs.state = 'Estado inválido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function save() {
    if (!validate()) return
    setSaving(true)
    try {
      const isNew = editing === 'new'
      const url = isNew ? '/api/cliente/endereco' : `/api/cliente/endereco/${editing}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          cep: form.cep.replace(/\D/g, ''),
          isDefault: form.isDefault || addresses.length === 0,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao salvar')
      }

      router.refresh()
      setEditing(null)
    } catch (err) {
      setErrors({ server: err instanceof Error ? err.message : 'Erro ao salvar' })
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Remover este endereço?')) return
    try {
      const res = await fetch(`/api/cliente/endereco/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      router.refresh()
      setAddresses((prev) => prev.filter((a) => a.id !== id))
    } catch {
      setErrors({ server: 'Erro ao remover endereço' })
    }
  }

  return (
    <div className="space-y-6">
      {errors.server && (
        <p className="text-sm text-red-500">{errors.server}</p>
      )}

      {}
      {addresses.length === 0 && editing !== 'new' && (
        <div className="border border-border p-8 text-center">
          <p className="text-muted-foreground mb-4">Nenhum endereço cadastrado.</p>
          <Button variant="primary" onClick={startNew}>ADICIONAR ENDEREÇO</Button>
        </div>
      )}

      {addresses.length > 0 && editing !== 'new' && (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="border border-border p-4 sm:p-6 relative">
              {addr.isDefault && (
                <span className="absolute top-2 right-2 text-[10px] font-heading font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5">
                  Principal
                </span>
              )}
              <p className="font-heading font-bold text-sm mb-1">{addr.label}</p>
              <p className="text-sm text-muted-foreground">
                {addr.street}, {addr.number}{addr.complement ? ` — ${addr.complement}` : ''}
              </p>
              <p className="text-sm text-muted-foreground">{addr.neighborhood}, {addr.city} — {addr.state}</p>
              <p className="text-xs text-muted-foreground">CEP: {addr.cep}</p>
              <div className="flex gap-3 mt-3">
                <button onClick={() => startEdit(addr)} className="text-xs underline hover:no-underline">Editar</button>
                <button onClick={() => remove(addr.id)} className="text-xs underline hover:no-underline text-red-500">Remover</button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={startNew}>+ NOVO ENDEREÇO</Button>
        </div>
      )}

      {}
      {editing && (
        <div className="border border-border p-6 space-y-4">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider">
            {editing === 'new' ? 'Novo Endereço' : 'Editar Endereço'}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Identificação</label>
              <input type="text" value={form.label} onChange={(e) => updateField('label', e.target.value)}
                placeholder="Ex: Minha Casa, Trabalho..."
                className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.label ? 'border-red-500' : 'border-border'}`} />
              {errors.label && <p className="text-xs text-red-500 mt-1">{errors.label}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">CEP</label>
              <input type="text" value={form.cep} onChange={(e) => updateField('cep', formatCEP(e.target.value))}
                maxLength={9}
                className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.cep ? 'border-red-500' : 'border-border'}`}
                placeholder="00000-000" />
              {errors.cep && <p className="text-xs text-red-500 mt-1">{errors.cep}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Estado</label>
              <input type="text" value={form.state} onChange={(e) => updateField('state', e.target.value.toUpperCase().slice(0, 2))}
                maxLength={2} placeholder="SP"
                className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.state ? 'border-red-500' : 'border-border'}`} />
              {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Endereço</label>
              <input type="text" value={form.street} onChange={(e) => updateField('street', e.target.value)}
                className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.street ? 'border-red-500' : 'border-border'}`} />
              {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Número</label>
              <input type="text" value={form.number} onChange={(e) => updateField('number', e.target.value)}
                className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.number ? 'border-red-500' : 'border-border'}`} />
              {errors.number && <p className="text-xs text-red-500 mt-1">{errors.number}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Complemento</label>
              <input type="text" value={form.complement} onChange={(e) => updateField('complement', e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Bairro</label>
              <input type="text" value={form.neighborhood} onChange={(e) => updateField('neighborhood', e.target.value)}
                className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.neighborhood ? 'border-red-500' : 'border-border'}`} />
              {errors.neighborhood && <p className="text-xs text-red-500 mt-1">{errors.neighborhood}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Cidade</label>
              <input type="text" value={form.city} onChange={(e) => updateField('city', e.target.value)}
                className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.city ? 'border-red-500' : 'border-border'}`} />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
              className="accent-black" />
            <span className="text-xs text-muted-foreground">Definir como endereço principal</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button variant="primary" size="sm" onClick={save} disabled={saving}>
              {saving ? 'SALVANDO...' : 'SALVAR'}
            </Button>
            <Button variant="outline" size="sm" onClick={cancel}>CANCELAR</Button>
          </div>
        </div>
      )}
    </div>
  )
}
