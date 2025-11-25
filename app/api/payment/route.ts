import { NextResponse } from "next/server";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST(request: Request) {
  if (!MP_ACCESS_TOKEN) {
    return NextResponse.json({ error: "MP_ACCESS_TOKEN não configurado" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !body.id || !body.title || !body.price) {
    return NextResponse.json({ error: "Body inválido. id, title e price são obrigatórios" }, { status: 400 });
  }

  const preference = {
    items: [
      {
        id: String(body.id),
        title: String(body.title),
        description: body.description ?? "",
        quantity: 1,
        currency_id: "BRL",
        unit_price: Number(body.price) || 0,
      },
    ],
    payer: {
      email: body.email ?? "test@example.com",
    },
    back_urls: {
      success: `${BASE_URL}/routes/PaymentPage/success`,
      failure: `${BASE_URL}/routes/PaymentPage/failure`,
      pending: `${BASE_URL}/routes/PaymentPage/pending`,
    },
    auto_return: "approved",
  };

  try {
    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("MP create preference error:", res.status, data);
      return NextResponse.json({ error: "Erro Mercado Pago", detail: data }, { status: 502 });
    }

    // prefira init_point, senão sandbox_init_point (ambiente sandbox)
    const init = data?.init_point || data?.sandbox_init_point;
    if (!init) {
      console.error("MP response sem init_point:", data);
      return NextResponse.json({ error: "init_point ausente", detail: data }, { status: 502 });
    }

    return NextResponse.json({ init_point: init, raw: data });
  } catch (err) {
    console.error("api/payment exception:", err);
    return NextResponse.json({ error: "Erro interno", detail: String(err) }, { status: 500 });
  }
}