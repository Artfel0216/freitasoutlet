import { NextResponse } from 'next/server'
import { checkoutSchema } from '@/lib/validations'
import { logger } from '@/lib/logger'
import { processCheckout } from '@/lib/checkout/checkout-service'
import { readJsonBody } from '@/lib/read-json'

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request)
    if (!body) {
      return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 })
    }
    const { action } = body

    if (action === 'validate') {
      const parsed = checkoutSchema.safeParse(body.data)
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Dados inválidos', details: parsed.error.flatten().fieldErrors },
          { status: 400 },
        )
      }
      return NextResponse.json({ valid: true })
    }

    if (action === 'process') {
      return processCheckout(request, body)
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (error) {
    logger.error('Checkout error', { error: String(error) })
    return NextResponse.json({ error: 'Erro interno ao processar pagamento' }, { status: 500 })
  }
}