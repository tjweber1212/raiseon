import { supabaseServer } from "@/lib/supabase-server";

type Props = {
 params: Promise<{
 id: string;
 }>;
 };

 export default async function OrdersPage({ params }: Props) {
 const { id } = await params;
const { data: players, error: playersError } = await supabaseServer.from("players").select("id, name").eq("campaign_id", id);
 const playerIds = players?.map((player) => player.id) ?? [];
 const { data: contacts, error: contactsError } =
 playerIds.length > 0
 ? await supabaseServer
 .from("contacts")
.select("id, player_id, name")
 .in("player_id", playerIds)
 : { data: [], error: null };
 const contactIds = contacts?.map((contact) => contact.id) ?? [];
 const contactById = new Map(contacts?.map((contact) => [contact.id, contact]) ?? []);
 const playerById = new Map(players?.map((player) => [player.id, player]) ?? []);
 const playerSummary = new Map<string, { orders: number; total: number }>();

 const { data: orders, error: ordersError } =
 contactIds.length > 0
 ? await supabaseServer
 .from("orders")
 .select("id, contact_id, customer_name, total, payment_status, created_at")
 .in("contact_id", contactIds)
 .order("created_at", { ascending: false })
 : { data: [], error: null };


 const orderIds = orders?.map((order) => order.id) ?? [];
 const totalOrdered = orders?.reduce((sum, order) => sum + Number(order.total), 0) ?? 0;
 orders?.forEach((order) => {
const playerId = contactById.get(order.contact_id)?.player_id;
if (!playerId) return;
const current = playerSummary.get(playerId) ?? { orders: 0, total: 0 };
playerSummary.set(playerId, { orders: current.orders + 1, total: current.total + Number(order.total) });
});
 const { data: orderItems } = orderIds.length > 0 ? await supabaseServer.from("order_items").select("id, order_id, product_name, quantity, unit_price").in("order_id", orderIds) : { data: [] };
 const productSummary = new Map<string, number>();
orderItems?.forEach((item) => {
productSummary.set(item.product_name, (productSummary.get(item.product_name) ?? 0) + item.quantity);
});
 return (
 <main className="p-10">
 <a href={"/dashboard/campaigns/" + id}
 className="mb-6 inline-block text-sm font-semibold text-blue-600 hover:underline"
 >
 ← Back to Campaign Dashboard
 </a> 
 <h1 className="text-4xl font-bold">Orders</h1>
 <p className="mt-4">Campaign ID: {id}</p>
 <div className="mt-6 grid gap-4 sm:grid-cols-2">
 <p className="rounded-xl border bg-white p-5 text-xl font-semibold shadow-sm">Orders: {orders?.length ?? 0}</p>
<p className="rounded-xl border bg-white p-5 text-xl font-semibold shadow-sm">Total Ordered: ${totalOrdered.toFixed(2)}</p>
 </div>
 <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
<h2 className="text-xl font-bold">Product Summary</h2>
<div className="mt-4 space-y-2">
{Array.from(productSummary.entries()).map(([productName, quantity]) => (
<p key={productName}>{productName}: {quantity} sold</p>
))}
</div>
</section>
<section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
<h2 className="text-xl font-bold">Player Summary</h2>
<div className="mt-4 space-y-3">
{Array.from(playerSummary.entries()).map(([playerId, summary]) => (
<div key={playerId} className="flex items-center justify-between border-b pb-2">
<span className="font-semibold">{playerById.get(playerId)?.name ?? "Unknown Player"}</span>
<span>{summary.orders} orders • ${summary.total.toFixed(2)}</span>
</div>
))}
</div>
</section>
 <div className="mt-6 space-y-4">
{orders?.map((order) => (
<div key={order.id} className="rounded-lg border bg-white p-4">
<p className="font-semibold">{order.customer_name}</p>
<p className="text-sm text-blue-600">Player: {playerById.get(contactById.get(order.contact_id)?.player_id ?? "")?.name ?? "Unknown"}</p>
<p>${Number(order.total).toFixed(2)}</p>
<div className="mt-2 space-y-1">
{orderItems?.filter((item) => item.order_id === order.id).map((item) => (
<p key={item.id} className="text-sm text-gray-700">
{item.product_name} × {item.quantity} • ${(Number(item.unit_price) * item.quantity).toFixed(2)}
</p>
))}
</div>
<p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
</div>
))}
</div>
 </main>
 );
 }