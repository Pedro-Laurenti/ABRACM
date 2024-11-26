import Stripe from "stripe";
import createConnection from "@/config/connection";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});

export async function POST(req: Request) {
  const { customerId, priceId, usuarioId } = await req.json();

  if (!customerId || !priceId || !usuarioId) {
    return new Response(
      JSON.stringify({ error: "Campos obrigatórios estão ausentes" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  let connection;
  try {
    connection = await createConnection();

    // Criando a sessão no Stripe
    const successUrl = `${process.env.NEXT_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_BASE_URL}/cancel`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // Inserindo assinatura no banco com valor temporário para stripe_subscription_id
    const [result]: any = await connection.execute(
      `INSERT INTO assinaturas 
        (usuario_id, stripe_subscription_id, plano, status, data_criacao) 
      VALUES (?, ?, ?, ?, NOW())`,
      [usuarioId, "pending", priceId, "incomplete"], // "pending" como valor temporário
    );

    if (!result.insertId) {
      throw new Error("Falha ao registrar assinatura no banco de dados");
    }

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("Erro ao criar sessão de checkout:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao processar a solicitação" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
