'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SneackersBrown from "@/public/HugoBossMarrom.jpeg";
import SneackersBlack from "@/public/HugoBossPreto.jpeg";

const sneakers = [
  {
    src: SneackersBrown.src,
    alt: "Tênis Hugo Boss marrom"
  },
  {
    src: SneackersBlack.src,
    alt: "Tênis Hugo Boss preto"
  }
];

export default function Contain() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? sneakers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev === sneakers.length - 1 ? 0 : prev + 1));
  };

  return (
    <article className="relative w-[20rem] h-[30rem] mt-8 ml-4 p-4 border-[2px] border-white cursor-pointer text-white text-center font-bold animate-fade-right animate-once animate-duration-[3000ms] animate-delay-1000 animate-ease-linear overflow-hidden rounded hover:border-green-500">
      
      {/* Botões laterais */}
      <button
        onClick={handlePrev}
        aria-label="Imagem anterior"
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-black p-1 rounded-full cursor-pointer z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Próxima imagem"
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-black p-1 rounded-full cursor-pointer z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Selo de desconto */}
      <div className="absolute top-4 left-4 flex items-center justify-center w-16 h-16 rounded-full bg-white text-black text-sm font-bold leading-tight cursor-pointer z-10">
        <span>
          50% <br />
          Off
        </span>
      </div>

      {/* Imagem com animação */}
      <figure className="relative w-full h-[20rem] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={sneakers[index].src}
            src={sneakers[index].src}
            alt={sneakers[index].alt}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.5 }}
            className="absolute w-[16rem] h-[20rem] object-cover mx-auto rounded-md"
          />
        </AnimatePresence>
        <figcaption className="mt-6 text-lg absolute bottom-[-2.5rem]">Tênis HUGO BOSS</figcaption>
      </figure>

      <p className="mt-12 text-xl font-thin">R$ 199,99</p>
        <p className="text-sm mt-2">ou 12x de R$ 16,66</p>
    </article>
  );
}
