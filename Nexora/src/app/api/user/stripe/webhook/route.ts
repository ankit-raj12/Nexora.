import connectDB from "@/lib/database";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Webhook signature verification failed ${error}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    try {
      await connectDB();
      await Order.findByIdAndUpdate(session.metadata?.orderId, {
        isPaid: true,
      });
    } catch (dbError) {
      console.error("Error updating order:", dbError);
      return NextResponse.json(
        { error: "Database update failed" },
        { status: 500 }
      );
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  // stripe listen --forward-to localhost:3000/api/user/stripe/webhook
  return NextResponse.json({ received: true }, { status: 200 });
}
