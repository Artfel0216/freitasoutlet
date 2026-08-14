import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

const CEP_REGEX = /^\d{5}-?\d{3}$/

export async function GET(request: NextRequest) {
  const cep = request.nextUrl.searchParams.get('cep') || ''

  if (!CEP_REGEX.test(cep)) {
    return NextResponse.json({ error: 'CEP inválido' }, { status: 400 })
  }

  const clean = cep.replace(/\D/g, '')

  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`, { next: { revalidate: 604800 } })
    if (!res.ok) {
      logger.error('ViaCEP request failed', { status: res.status, cep: clean })
      return NextResponse.json({ error: 'Não foi possível consultar o CEP' }, { status: 502 })
    }
    const data = await res.json()
    if (data.erro) {
      return NextResponse.json({ error: 'CEP não encontrado' }, { status: 404 })
    }
    return NextResponse.json({
      cep: data.cep,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    })
  } catch (error) {
    logger.error('CEP lookup error', { error: String(error) })
    return NextResponse.json({ error: 'Não foi possível consultar o CEP' }, { status: 502 })
  }
}
