'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
    router.push('/')
    router.refresh()
  }, [router])

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      SAIR
    </Button>
  )
}
