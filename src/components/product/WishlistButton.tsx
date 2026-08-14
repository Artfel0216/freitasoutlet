'use client'

import { useWishlist } from '@/lib/wishlist-context'

export function WishlistButton({ productId, className = '' }: { productId: string; className?: string }) {
  const { isWishlisted, toggle } = useWishlist()
  const active = isWishlisted(productId)

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(productId) }}
      className={`p-2 transition-colors ${className}`}
      aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    </button>
  )
}
