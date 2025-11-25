"use client";

import { useLoader } from "@/context/LoaderContext"; // ✅ Caminho certo
import { useState } from "react";

export default function PayButton({ product, method, email, children }: any) {
  const { setLoading } = useLoader();
  const [processing, setProcessing] = useState(false);

  async function handlePay() {
    if (processing) return;

    setProcessing(true);
    setLoading(true);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          title: product.title,
          price: product.price,
          email,
        }),
      });

      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error("Erro: init_point ausente", data);
      }
    } catch (error) {
      console.error("Erro ao iniciar pagamento:", error);
    }

    setProcessing(false);
    setLoading(false);
  }

  return (
    <div onClick={handlePay}>
      {processing ? (
        <button className="w-full h-[3.2rem] rounded-xl bg-black text-white font-bold animate-pulse">
          Processando...
        </button>
      ) : (
        children
      )}
    </div>
  );
}
