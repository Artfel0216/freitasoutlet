"use client";

import { useEffect, useState } from "react";
import HeaderCar from "@/app/components/HeaderCar/page";
import { Plus, Trash } from "lucide-react";
import ContinueButton from "./ContinueButton";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: { url: string }[];
}

export default function carpage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const selectedSize = searchParams.get("size");
  const imageParam = searchParams.get("image");

  // ✅ Faz o fetch do produto com base no ID recebido
  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!productId) return;
        const res = await fetch(`/api/product/${productId}`);
        if (!res.ok) throw new Error("Erro ao buscar produto");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProduct();
  }, [productId]);

  const removeItem = () => quantity > 1 && setQuantity(quantity - 1);
  const addItem = () => setQuantity(quantity + 1);

  const price = product?.price ?? 0;
  const total = price * quantity;

  const productImage =
    imageParam ||
    product?.images?.[0]?.url ||
    "";

  return (
    <div>
      <HeaderCar />
      <main className="flex">
        {/* Produto */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border border-gray-500 rounded w-[65rem] h-[15rem] mt-10 ml-2 flex text-white p-6 hover:border-green-500 transition duration-300"
        >
          <figure>
            {productImage ? (
              <motion.img
                key={productImage}
                src={productImage}
                alt={product?.title || "Produto"}
                className="w-[12rem] h-[12rem] object-cover rounded"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <div className="w-[12rem] h-[12rem] bg-gray-700 rounded flex items-center justify-center">
                <p className="text-sm text-gray-400">Sem imagem</p>
              </div>
            )}
          </figure>

          {/* Informações */}
          <section className="ml-6 flex flex-col">
            <h1 className="font-bold mt-6 text-[1.2rem]">
              {product?.title || "Carregando..."}
            </h1>
            <p className="mt-2">
              Tamanho:{" "}
              <strong className="font-bold">
                {selectedSize || "—"}
              </strong>
            </p>
            <p className="mt-2">
              Vendido e entregue por:{" "}
              <strong className="font-bold">Freitas Outlet</strong>
            </p>
          </section>

          {/* Quantidade */}
          <section className="flex items-center ml-30 gap-10">
            <button
              onClick={removeItem}
              className="rounded-full border-white border-[2px] w-[3rem] h-[3rem] text-white flex items-center justify-center hover:border-red-500 transition duration-300 cursor-pointer"
            >
              <Trash />
            </button>
            <motion.p
              key={quantity}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="font-bold text-[1.5rem]"
            >
              {quantity}
            </motion.p>
            <button
              onClick={addItem}
              className="rounded-full border-white border-[2px] w-[3rem] h-[3rem] text-white flex items-center justify-center hover:border-green-500 transition duration-300 cursor-pointer"
            >
              <Plus />
            </button>
          </section>

          {/* Preço */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-bold text-white text-[1.1rem] ml-20 mt-20"
          >
            R$ {total.toFixed(2).replace(".", ",")}
          </motion.p>
        </motion.article>

        {/* Resumo */}
        <aside className="w-[29rem] h-[15rem] mt-10 ml-2 bg-white opacity-70 rounded text-black font-semibold flex flex-col align-center p-6">
          <div className="flex">
            <p className="text-[1.2rem] font-bold">Produtos: </p>
            <p className="text-[0.9rem] ml-60 flex">
              R$ {total.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <div className="w-[26rem] mt-4 bg-black h-[2px]"></div>
          <div className="flex">
            <p className="mt-4 text-[1.1rem] font-bold">Total: </p>
            <p className="mt-4 font-bold ml-60 text-[1.5rem] flex-col">
              R$ {total.toFixed(2).replace(".", ",")} <br />
              <span className="text-[0.7rem] font-normal text-black flex">
                ou{" "}
                <strong>
                  6x de R$ {(total / 6).toFixed(2).replace(".", ",")} sem juros
                </strong>
              </span>
            </p>
          </div>
          <ContinueButton />
        </aside>
      </main>

      {/* Descrição */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-white mt-4 p-2 font-bold text-center"
      >
        <h2 className="text-xl">{product?.title || "Carregando..."}</h2>
        <p className="mt-4">
          {product?.description || "Carregando descrição..."}
        </p>
      </motion.section>
    </div>
  );
}
