"use client";
import React, { useEffect, useState } from "react";
import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAmount = localStorage.getItem("shipmentPrice");
      setAmount(parseFloat(storedAmount || "0"));
    }
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-10 text-gray-800 text-center border m-10 rounded-lg shadow-lg bg-gradient-to-r from-teal-400 to-blue-600 mt-16">
      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-4 text-white">Payment Request</h1>
        <h2 className="text-2xl text-white">
          We have requested <span className="font-semibold">Rs {amount}</span>
        </h2>
      </div>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "inr",
        }}
      >
        <CheckoutPage amount={amount} />
      </Elements>
    </main>
  );
}
