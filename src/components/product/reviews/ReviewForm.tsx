'use client'

import { motion } from 'framer-motion'
import type { ReviewFormData } from './use-reviews'

interface ReviewFormProps {
  form: ReviewFormData
  imageFiles: File[]
  imagePreviews: string[]
  submitting: boolean
  onChangeField: (field: keyof ReviewFormData, value: string | number) => void
  onImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  onSubmit: (e: React.FormEvent) => void
}

const inputClass =
  'w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black'

export function ReviewForm({
  form,
  imageFiles,
  imagePreviews,
  submitting,
  onChangeField,
  onImagesChange,
  onRemoveImage,
  onSubmit,
}: ReviewFormProps) {
  return (
    <motion.form
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={onSubmit}
      className="bg-muted p-6 mb-6 overflow-hidden"
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider mb-1 block">Seu nome</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onChangeField('name', e.target.value)}
            className={inputClass}
            placeholder="Como você se chama?"
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wider mb-1 block">Nota</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChangeField('rating', star)}
                className="p-0.5"
                aria-label={`Nota ${star}`}
              >
                <svg
                  className={`w-6 h-6 ${star <= form.rating ? 'fill-black text-black' : 'fill-none text-muted-foreground hover:text-black'} transition-colors`}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wider mb-1 block">Título (opcional)</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onChangeField('title', e.target.value)}
            className={inputClass}
            placeholder="Resumo da sua avaliação"
          />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wider mb-1 block">Comentário (opcional)</label>
          <textarea
            value={form.comment}
            onChange={(e) => onChangeField('comment', e.target.value)}
            className={`${inputClass} resize-none`}
            rows={3}
            placeholder="Conte sua experiência com o produto..."
          />
        </div>

        <ImageUpload
          imageFiles={imageFiles}
          imagePreviews={imagePreviews}
          onImagesChange={onImagesChange}
          onRemoveImage={onRemoveImage}
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white text-sm font-medium uppercase tracking-wider px-6 py-2.5 hover:bg-black/80 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Enviando...' : 'Enviar Avaliação'}
        </button>
      </div>
    </motion.form>
  )
}

function ImageUpload({
  imageFiles,
  imagePreviews,
  onImagesChange,
  onRemoveImage,
}: {
  imageFiles: File[]
  imagePreviews: string[]
  onImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider mb-1 block">Fotos (opcional, até 5)</label>
      <div
        className="border-2 border-dashed border-border p-4 text-center hover:border-foreground/30 transition-colors cursor-pointer"
        onClick={() => document.getElementById('review-image-upload')?.click()}
      >
        <svg className="w-6 h-6 mx-auto mb-1 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-xs text-muted-foreground">Adicionar fotos do produto</p>
      </div>
      <input
        id="review-image-upload"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={onImagesChange}
        className="hidden"
        disabled={imageFiles.length >= 5}
      />
      {imagePreviews.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {imagePreviews.map((preview, i) => (
            <div key={i} className="relative group w-16 h-16">
              <img src={preview} alt={`Foto ${i + 1}`} className="w-full h-full object-cover border border-border" />
              <button
                type="button"
                onClick={() => onRemoveImage(i)}
                className="absolute -top-1.5 -right-1.5 bg-black/60 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remover foto"
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