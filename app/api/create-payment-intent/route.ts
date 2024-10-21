import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  try {
    const { amount, customerName, customerAddress } = await request.json();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "inr",
      automatic_payment_methods: { enabled: true },
      description: "Shipment Order Payment Transaction",
      shipping: {
        name: customerName,
        address: {
          line1: customerAddress.line1,
          city: customerAddress.city,
          postal_code: customerAddress.postal_code,
          country: customerAddress.country,
        },
      },
    });
    const response = NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*"); // or specify your domain
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
