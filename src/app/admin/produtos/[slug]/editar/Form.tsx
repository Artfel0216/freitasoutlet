'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { categories } from '@/data/categories'
import type { OfferStatus, OfferType, Brand } from '@/types'
import type { EditableProduct } from './page'

const brandSegments = [
  { value: 'sportswear', label: 'Sportswear' },
  { value: 'premium', label: 'Premium' },
  { value: 'high-end', label: 'High-End' },
  { value: 'streetwear', label: 'Streetwear' },
]

export function AdminEditProductForm({ product, brands }: { product: EditableProduct; brands: Brand[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const [name, setName] = useState(product.name)
  const [brandSlug, setBrandSlug] = useState(product.brand?.slug || '')
  const [categorySlug, setCategorySlug] = useState(product.category?.slug || '')
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(String(product.price))
  const [compareAtPrice, setCompareAtPrice] = useState(product.compareAtPrice ? String(product.compareAtPrice) : '')
  const [sizes, setSizes] = useState(product.sizes.join(', '))
  const [sizeGuide, setSizeGuide] = useState(product.sizeGuide || 'shirt')
  const [tags, setTags] = useState(product.tags.join(', '))
  const [isNew, setIsNew] = useState(product.isNew || false)
  const [isTrending, setIsTrending] = useState(product.isTrending || false)
  const [offerStatus, setOfferStatus] = useState<OfferStatus>(product.offerStatus || 'none')
  const [offerType, setOfferType] = useState<OfferType>(product.offerType || 'none')
  const [offerDiscount, setOfferDiscount] = useState(String(product.offerDiscount ?? ''))
  const [featured, setFeatured] = useState(product.featured || false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(
    product.colors.length > 0 ? product.colors : [{ name: '', hex: '#000000' }]
  )
  const [video, setVideo] = useState('video' in product ? (product.video as string) || '' : '')

  const [brandOptions, setBrandOptions] = useState<Brand[]>(brands)
  const [showNewBrand, setShowNewBrand] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')
  const [newBrandSegment, setNewBrandSegment] = useState('premium')
  const [savingBrand, setSavingBrand] = useState(false)

  const existingImages: string[] = product.images || []

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

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    setImageFiles((prev) => [...prev, ...files])
    for (const file of files) {
      setImagePreviews((prev) => [...prev, URL.createObjectURL(file)])
    }
  }

  function removeNewImage(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  function removeExistingImage(index: number) {
    setImageFiles((prev) => [...prev]) // trigger re-render
  }

  async function handleCreateBrand(e: FormEvent) {
    e.preventDefault()
    if (!newBrandName.trim()) return
    setSavingBrand(true)
    try {
      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrandName.trim(), segment: newBrandSegment }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao criar marca')
      }
      const created = await res.json()
      setBrandOptions((prev) => {
        const exists = prev.some((b) => b.slug === created.slug)
        return exists ? prev : [...prev, { id: created.id, name: created.name, slug: created.slug, segment: created.segment }]
      })
      setBrandSlug(created.slug)
      setNewBrandName('')
      setShowNewBrand(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar marca')
    } finally {
      setSavingBrand(false)
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
      const brand = brandOptions.find((b) => b.slug === brandSlug)
      if (brand) {
        formData.append('brandName', brand.name)
        formData.append('brandSlug', brand.slug)
      }
      const cat = findCategory(categorySlug)
      if (cat) {
        formData.append('categoryName', cat.name)
        formData.append('categorySlug', cat.slug)
      }
      formData.append('description', description)
      formData.append('video', video)
      formData.append('price', price)
      if (compareAtPrice) formData.append('compareAtPrice', compareAtPrice)
      formData.append('sizes', JSON.stringify(sizes.split(',').map((s) => s.trim()).filter(Boolean)))
      formData.append('sizeGuide', sizeGuide)
      formData.append('tags', tags)
      formData.append('isNew', String(isNew))
      formData.append('isTrending', String(isTrending))
      formData.append('offerStatus', offerStatus)
      formData.append('offerType', offerType)
      formData.append('offerDiscount', offerDiscount || '0')
      formData.append('featured', String(featured))
      formData.append('colors', JSON.stringify(colors.filter((c) => c.name)))
      formData.append('keepExistingImages', 'true')
      formData.append('existingImages', JSON.stringify(existingImages))

      for (const file of imageFiles) {
        formData.append('images', file)
      }

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
        className="max-w-3xl space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="border border-border bg-white p-6 space-y-4 rounded-sm shadow-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
        >
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider">Informações Básicas</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Nome do Produto</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background" />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Marca</label>
              <select value={brandSlug} onChange={(e) => setBrandSlug(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background">
                <option value="">Selecione uma marca</option>
                {brandOptions.map((b) => (
                  <option key={b.slug} value={b.slug}>{b.name}</option>
                ))}
              </select>
              {showNewBrand ? (
                <form onSubmit={handleCreateBrand} className="mt-2 space-y-2 border border-border p-3">
                  <input type="text" placeholder="Nome da nova marca" value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background" />
                  <select value={newBrandSegment} onChange={(e) => setNewBrandSegment(e.target.value)}
                    className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background">
                    {brandSegments.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <Button variant="primary" size="sm" type="submit" disabled={savingBrand}>
                      {savingBrand ? 'SALVANDO...' : 'CADASTRAR'}
                    </Button>
                    <button type="button" onClick={() => setShowNewBrand(false)} className="text-xs underline hover:no-underline">
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <button type="button" onClick={() => setShowNewBrand(true)} className="mt-2 text-xs underline hover:no-underline">
                  + Cadastrar nova marca
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Categoria</label>
              <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background">
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <optgroup key={cat.id} label={cat.name}>
                    <option value={cat.slug}>{cat.name} (Todas)</option>
                    {cat.children?.map((child) => (
                      <option key={child.slug} value={child.slug}>{child.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Descrição</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background resize-vertical" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="border border-border bg-white p-6 space-y-4 rounded-sm shadow-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider">Preço e Estoque</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Preço</label>
              <input type="number" step="0.01" min="0" required value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background" />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Preço Original</label>
              <input type="number" step="0.01" min="0" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background" />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Tamanhos (separados por vírgula)</label>
              <input type="text" value={sizes} onChange={(e) => setSizes(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background" />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Guia de Tamanhos</label>
              <select value={sizeGuide} onChange={(e) => setSizeGuide(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background">
                <option value="shirt">Camiseta</option>
                <option value="footwear">Calçado</option>
                <option value="oversized">Oversized</option>
                <option value="pants">Calça</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="border border-border bg-white p-6 space-y-4 rounded-sm shadow-card"
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
                className="flex-1 border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background" />
              {colors.length > 1 && (
                <button type="button" onClick={() => removeColor(i)} className="text-xs text-red-500 hover:underline">Remover</button>
              )}
            </div>
          ))}
        </motion.div>

        <motion.div
          className="border border-border bg-white p-6 space-y-4 rounded-sm shadow-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider">Mídia</h2>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2">Imagens do Produto</label>

            {existingImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={img} alt={`${product.name} - ${i + 1}`} className="w-full h-full object-cover border border-border" />
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-border p-6 text-center hover:border-foreground/30 transition-colors cursor-pointer"
              onClick={() => document.getElementById('edit-image-upload')?.click()}>
              <svg className="w-8 h-8 mx-auto mb-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-muted-foreground">Clique para adicionar mais imagens</p>
              <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP ou GIF — Máx 5MB cada</p>
            </div>
            <input id="edit-image-upload" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple
              onChange={handleImagesChange} className="hidden" />
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-full object-cover border border-border" />
                    <button type="button" onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1">Vídeo do Produto (URL)</label>
            <input type="url" value={video} onChange={(e) => setVideo(e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background"
              placeholder="https://www.youtube.com/watch?v=... ou https://.../video.mp4" />
            <p className="text-xs text-muted-foreground mt-1">YouTube, Vimeo ou arquivo MP4/WebM</p>
          </div>
        </motion.div>

        <motion.div
          className="border border-border bg-white p-6 space-y-4 rounded-sm shadow-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider">Status de Oferta</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Status da Oferta</label>
              <select value={offerStatus} onChange={(e) => setOfferStatus(e.target.value as OfferStatus)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background">
                <option value="none">Normal</option>
                <option value="sale">Em Oferta</option>
                <option value="promotion">Em Promoção</option>
                <option value="clearance">Queima de Estoque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Tipo de Oferta</label>
              <select value={offerType} onChange={(e) => setOfferType(e.target.value as OfferType)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background">
                <option value="none">Nenhum</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1">Desconto (%)</label>
              <input type="number" min="0" max="100" value={offerDiscount} onChange={(e) => setOfferDiscount(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background" />
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4" />
                Produto em Destaque
              </label>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="border border-border bg-white p-6 space-y-4 rounded-sm shadow-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider">Tags e Flags</h2>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1">Tags (separadas por vírgula)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background" />
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
          transition={{ delay: 0.35 }}
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

function findCategory(slug: string) {
  for (const cat of categories) {
    if (cat.slug === slug) return cat
    const child = cat.children?.find((c) => c.slug === slug)
    if (child) return child
  }
  return null
}