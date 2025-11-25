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

      const text = await res.text();
      let data: any = null;
      try { data = text ? JSON.parse(text) : null; } catch (e) { data = { text }; }

      if (!res.ok) {
        console.error("payment API error:", data);
        alert(`Erro ao criar pagamento: ${data?.error ?? JSON.stringify(data)}`);
        setProcessing(false);
        return;
      }

      const init = data?.init_point || data?.sandbox_init_point || data?.initPoint || data?.raw?.init_point;
      if (!init) {
        console.error("init_point ausente no response:", data);
        alert("Não foi possível obter a URL de pagamento. Veja console para detalhes.");
        setProcessing(false);
        return;
      }

      // redireciona para Mercado Pago
      window.location.href = init;
    } catch (err) {
      console.error("handlePay exception:", err);
      alert("Erro de rede ao iniciar pagamento.");
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
