"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MapPin, Pencil } from "lucide-react";
import HeaderCar from "@/app/components/HeaderCar/page";
import Image from "next/image";

interface ProductImage {
  id: number;
  filename: string;
  url: string;
}

interface Marca {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  gender: string;
  productType: string;
  createdAt: string;
  updatedAt: string;
  marca?: Marca | null;
  images: ProductImage[];
}

export default function DeliveryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;
    console.log("ID recebido na DeliveryPage:", id);

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/product/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar produto");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      }
    }

    fetchProduct();
  }, [id]);

  const handleGoToPayment = () => {
    router.push("/routes/PaymentPage/");
  };

  return (
    <main>
      {/* Cabeçalho */}
      <HeaderCar />

      {/* Endereço */}
      <section className="flex text-white">
        <article className="ml-6 mt-10 h-[14rem] w-[50rem] rounded border border-white bg-black p-6">
          <h1 className="mb-4 flex items-center gap-2 text-[1.2rem] font-bold">
            <MapPin size={25} />
            Endereço:
          </h1>

          <address className="mt-10 not-italic text-[1rem] font-medium">
            Rua da Alegria, 678, Centro, Limoeiro, PE, 55700-000
          </address>

          <button className="mt-6 flex items-center gap-2 text-[1rem] font-bold text-green-500 underline cursor-pointer">
            Editar ou Escolher outro
            <Pencil size={20} />
          </button>
        </article>

        <aside className="ml-[10rem] mt-16 flex h-[10rem] w-[30rem] items-center justify-center rounded bg-white">
          <button
            onClick={handleGoToPayment}
            className="flex h-[3rem] w-[20rem] items-center justify-center rounded bg-black font-bold text-white cursor-pointer"
          >
            Ir para Pagamento
          </button>
        </aside>
      </section>

      {/* Produto */}
      <section className="flex">
        <article className="ml-6 mt-4 flex h-[20rem] w-[60rem] items-center gap-6 rounded border border-white p-6 text-white bg-black">
          {product ? (
            <>
              <div className="relative w-[10rem] h-[10rem] rounded overflow-hidden">
                <Image
                  src={product.images?.[0]?.url || "/imgCalcados/placeholder.png"}
                  alt={product.images?.[0]?.filename || "Produto"}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 10rem"
                  className="object-cover rounded"
                />
              </div>

              <div className="flex flex-col">
                <h2 className="font-bold text-lg">{product.title}</h2>
                <p className="text-gray-400 mt-1">
                  {product.description || "Sem descrição disponível."}
                </p>

                <p className="mt-2 font-medium text-gray-300">
                  Marca: {product.marca?.name || "Desconhecida"}
                </p>

                <p className="mt-2 text-gray-300">
                  Tipo de produto:{" "}
                  <span className="font-semibold">{product.productType}</span>
                </p>

                <p className="mt-1 text-gray-300">
                  Gênero:{" "}
                  <span className="font-semibold">{product.gender}</span>
                </p>

                <p className="mt-2 font-bold text-green-400">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.price)}
                </p>

                <p className="mt-3 text-gray-400 text-sm">
                  Criado em:{" "}
                  {new Date(product.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <p className="text-gray-400 text-sm">
                  Atualizado em:{" "}
                  {new Date(product.updatedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="ml-20 h-[11rem] w-[1px] bg-white" />

              <p className="ml-20 font-bold">Entrega: 11 a 12 dias úteis</p>
            </>
          ) : (
            <p>Carregando informações do produto...</p>
          )}
        </article>
      </section>
    </main>
  );
}
