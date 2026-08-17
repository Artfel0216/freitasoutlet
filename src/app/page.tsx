'use client'

import { Hero } from '@/components/home/Hero'
import { RecentlyViewed } from '@/components/product/RecentlyViewed'
import { products } from '@/data/products'
import { FlashSaleBanners } from '@/components/home/sections/FlashSaleBanners'
import { CategorySection } from '@/components/home/sections/CategorySection'
import { TrendingSection } from '@/components/home/sections/TrendingSection'
import { LuxuryShowcase } from '@/components/home/sections/LuxuryShowcase'
import { NewArrivalsSection } from '@/components/home/sections/NewArrivalsSection'
import { TrustBadges } from '@/components/home/sections/TrustBadges'

export default function HomePage() {
  const trendingProducts = products.filter((p) => p.isTrending)
  const newProducts = products.filter((p) => p.isNew)

  return (
    <div>
      <Hero />
      <FlashSaleBanners />
      <CategorySection />
      <TrendingSection products={trendingProducts} />
      <LuxuryShowcase />
      <NewArrivalsSection products={newProducts} />
      <TrustBadges />
      <div className="px-4 sm:px-6 lg:px-8">
        <RecentlyViewed />
      </div>
    </div>
  )
}