import React from 'react';
import Header from '@/app/components/header/page';
import Contain from '@/app/components/contain/page';
import { PrismaClient, Product, ProductImage, Marca } from '@prisma/client';
import { getProducts } from '@/app/action/get-Products';

const prisma = new PrismaClient();

// ===========================================================
// Tipos derivados do Prisma
// ===========================================================
interface ProductWithRelations extends Product {
  images: ProductImage[];
  marca: Marca | null;
}

// ===========================================================
// Função para formatar URLs das imagens corretamente
// ===========================================================
function formatUrlToImgCalcados(u?: string): string {
  if (!u) return '/imgCalcados/placeholder.png';
  const s = u.trim().replace(/^\.?\/?public\//, '');
  if (s.startsWith('http') || s.startsWith('data:')) return s;
  return s.startsWith('/') ? s : `/${s}`;
}

// ===========================================================
// Página principal
// ===========================================================
export default async function ManPage() {
  // 1️⃣ Busca produtos
  const products = (await getProducts()) as ProductWithRelations[];

  // 2️⃣ Busca todas as imagens separadamente
  const images = await prisma.productImage.findMany();

  // 3️⃣ Mapear imagens para cada produto
  const items = products.map((p) => {
    const productImages = images.filter(img => img.productId === p.id);

    const sneakers =
      productImages.length > 0
        ? productImages.map((img) => ({
            src: formatUrlToImgCalcados(img.url),
            alt: img.filename ?? p.title ?? 'Produto',
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

  // 4️⃣ Ordena por marca e depois por nome
  items.sort((a, b) => {
    const ma = (a.marcaName ?? '').toLowerCase();
    const mb = (b.marcaName ?? '').toLowerCase();
    if (ma !== mb) return ma.localeCompare(mb);
    return (a.name ?? '').toLowerCase().localeCompare((b.name ?? '').toLowerCase());
  });

  // ===========================================================
  // Renderização
  // ===========================================================
  return (
    <div>
      <Header />
      <div className="w-full h-[1px] bg-gray-500"></div>

      <div className="min-h-screen bg-black p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 place-items-center">
          {items.map((item) => (
            <Contain
              key={item.id}
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
