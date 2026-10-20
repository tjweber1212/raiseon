import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ToggleFundraiserButton from "./ToggleFundraiserButton";

export default async function CampaignsPage() {
const supabase = await createClient();

const { data: claimsData, error: claimsError } =
  await supabase.auth.getClaims();

if (claimsError || !claimsData?.claims) {
  redirect("/login");
}
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
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

  <Link
    href="/dashboard/campaigns/new"
    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      + New Fundraiser
    </Link>
</div>

        <div className="space-y-4">
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