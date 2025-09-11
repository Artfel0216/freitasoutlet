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
    <article
      className="
        relative 
        w-full max-w-[18rem] 
        h-[32rem] 
        mt-6 
        p-4 
        border-2 border-white 
        rounded-xl 
        text-white 
        text-center 
        font-bold 
        overflow-hidden 
        hover:border-green-500 
        transition 
        duration-300 
        flex flex-col justify-between
        cursor-pointer
      "
    >
      {/* Botões laterais */}
      <button
        onClick={handlePrev}
        aria-label="Imagem anterior"
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
      >
        <ChevronLeft className="w-5 h-5 cursor-pointer" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Próxima imagem"
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
      >
        <ChevronRight className="w-5 h-5 cursor-pointer" />
      </button>

      {/* Imagem com animação */}
      <figure className="relative w-full aspect-[3/4] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSneaker.src}
            src={currentSneaker.src}
            alt={currentSneaker.alt}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.4 }}
            className="absolute w-full h-full object-cover rounded-md"
          />
        </AnimatePresence>
      </figure>

      {/* Textos fixados na parte de baixo */}
      <div className="mt-3">
        <figcaption className="text-sm sm:text-base font-medium">
          {currentSneaker.alt}
        </figcaption>
        <h2 className="mt-2 text-lg sm:text-xl font-semibold">{title}</h2>
        <p className="text-base sm:text-lg font-thin">{price} no Pix</p>
        <p className="text-xs sm:text-sm mt-1 text-gray-300">
          ou até 6x sem juros
        </p>
      </div>
    </article>
  );
}
