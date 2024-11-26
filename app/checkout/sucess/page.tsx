import React from "react";
import Stripe from "stripe";

export default async function Sucesso({ searchParams }: { searchParams: { session_id: string } }) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-10-28.acacia",
  });

  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return <p>Erro: Session ID não encontrada.</p>;
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // Extrair o valor correto de 'subscription'
  const subscriptionId = 
    typeof session.subscription === "string" 
      ? session.subscription // ID da assinatura
      : session.subscription?.id || null; // Caso seja um objeto do tipo Stripe.Subscription

  return (
    <div>
      <h1>Pagamento Concluído!</h1>
      <p>Assinatura: {subscriptionId || "ID não disponível"}</p>
      <p>Cliente: {session.customer_email}</p>
      <p>Valor: R$ {(session.amount_total! / 100).toFixed(2)}</p>
    </div>
  );
}
