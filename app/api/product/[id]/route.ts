import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        marca: true,
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    const imageUrl = product.images[0]?.url
      ? product.images[0].url.replace(/^\.?\/?public\//, '/')
      : '/imgCalcados/placeholder.png';

    const price =
      typeof product.price === 'number'
        ? new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(product.price)
        : '';

    return NextResponse.json({
      id: product.id,
      title: product.title,
      description: product.description,
      marcaName: product.marca?.name ?? '',
      price,
      rawPrice: product.price,
      imageUrl,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
