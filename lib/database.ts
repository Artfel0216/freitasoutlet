import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DATABASE_URL = process.env.DATABASE_URL

type SqlFn = NeonQueryFunction<false, false>

function createSqliteSql(): SqlFn {
  let _db: Database.Database | null = null

  function getDb(): Database.Database {
    if (!_db) {
      const dataDir = path.join(process.cwd(), 'data')
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
      _db = new Database(path.join(dataDir, 'freitasoutlet.db'))
      _db.pragma('journal_mode = WAL')
      _db.pragma('foreign_keys = ON')
      _db.exec(`
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
        );
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
        );
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
           unboxing_video_url TEXT,
           created_at TEXT NOT NULL,
           updated_at TEXT NOT NULL
         );
         CREATE TABLE IF NOT EXISTS rate_limits (
          id TEXT PRIMARY KEY,
          key TEXT NOT NULL,
          count INTEGER NOT NULL DEFAULT 1,
          reset_at BIGINT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS coupons (
          code TEXT PRIMARY KEY,
          discount_type TEXT NOT NULL DEFAULT 'percent',
          discount_value REAL NOT NULL,
          min_order REAL,
          max_uses INTEGER,
          used_count INTEGER NOT NULL DEFAULT 0,
          active INTEGER NOT NULL DEFAULT 1,
          expires_at TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS tokens (
          token TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          type TEXT NOT NULL,
          expires_at TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          brand TEXT NOT NULL DEFAULT '{}',
          category TEXT NOT NULL DEFAULT '{}',
          description TEXT NOT NULL DEFAULT '',
          price REAL NOT NULL,
          compare_at_price REAL,
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
        );
      `)
      try { _db.exec(`ALTER TABLE orders ADD COLUMN unboxing_video_url TEXT`) } catch { /* column may already exist */ }
    }
    return _db
  }

  function convertPostgresParams(query: string): string {
    return query.replace(/\$\d+/g, '?')
  }

  function isReadQuery(sql: string): boolean {
    const trimmed = sql.trimStart().toUpperCase()
    return trimmed.startsWith('SELECT') || trimmed.startsWith('WITH') || trimmed.startsWith('PRAGMA')
  }

  const fn = ((strings: any, ...values: any[]): Promise<any> => {
    const db = getDb()

    if (Array.isArray(strings)) {
      let query = strings[0] ?? ''
      const params: unknown[] = []
      for (let i = 1; i < strings.length; i++) {
        params.push(values[i - 1])
        query += '?' + (strings[i] ?? '')
      }
      const stmt = db.prepare(query)
      if (isReadQuery(query)) {
        return Promise.resolve(stmt.all(...params))
      }
      stmt.run(...params)
      return Promise.resolve([])
    }

    const query: string = strings
    let params: unknown[] = []
    let fullResults = false

    if (values.length > 0) {
      const last = values[values.length - 1]
      if (last && typeof last === 'object' && !Array.isArray(last) && 'fullResults' in last) {
        fullResults = true
        params = values.slice(0, -1)
      } else {
        params = values
      }
    }

    const stmt = db.prepare(convertPostgresParams(query))

    if (fullResults) {
      const info = stmt.run(...params)
      return Promise.resolve({ rows: [], rowCount: info.changes } as any)
    }

    if (isReadQuery(query)) {
      return Promise.resolve(stmt.all(...params))
    }
    stmt.run(...params)
    return Promise.resolve([])
  }) as SqlFn

  return fn
}

export const sql = (DATABASE_URL ? neon(DATABASE_URL) : createSqliteSql()) as SqlFn & {
  (q: string, p?: unknown[]): Promise<any[]>
  (q: string, p: unknown[], opts: { fullResults: true }): Promise<{ rowCount: number }>
}

export async function queryOne<T extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
  params?: unknown[]
): Promise<T | undefined> {
  const rows = await (sql as any)(query, params ?? [])
  return rows[0] as T | undefined
}

export async function queryAll<T extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
  params?: unknown[]
): Promise<T[]> {
  return await (sql as any)(query, params ?? []) as T[]
}

export async function queryRun(
  query: string,
  params?: unknown[]
): Promise<{ rowCount: number }> {
  const result = await (sql as any)(query, params ?? [], { fullResults: true })
  return { rowCount: result.rowCount ?? 0 }
}

export async function initializeSchema() {
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
      unboxing_video_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `

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

  await sql`CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email)`
  await sql`CREATE INDEX IF NOT EXISTS idx_addresses_customer ON addresses(customer_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_email ON customers(email)`
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number)`

  try { await sql`ALTER TABLE orders ADD COLUMN unboxing_video_url TEXT` } catch { /* column may already exist */ }
  await sql`CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)`
  await sql`CREATE INDEX IF NOT EXISTS idx_products_active ON products(active)`

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

  await sql`
    CREATE TABLE IF NOT EXISTS rate_limits (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 1,
      reset_at BIGINT NOT NULL
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON rate_limits(key)`

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

  await sql`
    CREATE TABLE IF NOT EXISTS admin_passwords (
      id TEXT PRIMARY KEY,
      hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      expires_at BIGINT NOT NULL,
      created_at TEXT NOT NULL
    )
  `

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

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    )
  `

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
}
