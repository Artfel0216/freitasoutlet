import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is required')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function initializeSchema() {
  console.log('Initializing database schema...')

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL DEFAULT '',
      cpf TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL,
      email_verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `
  console.log('  ✓ customers')

  await sql`
    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      label TEXT NOT NULL DEFAULT '',
      cep TEXT NOT NULL,
      street TEXT NOT NULL,
      number TEXT NOT NULL,
      complement TEXT NOT NULL DEFAULT '',
      neighborhood TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      is_default INTEGER NOT NULL DEFAULT 0
    )
  `
  console.log('  ✓ addresses')

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_cpf TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      address_cep TEXT NOT NULL,
      address_street TEXT NOT NULL,
      address_number TEXT NOT NULL,
      address_neighborhood TEXT NOT NULL,
      address_city TEXT NOT NULL,
      address_state TEXT NOT NULL,
      items TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      payment_info TEXT NOT NULL DEFAULT '{}',
      subtotal NUMERIC(10,2) NOT NULL,
      shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
      discount NUMERIC(10,2) NOT NULL DEFAULT 0,
      total NUMERIC(10,2) NOT NULL,
      fraud_analysis TEXT,
      tracking_code TEXT,
      shipped_at TEXT,
      delivered_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `
  console.log('  ✓ orders')

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      compare_at_price NUMERIC(10,2),
      images TEXT NOT NULL DEFAULT '[]',
      colors TEXT NOT NULL DEFAULT '[]',
      sizes TEXT NOT NULL DEFAULT '[]',
      size_guide TEXT NOT NULL DEFAULT 'shirt',
      tags TEXT NOT NULL DEFAULT '[]',
      is_new INTEGER NOT NULL DEFAULT 0,
      is_trending INTEGER NOT NULL DEFAULT 0,
      stock TEXT NOT NULL DEFAULT '{}',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `
  console.log('  ✓ products')

  await sql`CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email)`
  await sql`CREATE INDEX IF NOT EXISTS idx_addresses_customer ON addresses(customer_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email)`
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number)`
  await sql`CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)`
  await sql`CREATE INDEX IF NOT EXISTS idx_products_active ON products(active)`
  console.log('  ✓ indexes')

  await sql`
    CREATE TABLE IF NOT EXISTS tokens (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      type TEXT NOT NULL,
      expires_at BIGINT NOT NULL,
      created_at TEXT NOT NULL
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_tokens_email ON tokens(email)`
  await sql`CREATE INDEX IF NOT EXISTS idx_tokens_type ON tokens(type)`
  console.log('  ✓ tokens')

  await sql`
    CREATE TABLE IF NOT EXISTS rate_limits (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 1,
      reset_at BIGINT NOT NULL
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON rate_limits(key)`
  console.log('  ✓ rate_limits')

  await sql`
    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      discount_type TEXT NOT NULL DEFAULT 'percent',
      discount_value NUMERIC(10,2) NOT NULL,
      min_order NUMERIC(10,2) NOT NULL DEFAULT 0,
      max_uses INTEGER NOT NULL DEFAULT 0,
      used_count INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      expires_at TEXT,
      created_at TEXT NOT NULL
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code)`
  console.log('  ✓ coupons')

  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Dicas',
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug)`
  console.log('  ✓ blog_posts')

  await sql`
    CREATE TABLE IF NOT EXISTS return_requests (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      order_number TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      reason TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_return_requests_order ON return_requests(order_id)`
  console.log('  ✓ return_requests')

  await sql`
    CREATE TABLE IF NOT EXISTS admin_passwords (
      id TEXT PRIMARY KEY,
      hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `
  console.log('  ✓ admin_passwords')

  await sql`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      expires_at BIGINT NOT NULL,
      created_at TEXT NOT NULL
    )
  `
  console.log('  ✓ admin_sessions')

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      title TEXT NOT NULL DEFAULT '',
      comment TEXT NOT NULL DEFAULT '',
      verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id)`
  console.log('  ✓ reviews')

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    )
  `
  console.log('  ✓ newsletter_subscribers')

  await sql`
    CREATE TABLE IF NOT EXISTS stock_notifications (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      email TEXT NOT NULL,
      size TEXT,
      notified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `
  console.log('  ✓ stock_notifications')

  console.log('\nDatabase schema initialized successfully!')
}

initializeSchema().catch((err) => {
  console.error('Failed to initialize database:', err)
  process.exit(1)
})
