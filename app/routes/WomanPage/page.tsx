'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/app/components/header/page';
import Contain from '@/app/components/contain/page';

export default function WomanPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeminino = async () => {
      try {
        const res = await fetch('/api/products/feminino');
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error('Erro ao buscar produtos femininos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeminino();
  }, []);

  return (
    <div>
      <Header />
      <div className="w-full h-[1px] bg-gray-600"></div>

      <main className="min-h-screen bg-black p-8">
        {/* Lista de produtos */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
            {items.map((item) => (
              <Contain
                key={item.id}
                sneakers={item.sneakers}
                title={item.name}
                description={item.description}
                price={item.price}
              />
            ))}
          </div>
        )}

        {/* Mensagem caso não haja produtos */}
        {items.length === 0 && !loading && (
          <div className="flex flex-col justify-center items-center min-h-screen bg-black text-gray-400 text-lg">
            Nenhum produto encontrado na categoria{' '}
            <span className="text-white font-semibold">Feminino</span>.
          </div>
        )}
      </main>
    </div>
  );
}
