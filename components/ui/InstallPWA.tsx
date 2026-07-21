'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './Button'

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') {
      setShow(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShow(false)
    setDismissed(true)
  }

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto bg-white dark:bg-black border border-border shadow-lg p-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-heading font-bold text-sm uppercase tracking-wider mb-1">Instalar App</p>
          <p className="text-xs text-muted-foreground mb-3">Instale o Freitas Outlet na tela inicial do seu dispositivo para uma experiência rápida e offline.</p>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleInstall}>
              INSTALAR
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              AGORA NÃO
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
