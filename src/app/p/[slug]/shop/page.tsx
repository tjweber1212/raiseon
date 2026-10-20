import { supabaseServer } from "@/lib/supabase-server";
import ShopCart from "./ShopCart";


export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ invite?: string }>;
}) {
  const { slug } = await params;
  const { invite } = await searchParams;

  const { data: player, error: playerError } = await supabaseServer
    .from("players")
    .select("id, name, campaign_id")
    .eq("slug", slug)
    .single();

  if (playerError || !player) {
    return (
      <main className="p-6">
        <h1>Player Not Found</h1>
      </main>
    );
  }
let contact = null;

if (invite) {
const { data } = await supabaseServer
.from("contacts")
.select("id, name, phone, player_id")
.eq("invite_token", invite)
.eq("player_id", player.id)
.single();

contact = data;
}
  const { data: products, error: productsError } = await supabaseServer
    .from("products")
    .select("id, name, price")
    .eq("campaign_id", player.campaign_id);

  return (
    <main className="mx-auto max-w-4xl p-6">
<section className="rounded-xl bg-blue-50 p-6">
  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
    Fundraiser Shop
  </p>

  <h1 className="mt-2 text-3xl font-bold">
    Support {player.name}
  </h1>

  {contact && (
    <p className="mt-3 text-gray-700">
      Welcome, {contact.name}! Choose an item below to support{" "}
      {player.name}'s fundraiser.
    </p>
  )}
</section>
      <section className="mt-8">
        {productsError ? (
          <p>Unable to load products.</p>
        ) : !products || products.length === 0 ? (
          <p>No products available.</p>
        ) : (
<ShopCart
  products={products.map((product) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
  }))}
  contactId={contact?.id ?? null}
  playerId={player.id}
  campaignId={player.campaign_id}
  inviteToken={invite ?? null}
/>

        )}
      </section>
    </main>
  );
}