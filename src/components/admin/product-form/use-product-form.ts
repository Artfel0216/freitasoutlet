'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { Brand, OfferStatus, OfferType } from '@/types'
import { findBrand, findCategory, type ColorInput, type ProductFormInitial } from './form-utils'

export interface BrandManager {
  brandOptions: Brand[]
  brandSlug: string
  setBrandSlug: (slug: string) => void
  showNewBrand: boolean
  newBrandName: string
  newBrandSegment: string
  savingBrand: boolean
  toggleNewBrand: () => void
  setNewBrandName: (value: string) => void
  setNewBrandSegment: (value: string) => void
  createBrand: (e: FormEvent) => Promise<void>
}

export interface ColorsEditorController {
  colors: ColorInput[]
  addColor: () => void
  updateColor: (index: number, field: keyof ColorInput, value: string) => void
  removeColor: (index: number) => void
}

export interface ProductFormController extends ProductFormInitial, BrandManager, ColorsEditorController {
  loading: boolean
  error: string
  setLoading: (value: boolean) => void
  setError: (value: string) => void
  setName: (value: string) => void
  setCategorySlug: (value: string) => void
  setDescription: (value: string) => void
  setPrice: (value: string) => void
  setCompareAtPrice: (value: string) => void
  setSizes: (value: string) => void
  setSizeGuide: (value: string) => void
  setTags: (value: string) => void
  setIsNew: (value: boolean) => void
  setIsTrending: (value: boolean) => void
  setOfferStatus: (value: OfferStatus) => void
  setOfferType: (value: OfferType) => void
  setOfferDiscount: (value: string) => void
  setFeatured: (value: boolean) => void
  setVideo: (value: string) => void
  imageFiles: File[]
  imagePreviews: string[]
  handleImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeNewImage: (index: number) => void
  handleSubmit: (e: FormEvent) => Promise<void>
}

export interface UseProductFormOptions {
  initial: ProductFormInitial
  brands: Brand[]
  mode: 'create' | 'edit'
}

export function useProductForm({ initial, brands, mode }: UseProductFormOptions): ProductFormController {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(initial.name)
  const [brandSlug, setBrandSlug] = useState(initial.brandSlug)
  const [categorySlug, setCategorySlug] = useState(initial.categorySlug)
  const [description, setDescription] = useState(initial.description)
  const [price, setPrice] = useState(initial.price)
  const [compareAtPrice, setCompareAtPrice] = useState(initial.compareAtPrice)
  const [sizes, setSizes] = useState(initial.sizes)
  const [sizeGuide, setSizeGuide] = useState(initial.sizeGuide)
  const [tags, setTags] = useState(initial.tags)
  const [isNew, setIsNew] = useState(initial.isNew)
  const [isTrending, setIsTrending] = useState(initial.isTrending)
  const [offerStatus, setOfferStatus] = useState<OfferStatus>(initial.offerStatus)
  const [offerType, setOfferType] = useState<OfferType>(initial.offerType)
  const [offerDiscount, setOfferDiscount] = useState(initial.offerDiscount)
  const [featured, setFeatured] = useState(initial.featured)
  const [colors, setColors] = useState<ColorInput[]>(initial.colors)
  const [video, setVideo] = useState(initial.video)

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const [brandOptions, setBrandOptions] = useState<Brand[]>(brands)
  const [showNewBrand, setShowNewBrand] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')
  const [newBrandSegment, setNewBrandSegment] = useState('premium')
  const [savingBrand, setSavingBrand] = useState(false)

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

  async function createBrand(e: FormEvent) {
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
      if (mode === 'edit' && initial.slug) {
        formData.append('slug', initial.slug)
      }
      formData.append('name', name)

      const brand = findBrand(brandOptions, brandSlug)
      if (brand) {
        formData.append('brandName', brand.name)
        formData.append('brandSlug', brand.slug)
        if (mode === 'create') {
          formData.append('brandId', brand.id)
          formData.append('brandSegment', brand.segment)
        }
      }

      const cat = findCategory(categorySlug)
      if (cat) {
        formData.append('categoryName', cat.name)
        formData.append('categorySlug', cat.slug)
        if (mode === 'create') {
          formData.append('categoryId', cat.id)
          formData.append('categoryParentSlug', cat.parentId || '')
        }
      }

      formData.append('description', description)
      formData.append('video', video)
      formData.append('price', price)
      if (compareAtPrice) formData.append('compareAtPrice', compareAtPrice)
      formData.append('sizes', JSON.stringify(sizes.split(',').map((s) => s.trim()).filter(Boolean)))
      formData.append('colors', JSON.stringify(colors.filter((c) => c.name)))
      formData.append('sizeGuide', sizeGuide)
      formData.append('tags', tags)
      formData.append('isNew', String(isNew))
      formData.append('isTrending', String(isTrending))
      formData.append('offerStatus', offerStatus)
      formData.append('offerType', offerType)
      formData.append('offerDiscount', offerDiscount || '0')
      formData.append('featured', String(featured))

      if (mode === 'edit') {
        formData.append('keepExistingImages', 'true')
        formData.append('existingImages', JSON.stringify(initial.existingImages || []))
      }

      for (const file of imageFiles) {
        formData.append('images', file)
      }

      const res = await fetch('/api/admin/produtos', {
        method: mode === 'edit' ? 'PUT' : 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao salvar produto')
      }

      router.push('/admin/produtos')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  return {
    slug: initial.slug,
    name,
    brandSlug,
    categorySlug,
    description,
    price,
    compareAtPrice,
    sizes,
    sizeGuide,
    tags,
    isNew,
    isTrending,
    offerStatus,
    offerType,
    offerDiscount,
    featured,
    colors,
    video,
    existingImages: initial.existingImages,
    loading,
    error,
    setLoading,
    setError,
    setName,
    setBrandSlug,
    setCategorySlug,
    setDescription,
    setPrice,
    setCompareAtPrice,
    setSizes,
    setSizeGuide,
    setTags,
    setIsNew,
    setIsTrending,
    setOfferStatus,
    setOfferType,
    setOfferDiscount,
    setFeatured,
    setVideo,
    brandOptions,
    showNewBrand,
    newBrandName,
    newBrandSegment,
    savingBrand,
    toggleNewBrand: () => setShowNewBrand((prev) => !prev),
    setNewBrandName,
    setNewBrandSegment,
    createBrand,
    addColor,
    updateColor,
    removeColor,
    imageFiles,
    imagePreviews,
    handleImagesChange,
    removeNewImage,
    handleSubmit,
  }
}