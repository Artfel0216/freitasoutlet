'use client';

import Header from "@/app/components/header/page";
import Contain from "@/app/components/contain/page";

import NikeAirforceBlack from "@/app/public/imgKids/NikeAirforceBlack.jpg";
import NikeAirforceBobGoodiesBlue from "@/app/public/imgKids/NikeAirforceBobGoodiesBlue.jpg";
import NikeAirforceBobGoodiesPink from "@/app/public/imgKids/NikeAirforceBobGoodiesPink.jpg";
import NikeAirforceBobGoodiesWhite from "@/app/public/imgKids/NikeAirforceBobGoodiesWhite.jpg";
import NikeAirforceStichBlue from "@/app/public/imgKids/NikeAirforceStichBlue.jpg";
import NikeAirforceStichWhite  from "@/app/public/imgKids/NikeAirforceStichWhite .jpg";
import NikeAirforceWhite from "@/app/public/imgKids/NikeAirforceWhite.jpg";
import NikeDunkAllBalck from "@/app/public/imgKids/NikeDunkAllBalck.jpg";
import NikeDunkBlackAndRed from "@/app/public/imgKids/NikeDunkBlackAndRed.jpg";
import NikeDunkBlackAndWhite from "@/app/public/imgKids/NikeDunkBlackAndWhite.jpg";

const NikeAirforce = [
  { src: NikeAirforceBlack.src, alt: 'Nike Air Force Black' },
  { src: NikeAirforceWhite.src, alt: 'Nike Air Force White' },
];

const NikeAirforceBobGoodies = [
  { src: NikeAirforceBobGoodiesBlue.src, alt: 'Nike Air Force Bob Goodies Blue' },
  { src: NikeAirforceBobGoodiesPink.src, alt: 'Nike Air Force Bob Goodies Pink' },
  { src: NikeAirforceBobGoodiesWhite.src, alt: 'Nike Air Force Bob Goodies White' },
];

const NikeAirforceStich = [
  { src: NikeAirforceStichBlue.src, alt: 'Nike Air Force Stitch Blue' },
  { src: NikeAirforceStichWhite.src, alt: 'Nike Air Force Stitch White' },
];

const NikeDunk = [
  { src: NikeDunkAllBalck.src, alt: 'Nike Dunk All Black' },
  { src: NikeDunkBlackAndRed.src, alt: 'Nike Dunk Black and Red' },
  { src: NikeDunkBlackAndWhite.src, alt: 'Nike Dunk Black and White' },
];

export default function KidsPage() {
  return (
    <>
      {/* Cabeçalho */}
      <header>
        <Header />
      </header>

      {/* Divisor */}
      <hr className="w-full border-gray-500" />

      {/* Conteúdo Principal */}
      <main className="min-h-screen bg-black p-8">
        <section
          aria-labelledby="kids-shoes"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 place-items-center"
        >
          <h1 id="kids-shoes" className="sr-only">
            Tênis Infantis
          </h1>

          <Contain sneakers={NikeAirforce} title="Nike Air Force" price="R$ 187,50" />
          <Contain sneakers={NikeAirforceBobGoodies} title="Nike Air Force Bob Goodies" price="R$ 125,00" />
          <Contain sneakers={NikeAirforceStich} title="Nike Air Force Stitch" price="R$ 107,50" />
          <Contain sneakers={NikeDunk} title="Nike Dunk" price="R$ 212,50" />
        </section>
      </main>
    </>
  );
}
