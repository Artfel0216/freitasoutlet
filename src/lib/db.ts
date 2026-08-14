import 'server-only'
import { queryOne, queryAll, queryRun } from './database'

type OrderItem = {
  productId: string
  productName: string
  brand: string
  size: string
  color: string
  quantity: number
  unitPrice: number
}

export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'refunded' | 'shipped' | 'delivered'

export type PaymentInfo = {
  method: 'pix' | 'credit' | 'debit'
  pixKey?: string
  pixQrCode?: string
  cardLastDigits?: string
  installments?: number
  gatewayTransactionId?: string
  gatewayStatus?: string
  clientSecret?: string
}

export type FraudAnalysis = {
  score: number
  status: string
  recommendation: string
}

export type Order = {
  id: string
  orderNumber: string
  status: OrderStatus
  customer: {
    name: string
    email: string
    cpf: string
    phone: string
  }
  address: {
    cep: string
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
  }
  items: OrderItem[]
  payment: PaymentInfo
  subtotal: number
  shipping: number
  discount: number
  total: number
  createdAt: string
  updatedAt: string
  fraudAnalysis?: FraudAnalysis
  shippedAt?: string
  deliveredAt?: string
  trackingCode?: string
  unboxingVideoUrl?: string
}

export async function readOrders(): Promise<Order[]> {
  const rows = await queryAll('SELECT * FROM orders ORDER BY created_at DESC')
  return rows.map(rowToOrder)
}

export async function createOrder(order: Omit<Order, 'createdAt' | 'updatedAt' | 'id' | 'orderNumber'>, idempotencyKey?: string): Promise<Order> {
  const id = crypto.randomUUID()
  const orderNumber = `FO-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`
  const now = new Date().toISOString()

  if (idempotencyKey) {
    const existing = await getOrderByIdempotencyKey(idempotencyKey)
    if (existing) return existing
  }

  const onConflict = idempotencyKey ? 'ON CONFLICT(idempotency_key) DO NOTHING' : ''
  await queryRun(`
    INSERT INTO orders (id, order_number, status, customer_name, customer_email, customer_cpf, customer_phone,
      address_cep, address_street, address_number, address_neighborhood, address_city, address_state,
      items, payment_method, payment_info, subtotal, shipping, discount, total, fraud_analysis, idempotency_key, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
    ${onConflict}
  `, [
    id, orderNumber, order.status,
    order.customer.name, order.customer.email, order.customer.cpf, order.customer.phone,
    order.address.cep, order.address.street, order.address.number, order.address.neighborhood, order.address.city, order.address.state,
    JSON.stringify(order.items), order.payment.method, JSON.stringify(order.payment),
    order.subtotal, order.shipping, order.discount, order.total,
    order.fraudAnalysis ? JSON.stringify(order.fraudAnalysis) : null,
    idempotencyKey || null,
    now, now,
  ])

  if (idempotencyKey) {
    const existing = await getOrderByIdempotencyKey(idempotencyKey)
    if (existing) return existing
  }

  return {
    ...order,
    id,
    orderNumber,
    createdAt: now,
    updatedAt: now,
  }
}

export async function getOrderByIdempotencyKey(key: string): Promise<Order | undefined> {
  const row = await queryOne('SELECT * FROM orders WHERE idempotency_key = $1', [key])
  return row ? rowToOrder(row) : undefined
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const row = await queryOne('SELECT * FROM orders WHERE id = $1', [id])
  return row ? rowToOrder(row) : undefined
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
  const row = await queryOne('SELECT * FROM orders WHERE order_number = $1', [orderNumber])
  return row ? rowToOrder(row) : undefined
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const rows = await queryAll('SELECT * FROM orders WHERE customer_email = $1 ORDER BY created_at DESC', [email.toLowerCase()])
  return rows.map(rowToOrder)
}

export async function updateOrderStatus(id: string, status: OrderStatus, extra?: Partial<Order>): Promise<Order | undefined> {
  const now = new Date().toISOString()

  const fields: string[] = ['status = $1', 'updated_at = $2']
  const values: unknown[] = [status, now]
  let paramIndex = 3

  if (extra) {
    if (extra.trackingCode) { fields.push(`tracking_code = $${paramIndex}`); values.push(extra.trackingCode); paramIndex++ }
    if (extra.shippedAt) { fields.push(`shipped_at = $${paramIndex}`); values.push(extra.shippedAt); paramIndex++ }
    if (extra.deliveredAt) { fields.push(`delivered_at = $${paramIndex}`); values.push(extra.deliveredAt); paramIndex++ }
    if (extra.unboxingVideoUrl !== undefined) { fields.push(`unboxing_video_url = $${paramIndex}`); values.push(extra.unboxingVideoUrl); paramIndex++ }
  }

  values.push(id)
  await queryRun(`UPDATE orders SET ${fields.join(', ')} WHERE id = $${paramIndex}`, values)
  return getOrderById(id)
}

export async function updatePaymentInfo(id: string, payment: Partial<PaymentInfo>): Promise<Order | undefined> {
  const order = await getOrderById(id)
  if (!order) return undefined

  const merged = { ...order.payment, ...payment }
  await queryRun('UPDATE orders SET payment_info = $1, updated_at = $2 WHERE id = $3', [JSON.stringify(merged), new Date().toISOString(), id])
  return getOrderById(id)
}

function rowToOrder(row: Record<string, unknown>): Order {
  const paymentInfo = JSON.parse((row.payment_info as string) || '{}') as PaymentInfo
  return {
    id: row.id as string,
    orderNumber: row.order_number as string,
    status: row.status as OrderStatus,
    customer: {
      name: row.customer_name as string,
      email: row.customer_email as string,
      cpf: row.customer_cpf as string,
      phone: row.customer_phone as string,
    },
    address: {
      cep: row.address_cep as string,
      street: row.address_street as string,
      number: row.address_number as string,
      neighborhood: row.address_neighborhood as string,
      city: row.address_city as string,
      state: row.address_state as string,
    },
    items: JSON.parse(row.items as string) as OrderItem[],
    payment: paymentInfo,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    discount: Number(row.discount),
    total: Number(row.total),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    fraudAnalysis: row.fraud_analysis ? JSON.parse(row.fraud_analysis as string) as FraudAnalysis : undefined,
    shippedAt: row.shipped_at as string | undefined,
    deliveredAt: row.delivered_at as string | undefined,
    trackingCode: row.tracking_code as string | undefined,
    unboxingVideoUrl: row.unboxing_video_url as string | undefined,
  }
}
