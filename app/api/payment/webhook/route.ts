import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("📩 Webhook recebido:", body);

    // Verifica tipo de notificação
    if (body.type !== "payment") {
      return NextResponse.json({ status: "ignored", message: "Tipo não é payment" });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return NextResponse.json({ status: "error", message: "Sem payment ID" }, { status: 400 });
    }

    // Buscar o pagamento completo no Mercado Pago
    const res = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    const payment = await res.json();
    console.log("🔎 Detalhes do pagamento:", payment);

    // Dados principais
    const status = payment.status; // approved | rejected | pending
    const item = payment.additional_info?.items?.[0];

    if (!item) {
      console.log("⚠ Nenhum item encontrado no pagamento.");
      return NextResponse.json({ status: "ignored" });
    }

    const productId = Number(item.id);
    const email = payment.payer?.email || "desconhecido";
    const amount = payment.transaction_amount;

    // Verifica se já existe pedido com este pagamento
    const existing = await prisma.order.findFirst({
      where: { transactionId: String(paymentId) },
    });

    if (existing) {
      console.log("⚠ Pedido já existe. Ignorando duplicata.");
      return NextResponse.json({ status: "duplicate" });
    }

    // Cria o pedido no banco com o status atual
    const order = await prisma.order.create({
      data: {
        productId,
        transactionId: String(paymentId),
        email,
        amount,
        status: status.toUpperCase(),
      },
    });

    console.log("📦 Pedido criado:", order);

    // IMPORTANTE: Trate cada status separadamente
    if (status === "approved") {
      console.log("🎉 Pagamento aprovado!");

      // Aqui você envia o email
      // sendConfirmationEmail(email, item.title, amount);
    }

    if (status === "rejected") {
      console.log("❌ Pagamento rejeitado.");
    }

    if (status === "pending") {
      console.log("⏳ Pagamento pendente (PIX não pago ainda).");
    }

    return NextResponse.json({ status: "processed" });

  } catch (error) {
    console.error("❌ ERRO WEBHOOK:", error);
    return NextResponse.json(
      { status: "error", message: "Webhook error" },
      { status: 500 }
    );
  }
}
