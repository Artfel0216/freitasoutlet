'use client'

import { inputClass, fieldLabelClass } from './form-utils'

interface TagsFlagsFieldsProps {
  tags: string
  isNew: boolean
  isTrending: boolean
  setTags: (value: string) => void
  setIsNew: (value: boolean) => void
  setIsTrending: (value: boolean) => void
}

export function TagsFlagsFields({
  tags,
  isNew,
  isTrending,
  setTags,
  setIsNew,
  setIsTrending,
}: TagsFlagsFieldsProps) {
  return (
    <>
      <div>
        <label className={fieldLabelClass}>Tags (separadas por vírgula)</label>
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} />
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
    </>
  )
}