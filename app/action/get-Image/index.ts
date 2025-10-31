'use server';

import { PrismaClient } from "@/app/generated/prisma";


const prisma = new PrismaClient();

export async function getImagesByCategory(category?: string) {
  try {
    
    const imagesFromDB = await prisma.productMasculino.findMany({
      where: category ? { category } : {},
      orderBy: { id: "asc" },
    });
    console.log("📦 Imagens buscadas do DB:", imagesFromDB);

    return [...imagesFromDB];
  } catch (error) {
    console.error("Erro ao buscar imagens:", error);
    return [];
  }
}
