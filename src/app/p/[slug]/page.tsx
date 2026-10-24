
import Link from "next/link";
import { savePhoneNumber } from "./actions";
import { createElement } from "react";
import { supabaseServer } from "@/lib/supabase-server";

export default async function PlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { slug } = await params;
  const { token } = await searchParams;

  const accessToken =
    typeof token === "string" ? token : undefined;


const { data: player, error } = await supabaseServer
  .from("players")
  .select("*")
  .eq("slug", slug)
  .eq("access_token", accessToken)
  .single();


  if (error || !player) {
    return (
      <main className="p-6">
        <h1>Player Not Found</h1>
      </main>
    );
  }

if (!player.phone) {

  async function savePhone(formData: FormData) {
  "use server";

  const rawPhone = formData.get("phone")?.toString() ?? "";
const digits = rawPhone.replace(/\D/g, "");
const phone = digits.length === 10 ? "+1" + digits : "+" + digits;

  const dashboardUrl =
  "https://raiseon-alpha.vercel.app/p/" +
  player.slug +
  "?token=" +
  encodeURIComponent(accessToken!);

  await savePhoneNumber(player.id, phone, dashboardUrl);

  const { redirect } = await import("next/navigation");

  redirect(
    "/p/" +
      player.slug +
      "?token=" +
      encodeURIComponent(accessToken!)
  );
} 
    
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold">
        Welcome to Your Fundraiser
      </h1>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Helping Younger Players Participate
        </h2>

        <p className="mt-4 text-gray-700">
          Not all players have their own mobile phone number.
          If your player doesn't, please enter a parent or
          guardian's phone number.
        </p>

        <p className="mt-4 text-gray-700">
          We’ll use this number to provide access to the player/participant’s fundraising dashboard and send important campaign-related updates.
        </p>

        <p className="mt-4 text-gray-700">
          This information is only used in connection with the
          fundraiser.
        </p>

<form action={savePhone}>
  <label
    htmlFor="phone"
    className="mb-2 block text-sm font-medium"
  >
    Mobile Phone Number
  </label>

  <input
    id="phone"
    name="phone"
    type="tel"
    placeholder="(555) 555-5555"
    className="w-full rounded-lg border p-3"
  />
<div className="mt-4">
  <label className="flex items-start gap-2 text-sm">
    <input
      type="checkbox"
      name="smsConsent"
      required
      className="mt-1"
    />

    <span>
      I agree to receive text messages related to the
      player/participant&apos;s fundraising participation, including access
      to the player/participant&apos;s dashboard and campaign updates.
    </span>
  </label>

<p className="mt-2 text-xs text-gray-500">
  Message frequency varies. Msg &amp; data rates may apply. Reply HELP for
  help or STOP to opt out. View our{" "}
  {createElement(
    "a",
    {
      href: "/privacy",
      className: "underline text-blue-600",
    },
    "Privacy Policy"
  )}{" "}
  and{" "}
  {createElement(
    "a",
    {
      href: "/terms",
      className: "underline text-blue-600",
    },
    "Terms of Service"
  )}.
</p>
</div>
  <button
    type="submit"
    className="mt-4 rounded-lg bg-blue-600 px-6 py-3 text-white"
  >
    
    Continue
  </button>
</form>

      </div>
    </main>
  );
}
  
  const { data: campaign } = await supabaseServer
    .from("campaigns")
    .select("name")
    .eq("id", player.campaign_id)
    .single();

const { data: orders, error: ordersError } = await supabaseServer
  .from("orders")
  .select(`
    id,
    customer_name,
    total,
    payment_status,
    created_at,
    contacts!inner (
      id,
      name,
      player_id
    )
  `)
  .eq("contacts.player_id", player.id);
  const orderIds = orders?.map((order) => order.id) ?? [];

const { data: orderItems } =
  orderIds.length > 0
    ? await supabaseServer
        .from("order_items")
        .select("id, order_id, product_name, quantity, unit_price")
        .in("order_id", orderIds)
    : { data: [] };

  const goal = Number(player.goal) || 0;
  const raised =
  orders
    ?.filter((order) => order.payment_status === "paid")
    .reduce((sum, order) => sum + Number(order.total), 0) ?? 0;
    const paidOrders =
  orders?.filter((order) => order.payment_status === "paid") ?? [];

const paidOrderCount = paidOrders.length;
const supporterCount = new Set(
  paidOrders.map((order) => order.customer_name)
).size;
  const progress =
    goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

    async function goToContacts() {
  "use server";

  const { redirect } = await import("next/navigation");

  redirect(
    "/p/" +
      player.slug +
      "/contacts/view?token=" +
      encodeURIComponent(accessToken!)
  );
}

const manageContactsButton = createElement(
  "form",
  { action: goToContacts },
  createElement(
    "button",
    {
      type: "submit",
className:
  "w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 sm:w-auto",
    },
    "Manage Contacts"
  )
);
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-4xl font-bold">
        {player.name}
      </h1>

      <p className="mt-2 text-gray-600">
        {campaign?.name}
      </p>

<section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
<div className="flex items-center justify-between gap-4">
    <h2 className="text-lg font-semibold">
      Fundraising Progress
    </h2>

<span className="shrink-0 font-semibold text-blue-600">
      {Math.round(progress)}%
    </span>
  </div>

  <p className="mt-4 text-2xl font-bold">
    ${raised}
    <span className="text-base font-normal text-gray-500">
      {" "}raised of ${goal} goal
    </span>
  </p>

  <div className="mt-4 h-4 w-full rounded-full bg-gray-200">
    <div
      className="h-4 rounded-full bg-blue-600"
      style={{ width: `${progress}%` }}
    />
  </div>
</section>
<div className="mt-6 grid gap-4 sm:grid-cols-3">
  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">Amount Raised</p>
    <p className="mt-1 text-2xl font-bold">
      ${raised.toFixed(2)}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">Paid Orders</p>
    <p className="mt-1 text-2xl font-bold">
      {paidOrderCount}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">Supporters</p>
    <p className="mt-1 text-2xl font-bold">
      {supporterCount}
    </p>
  </div>
</div>
<section className="mt-8 rounded-xl border bg-gray-50 p-5">
  <h2 className="mb-4 text-lg font-semibold">
    Quick Actions
  </h2>

  <div className="flex flex-wrap gap-3">
    {manageContactsButton}
  </div>
</section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">
          Orders
        </h2>

        {ordersError ? (
          <p>Unable to load orders.</p>
        ) : !orders || orders.length === 0 ? (
          <p className="text-gray-600">
            No orders yet.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border p-4"
              >
                <p className="font-semibold">
                  {order.customer_name}
                </p>

                <p>
                  ${Number(order.total).toFixed(2)}
                </p>

<div className="mt-2 space-y-1">
  {orderItems
    ?.filter((item) => item.order_id === order.id)
    .map((item) => (
      <p
        key={item.id}
        className="text-sm text-gray-700"
      >
        {item.product_name} × {item.quantity} • $
        {(Number(item.unit_price) * item.quantity).toFixed(2)}
      </p>
    ))}
</div>
                <p className="text-sm text-gray-600">
                  Payment: {order.payment_status}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-10 text-sm text-gray-500">
        <p>{player.email}</p>
        <p>Fundraiser Code: {player.slug}</p>
      </div>
    </main>
  );
}

 