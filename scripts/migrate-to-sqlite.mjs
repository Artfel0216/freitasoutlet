import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '..', 'data')
const dbPath = path.join(dataDir, 'freitasoutlet.db')

function loadJSON(filename) {
  const filePath = path.join(dataDir, filename)
  if (!fs.existsSync(filePath)) return []
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

console.log('Migrating data to SQLite...')
console.log(`Database: ${dbPath}`)

if (fs.existsSync(dbPath)) {
  console.log('Removing existing database...')
  fs.unlinkSync(dbPath)
  const walPath = dbPath + '-wal'
  const shmPath = dbPath + '-shm'
  if (fs.existsSync(walPath)) fs.unlinkSync(walPath)
  if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath)
}

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    phone TEXT NOT NULL DEFAULT '', cpf TEXT NOT NULL DEFAULT '',
    password_hash TEXT NOT NULL, email_verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS addresses (
    id TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT '', cep TEXT NOT NULL, street TEXT NOT NULL,
    number TEXT NOT NULL, complement TEXT NOT NULL DEFAULT '',
    neighborhood TEXT NOT NULL, city TEXT NOT NULL, state TEXT NOT NULL,
    is_default INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY, order_number TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
    customer_name TEXT NOT NULL, customer_email TEXT NOT NULL, customer_cpf TEXT NOT NULL,
    customer_phone TEXT NOT NULL, address_cep TEXT NOT NULL, address_street TEXT NOT NULL,
    address_number TEXT NOT NULL, address_neighborhood TEXT NOT NULL, address_city TEXT NOT NULL,
    address_state TEXT NOT NULL, items TEXT NOT NULL, payment_method TEXT NOT NULL,
    payment_info TEXT NOT NULL DEFAULT '{}', subtotal REAL NOT NULL, shipping REAL NOT NULL DEFAULT 0,
    discount REAL NOT NULL DEFAULT 0, total REAL NOT NULL, fraud_analysis TEXT,
    tracking_code TEXT, shipped_at TEXT, delivered_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL, category TEXT NOT NULL, description TEXT NOT NULL,
    price REAL NOT NULL, compare_at_price REAL, images TEXT NOT NULL DEFAULT '[]',
    colors TEXT NOT NULL DEFAULT '[]', sizes TEXT NOT NULL DEFAULT '[]',
    size_guide TEXT NOT NULL DEFAULT 'shirt', tags TEXT NOT NULL DEFAULT '[]',
    is_new INTEGER NOT NULL DEFAULT 0, is_trending INTEGER NOT NULL DEFAULT 0,
    stock TEXT NOT NULL DEFAULT '{}', active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
  CREATE INDEX IF NOT EXISTS idx_addresses_customer ON addresses(customer_id);
  CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
  CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
  CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
  CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
`)

// Migrate customers
const customers = loadJSON('clientes.json')
console.log(`Migrating ${customers.length} customers...`)
const insertCustomer = db.prepare(`
  INSERT INTO customers (id, name, email, phone, cpf, password_hash, email_verified, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)
const insertAddress = db.prepare(`
  INSERT INTO addresses (id, customer_id, label, cep, street, number, complement, neighborhood, city, state, is_default)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const transaction = db.transaction(() => {
  for (const c of customers) {
    insertCustomer.run(c.id, c.name, c.email, c.phone || '', c.cpf || '', c.passwordHash, c.emailVerified ? 1 : 0, c.createdAt, c.updatedAt)
    if (c.addresses && c.addresses.length > 0) {
      for (const a of c.addresses) {
        insertAddress.run(a.id, c.id, a.label || '', a.cep, a.street, a.number, a.complement || '', a.neighborhood, a.city, a.state, a.isDefault ? 1 : 0)
      }
    }
  }
})
transaction()

// Migrate orders
const orders = loadJSON('orders.json')
console.log(`Migrating ${orders.length} orders...`)
const insertOrder = db.prepare(`
  INSERT INTO orders (id, order_number, status, customer_name, customer_email, customer_cpf, customer_phone,
    address_cep, address_street, address_number, address_neighborhood, address_city, address_state,
    items, payment_method, payment_info, subtotal, shipping, discount, total, fraud_analysis,
    tracking_code, shipped_at, delivered_at, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const orderTransaction = db.transaction(() => {
  for (const o of orders) {
    insertOrder.run(
      o.id, o.orderNumber, o.status, o.customer.name, o.customer.email, o.customer.cpf, o.customer.phone,
      o.address.cep, o.address.street, o.address.number, o.address.neighborhood, o.address.city, o.address.state,
      JSON.stringify(o.items), o.payment.method, JSON.stringify(o.payment),
      o.subtotal, o.shipping || 0, o.discount || 0, o.total,
      o.fraudAnalysis ? JSON.stringify(o.fraudAnalysis) : null,
      o.trackingCode || null, o.shippedAt || null, o.deliveredAt || null,
      o.createdAt, o.updatedAt,
    )
  }
})
orderTransaction()

// Migrate products
const products = loadJSON('products.json')
console.log(`Migrating ${products.length} products...`)
const insertProduct = db.prepare(`
  INSERT INTO products (id, name, slug, brand, category, description, price, compare_at_price,
    images, colors, sizes, size_guide, tags, is_new, is_trending, stock, active, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const productTransaction = db.transaction(() => {
  for (const p of products) {
    insertProduct.run(
      p.id, p.name, p.slug, JSON.stringify(p.brand), JSON.stringify(p.category),
      p.description, p.price, p.compareAtPrice || null,
      JSON.stringify(p.images), JSON.stringify(p.colors), JSON.stringify(p.sizes),
      p.sizeGuide || 'shirt', JSON.stringify(p.tags || []),
      p.isNew ? 1 : 0, p.isTrending ? 1 : 0,
      JSON.stringify(p.stock || {}), p.active !== false ? 1 : 0,
      p.createdAt, p.updatedAt,
    )
  }
})
productTransaction()

db.close()
console.log('Migration complete!')
