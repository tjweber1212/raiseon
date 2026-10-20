"use server";

import { supabaseServer } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";

export async function createOrder({
  inviteToken,
  items,
}: {
  inviteToken: string | null;
  items: {
    productId: string;
    quantity: number;
  }[];
}) {
  if (!inviteToken) {
    throw new Error("Invalid supporter invitation.");
  }

  const { data: contact, error: contactError } = await supabaseServer
    .from("contacts")
    .select("id, name, phone, player_id")
    .eq("invite_token", inviteToken)
    .single();

  if (contactError || !contact) {
    throw new Error("Invalid supporter invitation.");
  }

  const { data: player, error: playerError } = await supabaseServer
    .from("players")
    .select("id, campaign_id, slug")
    .eq("id", contact.player_id)
    .single();

  if (playerError || !player) {
    throw new Error("Invalid player.");
  }

  if (items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  if (
    items.some(
      (item) =>
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
    )
  ) {
    throw new Error("Invalid quantity.");
  }

  const productIds = items.map((item) => item.productId);

  const { data: products, error: productsError } =
    await supabaseServer
      .from("products")
      .select("id, name, price, campaign_id")
      .in("id", productIds)
      .eq("campaign_id", player.campaign_id);

  if (
    productsError ||
    !products ||
    products.length !== productIds.length
  ) {
    throw new Error("One or more products are invalid.");
  }

  const verifiedItems = items.map((item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    if (!product) {
      throw new Error("Product not found.");
    }

    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: Number(product.price),
    };
  });

  const verifiedTotal = verifiedItems.reduce(
    (sum, item) =>
      sum + item.unitPrice * item.quantity,
    0
  );

  const { data: order, error: orderError } =
    await supabaseServer
      .from("orders")
      .insert({
        campaign_id: player.campaign_id,
        player_id: player.id,
        contact_id: contact.id,
        customer_name: contact.name,
        customer_phone: contact.phone,
        total: verifiedTotal,
        payment_status: "pending",
      })
      .select("id")
      .single();

  if (orderError || !order) {
    throw new Error(
      orderError?.message || "Unable to create order."
    );
  }

  const orderItems = verifiedItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }));

  const { error: itemsError } = await supabaseServer
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    throw new Error(itemsError.message);
  }
const checkoutSession = await stripe.checkout.sessions.create({
mode: "payment",
client_reference_id: order.id,
line_items: verifiedItems.map((item) => ({
    price_data: {
currency: "usd",
product_data: { name: item.productName },
unit_amount: Math.round(item.unitPrice * 100),
},
quantity: item.quantity,
})),
success_url: "http://localhost:3000/p/" + player.slug + "/shop/success?session_id={CHECKOUT_SESSION_ID}",
cancel_url: "http://localhost:3000/p/" + player.slug + "/shop?invite=" + inviteToken,
});
  return { checkoutUrl: checkoutSession.url };
}