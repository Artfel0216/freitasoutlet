'use client';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';

// =========================
// Tipagem das Props
// =========================
interface ContainProps {
  sneakers: {
    src: string;
    alt?: string;
  }[];
  title: string;
  description?: string;
  price?: string;
}

// =========================
// Componente Principal
// =========================
export default function Contain({
  sneakers,
  title,
  description,
  price,
}: ContainProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  // Transição suave entre imagens
  const changeImage = (newIndex: number) => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setFade(false);
    }, 200);
  };

  // Funções de navegação
  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? sneakers.length - 1 : currentIndex - 1;
    changeImage(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex === sneakers.length - 1 ? 0 : currentIndex + 1;
    changeImage(newIndex);
  };

  // Imagem atual
  const currentImage =
    sneakers && sneakers.length > 0
      ? sneakers[currentIndex].src
      : '/imgCalcados/placeholder.png';

  return (
    <div className="flex flex-col items-center justify-center text-white p-4 bg-neutral-900 rounded-2xl shadow-lg w-full max-w-xs">
      {/* Container da Imagem */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xl mb-4 bg-gray-800">
        <img
          src={currentImage}
          alt={sneakers[currentIndex]?.alt ?? 'Produto'}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            fade ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Botões de navegação */}
        {sneakers.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black text-white text-3xl rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
              aria-label="Imagem anterior"
            >
              <ArrowLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2  -translate-y-1/2 bg-black text-white text-3xl rounded-full w-[2.5rem] h-[2.5rem] flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
              aria-label="Próxima imagem"
            >
              <ArrowRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Bolinhas indicadoras */}
      {sneakers.length > 1 && (
        <div className="flex justify-center items-center gap-2 mb-3">
          {sneakers.map((_, index) => (
            <span
              key={index}
              onClick={() => changeImage(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                currentIndex === index ? 'bg-green-400 scale-110' : 'bg-gray-500'
              }`}
            ></span>
          ))}
        </div>
      )}

      {/* Título */}
      <h2 className="text-lg font-semibold text-center mb-2">{title}</h2>

      {/* Descrição */}
      {description && (
        <p className="text-sm text-gray-400 text-center line-clamp-2 mb-2">
          {description}
        </p>
      )}

      {/* Preço */}
      {price && (
        <span className="text-green-400 font-bold text-lg animate-pulse">
          {price}
        </span>
      )}
    </div>
  );
}
