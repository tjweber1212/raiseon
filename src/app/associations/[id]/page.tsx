import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AssociationPage({
  params,
}: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: organization } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("organization_id", id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-3 text-4xl font-bold">
          {organization?.name}
        </h1>

        <p className="mb-8 text-lg text-gray-600">
          Launch your next fundraiser.
        </p>

        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
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

          <div className="rounded-xl border bg-white p-6 shadow-sm">
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

          <div className="rounded-xl border bg-white p-6 shadow-sm">
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

        <div className="mb-10">
        <Link
  href={`/associations/${id}/campaigns/new`}

            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Create Fundraiser
          </Link>
        </div>

        <div className="mb-10">
          <h2 className="mb-4 text-2xl font-bold">
            Fundraisers
          </h2>

          <div className="space-y-4">
            {campaigns?.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/dashboard/campaigns/${campaign.id}`}
                className="block rounded-xl border bg-white p-6 shadow-sm hover:border-blue-300"
              >
                <h3 className="text-xl font-semibold">
                  {campaign.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t pt-8">
          <h2 className="mb-2 text-xl font-semibold">
            Optional Setup
          </h2>

          <p className="mb-4 text-gray-600">
            Invite coaches, board members, booster club leaders,
            or volunteers to help manage fundraising activities.
          </p>

          <button className="rounded-lg border px-4 py-2 hover:bg-gray-50">
            Invite Administrator
          </button>
        </div>
      </div>
    </main>
  );
}