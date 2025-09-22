'use client';

import { useParams } from 'next/navigation';

// Simulação de banco de dados
const products = {
  alphafly2: {
    src: '/imgCalçados/NikeAirZoomAlphafly2WhiteAndOrange.jpg',
    alt: 'Nike Air Zoom Alphafly 2 White And Orange',
    name: 'Nike Air Zoom Alphafly 2',
    price: 800,
    description: 'Tênis Nike Air Zoom Alphafly 2 Masculino: desenvolvido para máxima performance em corridas...',
  },
  'airforce-black': {
    src: '/imgCalçados/NikeAirForceAllBlack.jpg',
    alt: 'Nike Air Force All Black',
    name: 'Nike Air Force All Black',
    price: 107.5,
    description: 'Tênis Nike Air Force All Black: estilo clássico e versátil...',
  },
};

export default function ProductPage() {
  const { id } = useParams();
  const product = products[id as keyof typeof products];

  if (!product) {
    return <div className="text-white text-center mt-20">Produto não encontrado</div>;
  }

  return (
    <div>
      {/* Aqui você reaproveita o mesmo layout que já tem na ProductPage */}
      <img src={product.src} alt={product.alt} />
      <h1>{product.name}</h1>
      <p>R$ {product.price.toFixed(2).replace('.', ',')}</p>
      <p>{product.description}</p>
    </div>
  );
}
