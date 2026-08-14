'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

type Coupon = {
  id: string
  code: string
  discountType: 'percent' | 'fixed'
  discountValue: number
  minOrder: number
  maxUses: number
  usedCount: number
  active: boolean
  expiresAt: string | null
  createdAt: string
}

export function AdminCouponsTable() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [form, setForm] = useState({
    code: '',
    discountType: 'percent' as 'percent' | 'fixed',
    discountValue: '',
    minOrder: '',
    maxUses: '',
    expiresAt: '',
  })

  useEffect(() => {
    fetch('/api/admin/coupons')
      .then(r => r.json())
      .then(data => { setCoupons(data.coupons || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          discountType: form.discountType,
          discountValue: parseFloat(form.discountValue),
          minOrder: parseFloat(form.minOrder) || 0,
          maxUses: parseInt(form.maxUses) || 0,
          expiresAt: form.expiresAt || null,
        }),
      })
      if (res.ok) {
        const coupon = await res.json()
        setCoupons(prev => [coupon, ...prev])
        setShowForm(false)
        setForm({ code: '', discountType: 'percent', discountValue: '', minOrder: '', maxUses: '', expiresAt: '' })
        toast.success('Cupom criado!')
      }
    } catch {
      toast.error('Erro ao criar cupom')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCoupon) return
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCoupon.id,
          code: form.code.toUpperCase(),
          discountType: form.discountType,
          discountValue: parseFloat(form.discountValue),
          minOrder: parseFloat(form.minOrder) || 0,
          maxUses: parseInt(form.maxUses) || 0,
          expiresAt: form.expiresAt || null,
        }),
      })
      if (res.ok) {
        setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? {
          ...c,
          code: form.code.toUpperCase(),
          discountType: form.discountType,
          discountValue: parseFloat(form.discountValue),
          minOrder: parseFloat(form.minOrder) || 0,
          maxUses: parseInt(form.maxUses) || 0,
          expiresAt: form.expiresAt || null,
        } : c))
        setShowForm(false)
        setEditingCoupon(null)
        setForm({ code: '', discountType: 'percent', discountValue: '', minOrder: '', maxUses: '', expiresAt: '' })
        toast.success('Cupom atualizado!')
      }
    } catch {
      toast.error('Erro ao atualizar cupom')
    }
  }

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: coupon.id, active: !coupon.active }),
      })
      if (res.ok) {
        setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, active: !c.active } : c))
        toast.success(coupon.active ? 'Cupom desativado' : 'Cupom ativado')
      }
    } catch {
      toast.error('Erro ao atualizar')
    }
  }

  const startEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrder: String(coupon.minOrder),
      maxUses: String(coupon.maxUses),
      expiresAt: coupon.expiresAt?.split('T')[0] || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (code: string) => {
    if (!confirm('Tem certeza que deseja deletar este cupom?')) return
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      if (res.ok) {
        setCoupons(prev => prev.filter(c => c.code !== code))
        toast.success('Cupom deletado!')
      }
    } catch {
      toast.error('Erro ao deletar cupom')
    }
  }

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-lg uppercase">Cupons</h2>
        <button onClick={() => { setShowForm(!showForm); setEditingCoupon(null); setForm({ code: '', discountType: 'percent', discountValue: '', minOrder: '', maxUses: '', expiresAt: '' }) }} className="text-xs font-medium uppercase tracking-wider border border-border px-4 py-2 hover:bg-muted">
          {showForm ? 'Cancelar' : '+ Novo Cupom'}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={editingCoupon ? handleUpdate : handleCreate}
          className="bg-muted p-4 mb-6 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Código (ex: VERAO10)" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} className="border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black" required />
            <select value={form.discountType} onChange={e => setForm(p => ({ ...p, discountType: e.target.value as 'percent' | 'fixed' }))} className="border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black">
              <option value="percent">% Desconto</option>
              <option value="fixed">R$ Desconto</option>
            </select>
            <input type="number" placeholder="Valor do desconto" value={form.discountValue} onChange={e => setForm(p => ({ ...p, discountValue: e.target.value }))} className="border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black" required />
            <input type="number" placeholder="Pedido mínimo (R$)" value={form.minOrder} onChange={e => setForm(p => ({ ...p, minOrder: e.target.value }))} className="border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black" />
            <input type="number" placeholder="Máximo de usos (0=ilimitado)" value={form.maxUses} onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))} className="border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black" />
            <input type="date" placeholder="Data de expiração" value={form.expiresAt} onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))} className="border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>
          <button type="submit" className="bg-black text-white text-xs font-medium uppercase tracking-wider px-6 py-2">{editingCoupon ? 'Salvar Alterações' : 'Criar Cupom'}</button>
        </motion.form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Código</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Desconto</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Mínimo</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Usos</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="p-3 text-xs font-medium uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon.id} className="border-b border-border">
                <td className="p-3 font-mono font-bold">{coupon.code}</td>
                <td className="p-3">{coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `R$ ${coupon.discountValue.toFixed(2)}`}</td>
                <td className="p-3">R$ {coupon.minOrder.toFixed(2)}</td>
                <td className="p-3">{coupon.usedCount}/{coupon.maxUses || '∞'}</td>
                <td className="p-3">
                  <button onClick={() => handleToggleActive(coupon)} className={`text-xs font-medium px-2 py-0.5 rounded cursor-pointer ${coupon.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {coupon.active ? 'Ativo' : 'Inativo'}
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(coupon)} className="text-xs text-blue-500 hover:underline">Editar</button>
                    <button onClick={() => handleDelete(coupon.code)} className="text-xs text-red-500 hover:underline">Deletar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">Nenhum cupom criado.</p>}
      </div>
    </div>
  )
}
