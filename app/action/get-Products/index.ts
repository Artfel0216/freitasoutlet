'use server';

import { prisma } from "../../lib/prisma";

function normalizeUrl(u?: string) {
  if (!u) return '';
  const s = u.trim().replace(/^\.?\/?public\//, '');

  if (s.startsWith('http') || s.startsWith('data:')) return s;
  if (s.includes('imgCalcados')) return s.startsWith('/') ? s : `/${s.replace(/^\/+/, '')}`;

  const parts = s.split('/').filter(Boolean);
  const basename = parts.pop() ?? s;
  return `/imgCalcados/${basename}`;
}

export async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      marca: { select: { id: true, name: true, slug: true } },
      images: { select: { id: true, url: true, filename: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // normaliza URLs
  return products.map((p) => ({
    ...p,
    images: (p.images ?? []).map((img) => ({
      id: img.id,
      url: normalizeUrl(img.url ?? img.filename ?? ''),
      altText: p.title ?? 'Produto',
    })),
  }));
}
