import React from "react";
import Header from "@/app/components/header/page";
import Contain from "@/app/components/contain/page";
import { Product, ProductImage, Marca, Gender } from "@prisma/client";
import { prisma } from "@/app/lib/prisma"; // ✅ usa o prisma global seguro
import { getProducts } from "@/app/action/get-Products";

interface ProductWithRelations extends Product {
  images: ProductImage[];
  marca: Marca | null;
}

function formatUrlToImgCalcados(u?: string): string {
  if (!u) return "/imgCalcados/placeholder.png";
  const s = u.trim().replace(/^\.?\/?public\//, "");
  if (s.startsWith("http") || s.startsWith("data:")) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

export default async function KidsPage() {
  // ✅ busca todos os produtos
  const products = (await getProducts()) as ProductWithRelations[];

  // ✅ filtra apenas produtos infantis
  const kidsProducts = products.filter((p) => p.gender === Gender.KIDS);

  // ✅ busca imagens separadamente (opcional)
  const images = await prisma.productImage.findMany();

  const items = kidsProducts.map((p) => {
    const productImages = images.filter((img) => img.productId === p.id);

    const sneakers =
      productImages.length > 0
        ? productImages.map((img) => ({
            src: formatUrlToImgCalcados(img.url),
            alt: img.filename ?? p.title ?? "Produto",
          }))
        : [
            {
              src: "/imgCalcados/placeholder.png",
              alt: "Imagem indisponível",
            },
          ];

    const price =
      typeof p.price === "number"
        ? new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(p.price)
        : "";

    return {
      id: String(p.id),
      name: p.title ?? "",
      description: p.description ?? "",
      price,
      marcaName: p.marca?.name ?? "",
      sneakers,
    };
  });

  // ✅ ordenação alfabética por marca e nome
  items.sort((a, b) => {
    const ma = (a.marcaName ?? "").toLowerCase();
    const mb = (b.marcaName ?? "").toLowerCase();
    if (ma !== mb) return ma.localeCompare(mb);
    return (a.name ?? "").toLowerCase().localeCompare((b.name ?? "").toLowerCase());
  });

  // ✅ renderização
  return (
    <div>
      <Header />
      <div className="w-full h-[1px] bg-gray-500"></div>

      <div className="min-h-screen bg-black p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 place-items-center">
  {items.map((item) => (
    <Contain
      key={item.id}
      id={item.id} // ✅ Adicionado — o TypeScript exige essa prop
      sneakers={item.sneakers}
      title={item.name}
      description={item.description}
      price={item.price}
    />
  ))}
</div>

        {items.length === 0 && (
          <div className="flex flex-col justify-center items-center min-h-screen bg-black text-gray-400 text-lg">
            Nenhum produto encontrado na categoria{" "}
            <span className="text-white font-semibold">Infantil</span>.
          </div>
        )}
      </div>
    </div>
  );
}
