'use client';
import React from 'react';

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
export default function Contain({ sneakers, title, description, price }: ContainProps) {
  // Pega a primeira imagem (principal)
  const mainImage = sneakers && sneakers.length > 0 ? sneakers[0].src : '/imgCalcados/placeholder.png';

  return (
    <div className="flex flex-col items-center justify-center text-white p-4 bg-neutral-900 rounded-2xl shadow-lg w-full max-w-xs">
      {/* Imagem principal */}
      <div className="w-full aspect-square overflow-hidden rounded-xl mb-4 bg-gray-800">
        <img
          src={mainImage}
          alt={sneakers[0]?.alt ?? 'Produto'}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Nome / Título */}
      <h2 className="text-lg font-semibold text-center mb-2">{title}</h2>

      {/* Descrição opcional */}
      {description && (
        <p className="text-sm text-gray-400 text-center line-clamp-2 mb-2">{description}</p>
      )}

      {/* Preço opcional */}
      {price && (
        <span className="text-yellow-400 font-bold text-lg">{price}</span>
      )}
    </div>
  );
}
