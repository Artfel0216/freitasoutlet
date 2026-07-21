'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

interface ColorInput {
  name: string
  hex: string
}

export default function AdminNewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [brandSlug, setBrandSlug] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [categorySlug, setCategorySlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [compareAtPrice, setCompareAtPrice] = useState('')
  const [sizes, setSizes] = useState('')
  const [sizeGuide, setSizeGuide] = useState('shirt')
  const [tags, setTags] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [isTrending, setIsTrending] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [colors, setColors] = useState<ColorInput[]>([{ name: '', hex: '#000000' }])

  function addColor() {
    setColors([...colors, { name: '', hex: '#000000' }])
  }

  function updateColor(index: number, field: keyof ColorInput, value: string) {
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
      formData.append('name', name)
      formData.append('brandName', brandName)
      formData.append('brandSlug', brandSlug || brandName.toLowerCase().replace(/\s+/g, '-'))
      formData.append('brandId', brandSlug || brandName.toLowerCase().replace(/\s+/g, '-'))
      formData.append('brandSegment', 'premium')
      formData.append('categoryName', categoryName)
      formData.append('categorySlug', categorySlug || categoryName.toLowerCase().replace(/\s+/g, '-'))
      formData.append('categoryId', categorySlug || categoryName.toLowerCase().replace(/\s+/g, '-'))
      formData.append('description', description)
      formData.append('price', price)
      if (compareAtPrice) formData.append('compareAtPrice', compareAtPrice)
      formData.append('sizes', JSON.stringify(sizes.split(',').map((s) => s.trim()).filter(Boolean)))
      formData.append('colors', JSON.stringify(colors.filter((c) => c.name)))
      formData.append('sizeGuide', sizeGuide)
      formData.append('tags', tags)
      formData.append('isNew', String(isNew))
      formData.append('isTrending', String(isTrending))

      if (image) formData.append('image', image)

      const res = await fetch('/api/admin/produtos', { method: 'POST', body: formData })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao criar produto')
      }

      router.push('/admin/produtos')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-8">Novo Produto</h1>

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
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Nome do Produto *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Marca *</label>
              <input type="text" required value={brandName} onChange={(e) => setBrandName(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Slug da Marca</label>
              <input type="text" value={brandSlug} onChange={(e) => setBrandSlug(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
                placeholder={brandName.toLowerCase().replace(/\s+/g, '-')} />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Categoria *</label>
              <input type="text" required value={categoryName} onChange={(e) => setCategoryName(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Slug da Categoria</label>
              <input type="text" value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
                placeholder={categoryName.toLowerCase().replace(/\s+/g, '-')} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1">Descrição</label>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black resize-vertical" />
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
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Preço *</label>
              <input type="number" step="0.01" min="0" required value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Preço Original (opcional)</label>
              <input type="number" step="0.01" min="0" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Tamanhos (separados por vírgula)</label>
              <input type="text" value={sizes} onChange={(e) => setSizes(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
                placeholder="P, M, G, GG" />
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
            <input type="file" accept="image/*" onChange={handleImageChange}
              className="w-full text-sm" />
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
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
              placeholder="nike, casual, esportivo" />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)}
                className="w-4 h-4" />
              Novo
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)}
                className="w-4 h-4" />
              Trending
            </label>
          </div>
        </motion.div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center gap-4">
          <Button variant="primary" size="lg" type="submit" disabled={loading}>
            {loading ? 'SALVANDO...' : 'SALVAR PRODUTO'}
          </Button>
          <button type="button" onClick={() => router.back()} className="text-sm underline hover:no-underline">
            Cancelar
          </button>
        </div>
      </motion.form>
    </div>
  )
}
