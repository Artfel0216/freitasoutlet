'use client'

import { useEffect } from 'react'

export function ThreeConsoleShim() {
  useEffect(() => {
    let disposed = false

    const run = async () => {
      const { setConsoleFunction, getConsoleFunction } = await import('three')
      if (disposed) return

      const previous = getConsoleFunction()
      const filtered = (type: 'log' | 'warn' | 'error', message: string, ...params: unknown[]) => {
        if (type === 'warn' && String(message).includes('Clock: This module has been deprecated')) {
          return
        }
        if (previous) {
          previous(type, message, ...params)
          return
        }
        const fn = type === 'error' ? console.error : type === 'warn' ? console.warn : console.log
        fn(message, ...params)
      }

      setConsoleFunction(filtered)
    }

    run()
    return () => {
      disposed = true
    }
  }, [])

  return null
}
