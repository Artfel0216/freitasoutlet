'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { megaAjuda, megaCategorias, megaMarcas } from './menu-data'

interface MegaMenuProps {
  open: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function MegaColumn({
  title,
  items,
  onNavigate,
}: {
  title: string
  items: { label: string; href: string }[]
  onNavigate: () => void
}) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-muted-foreground">
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm font-medium hover:text-gold transition-colors"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function MegaMenu({ open, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="hidden lg:block absolute left-0 right-0 top-full site-mega border-b"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-4 gap-12">
              <MegaColumn
                title="Categorias"
                items={megaCategorias}
                onNavigate={onMouseLeave}
              />
              <MegaColumn title="Marcas" items={megaMarcas} onNavigate={onMouseLeave} />
              <div className="col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-muted-foreground">
                  Ajuda
                </h3>
                <ul className="grid grid-cols-2 gap-3">
                  {megaAjuda.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm font-medium hover:text-gold transition-colors"
                        onClick={onMouseLeave}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}