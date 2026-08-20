'use client'

import dynamic from 'next/dynamic'

const WhatsAppChat = dynamic(() => import('@/components/ui/WhatsAppChat').then((mod) => mod.WhatsAppChat), {
  ssr: false,
  loading: () => null,
})

export function FloatingElements() {
  return (
    <>
      <WhatsAppChat />
    </>
  )
}