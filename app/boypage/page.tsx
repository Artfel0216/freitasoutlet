'use client';

import React from 'react';

import Header from '../components/header/page';
import Contain from '@/app/components/contain/page';

import SneackersBrown from '@/public/HugoBossMarrom.jpeg';
import SneackersBlack from '@/public/HugoBossPreto.jpeg';
import ArmaniBlack from '@/public/Amani-black.jpeg';
import ArmaniWhite from '@/public/Armani-white.jpeg';
import BossBlack from '@/public/Boss-black.jpeg';
import BossWhite from '@/public/Boss-white.jpeg';
import LeatherBeige from '@/public/Leather-beige.jpeg';
import LeatherBlack from '@/public/Leather-black.jpeg';
import NewBalanceBeige from '@/public/NewBalance-beige.jpeg';
import NewBalanceBlack from '@/public/NewBalance-black.jpeg';
import ReservaBlack from '@/public/Reserva-black.jpeg';
import ReservaWhite from '@/public/Reserva-white.jpeg';

// Dados dos produtos
const sneakersHugoBoss = [
  {
    src: SneackersBlack.src,
    alt: 'Tênis Hugo Boss Preto'
  },
  {
    src: SneackersBrown.src,
    alt: 'Tênis Hugo Boss Marrom'
  }
];

const sneakersArmani = [
  {
    src: ArmaniBlack.src,
    alt: 'Tênis Armani preto'
  },
  {
    src: ArmaniWhite.src,
    alt: 'Tênis Armani branco'
  }
];

const sneakersBoss = [
  {
    src: BossBlack.src,
    alt: 'Tênis Hugo Boss preto'
  },
  {
    src: BossWhite.src,
    alt: 'Tênis Hugo Boss branco'
  }
];
const sneakersLeather = [
  {
    src: LeatherBlack.src,
    alt: 'Tênis couro Preto'
  },
  {
    src: LeatherBeige.src,
    alt: 'Tênis couro Bege'
  }
];

const sneakersNewBalance = [
  {
    src: NewBalanceBlack.src,
    alt: 'Tênis New Balance preto'
  },
  {
    src: NewBalanceBeige.src,
    alt: 'Tênis New Balance bege'
  }
];

const sneakersReserva = [
  {
    src: ReservaBlack.src,
    alt: 'Tênis Reserva preto'
  },
  {
    src: ReservaWhite.src,
    alt: 'Tênis Reserva branco'
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
