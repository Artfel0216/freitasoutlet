'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { catalogImages, getCatalogGroups } from '@/data/catalog-images'
import { stagger, staggerItem, fadeUp } from '@/components/animations'

const groups = getCatalogGroups()
const allBrands = [...new Set(catalogImages.map((i) => i.brand))].sort()
const allCategories = [...new Set(catalogImages.map((i) => i.category))]

export default function CatalogoImagensPage() {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterBrand, setFilterBrand] = useState('')

  const filtered = groups.filter((g) => {
    if (filterCategory && g.category !== filterCategory) return false
    if (filterBrand && g.brand !== filterBrand) return false
    if (search) {
      const q = search.toLowerCase()
      return g.brand.toLowerCase().includes(q) || g.model.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
    }
    return true
  })

  const totalImages = catalogImages.length

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.div initial="initial" animate="animate" variants={stagger} className="space-y-2 mb-8">
          <motion.h1 variants={staggerItem} className="font-heading font-black text-3xl lg:text-4xl">
            Catálogo de Imagens
          </motion.h1>
          <motion.p variants={staggerItem} className="text-muted-foreground">
            {totalImages} imagens · {groups.length} produtos · {allBrands.length} marcas · {allCategories.length} categorias
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <input
            type="text"
            placeholder="Buscar por marca, modelo ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 appearance-none cursor-pointer"
          >
            <option value="">Todas as categorias</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 appearance-none cursor-pointer"
          >
            <option value="">Todas as marcas</option>
            {allBrands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </motion.div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Nenhum resultado encontrado.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filtered.map((group) => (
              <motion.section
                key={`${group.category}|${group.brand}|${group.model}`}
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: '-80px' }}
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <h2 className="font-heading font-bold text-xl lg:text-2xl">
                    {group.brand} {group.model}
                  </h2>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    {group.category}
                  </span>
                </div>
                <div className="w-12 h-0.5 bg-foreground/20 mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {group.images.map((img) => (
                    <div key={img.src} className="group">
                      <div className="relative aspect-square bg-muted overflow-hidden rounded-lg">
                        <Image
                          src={img.src}
                          alt={`${img.brand} ${img.model} - ${img.label}`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground truncate">
                        {img.label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground"
        >
          {totalImages} imagens catalogadas · {groups.length} modelos · {allBrands.length} marcas
        </motion.div>
      </div>
    </div>
  )
}
