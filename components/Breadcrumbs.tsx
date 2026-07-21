import Link from 'next/link'

type Breadcrumb = { label: string; href?: string }

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-4 lg:mb-6">
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span>/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-black transition-colors">{item.label}</Link>
            ) : (
              <span className="text-black font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
