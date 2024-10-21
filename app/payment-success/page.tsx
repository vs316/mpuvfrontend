"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const paymentMethod = "Stripe"; // You can dynamically set this if required
  const paymentStatus = "Success"; // Assuming the payment was successful

  useEffect(() => {
    // Post payment details to backend
    const postPaymentDetails = async () => {
      try {
        const response = await fetch("http://localhost:3000/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            //  shipment_id: shipmentId, // Assumed to come from the query params or session
            amount: parseFloat(amount ?? "0"),
            payment_method: paymentMethod,
            payment_status: paymentStatus,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        console.log("Payment details successfully posted to backend.");
      } catch (error) {
        console.error("Failed to post payment details:", error);
      }
    };

    if (amount) {
      postPaymentDetails();
    }
  }, [amount]);

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
