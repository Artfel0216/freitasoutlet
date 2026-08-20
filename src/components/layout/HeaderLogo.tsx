'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Logo } from './Logo'

const Logo3DCanvas = dynamic(() => import('./Logo3DCanvas').then((m) => m.Logo3DCanvas), {
  ssr: false,
  loading: () => <StaticLogo />,
})

function StaticLogo() {
  return (
    <div className="h-10 flex items-center">
      <Logo />
    </div>
  )
}

export function HeaderLogo() {
  const [show3D, setShow3D] = useState(false)

  useEffect(() => {
    let cancelled = false
    const trigger = () => {
      if (!cancelled) setShow3D(true)
    }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(trigger, { timeout: 2500 })
      return () => {
        cancelled = true
        window.cancelIdleCallback(id)
      }
    }
    const t = setTimeout(trigger, 1500)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [])

  return show3D ? <Logo3DCanvas /> : <StaticLogo />
}