import { NextResponse } from 'next/server'

export interface ExistingOrderPayment {
  method: string
  pixKey?: string
  pixQrCode?: string
  clientSecret?: string
  gatewayStatus?: string
  gatewayTransactionId?: string
}

export interface ExistingOrder {
  id: string
  orderNumber: string
  status: string
  payment: ExistingOrderPayment
}

export function buildExistingOrderResponse(existingOrder: ExistingOrder): NextResponse {
  const payment = existingOrder.payment

  if (payment.method === 'pix' && payment.pixKey && payment.pixQrCode) {
    return NextResponse.json({
      success: true,
      orderId: existingOrder.id,
      orderNumber: existingOrder.orderNumber,
      status: existingOrder.status,
      paymentStatus: payment.gatewayStatus,
      pix: {
        pixKey: payment.pixKey.replace(/(\d{3})\d{6}(\d{2})/, '$1******$2'),
        pixQrCode: payment.pixQrCode,
      },
    })
  }

  if ((payment.method === 'credit' || payment.method === 'debit') && payment.clientSecret) {
    return NextResponse.json({
      success: true,
      orderId: existingOrder.id,
      orderNumber: existingOrder.orderNumber,
      status: existingOrder.status,
      clientSecret: payment.clientSecret,
      paymentIntentId: payment.gatewayTransactionId,
    })
  }

  return NextResponse.json({
    success: true,
    orderId: existingOrder.id,
    orderNumber: existingOrder.orderNumber,
    status: existingOrder.status,
    paymentStatus: payment.gatewayStatus,
  })
}

export function buildRejectedOrderResponse(existingOrder: ExistingOrder): NextResponse {
  return NextResponse.json(
    {
      error: 'Transação rejeitada pela análise de segurança',
      orderId: existingOrder.id,
      orderNumber: existingOrder.orderNumber,
    },
    { status: 403 },
  )
}