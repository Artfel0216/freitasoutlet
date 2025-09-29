'use client';

import { useRouter } from "next/navigation";
import { MapPin, Pencil } from "lucide-react";
import HeaderCar from "@/app/components/HeaderCar/page";
import NikeAirZoomAlphafly2WhiteFireRed from '@/app/public/imgCalçados/NikeAirZoomAlphafly2WhiteFire.jpg';

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
          <img
            src={NikeAirZoomAlphafly2WhiteFireRed.src}
            alt="Tênis Air Zoom Alphafly 2"
            className="h-[10rem] w-[10rem] rounded object-cover"
          />

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
