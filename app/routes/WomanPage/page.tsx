'use client';

import React from 'react';
import Header from '@/app/components/header/page';
import Contain from '@/app/components/contain/page';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
// Página Feminina
// ===========================================================
export default async function WomanPage() {
  // 1️⃣ Busca produtos femininos direto no banco
  const products = await prisma.product.findMany({
    where: {
      gender: 'FEMININO', // 👈 enum precisa estar em MAIÚSCULAS
    },
    include: {
      images: true, // agora existe no schema
      marca: true,  // pega a marca associada
    },
  });

  // 2️⃣ Mapeia produtos para o formato usado em tela
  const items = products.map((p) => {
    const sneakers =
      p.images.length > 0
        ? p.images.map((img) => ({
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

  // ===========================================================
  // Renderização
  // ===========================================================
  if (items.length === 0) {
    return (
      <div>
        <Header />
        <div className="w-full h-[1px] bg-gray-600"></div>
        <div className="flex flex-col justify-center items-center min-h-screen bg-black text-gray-400 text-lg">
          Nenhum produto encontrado na categoria{' '}
          <span className="text-white font-semibold">Feminino</span>.
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="w-full h-[1px] bg-gray-600"></div>

      <main className="min-h-screen bg-black p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
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
      </main>
    </div>
  );
}
