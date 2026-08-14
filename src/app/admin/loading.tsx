export default function Loading() {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center gap-2">
        <div className="w-2 h-2 bg-black animate-pulse rounded-full" />
        <div className="w-2 h-2 bg-black animate-pulse rounded-full" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-black animate-pulse rounded-full" style={{ animationDelay: '0.4s' }} />
      </div>
      <p className="text-sm text-muted-foreground mt-4">Carregando...</p>
    </div>
  )
}
