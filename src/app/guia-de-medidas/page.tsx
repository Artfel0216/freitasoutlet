import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guia de Medidas | Freitas Outlet',
}

const footwearSizes = [
  { br: '33/34', us: '3', eu: '34', cm: '21,5' },
  { br: '35/36', us: '5', eu: '36', cm: '23' },
  { br: '37/38', us: '7', eu: '38', cm: '24,5' },
  { br: '39/40', us: '8', eu: '40', cm: '26' },
  { br: '41/42', us: '9.5', eu: '42', cm: '27,5' },
  { br: '43/44', us: '11', eu: '44', cm: '29' },
]

const shirtSizes = [
  { size: 'PP', chest: '88-94', waist: '74-80', length: '64' },
  { size: 'P', chest: '94-100', waist: '80-86', length: '67' },
  { size: 'M', chest: '100-106', waist: '86-92', length: '70' },
  { size: 'G', chest: '106-112', waist: '92-98', length: '73' },
  { size: 'GG', chest: '112-118', waist: '98-104', length: '76' },
  { size: 'XGG', chest: '118-124', waist: '104-110', length: '79' },
]

const oversizedSizes = [
  { size: 'P', chest: '108-112', length: '70', sleeve: '22' },
  { size: 'M', chest: '114-118', length: '73', sleeve: '23' },
  { size: 'G', chest: '120-124', length: '76', sleeve: '24' },
  { size: 'GG', chest: '126-130', length: '79', sleeve: '25' },
]

export default function GuiaMedidasPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-heading font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-2">
        Guia de Medidas
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Encontre o tamanho ideal para cada tipo de produto.
      </p>

      <section className="mb-12">
        <h2 className="font-heading font-bold text-lg uppercase tracking-tight mb-4">Calçados</h2>
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider">Brasil</th>
                <th className="text-left px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider">US</th>
                <th className="text-left px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider">EU</th>
                <th className="text-left px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider">Pé (cm)</th>
              </tr>
            </thead>
            <tbody>
              {footwearSizes.map((s) => (
                <tr key={s.br} className="border-b border-border/50">
                  <td className="px-4 py-2 font-medium">{s.br}</td>
                  <td className="px-4 py-2">{s.us}</td>
                  <td className="px-4 py-2">{s.eu}</td>
                  <td className="px-4 py-2">{s.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Meça do calcanhar ao dedão e compare com a tabela.</p>
      </section>

      <section className="mb-12">
        <h2 className="font-heading font-bold text-lg uppercase tracking-tight mb-4">Camisetas — Tradicional</h2>
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider">Tamanho</th>
                <th className="text-left px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider">Tórax (cm)</th>
                <th className="text-left px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider">Cintura (cm)</th>
                <th className="text-left px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider">Comprimento (cm)</th>
              </tr>
            </thead>
            <tbody>
              {shirtSizes.map((s) => (
                <tr key={s.size} className="border-b border-border/50">
                  <td className="px-4 py-2 font-medium">{s.size}</td>
                  <td className="px-4 py-2">{s.chest}</td>
                  <td className="px-4 py-2">{s.waist}</td>
                  <td className="px-4 py-2">{s.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-heading font-bold text-lg uppercase tracking-tight mb-4">Camisetas — Oversized / Streetwear</h2>
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider">Tamanho</th>
                <th className="text-left px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider">Tórax (cm)</th>
                <th className="text-left px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider">Comprimento (cm)</th>
                <th className="text-left px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider">Manga (cm)</th>
              </tr>
            </thead>
            <tbody>
              {oversizedSizes.map((s) => (
                <tr key={s.size} className="border-b border-border/50">
                  <td className="px-4 py-2 font-medium">{s.size}</td>
                  <td className="px-4 py-2">{s.chest}</td>
                  <td className="px-4 py-2">{s.length}</td>
                  <td className="px-4 py-2">{s.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
