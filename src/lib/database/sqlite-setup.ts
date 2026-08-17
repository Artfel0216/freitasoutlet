import Database from 'better-sqlite3'

export function setupSqliteSchema(db: Database.Database): void {
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.exec(`
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
      idempotency_key TEXT,
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
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      discount_type TEXT NOT NULL DEFAULT 'percent',
      discount_value REAL NOT NULL,
      min_order REAL NOT NULL DEFAULT 0,
      max_uses INTEGER NOT NULL DEFAULT 0,
      used_count INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      expires_at TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tokens (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      type TEXT NOT NULL,
      expires_at BIGINT NOT NULL,
      created_at TEXT NOT NULL
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
      video TEXT NOT NULL DEFAULT '',
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
  try { db.exec('CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email)') } catch { /* */ }
  try { db.exec('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)') } catch { /* */ }
  try { db.exec('CREATE INDEX IF NOT EXISTS idx_stock_notifications_product ON stock_notifications(product_id)') } catch { /* */ }
  try { db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_number_unique ON orders(order_number)') } catch { /* */ }
  try { db.exec(`ALTER TABLE orders ADD COLUMN unboxing_video_url TEXT`) } catch { /* column may already exist */ }
  try { db.exec(`ALTER TABLE products ADD COLUMN video TEXT NOT NULL DEFAULT ''`) } catch { /* column may already exist */ }
  try { db.exec(`ALTER TABLE orders ADD COLUMN idempotency_key TEXT`) } catch { /* column may already exist */ }
  try { db.exec('DROP INDEX IF EXISTS idx_orders_idempotency_key') } catch { /* */ }
  try { db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_idempotency_key ON orders(idempotency_key)') } catch { /* */ }
  migrateSqliteSchema(db)
}

function migrateSqliteSchema(db: Database.Database) {
  const hasColumn = (table: string, column: string): boolean => {
    const info = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]
    return info.some((c) => c.name === column)
  }

  if (hasColumn('tokens', 'token') && !hasColumn('tokens', 'id')) {
    db.exec(`
      ALTER TABLE tokens RENAME COLUMN token TO id;
    `)
  }

  if (hasColumn('coupons', 'code') && !hasColumn('coupons', 'id')) {
    db.exec(`
      CREATE TABLE coupons_migrated (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        discount_type TEXT NOT NULL DEFAULT 'percent',
        discount_value REAL NOT NULL,
        min_order REAL NOT NULL DEFAULT 0,
        max_uses INTEGER NOT NULL DEFAULT 0,
        used_count INTEGER NOT NULL DEFAULT 0,
        active INTEGER NOT NULL DEFAULT 1,
        expires_at TEXT,
        created_at TEXT NOT NULL
      );
      INSERT INTO coupons_migrated (id, code, discount_type, discount_value, min_order, max_uses, used_count, active, expires_at, created_at)
        SELECT lower(hex(randomblob(16))), code, discount_type, discount_value, min_order, max_uses, used_count, active, expires_at, created_at FROM coupons;
      DROP TABLE coupons;
      ALTER TABLE coupons_migrated RENAME TO coupons;
    `)
  }

  if (hasColumn('products', 'brand')) {
    const rows = db.prepare('SELECT id, brand, category FROM products').all() as {
      id: string
      brand: string
      category: string
    }[]
    const update = db.prepare('UPDATE products SET brand = ?, category = ? WHERE id = ?')
    for (const row of rows) {
      let brand = row.brand
      let category = row.category
      let changed = false
      try {
        JSON.parse(brand)
      } catch {
        brand = JSON.stringify({ id: brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'unknown', name: brand, slug: brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'unknown', segment: 'premium' })
        changed = true
      }
      try {
        JSON.parse(category)
      } catch {
        category = JSON.stringify({ id: category.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'catalogo', name: category, slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'catalogo', parentId: null })
        changed = true
      }
      if (changed) update.run(brand, category, row.id)
    }
  }
}