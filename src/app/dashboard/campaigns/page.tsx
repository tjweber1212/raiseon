import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ToggleFundraiserButton from "./ToggleFundraiserButton";

export default async function CampaignsPage() {
const supabase = await createClient();

const {
  data: { user },
} = await supabase.auth.getUser();

const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user!.id)
  .maybeSingle();

  if (!profile) {
  const { data: newOrganization } = await supabase
    .from("organizations")
    .insert({
      name: user?.user_metadata?.association_name,
      owner_id: user?.id,
    })
    .select()
    .single();

  await supabase.from("profiles").insert({
    id: user?.id,
    organization_id: newOrganization.id,
    name: user?.user_metadata?.full_name,
    email: user?.email,
    role: "owner",
  });
}

const { data: claimsData, error: claimsError } =
  await supabase.auth.getClaims();

const userId = claimsData!.claims!.sub;

const { data: organization } = await supabase
  .from("organizations")
  .select("*")
  .eq("owner_id", userId)
  .single();


const { data: campaigns } = await supabase
  .from("campaigns")
  .select("*")
  .eq("organization_id", organization?.id)
  .order("created_at", { ascending: false });


  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-5xl">
<div className="mb-8 flex items-center justify-between">
  <div>
    <h1 className="mb-2 text-4xl font-bold">
      Fundraisers
    </h1>

    <p className="text-gray-600">
      Create and manage fundraising campaigns.
    </p>
  </div>

{campaigns && campaigns.length > 0 && (
  <Link
    href="/dashboard/campaigns/new"
    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
  >
    + New Fundraiser
  </Link>
)}
</div>

  <div className="space-y-4">

{(!campaigns || campaigns.length === 0) && (
  <div className="rounded-2xl border bg-white p-10 shadow-sm">
    <h2 className="mb-3 text-4xl font-bold">
      Welcome to RaiseOn
    </h2>

    <p className="mb-8 max-w-2xl text-lg text-gray-600">
      Launch your first fundraiser in three simple steps.
    </p>

    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-xl border p-6">
        <div className="mb-3 text-3xl font-bold text-blue-600">
          ①
        </div>

        <h3 className="mb-2 text-xl font-semibold">
          Create Fundraiser
        </h3>

        <p className="text-gray-600">
          Set fundraiser dates, goals, and products.
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <div className="mb-3 text-3xl font-bold text-blue-600">
          ②
        </div>

        <h3 className="mb-2 text-xl font-semibold">
          Add Players
        </h3>

        <p className="text-gray-600">
          Import your roster or add players manually.
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <div className="mb-3 text-3xl font-bold text-blue-600">
          ③
        </div>

        <h3 className="mb-2 text-xl font-semibold">
          Start Selling
        </h3>

        <p className="text-gray-600">
          Players share links and supporters place orders online.
        </p>
      </div>
    </div>

    <div className="mt-10">
      <Link
        href="/dashboard/campaigns/new"
        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Create First Fundraiser
      </Link>
    </div>

    <div className="mt-10 border-t pt-8">
      <h3 className="mb-2 text-lg font-semibold">
        Optional Setup
      </h3>

      <p className="mb-4 max-w-2xl text-gray-600">
        Invite coaches, board members, booster club leaders, or volunteers
        to help manage your fundraiser.
      </p>

      <button
        className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50"
      >
        Invite Administrator
      </button>
    </div>
  </div>
)}

  {campaigns?.map((campaign) => (
            <div
  key={campaign.id}
  className={
    campaign.active
      ? "rounded-lg border bg-white p-6"
      : "rounded-lg border bg-gray-50 p-6 opacity-75"
  }
>
<h2 className="text-2xl font-bold">
  <Link
    href={"/dashboard/campaigns/" + campaign.id}
    className="text-black hover:text-blue-600"
    >
      {campaign.name}
      </Link>
</h2>
<p className="mt-2 text-sm text-gray-600">
  {new Date(
    campaign.start_date + "T12:00:00"
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}{" "}
  -{" "}
  {new Date(
    campaign.end_date + "T12:00:00"
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}
</p>

<div className="mt-3 flex items-center gap-3">
  <span
    className={
      campaign.active
        ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
        : "rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
    }
  >
    {campaign.active
      ? "🟢 Active Fundraiser"
      : "⚫ Inactive Fundraiser"}
  </span>

  <ToggleFundraiserButton
    campaignId={campaign.id}
    active={campaign.active}
  />
</div>


            </div>
          ))}
        </div>
      </div>
    </main>
  );
}