import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { setupSqliteSchema } from './sqlite-setup'

const DATABASE_URL = process.env.DATABASE_URL

type SqlFn = NeonQueryFunction<false, false>

function createSqliteSql(): SqlFn {
  let _db: Database.Database | null = null

  function getDb(): Database.Database {
    if (!_db) {
      const dataDir = path.join(process.cwd(), 'data')
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
      _db = new Database(path.join(dataDir, 'freitasoutlet.db'))
      setupSqliteSchema(_db)
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