'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Sneaker = {
  src: string;
  alt: string;
};

interface ContainProps {
  sneakers: Sneaker[];
  title: string;
  price: string;
}

export default function Contain({ sneakers, title, price }: ContainProps) {
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

  const currentSneaker = sneakers[index];

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

      {/* Imagem com animação */}
      <figure className="relative w-full h-[20rem] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSneaker.src}
            src={currentSneaker.src}
            alt={currentSneaker.alt}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.5 }}
            className="absolute w-[16rem] h-[20rem] object-cover mx-auto rounded-md"
          />
        </AnimatePresence>
        <figcaption className="mt-6 text-lg absolute bottom-[-2.5rem]">
          {currentSneaker.alt}
        </figcaption>
      </figure>

      {/* Título e Preço */}
      <h2 className="mt-[3rem] text-lg font-semibold">{title}</h2>
      <p className="text-xl font-thin">{price} no Pix</p>
      <p className="text-sm mt-2">ou até 6x sem juros</p>
    </article>
  );
}
