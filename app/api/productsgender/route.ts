import { prisma } from "@/app/lib/prisma";
import { Gender } from "@prisma/client";
import { NextResponse } from "next/server";

// Normaliza caminho para /public
function normalizeToPublicSrc(value?: string | null) {
  if (!value) return "";

  const s = String(value)
    .trim()
    .replace(/^\.?\/?public\//, ""); // remove "public/" se existir

  // Se já for URL completa, retornar direto
  if (s.startsWith("http") || s.startsWith("data:")) return s;

  // Se já estiver no diretório imgCalcados
  if (s.includes("imgCalcados")) return s.startsWith("/") ? s : `/${s}`;

  // Caso seja somente o nome do arquivo
  const parts = s.split("/").filter(Boolean);
  const basename = parts.pop() ?? s;

  return `/imgCalcados/${basename}`;
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        gender: Gender.MASCULINO,
      },
      include: {
        images: true,
        marca: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = products.map((product) => {
      const images = product.images.map((img) => ({
        id: img.id,
        src: normalizeToPublicSrc(img.filename || img.url),
        altText: product.title,
        isMain: false,
      }));

      // define primeira imagem como principal
      if (images.length > 0) images[0].isMain = true;

      return {
        id: product.id,
        title: product.title,             // ✔ título do banco
        description: product.description, // ✔ descrição
        price: product.price,             // ✔ preço do banco
        gender: product.gender,
        productType: product.productType,
        marca: product.marca
          ? { id: product.marca.id, name: product.marca.name }
          : null,                         // ✔ marca do banco
        images,                           // ✔ imagens corrigidas
      };
    });

    return NextResponse.json(mapped);

  } catch (error) {
    console.error("Erro ao carregar produtos masculinos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos masculinos" },
      { status: 500 }
    );
  }
}
