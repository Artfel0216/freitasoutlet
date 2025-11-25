import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!, 
});

export async function POST(req: Request) {
  try {
    const { title, price, id, email } = await req.json();

    const preference = await new Preference(client).create({
      body: {
        payer: { email },
        items: [
          {
            id: String(id),
            title,
            quantity: 1,
            unit_price: Number(price),
          },
        ],
        payment_methods: {
          excluded_payment_types: [], 
        },
        back_urls: {
          success: process.env.MP_SUCCESS_URL!,
          failure: process.env.MP_FAILURE_URL!,
        },
        auto_return: "approved",
        notification_url: process.env.MP_WEBHOOK_URL!,
      },
    });

    return NextResponse.json({
      init_point: preference.init_point,
    });

  } catch (error) {
    console.error("❌ Erro ao criar preferência:", error);
    return NextResponse.json({ error: "Erro ao criar pagamento" }, { status: 500 });
  }
}
