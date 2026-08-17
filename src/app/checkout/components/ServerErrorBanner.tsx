'use client'

import { AnimatePresence, motion } from 'framer-motion'

export function ServerErrorBanner({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="server-error"
          className="mb-6 p-4 bg-red-50 border border-red-200 text-sm text-red-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}