import { NextResponse } from "next/server";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST(request: Request) {
  if (!MP_ACCESS_TOKEN) {
    console.error("MP_ACCESS_TOKEN não configurado");
    return NextResponse.json({ error: "MP_ACCESS_TOKEN não configurado" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !body.id || !body.title || !body.price) {
    console.error("Body inválido recebido em /api/payment:", body);
    return NextResponse.json({ error: "Body inválido. id, title e price são obrigatórios", received: body }, { status: 400 });
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
    payer: { email: body.email ?? "test@example.com" },
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

    const text = await res.text();
    let parsed = null;
    try { parsed = text ? JSON.parse(text) : null; } catch (e) { /* não JSON */ }

    if (!res.ok) {
      console.error("MercadoPago retornou erro:", res.status, text);
      return NextResponse.json({ error: "Mercado Pago retornou erro", status: res.status, bodyText: text, bodyJson: parsed }, { status: 502 });
    }

    // prefer init_point; se sandbox estiver presente usa sandbox_init_point
    const initPoint = parsed?.init_point || parsed?.sandbox_init_point;
    if (!initPoint) {
      console.error("MercadoPago criou preferência sem init_point:", parsed);
      return NextResponse.json({ error: "init_point ausente", raw: parsed }, { status: 502 });
    }

    return NextResponse.json({ init_point: initPoint, raw: parsed });
  } catch (err) {
    console.error("Erro ao chamar MercadoPago:", err);
    return NextResponse.json({ error: "Erro interno ao comunicar Mercado Pago", detail: String(err) }, { status: 500 });
  }
}