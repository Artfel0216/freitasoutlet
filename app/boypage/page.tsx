'use client';

import React from 'react';
import Header from '../components/header/page';
import Contain from '@/app/components/contain/page';
import SlipperAsunaAllBlack from "@/app/public/imgCalçados/ChineloAsunaAllBlack.jpg";
import SlipperAsunaBeige from "@/app/public/imgCalçados/ChineloAsunabege.jpg";
import SlipperAsunaGray from "@/app/public/imgCalçados/ChineloAsunaCinza.jpg";
import SlipperAsunaBlack from '@/app/public/imgCalçados/ChineloAsunaPreto.jpg';
import SneakersVansAllBlack from '@/app/public/imgCalçados/TenisVansAllBlack.jpg';
import SneakersVansAllWhite from '@/app/public/imgCalçados/TenisVansAllWhite.jpg';
import SneakersVansBrown from '@/app/public/imgCalçados/TenisVansBrown.jpg';
import SneakersVansBlack from '@/app/public/imgCalçados/TenisVansBlack.jpg';
import SneakersAirForceAllBlack from '@/app/public/imgCalçados/TênisNikeAirForceLinhaPremiumBlack.jpg';
import SneakersAirForceAllWhite from '@/app/public/imgCalçados/TênisNikeAirForceLinhaPremiumWhite.jpg';
import SneakersAirForceLinhaPremiumstringBlack from '@/app/public/imgCalçados/Tênis NikeAirForceLinhaPremiumCordaPreta.jpg'
import SneakersAirForceLinhaPremiumstringWhite from '@/app/public/imgCalçados/Tênis NikeAirForceLinhaPremiumCordaBranca.jpg';


// Product data
const AsunaSlippers = [
  {
    src: SlipperAsunaAllBlack.src,
    alt: 'Asuna Slipper'
  },
  {
    src: SlipperAsunaBeige.src,
    alt: 'Asuna Slipper'
  },
  {
    src: SlipperAsunaGray.src,
    alt: 'Asuna Slipper'
  },
  {
    src: SlipperAsunaBlack.src,
    alt: 'Asuna Slipper'
  }   
];

const VansSneakers = [
  {
    src: SneakersVansAllBlack.src,
    alt: 'Vans VR3 Neo All Black Sneakers'
  },
  {
    src: SneakersVansAllWhite.src,
    alt: 'Vans VR3 Neo White Sneakers'
  },
  {
    src: SneakersVansBlack.src,
    alt: 'Vans VR3 Neo Black Sneakers'
  },
  {
    src: SneakersVansBrown.src,
    alt: 'Vans VR3 Neo Brown Sneakers'
  }

];

const AirForceSneakers = [
  {
    src: SneakersAirForceAllBlack.src,
    alt: 'Nike Air Force All Black',
  },
  {
    src: SneakersAirForceAllWhite.src,
    alt: 'Nike Air Force White',
  },
  {
    src: SneakersAirForceLinhaPremiumstringBlack.src,
    alt: 'Nike Air Force Black with String',
  },
  {
    src: SneakersAirForceLinhaPremiumstringWhite.src,
    alt: 'Nike Air Force White with String',
  }
  
]

// Main page
export default function BoyPage() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Divider */}
      <div className="w-full h-[1px] bg-gray-500"></div>

      {/* Main content */}
      <div className="min-h-screen bg-black p-8">
        <main className="flex gap-2 items-center justify-center">
          <Contain
            sneakers={AsunaSlippers}
            title="Asuna Slipper Premium Line"
            price="R$ 150,00"
          />
          <Contain
            sneakers={VansSneakers}
            title="Vans VR3 Sneakers"
            price="R$ 100,00"
          />
          <Contain
            sneakers={AirForceSneakers}
            title="Nike Air Force Premium Line"
            price="R$ 86,00"
          />
        </main>

        <main className="flex gap-2 items-center justify-center">
        </main>
      </div>
    </div>
  );
}
