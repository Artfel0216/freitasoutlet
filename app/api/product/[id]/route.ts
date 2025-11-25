import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

function normalizeImage(i: { filename?: string | null; url?: string | null }) {
  const f = i?.filename ?? i?.url ?? "";
  if (!f) return "";
  const s = String(f).trim().replace(/^\.?\/?public\//, "");
  if (s.startsWith("http") || s.startsWith("data:")) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "id inválido" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { id: "asc" } },
      marca: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  // normaliza imagens para retornar src utilizável no front (/imgCalcados/xxx.jpg ou URL absoluta)
  const images = (product.images ?? []).map((img) => ({
    id: img.id,
    filename: img.filename,
    url: normalizeImage(img),
    altText: img.filename ?? img.url ?? product.title ?? "",
  }));

  const response = {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    gender: product.gender,
    productType: product.productType,
    marca: product.marca,
    images,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };

  return NextResponse.json(response);
}
