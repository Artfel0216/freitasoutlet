'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export default function VerificarEmailPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-20 text-center">Carregando...</div>}>
      <VerificarEmailContent />
    </Suspense>
  )
}

function VerificarEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(() => token ? 'loading' : 'error')
  const [message, setMessage] = useState(() => token ? '' : 'Link de verificação inválido')

  useEffect(() => {
    if (!token) {
      return
    }

    fetch('/api/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.ok) {
          setStatus('success')
          setMessage(data.message || 'E-mail verificado com sucesso!')
        } else {
          setStatus('error')
          setMessage(data.error || 'Erro ao verificar e-mail')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Erro ao verificar e-mail')
      })
  }, [token])

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      {status === 'loading' && (
        <div>
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Verificando seu e-mail...</p>
        </div>
      )}

      {status === 'success' && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-4">E-mail Verificado!</h1>
          <p className="text-sm text-muted-foreground mb-6">{message}</p>
          <Link href="/login">
            <Button variant="primary">FAZER LOGIN</Button>
          </Link>
        </motion.div>
      )}

      {status === 'error' && (
        <div>
          <div className="w-16 h-16 bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6 rounded-full">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-4">Erro na Verificação</h1>
          <p className="text-sm text-muted-foreground mb-6">{message}</p>
          <Link href="/cadastro">
            <Button variant="primary">CRIAR NOVA CONTA</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
