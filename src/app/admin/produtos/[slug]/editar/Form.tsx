'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useProductForm } from '@/components/admin/product-form/use-product-form'
import { FormCard } from '@/components/admin/product-form/FormCard'
import { BrandField } from '@/components/admin/product-form/BrandField'
import { CategoryField } from '@/components/admin/product-form/CategoryField'
import { ColorsEditor } from '@/components/admin/product-form/ColorsEditor'
import { ImageUploader } from '@/components/admin/product-form/ImageUploader'
import { OfferStatusFields } from '@/components/admin/product-form/OfferStatusFields'
import { TagsFlagsFields } from '@/components/admin/product-form/TagsFlagsFields'
import { inputClass, fieldLabelClass, type ProductFormInitial } from '@/components/admin/product-form/form-utils'
import type { OfferStatus, OfferType, Brand } from '@/types'
import type { EditableProduct } from './page'

export function AdminEditProductForm({ product, brands }: { product: EditableProduct; brands: Brand[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const initial: ProductFormInitial = {
    slug: product.slug,
    name: product.name,
    brandSlug: product.brand?.slug || '',
    categorySlug: product.category?.slug || '',
    description: product.description,
    price: String(product.price),
    compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : '',
    sizes: product.sizes.join(', '),
    sizeGuide: product.sizeGuide || 'shirt',
    tags: product.tags.join(', '),
    isNew: product.isNew || false,
    isTrending: product.isTrending || false,
    offerStatus: (product.offerStatus as OfferStatus) || 'none',
    offerType: (product.offerType as OfferType) || 'none',
    offerDiscount: String(product.offerDiscount ?? ''),
    featured: product.featured || false,
    colors: product.colors.length > 0 ? product.colors : [{ name: '', hex: '#000000' }],
    video: 'video' in product ? (product.video as string) || '' : '',
    existingImages: product.images || [],
  }

  const f = useProductForm({ initial, brands, mode: 'edit' })

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
      f.setError('Erro ao excluir produto')
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
        onSubmit={f.handleSubmit}
        className="max-w-3xl space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FormCard title="Informações Básicas">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={fieldLabelClass}>Nome do Produto</label>
              <input
                type="text"
                required
                value={f.name}
                onChange={(e) => f.setName(e.target.value)}
                className={inputClass}
              />
            </div>

            <BrandField manager={f} />
            <CategoryField value={f.categorySlug} onChange={f.setCategorySlug} />

            <div className="col-span-2">
              <label className={fieldLabelClass}>Descrição</label>
              <textarea
                rows={4}
                value={f.description}
                onChange={(e) => f.setDescription(e.target.value)}
                className={`${inputClass} resize-vertical`}
              />
            </div>
          </div>
        </FormCard>

        <FormCard title="Preço e Estoque" delay={0.1}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={fieldLabelClass}>Preço</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={f.price}
                onChange={(e) => f.setPrice(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={fieldLabelClass}>Preço Original</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={f.compareAtPrice}
                onChange={(e) => f.setCompareAtPrice(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={fieldLabelClass}>Tamanhos (separados por vírgula)</label>
              <input
                type="text"
                value={f.sizes}
                onChange={(e) => f.setSizes(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={fieldLabelClass}>Guia de Tamanhos</label>
              <select value={f.sizeGuide} onChange={(e) => f.setSizeGuide(e.target.value)} className={inputClass}>
                <option value="shirt">Camiseta</option>
                <option value="footwear">Calçado</option>
                <option value="oversized">Oversized</option>
                <option value="pants">Calça</option>
              </select>
            </div>
          </div>
        </FormCard>

        <FormCard
          title="Cores"
          delay={0.15}
          headerAction={
            <button type="button" onClick={f.addColor} className="text-xs underline hover:no-underline">
              Adicionar cor
            </button>
          }
        >
          <ColorsEditor colors={f.colors} updateColor={f.updateColor} removeColor={f.removeColor} />
        </FormCard>

        <FormCard title="Mídia" delay={0.2}>
          <ImageUploader
            inputId="edit-image-upload"
            label="Imagens do Produto"
            existingImages={initial.existingImages?.map((src, i) => ({ src, alt: `${product.name} - ${i + 1}` }))}
            imagePreviews={f.imagePreviews}
            onImagesChange={f.handleImagesChange}
            onRemoveImage={f.removeNewImage}
          />

          <div>
            <label className={fieldLabelClass}>Vídeo do Produto (URL)</label>
            <input
              type="url"
              value={f.video}
              onChange={(e) => f.setVideo(e.target.value)}
              className={inputClass}
              placeholder="https://www.youtube.com/watch?v=... ou https://.../video.mp4"
            />
            <p className="text-xs text-muted-foreground mt-1">YouTube, Vimeo ou arquivo MP4/WebM</p>
          </div>
        </FormCard>

        <FormCard title="Status de Oferta" delay={0.25}>
          <OfferStatusFields
            offerStatus={f.offerStatus}
            offerType={f.offerType}
            offerDiscount={f.offerDiscount}
            featured={f.featured}
            setOfferStatus={f.setOfferStatus}
            setOfferType={f.setOfferType}
            setOfferDiscount={f.setOfferDiscount}
            setFeatured={f.setFeatured}
          />
        </FormCard>

        <FormCard title="Tags e Flags" delay={0.3}>
          <TagsFlagsFields
            tags={f.tags}
            isNew={f.isNew}
            isTrending={f.isTrending}
            setTags={f.setTags}
            setIsNew={f.setIsNew}
            setIsTrending={f.setIsTrending}
          />
        </FormCard>

        {f.error && <p className="text-sm text-red-500">{f.error}</p>}

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Button variant="primary" size="lg" type="submit" disabled={f.loading}>
            {f.loading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
          </Button>
          <button type="button" onClick={() => router.back()} className="text-sm underline hover:no-underline">
            Cancelar
          </button>
        </motion.div>
      </motion.form>
    </div>
  )
}