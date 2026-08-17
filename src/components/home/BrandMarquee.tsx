import { brands } from './hero-data'

export function BrandMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-border" aria-hidden="true">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((n) => (
          <div key={n} className="flex shrink-0 items-center">
            {brands.map((brand) => (
              <span
                key={`${n}-${brand}`}
                className="flex items-center gap-6 px-6 py-4 font-heading text-sm font-black uppercase tracking-[0.35em] text-muted-foreground/30"
              >
                {brand}
                <span className="h-1.5 w-1.5 rotate-45 bg-foreground/30" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}