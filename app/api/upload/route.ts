import { PrismaClient } from "@/app/generated/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string; // Ex: "imgCalcados"
    

    if (!file || !category) {
      return new Response("Arquivo ou categoria não enviada", { status: 400 });
    }

    // Caminho da pasta (ex: public/imgCalcados)
    const folderPath = path.join(process.cwd(), "public", category);
    await mkdir(folderPath, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(folderPath, file.name);

    // Salva o arquivo fisicamente
    await writeFile(filePath, buffer);

    // Caminho acessível pelo navegador
    const imageUrl = `/${category}/${file.name}`;

    // Salva os metadados no banco
    const image = await prisma.productMasculino.create({
      data: {
        title,
        filename: file.name,
        path: filePath,
        url: imageUrl,
        category,
        mime: file.type,
        size: file.size,
      },
    });

    return Response.json(image);
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return new Response("Erro no upload", { status: 500 });
  }
}
