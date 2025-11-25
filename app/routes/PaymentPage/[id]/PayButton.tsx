"use client";

import React, { useState } from "react";

export default function PayButton({ product, email, children }: any) {
  const [processing, setProcessing] = useState(false);

  async function handlePay() {
    if (processing) return;
    setProcessing(true);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product?.id,
          title: product?.title,
          description: product?.description,
          price: product?.price,
          email: email ?? undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("payment API error:", data);
        alert(data?.error ? `${data.error}` : "Erro ao criar preferência de pagamento");
        setProcessing(false);
        return;
      }

      const init = data?.init_point || data?.sandbox_init_point || data?.initPoint || data?.raw?.init_point;
      if (!init) {
        console.error("init_point não retornado:", data);
        alert("Não foi possível obter a URL de pagamento. Verifique logs do servidor.");
        setProcessing(false);
        return;
      }

      // redireciona para Mercado Pago
      window.location.href = init;
    } catch (err) {
      console.error("handlePay exception:", err);
      alert("Erro ao iniciar pagamento.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={processing}
      className={`px-4 py-2 rounded font-bold ${processing ? "opacity-50 cursor-wait" : "bg-white text-black"}`}
    >
      {processing ? "Processando..." : children ?? "Pagar"}
    </button>
  );
}
