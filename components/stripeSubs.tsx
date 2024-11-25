"use client";
import { Button } from "@nextui-org/react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

type Props = {
  priceId: string;
  price: string;
};

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY!);

const StripeSubs = ({ priceId, price }: Props) => {
  const handleSubmit = async () => {
    const response = await axios.post("/api/checkout", { priceId });

    if (response.data.sessionId) {
      const stripe = await stripePromise;

      if (stripe) {
        await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });
      }
    }
  };

  return (
    <Button color="primary" onClick={handleSubmit}>
      {price}
    </Button>
  );
};

export default StripeSubs;
