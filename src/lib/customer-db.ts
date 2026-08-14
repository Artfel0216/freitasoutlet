import 'server-only'
import bcrypt from 'bcryptjs'
import { queryOne, queryAll, queryRun } from './database'

export type Address = {
  id: string
  label: string
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  isDefault: boolean
}

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  passwordHash: string
  emailVerified: boolean
  addresses: Address[]
  createdAt: string
  updatedAt: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function findCustomerByEmail(email: string): Promise<Customer | undefined> {
  const row = await queryOne('SELECT * FROM customers WHERE email = $1', [email.toLowerCase()])
  if (!row) return undefined
  return rowToCustomer(row)
}

export async function findCustomerById(id: string): Promise<Customer | undefined> {
  const row = await queryOne('SELECT * FROM customers WHERE id = $1', [id])
  if (!row) return undefined
  return rowToCustomer(row)
}

export async function createCustomer(data: {
  name: string
  email: string
  phone: string
  password: string
}): Promise<Customer> {
  const exists = await queryOne('SELECT id FROM customers WHERE email = $1', [data.email.toLowerCase()])
  if (exists) throw new Error('E-mail já cadastrado')

  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  const passwordHash = await hashPassword(data.password)

  await queryRun(`
    INSERT INTO customers (id, name, email, phone, cpf, password_hash, email_verified, created_at, updated_at)
    VALUES ($1, $2, $3, $4, '', $5, 0, $6, $7)
  `, [id, data.name, data.email.toLowerCase(), data.phone || '', passwordHash, now, now])

  return {
    id,
    name: data.name,
    email: data.email.toLowerCase(),
    phone: data.phone || '',
    cpf: '',
    passwordHash,
    emailVerified: false,
    addresses: [],
    createdAt: now,
    updatedAt: now,
  }
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer | undefined> {
  const fields: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  if (data.name !== undefined) { fields.push(`name = $${paramIndex}`); values.push(data.name); paramIndex++ }
  if (data.email !== undefined) { fields.push(`email = $${paramIndex}`); values.push(data.email.toLowerCase()); paramIndex++ }
  if (data.phone !== undefined) { fields.push(`phone = $${paramIndex}`); values.push(data.phone); paramIndex++ }
  if (data.cpf !== undefined) { fields.push(`cpf = $${paramIndex}`); values.push(data.cpf); paramIndex++ }
  if (data.passwordHash !== undefined) { fields.push(`password_hash = $${paramIndex}`); values.push(data.passwordHash); paramIndex++ }
  if (data.emailVerified !== undefined) { fields.push(`email_verified = $${paramIndex}`); values.push(data.emailVerified ? 1 : 0); paramIndex++ }

  if (fields.length === 0) return findCustomerById(id)

  fields.push(`updated_at = $${paramIndex}`)
  values.push(new Date().toISOString())
  paramIndex++
  values.push(id)

  await queryRun(`UPDATE customers SET ${fields.join(', ')} WHERE id = $${paramIndex}`, values)
  return findCustomerById(id)
}

export async function addAddress(customerId: string, address: Omit<Address, 'id'>): Promise<Address | undefined> {
  const customer = await findCustomerById(customerId)
  if (!customer) return undefined

  const newId = crypto.randomUUID()
  const isDefault = address.isDefault || customer.addresses.length === 0

  if (isDefault) {
    await queryRun('UPDATE addresses SET is_default = 0 WHERE customer_id = $1', [customerId])
  }

  await queryRun(`
    INSERT INTO addresses (id, customer_id, label, cep, street, number, complement, neighborhood, city, state, is_default)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  `, [newId, customerId, address.label, address.cep, address.street, address.number, address.complement, address.neighborhood, address.city, address.state, isDefault ? 1 : 0])

  await updateCustomer(customerId, { updatedAt: new Date().toISOString() } as Partial<Customer>)

  return {
    id: newId,
    ...address,
    isDefault,
  }
}

export async function updateAddress(customerId: string, addressId: string, data: Partial<Address>): Promise<Address | undefined> {
  const fields: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  if (data.label !== undefined) { fields.push(`label = $${paramIndex}`); values.push(data.label); paramIndex++ }
  if (data.cep !== undefined) { fields.push(`cep = $${paramIndex}`); values.push(data.cep); paramIndex++ }
  if (data.street !== undefined) { fields.push(`street = $${paramIndex}`); values.push(data.street); paramIndex++ }
  if (data.number !== undefined) { fields.push(`number = $${paramIndex}`); values.push(data.number); paramIndex++ }
  if (data.complement !== undefined) { fields.push(`complement = $${paramIndex}`); values.push(data.complement); paramIndex++ }
  if (data.neighborhood !== undefined) { fields.push(`neighborhood = $${paramIndex}`); values.push(data.neighborhood); paramIndex++ }
  if (data.city !== undefined) { fields.push(`city = $${paramIndex}`); values.push(data.city); paramIndex++ }
  if (data.state !== undefined) { fields.push(`state = $${paramIndex}`); values.push(data.state); paramIndex++ }

  if (data.isDefault) {
    await queryRun('UPDATE addresses SET is_default = 0 WHERE customer_id = $1', [customerId])
    fields.push('is_default = 1')
  } else if (fields.length === 0) {
    const existing = await queryOne('SELECT * FROM addresses WHERE id = $1 AND customer_id = $2', [addressId, customerId])
    if (!existing) return undefined
    return addressRowToAddress(existing)
  }

  values.push(addressId, customerId)
  await queryRun(`UPDATE addresses SET ${fields.join(', ')} WHERE id = $${paramIndex} AND customer_id = $${paramIndex + 1}`, values)
  await updateCustomer(customerId, { updatedAt: new Date().toISOString() } as Partial<Customer>)

  const row = await queryOne('SELECT * FROM addresses WHERE id = $1', [addressId])
  return row ? addressRowToAddress(row) : undefined
}

export async function removeAddress(customerId: string, addressId: string): Promise<boolean> {
  const addr = await queryOne('SELECT is_default FROM addresses WHERE id = $1 AND customer_id = $2', [addressId, customerId]) as { is_default: number } | undefined
  if (!addr) return false

  await queryRun('DELETE FROM addresses WHERE id = $1 AND customer_id = $2', [addressId, customerId])

  if (addr.is_default) {
    const next = await queryOne('SELECT id FROM addresses WHERE customer_id = $1 ORDER BY created_at LIMIT 1', [customerId]) as { id: string } | undefined
    if (next) {
      await queryRun('UPDATE addresses SET is_default = 1 WHERE id = $1', [next.id])
    }
  }

  await updateCustomer(customerId, { updatedAt: new Date().toISOString() } as Partial<Customer>)
  return true
}

async function getAddresses(customerId: string): Promise<Address[]> {
  const rows = await queryAll('SELECT * FROM addresses WHERE customer_id = $1 ORDER BY is_default DESC', [customerId])
  return rows.map(addressRowToAddress)
}

async function rowToCustomer(row: Record<string, unknown>): Promise<Customer> {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string,
    cpf: row.cpf as string,
    passwordHash: row.password_hash as string,
    emailVerified: (row.email_verified as number) === 1,
    addresses: await getAddresses(row.id as string),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function addressRowToAddress(row: Record<string, unknown>): Address {
  return {
    id: row.id as string,
    label: row.label as string,
    cep: row.cep as string,
    street: row.street as string,
    number: row.number as string,
    complement: row.complement as string,
    neighborhood: row.neighborhood as string,
    city: row.city as string,
    state: row.state as string,
    isDefault: (row.is_default as number) === 1,
  }
}

export { getAddresses }
