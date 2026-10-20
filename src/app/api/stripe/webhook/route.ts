import { stripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response("Missing webhook secret", { status: 500 });
  }

  const stripeEvent = stripe.webhooks.constructEvent(
    body,
    signature,
    webhookSecret
  );

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    const orderId = session.client_reference_id;

    if (orderId) {
  const { data: updatedOrders, error: updateError } = await supabaseServer
  .from("orders")
  .update({ payment_status: "paid" })
  .eq("id", orderId)
  .select("id, payment_status");

if (updateError) {
  console.error("Order payment update failed:", updateError);
  return new Response("Order update failed", { status: 500 });
}
    }
  }

  return new Response("OK", { status: 200 });
}