import { PrismaClient, Gender } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
try {

const products = await prisma.product.findMany({
where: { gender: Gender.KIDS },
include: { images: true, marca: true },
});


// Formata os produtos para enviar como JSON
const formattedProducts = products.map((p) => ({
  id: p.id,
  title: p.title,
  description: p.description ?? '',
  price: p.price,
  marcaName: p.marca?.name ?? '',
  sneakers:
    p.images.length > 0
      ? p.images.map((img) => ({
          src: img.url || `/imgKids/${img.filename}`,
          alt: img.filename ?? p.title ?? 'Produto',
        }))
      : [
          {
            src: '/imgCalcados/placeholder.png',
            alt: 'Imagem indisponível',
          },
        ],
}));

return new Response(JSON.stringify(formattedProducts), {
  headers: { 'Content-Type': 'application/json' },
});


} catch (err) {
console.error('Erro ao buscar produtos kids:', err);
return new Response(
JSON.stringify({ error: 'Erro ao buscar produtos kids' }),
{ status: 500, headers: { 'Content-Type': 'application/json' } }
);
}
}
