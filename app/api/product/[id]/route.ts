import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: numericId },
      include: {
        marca: true,
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Corrige URLs das imagens (caso venham com /public/)
    const images = product.images.map((img) => ({
      id: img.id,
      filename: img.filename,
      url: img.url.replace(/^\.?\/?public\//, "/"),
    }));

    const responseData = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      gender: product.gender,
      productType: product.productType,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      marca: product.marca ? { name: product.marca.name } : null,
      images,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Erro interno da API de produto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
