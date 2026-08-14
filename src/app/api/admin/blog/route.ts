import { NextRequest, NextResponse } from 'next/server'
import { queryAll, queryRun } from '@/lib/database'
import { getSession } from '@/lib/auth'

async function initBlogPostsTable() {
  try { await queryRun("CREATE TABLE IF NOT EXISTS blog_posts (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL, excerpt TEXT NOT NULL DEFAULT '', content TEXT NOT NULL DEFAULT '', category TEXT NOT NULL DEFAULT 'Dicas', published INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)") } catch { /* */ }
}

export async function GET() {
  await initBlogPostsTable()
  const rows = await queryAll('SELECT * FROM blog_posts ORDER BY created_at DESC')
  const posts = rows.map(r => ({
    id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt,
    content: r.content, category: r.category, published: Boolean(r.published),
    createdAt: r.created_at, updatedAt: r.updated_at,
  }))
  return NextResponse.json({ posts })
}

export async function POST(request: NextRequest) {
  await initBlogPostsTable()
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { slug, title, excerpt, content, category } = body

    if (!slug || !title) {
      return NextResponse.json({ error: 'Slug e título são obrigatórios' }, { status: 400 })
    }

    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    try {
      await queryRun('INSERT INTO blog_posts (id, slug, title, excerpt, content, category, published, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, 1, $7, $8)', [
        id, slug, title, excerpt || '', content || '', category || 'Dicas', now, now
      ])
    } catch {
      return NextResponse.json({ error: 'Slug já existe' }, { status: 409 })
    }

    return NextResponse.json({ id, slug, title, excerpt, content, category, published: true, createdAt: now, updatedAt: now }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 }) }
  const { id, slug, title, excerpt, content, category, published } = body

  if (!id) {
    return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
  }

  const fields: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  if (slug !== undefined) { fields.push(`slug = $${paramIndex}`); values.push(slug); paramIndex++ }
  if (title !== undefined) { fields.push(`title = $${paramIndex}`); values.push(title); paramIndex++ }
  if (excerpt !== undefined) { fields.push(`excerpt = $${paramIndex}`); values.push(excerpt); paramIndex++ }
  if (content !== undefined) { fields.push(`content = $${paramIndex}`); values.push(content); paramIndex++ }
  if (category !== undefined) { fields.push(`category = $${paramIndex}`); values.push(category); paramIndex++ }
  if (published !== undefined) { fields.push(`published = $${paramIndex}`); values.push(published ? 1 : 0); paramIndex++ }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 })
  }

  fields.push(`updated_at = $${paramIndex}`)
  values.push(new Date().toISOString())
  paramIndex++
  values.push(id)

  await queryRun(`UPDATE blog_posts SET ${fields.join(', ')} WHERE id = $${paramIndex}`, values)

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  let body: { slug?: string; id?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 }) }
  const { slug, id } = body
  if (id) {
    await queryRun('DELETE FROM blog_posts WHERE id = $1', [id])
  } else if (slug) {
    await queryRun('DELETE FROM blog_posts WHERE slug = $1', [slug])
  } else {
    return NextResponse.json({ error: 'ID ou slug é obrigatório' }, { status: 400 })
  }
  return NextResponse.json({ success: true })
}
