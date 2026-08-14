import Link from 'next/link'
import { blogPosts as staticPosts } from '@/data/blog'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BlogComments } from '@/components/blog/BlogComments'
import { queryOne, queryAll } from '@/lib/database'

type DbPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
}

async function getDbPost(slug: string): Promise<DbPost | null> {
  try {
    const row = await queryOne('SELECT * FROM blog_posts WHERE slug = $1 AND published = 1', [slug])
    if (!row) return null
    return {
      slug: row.slug as string,
      title: row.title as string,
      excerpt: row.excerpt as string,
      content: row.content as string,
      category: row.category as string,
      date: (row.created_at as string).split('T')[0],
    }
  } catch {
    return null
  }
}

async function getAllSlugs(): Promise<string[]> {
  const dbSlugs = await (async () => {
    try {
      const rows = await queryAll<{ slug: string }>('SELECT slug FROM blog_posts WHERE published = 1')
      return rows.map((r) => r.slug)
    } catch {
      return []
    }
  })()
  const staticSlugs = staticPosts.map((p) => p.slug)
  return [...new Set([...dbSlugs, ...staticSlugs])]
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const dbPost = await getDbPost(slug)
  if (dbPost) return { title: `${dbPost.title} | Freitas Outlet`, description: dbPost.excerpt }

  const post = staticPosts.find((p) => p.slug === slug)
  if (!post) return {}
  return { title: `${post.title} | Freitas Outlet`, description: post.excerpt }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const dbPost = await getDbPost(slug)
  const staticPost = staticPosts.find((p) => p.slug === slug)
  const post = dbPost || staticPost

  if (!post) notFound()

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Link href="/blog" className="text-xs underline hover:no-underline mb-6 inline-block">&larr; VOLTAR AO BLOG</Link>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{post.category} — {post.date}</span>
      <h1 className="font-heading font-black text-3xl lg:text-4xl uppercase tracking-tighter mt-2 mb-8">{post.title}</h1>
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: post.content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/on\w+="[^"]*"/gi, '') }} />
      <div className="mt-12">
        <BlogComments postSlug={post.slug} />
      </div>
    </article>
  )
}
