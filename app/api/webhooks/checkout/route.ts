import { NextResponse } from "next/server";
import Stripe from "stripe";
import createConnection from "@/config/connection";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});

const webhookSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response(
      JSON.stringify({ error: "Assinatura ausente" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Erro de validação do webhook:", (err as Error).message);
    return new Response(
      JSON.stringify({ error: "Evento não validado" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  let connection;

  try {
    connection = await createConnection();

    const { type, data } = event;

    // Verifique o tipo de evento
    if (type === "invoice.payment_succeeded" || type === "invoice.payment_failed") {
      // Tipagem explícita: Stripe.Invoice
      const invoice = data.object as Stripe.Invoice;

      const stripeSubscriptionId = invoice.subscription as string; // ID da assinatura
      const stripeCustomerId = invoice.customer as string; // ID do cliente
      const valor = invoice.total ? invoice.total / 100 : 0; // Valor total em reais
      const usuarioId = invoice.metadata?.usuario_id; // Seu metadata customizado

      if (type === "invoice.payment_succeeded") {
        // Proximo pagamento
        const proximoPagamento = invoice.next_payment_attempt
          ? new Date(invoice.next_payment_attempt * 1000).toISOString()
          : null;

        const metodoPagamento = invoice.payment_intent || "unknown";

        // Atualizar `assinaturas` com o stripe_subscription_id correto
        await connection.execute(
          `UPDATE assinaturas 
           SET stripe_subscription_id = ?, status = ?, data_proximo_pagamento = ? 
           WHERE stripe_subscription_id = ?`,
          [stripeSubscriptionId, "active", proximoPagamento, "pending"]
        );

        // Atualizar `usuarios`
        await connection.execute(
          `UPDATE usuarios 
           SET tipo_usuario = ? 
           WHERE stripe_customer_id = ?`,
          ["associado", stripeCustomerId]
        );

        // Registrar pagamento
        await connection.execute(
          `INSERT INTO pagamentos (usuario_id, stripe_payment_id, valor, metodo_pagamento, status, data_pagamento) 
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [usuarioId, invoice.payment_intent, valor, metodoPagamento, "succeeded"]
        );
      } else if (type === "invoice.payment_failed") {
        // Atualizar `assinaturas` com falha
        await connection.execute(
          `UPDATE assinaturas 
           SET status = ? 
           WHERE stripe_subscription_id = ?`,
          ["incomplete", stripeSubscriptionId]
        );

        // Registrar falha no pagamento
        await connection.execute(
          `INSERT INTO pagamentos (usuario_id, stripe_payment_id, valor, metodo_pagamento, status, data_pagamento) 
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [usuarioId, invoice.payment_intent, valor, "unknown", "failed"]
        );
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro no processamento do webhook:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    if (connection) await connection.end();
  }
}
