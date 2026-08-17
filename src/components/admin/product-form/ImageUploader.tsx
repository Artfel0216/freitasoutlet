'use client'

import { fieldLabelClass } from './form-utils'

interface ExistingImage {
  src: string
  alt: string
}

interface ImageUploaderProps {
  inputId: string
  label: string
  existingImages?: ExistingImage[]
  imagePreviews: string[]
  onImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
}

export function ImageUploader({
  inputId,
  label,
  existingImages = [],
  imagePreviews,
  onImagesChange,
  onRemoveImage,
}: ImageUploaderProps) {
  return (
    <div>
      <label className={`${fieldLabelClass} mb-2`}>{label}</label>

      {existingImages.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          {existingImages.map((img, i) => (
            <div key={i} className="relative group aspect-square">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover border border-border" />
            </div>
          ))}
        </div>
      )}

      <div
        className="border-2 border-dashed border-border p-6 text-center hover:border-foreground/30 transition-colors cursor-pointer"
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <svg className="w-8 h-8 mx-auto mb-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-muted-foreground">Clique para adicionar imagens</p>
        <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP ou GIF — Máx 5MB cada</p>
      </div>
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={onImagesChange}
        className="hidden"
      />

      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {imagePreviews.map((preview, i) => (
            <div key={i} className="relative group aspect-square">
              <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-full object-cover border border-border" />
              <button
                type="button"
                onClick={() => onRemoveImage(i)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remover imagem"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}