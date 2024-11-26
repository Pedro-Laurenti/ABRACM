import { useState } from "react";
import { Button } from "@nextui-org/react";
import Cookies from "js-cookie";
import { loadStripe } from "@stripe/stripe-js";  // Importação correta

export default function StripePayment({ priceId, price }: { priceId: string; price: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    const customerId = Cookies.get("stripe_customer_id"); // Obtemos o ID do cliente do cookie
    const usuarioId = Cookies.get("internal_user_id");

    if (!usuarioId) {
      setError("Usuário não encontrado.");
      setLoading(false);
      return;
    }

    if (!customerId) {
      setError("Cliente não encontrado.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, priceId, usuarioId }),
      });
  
      const data = await response.json();

      if (!response.ok) {
        console.error("Erro ao criar sessão:", data.error);
        throw new Error(data.error || "Erro inesperado ao processar o pagamento.");
      }  

      if (response.ok && data.sessionId) {
        // Agora carregamos o Stripe.js
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
        if (!stripe) {
          console.error("Falha ao carregar Stripe.js.");
          setError("Erro ao carregar Stripe.");
          return;
        }
        

        if (!stripe) {
          setError("Falha ao carregar o Stripe.");
          return;
        }

        // Redireciona para o Checkout da Stripe
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        setError(data.error || "Erro ao criar sessão de pagamento.");
      }
    } catch (err) {
      setError("Erro inesperado ao processar o pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button isLoading={loading} disabled={loading} onClick={handlePayment}>
        {price}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
