import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ====================================================
  // 1️⃣ Criar Marcas
  // ====================================================
  const marcas = await prisma.marca.createMany({
    data: [
      { name: 'Nike', slug: 'nike' },
      { name: 'Adidas', slug: 'adidas' },
      { name: 'Puma', slug: 'puma' },
    ],
  });
  console.log(`✅ Marcas criadas: ${marcas.count}`);

  // ====================================================
  // 2️⃣ Criar Produtos
  // ====================================================
  const produtos = await prisma.product.createMany({
    data: [
      {
        title: 'Tênis Nike Air Zoom',
        description: 'Tênis confortável com amortecimento responsivo.',
        price: 499.9,
        gender: 'MASCULINO',
        productType: 'SAPATO',
        marcaId: 1,
      },
      {
        title: 'Sandália Adidas Adilette',
        description: 'Sandália leve e moderna.',
        price: 189.9,
        gender: 'FEMININO',
        productType: 'SANDALIA',
        marcaId: 2,
      },
      {
        title: 'Tênis Infantil Puma Fun',
        description: 'Tênis colorido e confortável para crianças.',
        price: 259.9,
        gender: 'KIDS',
        productType: 'SAPATO',
        marcaId: 3,
      },
    ],
  });
  console.log(`✅ Produtos criados: ${produtos.count}`);

  // ====================================================
  // 3️⃣ Criar Imagens
  // ====================================================
  const basePath = path.join(process.cwd(), 'public');
  const categorias = ['imgCalcados', 'imgCalcadosWoman', 'imgKids'];

  for (const category of categorias) {
    const folderPath = path.join(basePath, category);
    if (!fs.existsSync(folderPath)) continue;

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);

      // apenas arquivos de imagem
      if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;

      await prisma.productImage.create({
        data: {
          title: path.parse(file).name,
          filename: file,
          url: `/${category}/${file}`,
          path: filePath,
          category,
          mime: 'image/jpeg',
          size: fs.statSync(filePath).size,
          productId:
            category === 'imgCalcados' ? 1 :
            category === 'imgCalcadosWoman' ? 2 :
            category === 'imgKids' ? 3 :
            null,
        },
      });
    }
  }

  console.log('✅ Imagens criadas com base nas pastas locais.');
  console.log('🌱 Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
