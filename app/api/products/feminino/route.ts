// app/api/products/feminino/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function formatUrlToImgCalcados(u?: string): string {
  if (!u) return '/imgCalcados/placeholder.png';
  const s = u.trim().replace(/^\.?\/?public\//, '');
  if (s.startsWith('http') || s.startsWith('data:')) return s;
  return s.startsWith('/') ? s : `/${s}`;
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { gender: 'FEMININO' },
      include: { images: true, marca: true },
    });

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.title ?? '',
      description: p.description ?? '',
      price:
        typeof p.price === 'number'
          ? new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(p.price)
          : '',
      marcaName: p.marca?.name ?? '',
      sneakers:
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
            ],
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Erro ao buscar produtos femininos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
