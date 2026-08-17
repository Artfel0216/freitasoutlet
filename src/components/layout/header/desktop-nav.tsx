'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { menuItems } from './menu-data'
import { MegaMenu } from './mega-menu'

export function DesktopNav() {
  const [megaOpen, setMegaOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setMegaOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMegaOpen(false)
    }, 150)
  }

  return (
    <>
      <nav
        className="hidden lg:flex items-center gap-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {menuItems.map((item) => (
          <motion.div
            key={item.href}
            className="menu-item-3d"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Link
              href={item.href}
              className="relative block px-4 py-2 text-sm font-medium text-foreground hover:text-gold transition-colors"
            >
              {item.label}
            </Link>
          </motion.div>
        ))}
      </nav>

      <MegaMenu
        open={megaOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </>
  )
}