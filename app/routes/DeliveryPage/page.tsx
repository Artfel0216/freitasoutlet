'use client';

import { useRouter } from "next/navigation";
import { MapPin, Pencil } from "lucide-react";
import HeaderCar from "@/app/components/HeaderCar/page";
import { prisma } from "@/app/lib/prisma/index"
import { NextRequest } from "next/server";

export default function DeliveryPage() {
  const router = useRouter();

  const handleGoToPayment = () => {
    router.push("/routes/PaymentPage/");
  };

  return (
    <main>
      {/* Cabeçalho */}
      <HeaderCar />

      {/* Endereço e botão de pagamento */}
      <section className="flex text-white">
        <article className="ml-6 mt-10 h-[14rem] w-[50rem] rounded border border-white bg-black p-6">
          <h1 className="mb-4 flex items-center gap-2 text-[1.2rem] font-bold">
            <MapPin size={25} />
            Endereço:
          </h1>

          <address className="mt-10 not-italic text-[1rem] font-medium">
            Rua Da Alegria, 678, Centro, Limoeiro, PE, 5570000
          </address>

          <button className="mt-18 flex items-center gap-2 text-[1rem] font-bold text-green-500 underline cursor-pointer">
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
        <article className="ml-6 mt-4 flex h-[14rem] w-[50rem] items-center gap-4 rounded border border-white p-6 text-white">
          <div className="flex flex-col">
            <h2 className="font-bold">Tênis Air Zoom Alphafly 2</h2>
            <p className="font-bold">Tamanho: 40</p>
            <p className="font-bold">Cor: Branco/Vermelho</p>
          </div>

          <div className="ml-20 h-[11rem] w-[1px] bg-white" />

          <p className="ml-20 font-bold">11 a 12 dias úteis</p>
        </article>
      </section>
    </main>
  );
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return new Response(JSON.stringify({ error: "Invalid id" }), { status: 400, headers: { "content-type": "application/json" } });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      marca: true,
    },
  });

  if (!product) {
    return new Response(JSON.stringify({ error: "Product not found" }), { status: 404, headers: { "content-type": "application/json" } });
  }

  return new Response(JSON.stringify(product), { status: 200, headers: { "content-type": "application/json" } });
}
