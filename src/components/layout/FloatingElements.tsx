'use client'

import dynamic from 'next/dynamic'

const CompareBar = dynamic(() => import('@/components/product/CompareBar').then((mod) => mod.CompareBar), {
  ssr: false,
  loading: () => null,
})

const WhatsAppChat = dynamic(() => import('@/components/ui/WhatsAppChat').then((mod) => mod.WhatsAppChat), {
  ssr: false,
  loading: () => null,
})

const InstallPWA = dynamic(() => import('@/components/ui/InstallPWA').then((mod) => mod.InstallPWA), {
  ssr: false,
  loading: () => null,
})

export function FloatingElements() {
  return (
    <>
      <CompareBar />
      <WhatsAppChat />
      <InstallPWA />
    </>
  )
}