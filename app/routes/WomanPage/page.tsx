'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/app/components/header/page';
import Contain from '@/app/components/contain/page';
import { getImagesByCategory } from '@/app/action/get-Image';

interface ProductImage {
  id: number;
  name: string;
  src: string;
  alt: string;
  category: string;
  price: number;
}

export default async function WomanPage() {
  const images = await getImagesByCategory();

  if (images.length === 0) {
    return (
      <div>
        <Header />
        <div className="w-full h-[1px] bg-gray-600"></div>
        <div className="flex flex-col justify-center items-center min-h-screen bg-black text-gray-400 text-lg">
          Nenhum produto encontrado na categoria <span className="text-white font-semibold">Feminino</span>.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Divider */}
      <div className="w-full h-[1px] bg-gray-600"></div>

      {/* Products Grid */}
      {/* <main className="min-h-screen bg-black p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
          {images.map((item) => (
            <Contain
              key={item.id}
              sneakers={[item.src] as unknown as any}
              title={item.name}
              price={`R$ ${item.price.toFixed(2)}`}
            />
          ))}
        </div>
      </main> */}
    </div>
  );
}
