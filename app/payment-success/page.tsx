"use client";

import { useEffect } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const paymentMethod = "Stripe";
  const paymentStatus = "Success";
  const paymentId = localStorage.getItem("paymentId");

  useEffect(() => {
    // Update payment details in the backend
    const updatePaymentDetails = async () => {
      if (!paymentId) {
        console.error("No payment ID found in local storage.");
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:3000/payment/${paymentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: parseFloat(amount ?? "0"),
              payment_method: paymentMethod,
              payment_status: paymentStatus,
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        console.log("Payment details successfully updated in backend.");
      } catch (error) {
        console.error("Failed to update payment details:", error);
      }
    };

    if (amount && paymentId) {
      updatePaymentDetails();
      // resetLocalStorage();
      // localStorage.removeItem("selectedService");
      // localStorage.removeItem("shipmentPrice");
    }
  }, [amount, paymentId]);

  return (
    <main className="max-w-6xl mx-auto p-10 text-gray-800 text-center border m-10 rounded-lg shadow-lg bg-gradient-to-r from-teal-400 to-blue-600">
      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-4 text-white">Thank You!</h1>
        <h2 className="text-2xl text-white">You successfully sent</h2>
        <div className="bg-white p-4 rounded-lg mt-5 text-blue-600 text-4xl font-bold">
          Rs {amount}
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
