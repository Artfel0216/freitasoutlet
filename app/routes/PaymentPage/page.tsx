'use client';

import HeaderCar from "@/app/components/HeaderCar/page";
import { CreditCard, House, Pencil, Wallet } from "lucide-react";

export default function PaymentPage() {
  return (
    <main>
      {/* Cabeçalho */}
      <HeaderCar />

      <div className="flex ml-4 mt-4 gap-6">

        {/* Coluna Esquerda - Entrega + Pagamento */}
        <section className="flex-1 text-white font-bold">
          {/* Seção de entrega */}
          <header className="flex justify-between items-center">
            <h1 className="text-[1.2rem]">Entrega</h1>
           
          </header>

          <address className="p-6 w-[54rem] h-[8rem] mt-4 border border-white rounded not-italic">
            <div className="flex items-center">
              <House size={20} />
              <div className="ml-4">
                <h2 className="font-bold text-lg leading-tight">
                  Arthur Fellipe
                </h2>
                <p className="text-gray-300">
                  Entrega para: Limoeiro-PE <br />
                  Rua da Alegria, 678, Centro - 52060904
                </p>
              </div>
            </div>
          </address>

          {/* Seção de pagamento */}
          <section className="mt-6">
            <h1 className="font-bold text-white text-[1.2rem]">Pagamento</h1>
            <p className="font-semibold text-white mt-2">
              Selecione a forma de pagamento:
            </p>

            {/* Opção Pix */}
            <article className="p-6 w-[54rem] h-[8rem] mt-4 border border-white rounded hover:border-green-500 cursor-pointer">
              <div className="flex items-center">
                <Wallet size={20} />
                <div className="ml-4">
                  <h2 className="font-bold text-lg leading-tight">Pix</h2>
                  <p className="text-gray-300">Aprovação imediata.</p>
                </div>
              </div>
            </article>

            {/* Opção Cartão */}
            <article className="p-6 w-[54rem] h-[8rem] mt-4 border border-white rounded hover:border-green-500 cursor-pointer">
              <div className="flex items-center">
                <CreditCard size={20} />
                <div className="ml-4">
                  <h2 className="font-bold text-lg leading-tight">
                    Cartão de Crédito
                  </h2>
                  <p className="text-gray-300">Em até 6x sem juros</p>
                </div>
              </div>
            </article>
          </section>
        </section>

        {/* Coluna Direita - Resumo */}
        <aside className="w-[25rem] h-fit bg-white text-black rounded shadow-md p-6 mr-20">
          <div className="flex justify-between mb-2">
            <span>Produtos</span>
            <span>R$ 399,99</span>
          </div>

          <div className="flex justify-between mb-2 text-green-600">
            <span>Desconto no Pix</span>
            <span>-R$ 20,00</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Total</span>
            <span className="font-extrabold text-lg text-black">
              R$ 379,99 <span className="text-sm font-normal">no Pix</span>
            </span>
          </div>

          <button className="w-full py-3 bg-green-500 text-white font-bold rounded hover:bg-green-700">
            Finalizar compra
          </button>
        </aside>
      </div>
    </main>
  );
}
