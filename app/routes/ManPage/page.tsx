import React from 'react';
import Header from '@/app/components/header/page';
import Contain from '@/app/components/contain/page';
import { getProducts } from '@/app/action/get-Products';

function formatUrlToImgCalcados(u?: string) {
  if (!u) return '';
  const s = u.trim().replace(/^\.?\/?public\//, '');
  if (s.startsWith('http') || s.startsWith('data:')) return s;
  if (s.includes('imgCalcados')) return s.startsWith('/') ? s : `/${s.replace(/^\/+/, '')}`;
  const parts = s.split('/').filter(Boolean);
  const basename = parts.pop() ?? s;
  return `/imgCalcados/${basename}`;
}

export default async function ManPage() {
  const products = await getProducts();

  const items = (products ?? []).map((p) => {
    const sneakers =
      (p.images ?? []).length > 0
        ? p.images.map((i: any) => ({
            src: formatUrlToImgCalcados(i.url),
            alt: i.altText ?? p.title ?? 'Produto',
          }))
        : [
            {
              src: '/imgCalcados/placeholder.png',
              alt: 'Imagem indisponível',
            },
          ];

    const price =
      typeof p.price === 'number'
        ? new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(p.price)
        : '';

    return {
      id: String(p.id),
      name: p.title ?? '',
      description: p.description ?? '',
      price,
      marcaName: p.marca?.name ?? '',
      sneakers,
    };
  });

  // ordena por marca e título
  items.sort((a, b) => {
    const ma = (a.marcaName ?? '').toLowerCase();
    const mb = (b.marcaName ?? '').toLowerCase();
    if (ma !== mb) return ma.localeCompare(mb);
    return (a.name ?? '').toLowerCase().localeCompare((b.name ?? '').toLowerCase());
  });

  return (
    <div>
      <Header />
      <div className="w-full h-[1px] bg-gray-500"></div>

      <div className="min-h-screen bg-black p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 place-items-center">
          {items.map((item, idx) => (
            <Contain
              key={idx}
              sneakers={item.sneakers}
              title={item.name}
              description={item.description}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
