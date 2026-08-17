'use client'

import Link from 'next/link'
import { useState } from 'react'
import { HeaderLogo } from '@/components/layout/HeaderLogo'
import { DesktopNav } from './header/desktop-nav'
import { MobileMenuButton } from './header/mobile-menu-button'
import { MobileMenuPanel } from './header/mobile-menu-panel'
import { HeaderActions } from './header/header-actions'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <MobileMenuButton
            isOpen={menuOpen}
            onToggle={() => setMenuOpen((prev) => !prev)}
          />

          <Link href="/" className="flex items-center">
            <HeaderLogo />
          </Link>

          <DesktopNav />

          <HeaderActions />
        </div>
      </div>

      <MobileMenuPanel open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}