import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * Normaliza nomes de arquivos:
 * - Remove acentos
 * - Substitui espaços e caracteres inválidos por '-'
 */
function normalizeFilename(filename: string) {
  return filename
    .normalize('NFD') // separa acentos
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/\s+/g, '-') // espaços -> "-"
    .replace(/[^a-zA-Z0-9\-_.]/g, '') // remove caracteres inválidos
    .toLowerCase();
}

async function main() {
  const baseDir = path.join(process.cwd(), 'public', 'imgCalcados');
  if (!fs.existsSync(baseDir)) {
    console.log(`⚠️ Pasta não encontrada: ${baseDir}`);
    return;
  }

  const files = fs.readdirSync(baseDir);
  console.log(`🖼️ Encontradas ${files.length} imagens na pasta imgCalcados\n`);

  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const allProducts = await prisma.product.findMany();

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!validExtensions.includes(ext)) continue;

    const rawName = path.basename(file);
    const normalizedName = normalizeFilename(rawName);

    const url = `/imgCalcados/${normalizedName}`;

    // Verifica duplicidade
    const existing = await prisma.productImage.findFirst({ where: { url } });
    if (existing) {
      console.log(`⚠️ Já existe: ${normalizedName}`);
      continue;
    }

    // Buscar produto pelo nome aproximado
    const titleLike = path.parse(file).name.toLowerCase();
    const product = allProducts.find(p => p.title.toLowerCase().includes(titleLike));

    // Renomeia arquivo fisicamente para corresponder ao URL normalizado
    const oldPath = path.join(baseDir, file);
    const newPath = path.join(baseDir, normalizedName);
    if (!fs.existsSync(newPath)) {
      fs.renameSync(oldPath, newPath);
    }

    // Cria registro no banco
    await prisma.productImage.create({
      data: {
        url,
        filename: normalizedName,
        category: 'calcado',
        productId: product?.id ?? null,
      },
    });

    console.log(
      `✅ Inserido: ${normalizedName} ${product ? `(ligado a "${product.title}")` : '(sem produto)'}`
    );
  }

  console.log('\n🎉 Seed finalizado com sucesso!');
}

main()
  .catch(e => console.error('❌ Erro no seed:', e))
  .finally(async () => {
    await prisma.$disconnect();
  });
