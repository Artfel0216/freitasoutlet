import Link from 'next/link'
import { blogPosts as staticPosts } from '@/data/blog'
import type { Metadata } from 'next'
import { queryAll } from '@/lib/database'

export const metadata: Metadata = {
  title: 'Blog | Freitas Outlet',
  description: 'Dicas de moda, cuidados com produtos, streetwear e muito mais.',
}

type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
}

async function getDbPosts(): Promise<BlogPost[]> {
  try {
    const rows = await queryAll('SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC')
    return rows.map((row) => ({
      slug: row.slug as string,
      title: row.title as string,
      excerpt: row.excerpt as string,
      category: row.category as string,
      date: (row.created_at as string).split('T')[0],
    }))
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const dbPosts = await getDbPosts()
  const allPosts = [
    ...dbPosts,
    ...staticPosts.filter((sp) => !dbPosts.some((dp) => dp.slug === sp.slug)),
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-heading font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-2">Blog</h1>
      <p className="text-sm text-muted-foreground mb-8">Dicas, novidades e conteúdo sobre moda urbana.</p>

      <div className="space-y-8">
        {allPosts.map((post) => (
          <article key={post.slug} className="border-b border-border pb-8">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{post.category} — {post.date}</span>
            <h2 className="font-heading font-bold text-lg mt-1 mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-xs font-medium underline hover:no-underline mt-3 inline-block">
              CONTINUAR LENDO
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
