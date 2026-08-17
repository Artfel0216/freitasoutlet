'use client'

interface PriceRangeFilterProps {
  minPriceInput: string
  maxPriceInput: string
  setMinPriceInput: (value: string) => void
  setMaxPriceInput: (value: string) => void
}

function PriceInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative flex-1">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
      <input
        type="number"
        min={0}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-7 pr-2 py-1.5 text-sm border border-border focus:border-black outline-none"
      />
    </div>
  )
}

export function PriceRangeFilter({
  minPriceInput,
  maxPriceInput,
  setMinPriceInput,
  setMaxPriceInput,
}: PriceRangeFilterProps) {
  return (
    <div>
      <h3 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Faixa de Preço</h3>
      <div className="flex items-center gap-2">
        <PriceInput placeholder="Min" value={minPriceInput} onChange={setMinPriceInput} />
        <span className="text-xs text-muted-foreground">—</span>
        <PriceInput placeholder="Max" value={maxPriceInput} onChange={setMaxPriceInput} />
      </div>
    </div>
  )
}