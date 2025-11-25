"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Header from "@/app/components/header/page";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number | string;
  images?: { url: string }[];
}

export default function ProductPage() {
  const { addToCart } = useCart();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id;
  const initialImage = searchParams.get("image");

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const res = await fetch(`/api/product/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar produto");
        const data = await res.json();
        setProduct(data);

        if (!initialImage && data.images?.length > 0) {
          setSelectedImage(data.images[0].url);
        }
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      }
    }
    fetchProduct();
  }, [id, initialImage]);

  if (!product)
    return (
      <main className="flex justify-center items-center min-h-screen text-white text-xl">
        Carregando...
      </main>
    );

  const priceNumber =
    typeof product.price === "number"
      ? product.price
      : parseFloat(product.price || "0");

  const sizes = [36, 37, 38, 39, 40, 41, 42, 43];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: priceNumber,
      image: selectedImage || product.images?.[0]?.url || "",
      size: selectedSize,
    });
  };

 const handleBuyNow = () => {
  if (!selectedSize) return;
  const imageParam = selectedImage ? `&image=${encodeURIComponent(selectedImage)}` : "";
  router.push(`/carpage?id=${product.id}&size=${selectedSize}${imageParam}`);
};

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <Header />
      <div className="w-full h-[1px] bg-gray-700"></div>

      <section className="flex flex-col md:flex-row p-8 gap-10 max-w-6xl mx-auto">
        {/* IMAGEM DO PRODUTO */}
        <figure className="flex-1 flex justify-center items-center">
          <motion.img
            key={selectedImage}
            src={selectedImage || product.images?.[0]?.url || ""}
            alt={product.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl max-h-[500px] object-contain shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </figure>

        {/* INFORMAÇÕES */}
        <article className="flex-1 flex flex-col justify-center gap-6">
          <header>
            <motion.h1
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-2"
            >
              {product.title}
            </motion.h1>
            <p className="text-gray-300 text-lg">
              {product.description || "Descrição não disponível."}
            </p>
            <p className="text-green-400 text-2xl font-semibold mt-4">
              R$ {priceNumber.toFixed(2)}
            </p>
          </header>

          {/* SELETOR DE TAMANHO */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Selecione o tamanho:</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              {sizes.map((size) => (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedSize === size
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-blue-300 text-black border-gray-300 hover:bg-green-300"
                  }`}
                >
                  {size}
                </motion.button>
              ))}
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="flex gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md"
              >
                Adicionar ao carrinho
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBuyNow}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md"
              >
                Comprar agora
              </motion.button>
            </div>
          </section>
        </article>
      </section>
    </main>
  );
}
