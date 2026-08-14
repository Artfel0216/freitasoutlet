'use client'

import { LoyaltyCard } from '@/components/loyalty/LoyaltyCard'
import Link from 'next/link'

export function LoyaltyAccountCard() {
  return (
    <div className="border border-border">
      <LoyaltyCard />
      <div className="px-6 pb-6 pt-0 text-center">
        <Link href="/fidelidade" className="text-xs underline hover:no-underline">
          VER PROGRAMA COMPLETO
        </Link>
      </div>
    </div>
  )
}
