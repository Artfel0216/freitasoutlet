'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import type { EditableProduct } from './page'

export function AdminEditProductForm({ product }: { product: EditableProduct }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(String(product.price))
  const [compareAtPrice, setCompareAtPrice] = useState(product.compareAtPrice ? String(product.compareAtPrice) : '')
  const [sizes, setSizes] = useState(product.sizes.join(', '))
  const [sizeGuide, setSizeGuide] = useState(product.sizeGuide || 'shirt')
  const [tags, setTags] = useState(product.tags.join(', '))
  const [isNew, setIsNew] = useState(product.isNew || false)
  const [isTrending, setIsTrending] = useState(product.isTrending || false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(
    product.colors.length > 0 ? product.colors : [{ name: '', hex: '#000000' }]
  )

  function addColor() {
    setColors([...colors, { name: '', hex: '#000000' }])
  }

  function updateColor(index: number, field: 'name' | 'hex', value: string) {
    const updated = [...colors]
    updated[index] = { ...updated[index], [field]: value }
    setColors(updated)
  }

  function removeColor(index: number) {
    setColors(colors.filter((_, i) => i !== index))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('slug', product.slug)
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      if (compareAtPrice) formData.append('compareAtPrice', compareAtPrice)
      formData.append('sizes', JSON.stringify(sizes.split(',').map((s) => s.trim()).filter(Boolean)))
      formData.append('sizeGuide', sizeGuide)
      formData.append('tags', tags)
      formData.append('isNew', String(isNew))
      formData.append('isTrending', String(isTrending))
      formData.append('colors', JSON.stringify(colors.filter((c) => c.name)))

      if (image) formData.append('image', image)

      const res = await fetch('/api/admin/produtos', { method: 'PUT', body: formData })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao atualizar produto')
      }

      router.push('/admin/produtos')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar produto')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    setDeleting(true)
    try {
      const res = await fetch('/api/admin/produtos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: product.slug }),
      })

      if (!res.ok) throw new Error('Erro ao excluir produto')

      router.push('/admin/produtos')
      router.refresh()
    } catch {
      setError('Erro ao excluir produto')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-black text-2xl uppercase tracking-tighter">{product.name}</h1>
        <Button variant="outline" size="sm" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'EXCLUINDO...' : 'EXCLUIR'}
        </Button>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="border border-border bg-white p-6 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
        >
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider">Informações Básicas</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Nome do Produto</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Descrição</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black resize-vertical" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="border border-border bg-white p-6 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider">Preço e Estoque</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Preço</label>
              <input type="number" step="0.01" min="0" required value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Preço Original</label>
              <input type="number" step="0.01" min="0" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Tamanhos (separados por vírgula)</label>
              <input type="text" value={sizes} onChange={(e) => setSizes(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Guia de Tamanhos</label>
              <select value={sizeGuide} onChange={(e) => setSizeGuide(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-white">
                <option value="shirt">Camiseta</option>
                <option value="footwear">Calçado</option>
                <option value="oversized">Oversized</option>
                <option value="pants">Calça</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="border border-border bg-white p-6 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider">Cores</h2>
            <button type="button" onClick={addColor} className="text-xs underline hover:no-underline">Adicionar cor</button>
          </div>

          {colors.map((color, i) => (
            <div key={i} className="flex items-center gap-3">
              <input type="color" value={color.hex} onChange={(e) => updateColor(i, 'hex', e.target.value)}
                className="w-10 h-10 border border-border cursor-pointer" />
              <input type="text" placeholder="Nome da cor" value={color.name} onChange={(e) => updateColor(i, 'name', e.target.value)}
                className="flex-1 border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
              {colors.length > 1 && (
                <button type="button" onClick={() => removeColor(i)} className="text-xs text-red-500 hover:underline">Remover</button>
              )}
            </div>
          ))}
        </motion.div>

        <motion.div
          className="border border-border bg-white p-6 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider">Mídia</h2>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1">Imagem do Produto</label>
            {product.images?.[0] && !imagePreview && (
              
              <img src={product.images[0]} alt={product.name} className="mb-2 w-32 h-32 object-cover border border-border" />
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
            {imagePreview && (
              
              <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover border border-border" />
            )}
          </div>
        </motion.div>

        <motion.div
          className="border border-border bg-white p-6 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider">Tags e Flags</h2>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1">Tags (separadas por vírgula)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="w-4 h-4" />
              Novo
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="w-4 h-4" />
              Trending
            </label>
          </div>
        </motion.div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button variant="primary" size="lg" type="submit" disabled={loading}>
            {loading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
          </Button>
          <button type="button" onClick={() => router.back()} className="text-sm underline hover:no-underline">
            Cancelar
          </button>
        </motion.div>
      </motion.form>
    </div>
  )
}
