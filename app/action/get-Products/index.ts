import { PrismaClient, Product, ProductImage, Marca } from "@prisma/client";

const prisma = new PrismaClient();

function formatUrlToImgCalcados(u?: string) {
  if (!u) return '';
  const s = u.trim().replace(/^\.?\/?public\//, ''); 
  if (s.startsWith('http') || s.startsWith('data:')) return s;

  // garante que o caminho sempre comece com /
  const clean = s.startsWith('/') ? s : `/${s}`;
  return clean;
}


/**
 * Retorna todos os produtos com marca e imagens.
 */
export async function getProducts(): Promise<
  (Product & { images: ProductImage[]; marca: Marca | null })[]
> {
  const products = await prisma.product.findMany({
    include: {
      images: true,
      marca: true,
    },
  });

  return products.map((p) => ({
    ...p,
    images: p.images.map((img) => ({
      ...img,
      url: formatUrlToImgCalcados(img.url),
    })),
  }));
}
