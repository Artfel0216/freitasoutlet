import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ cep: string }> }) {
  const { cep } = await params
  const clean = cep.replace(/\D/g, '')

  if (clean.length !== 8) {
    return NextResponse.json({ error: 'CEP inválido' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
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
  } catch {
    return NextResponse.json({ error: 'Erro ao consultar CEP' }, { status: 500 })
  }
}
