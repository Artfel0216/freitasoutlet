'use client';

import HeaderCar from "@/app/components/HeaderCar/page";
import NikeAirZoomAlphafly2GreenAndBlack from '@/app/public/imgCalçados/NikeAirZoomAlphafly2GreenAndBlack.jpg';
import { Plus, Trash } from "lucide-react";

export default function CarPage() {
  return (
    <div>
      {/* Header */}
      <HeaderCar />

      <main className="flex">
        {/* Produto no carrinho */}
        <article className="border border-gray-500 rounded w-[65rem] h-[15rem] mt-10 ml-2 flex text-white p-6 hover:border-green-500 transition duration-300">
          <figure>
            <img
              src={NikeAirZoomAlphafly2GreenAndBlack.src}
              alt="Nike Air Zoom Alphafly 2 Verde e Preto"
              className="w-[12rem] h-[12rem] object-cover rounded"
            />
          </figure>

          {/* Informações do produto */}
          <section className="ml-6 flex flex-col">
            <h1 className="font-bold mt-6">Nike Air Zoom Alphafly 2</h1>
            <p className="mt-2">
              Tamanho: <strong className="font-bold">40</strong>
            </p>
            <p className="mt-2">
              Cor: <strong className="font-bold text-green-600">Verde</strong>
            </p>
            <p className="mt-2">
              Vendido e entregue por:{" "}
              <strong className="font-bold">Freitas Outlet</strong>
            </p>
          </section>

          {/* Controles de quantidade */}
          <section className="flex items-center ml-30 gap-10">
            <button className="rounded-full border-white border-[2px] w-[3rem] h-[3rem] text-white flex items-center justify-center hover:border-red-500 transition duration-300 cursor-pointer">
              <Trash />
            </button>

            <p className="font-bold text-[1.5rem]">1</p>

            <button className="rounded-full border-white border-[2px] w-[3rem] h-[3rem] text-white flex items-center justify-center hover:border-green-500 transition duration-300 cursor-pointer">
              <Plus />
            </button>
          </section>

          {/* Preço */}
          <p className="font-bold text-white text-[1.2rem] ml-24 mt-20">
            R$ 800,00
          </p>
        </article>

        {/* Resumo do pedido */}
        <aside className="w-[29rem] h-[15rem] mt-10 ml-2 bg-white opacity-70 rounded text-black font-semibold flex flex-col align-center p-6">
          <div className="flex">
            <p className="text-[1.2rem] font-bold">Produtos: </p>
            <p className="text-[1.2rem] ml-60">R$ 800,00</p>
          </div>

          <div className="w-[26rem] mt-4 bg-black h-[2px]"></div>

          <div className="flex">
            <p className="mt-4 text-[1.1rem] font-bold">Total: </p>

            <p className="mt-4 font-bold ml-60 text-[1.5rem] flex-col">
              R$ 800,00 <br />
              <span className="text-[0.7rem] font-normal text-black flex">
                ou <strong>6x de R$ 133,33 sem juros</strong>
              </span>
            </p>
          </div>

          <button className="bg-green-400 rounded cursor-pointer font-semibold h-[2.5rem] mt-4 hover:bg-green-600">
            Continuar
          </button>
        </aside>
      </main>

      {/* Descrição do produto */}
      <section className="text-white mt-4 p-2 font-bold text-center">
        <h2 className="text-xl">Nike Air Zoom Alphafly 2</h2>
        <p className="mt-4">
          O Nike Air Zoom Alphafly 2 foi desenvolvido para quem busca velocidade
          máxima, eficiência e conforto em longas distâncias. <br />
          Projetado a partir do feedback de atletas de elite, ele combina
          tecnologia de ponta com design inovador para proporcionar desempenho
          incomparável.
        </p>

        <ul className="mt-4 space-y-2">
          <li>
            <strong>Impulso explosivo:</strong> As cápsulas duplas de Zoom Air
            na região do antepé oferecem resposta imediata a cada passada.
          </li>
          <li>
            <strong>Estabilidade e suporte:</strong> A placa de carbono de
            comprimento total garante transições mais rápidas e consistentes
            durante a corrida.
          </li>
          <li>
            <strong>Amortecimento premium:</strong> A espuma ZoomX proporciona
            maciez e retorno de energia excepcionais, mesmo em treinos ou provas
            mais longas.
          </li>
        </ul>
      </section>
    </div>
  );
}
