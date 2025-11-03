'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  {
    src: '/img/Arte 1 carrosel.png',
    alt: 'Modelos de roupas',
  },
  {
    src: '/img/Arte 2 carrosel.png',
    alt: 'Envio rápido',
  },
];

export default function Sliders() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = esquerda, 1 = direita

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full mt-[3rem] flex justify-center items-center relative overflow-hidden">
      <div className="w-full max-w-[100rem] h-auto relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={images[currentIndex].src}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              width={1600}
              height={600}
              className="w-full h-auto rounded shadow-md object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={handlePrev}
        aria-label="Imagem anterior"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-[2rem] h-[2rem] flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-900 cursor-pointer"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={handleNext}
        aria-label="Próxima imagem"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-[2rem] h-[2rem] flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-900 cursor-pointer"
      >
        <ChevronRight />
      </button>
    </section>
  );
}
