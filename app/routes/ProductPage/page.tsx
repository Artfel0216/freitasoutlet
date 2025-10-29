'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/app/components/header/page';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

export default function ProductPage() {
  const { addToCart } = useCart();


  const direction = 1;
  const sizes = [38, 39, 40, 41, 42, 43];

  return (
    <div>
      {/* Header */}
      <Header />

      <hr className="w-full h-[2px] bg-gray-500" />

      <main className="p-6 text-white flex flex-col lg:flex-row gap-10 items-center lg:items-start">
        {/* Imagem */}
        <figure className="relative w-full max-w-[22rem] h-[22rem] sm:max-w-[28rem] sm:h-[28rem] lg:w-[30rem] lg:h-[30rem] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img

              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.4 }}
              className="absolute w-full h-full object-cover rounded-md"
            />
          </AnimatePresence>
        </figure>

        {/* Informações */}
        <section className="w-full max-w-xl">
          <h1 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-thin leading-snug mt-6 lg:mt-10 text-center lg:text-left">
            Nike Air Zoom Alphafly 2 <br />
            <span className="font-normal">Masculino</span>
          </h1>

          <p className="text-xl sm:text-2xl font-bold mt-6 text-center lg:text-left">
            R$ 800,00 <br />
            <span className="font-normal text-sm sm:text-base">
              Ou em 6X de <strong className="text-green-500">R$ 133,00</strong>
            </span>
          </p>

          {/* Tamanhos */}
          <div className="flex flex-wrap justify-center lg:justify-start mt-6 gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                className="cursor-pointer rounded w-[3.5rem] h-[2.2rem] bg-white text-black font-bold hover:bg-gray-300"
              >
                {size}
              </button>
            ))}
          </div>

          {/* Descrição */}
          <p className="mt-6 font-medium text-sm sm:text-base text-center lg:text-left">
            Tênis Nike Air Zoom Alphafly 2 Masculino: desenvolvido para máxima performance em corridas...
          </p>

          {/* Ações */}
          <div className="flex justify-center lg:justify-start gap-6 mt-8">
            <button 
             onClick={addToCart}
            className="cursor-pointer w-[7rem] sm:w-[8rem] bg-white h-[3rem] text-black flex items-center justify-center rounded hover:bg-gray-300">
              <ShoppingCart />
            </button>

            <button
              className="cursor-pointer w-[7rem] sm:w-[8rem] font-bold bg-green-600 h-[3rem] text-black flex items-center justify-center rounded hover:bg-green-800"
            >
              Comprar
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
