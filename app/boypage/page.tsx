'use client';

import React from 'react';
import Header from '../components/header/page';
import Contain from '@/app/components/contain/page';
import SlipperAsunaAllBlack from "@/app/public/imgCalçados/ChineloAsunaAllBlack.jpg"
import SlipperAsunaBege from "@/app/public/imgCalçados/ChineloAsunabege.jpg"
import SlliperAsunaCinza from "@/app/public/imgCalçados/ChineloAsunaCinza.jpg"
import SlliperAsunaPreto from '@/app/public/imgCalçados/ChineloAsunaPreto.jpg'



// Dados dos produtos
const sneakersHugoBoss = [
  {
    src: SlipperAsunaAllBlack.src,
    alt: ''
  },
  {
    src: SlipperAsunaBege.src,
    alt: ''
  },
  {
    src: 
  }
];


// Página principal
export default function BoyPage() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Divisor */}
      <div className="w-full h-[1px] bg-gray-500"></div>

      {/* Conteúdo principal */}
      <div className="min-h-screen bg-black p-8">
        <main className="flex gap-2 items-center justify-center">
          <Contain
            sneakers={sneakersHugoBoss}
            title="Tênis Hugo Boss"
            price="R$ 199,99"
          />
          <Contain
            sneakers={sneakersArmani}
            title="Tênis Armani"
            price="R$ 299,99"
          />
          <Contain
          sneakers={sneakersBoss}
          title="Tênis Boss"
          price="R$ 129,99"
          />
        </main>

        <main className='flex gap-2 items-center justify-center'>
          <Contain
            sneakers={sneakersLeather}
            title="Tênis Hugo Boss"
            price="R$ 199,99"
          />

          <Contain
            sneakers={sneakersNewBalance}
            title="Tênis New Balance"
            price="R$ 299,99"
          />
          <Contain
            sneakers={sneakersReserva}
            title="Tênis Reserva"
            price="R$ 129,99"
          />
        </main>
      </div>
    </div>
  );
}
