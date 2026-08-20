export function LogoSymbol({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <rect
        x="138"
        y="138"
        width="236"
        height="236"
        fill="none"
        stroke="#c0c0c0"
        strokeWidth="10"
        transform="rotate(45 256 256)"
      />
      <rect
        x="156"
        y="156"
        width="200"
        height="200"
        fill="none"
        stroke="#0a0a0a"
        strokeWidth="4"
        opacity="0.5"
        transform="rotate(45 256 256)"
      />
      <g fill="none" stroke="#0a0a0a" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round">
        <path d="M206 172 h96" />
        <path d="M206 258 h84" />
        <path d="M206 172 v172" />
      </g>
    </svg>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoSymbol className="h-9 w-9 lg:h-10 lg:w-10 shrink-0" />
      <div className="flex flex-col leading-none">
        <span className="font-heading font-black text-base lg:text-lg uppercase tracking-[0.18em] whitespace-nowrap text-foreground">
          Freitas
        </span>
        <span className="font-heading font-semibold text-[10px] lg:text-xs uppercase tracking-[0.4em] whitespace-nowrap text-silver mt-0.5">
          Outlet
        </span>
      </div>
    </div>
  )
}