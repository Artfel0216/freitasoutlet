'use client'

interface FilterCheckboxItem {
  id: string
  slug: string
  name: string
  children?: FilterCheckboxItem[]
}

interface FilterCheckboxListProps {
  title: string
  items: FilterCheckboxItem[]
  active: string[]
  onToggle: (slug: string) => void
  scrollable?: boolean
}

export function FilterCheckboxList({
  title,
  items,
  active,
  onToggle,
  scrollable = false,
}: FilterCheckboxListProps) {
  return (
    <div>
      <h3 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">{title}</h3>
      <div className={`space-y-2 ${scrollable ? 'max-h-48 overflow-y-auto' : ''}`}>
        {items.map((item) => (
          <div key={item.id}>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={active.includes(item.slug)}
                onChange={() => onToggle(item.slug)}
                className="accent-black"
              />
              {item.name}
            </label>
            {item.children && (
              <div className="ml-6 mt-1 space-y-1">
                {item.children.map((child) => (
                  <label key={child.id} className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={active.includes(child.slug)}
                      onChange={() => onToggle(child.slug)}
                      className="accent-black"
                    />
                    {child.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}