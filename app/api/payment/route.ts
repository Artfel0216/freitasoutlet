import { NextResponse } from "next/server";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN; // configure no .env

export async function POST(request: Request) {
  try {
    if (!MP_ACCESS_TOKEN) {
      return NextResponse.json({ error: "Mercado Pago access token not configured" }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.id || !body.price || !body.title) {
      return NextResponse.json({ error: "Invalid body (id, title, price required)" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL ?? "http://localhost:3000";
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
        success: `${baseUrl}/routes/PaymentPage/success`,
        failure: `${baseUrl}/routes/PaymentPage/failure`,
        pending: `${baseUrl}/routes/PaymentPage/pending`,
      },
      auto_return: "approved",
    };

    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("MP error:", res.status, err);
      return NextResponse.json({ error: "Mercado Pago error", detail: err }, { status: 502 });
    }

    const data = await res.json();
    // data.init_point contém a URL de pagamento para redirecionar o usuário
    return NextResponse.json(data);
  } catch (error) {
    console.error("api/payment error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}