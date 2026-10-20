import { supabaseServer } from "@/lib/supabase-server";
import Link from "next/link";
import { createElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { toggleCampaignActive } from "./actions";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CampaignDetailsPage({
   params,
}: Props) {
  const { id } = await params;   
  const supabase = await createClient();
  const { data: campaign } = await supabaseServer
  .from("campaigns")
  .select("*")
  .eq("id", id)
  .single();


const { data: players } = await supabaseServer
  .from("players")
  .select("id, name, goal")
  .eq("campaign_id", id);
const playerIds = players?.map((player) => player.id) ?? [];

const { data: contacts } =
  playerIds.length > 0
    ? await supabaseServer
        .from("contacts")
        .select("id, player_id")
        .in("player_id", playerIds)
    : { data: [] };

const contactIds = contacts?.map((contact) => contact.id) ?? [];

const { data: orders } =
  contactIds.length > 0
    ? await supabaseServer
        .from("orders")
        .select("id, contact_id, customer_name, total, payment_status, created_at")
        .in("contact_id", contactIds)
    : { data: [] };

 const paidOrders =
  orders?.filter((order) => order.payment_status === "paid") ?? [];

const totalRaised = paidOrders.reduce(
  (sum, order) => sum + Number(order.total),
  0
);
const playerTotals =
  players?.map((player) => {
    const playerContactIds =
      contacts
        ?.filter((contact) => contact.player_id === player.id)
        .map((contact) => contact.id) ?? [];

    const raised = paidOrders
      .filter((order) => playerContactIds.includes(order.contact_id))
      .reduce((sum, order) => sum + Number(order.total), 0);

    return {
      ...player,
      raised,
    };
  }) ?? [];
const leaderboard = [...playerTotals].sort(
  (a, b) => b.raised - a.raised
);  
const paidOrderCount = paidOrders.length;

const playerCount = players?.length ?? 0; 

const campaignGoal =
  players?.reduce(
    (sum, player) => sum + Number(player.goal || 0),
    0
  ) ?? 0;

const campaignProgress =
  campaignGoal > 0
    ? Math.min((totalRaised / campaignGoal) * 100, 100)
    : 0;

    const productsCard = createElement(
  Link,
  {
    href: "/dashboard/campaigns/" + id + "/products",
    className:
      "block rounded-xl border bg-white p-6 shadow hover:border-blue-300 hover:shadow-md",
  },
  createElement(
    "h2",
    { className: "text-xl font-bold text-black" },
    "Products"
  ),
  createElement(
    "p",
    { className: "mt-2 text-gray-700" },
    "Manage products available for sale."
  )
);

    const ordersCard = createElement(
  Link,
  {
    href: "/dashboard/campaigns/" + id + "/orders",
    className:
      "block rounded-xl border bg-white p-6 shadow hover:border-blue-300 hover:shadow-md",
  },
  createElement(
    "h2",
    { className: "text-xl font-bold text-black" },
    "Orders"
  ),
  createElement(
    "p",
    { className: "mt-2 text-gray-700" },
    "View fundraiser orders."
  )
);
const formatDate = (dateString: string) =>
  new Date(dateString + "T12:00:00").toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
async function toggleStatus() {
  "use server";

  await toggleCampaignActive(
    id,
    campaign?.active ?? false
  );
}
  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-6xl">
  <Link
  href="/dashboard/campaigns"
  className="mb-6 inline-block text-sm font-semibold text-blue-600 hover:underline"
>
  ← Back to Fundraisers
</Link>

<div className="flex items-start justify-between">
  <div>
    <h1 className="text-4xl font-bold text-black">
      {campaign?.name}
    </h1>
  </div>


</div>

<p className="mt-2 text-gray-600">
  Fundraiser runs from {formatDate(campaign.start_date)} through{" "}
  {formatDate(campaign.end_date)}
</p>
<div className="mt-3">
  <span
    className={
      campaign?.active
        ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
        : "rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
    }
  >
    {campaign?.active ? "Active" : "Inactive"}
  </span>
</div>
                <div className="mt-8 grid gap-4 md:grid-cols-4">
        {productsCard}
         <Link   
            href={"/dashboard/campaigns/"+id+"/players"}
            className="block rounded-xl border bg-white p-6 shadow hover:border-blue-300 hover:shadow-md"
            ><h2 className="text-xl font-bold text-black" > Players</h2>
            <p className="mt-2 text-gray-700">
                Manage players in this campaign.
                </p>      
          </Link>
        {ordersCard}
        </div>
<div className="mt-8 grid gap-4 md:grid-cols-3">
  <div className="rounded-xl border bg-white p-6 shadow-sm">
    <p className="text-sm text-gray-500">Total Raised</p>
    <p className="mt-1 text-3xl font-bold text-black">
      ${totalRaised.toFixed(2)}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-6 shadow-sm">
    <p className="text-sm text-gray-500">Paid Orders</p>
    <p className="mt-1 text-3xl font-bold text-black">
      {paidOrderCount}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-6 shadow-sm">
    <p className="text-sm text-gray-500">Players</p>
    <p className="mt-1 text-3xl font-bold text-black">
      {playerCount}
    </p>
  </div>
</div>
<section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-black">
      Campaign Progress
    </h2>

    <span className="font-semibold text-blue-600">
      {Math.round(campaignProgress)}%
    </span>
  </div>

  <p className="mt-3 text-gray-700">
    ${totalRaised.toFixed(2)} raised of ${campaignGoal.toFixed(2)} goal
  </p>

  <div className="mt-4 h-4 w-full rounded-full bg-gray-200">
    <div
      className="h-4 rounded-full bg-blue-600"
      style={{ width: `${campaignProgress}%` }}
    />
  </div>
</section>
<section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
  <h2 className="text-xl font-bold text-black">
    Player Leaderboard
  </h2>

  <div className="mt-4 space-y-3">
    {leaderboard.map((player, index) => (
      <div
        key={player.id}
        className="flex items-center justify-between rounded-lg border p-4"
      >
        <div className="flex items-center gap-4">
          <span className="w-8 font-bold text-gray-500">
            #{index + 1}
          </span>

          <span className="font-semibold text-black">
            {player.name}
          </span>
        </div>

        <span className="font-bold text-blue-600">
          ${player.raised.toFixed(2)}
        </span>
      </div>
    ))}
  </div>
</section>

      </div>
    </main>
  );
}