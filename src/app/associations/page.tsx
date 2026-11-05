import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AssociationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: organizations } = await supabase
    .from("organizations")
    .select("*")
    .eq("owner_id", user.id)
    .order("name");

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-4xl font-bold">
          My Associations
        </h1>

        <p className="mb-8 text-gray-600">
          Select an association to manage fundraising activities.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizations?.map((organization) => (
            <Link
              key={organization.id}
              href={`/associations/${organization.id}`}
              className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold">
                {organization.name}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Open Association
              </p>
            </Link>
          ))}

          <div className="rounded-xl border-2 border-dashed bg-white p-6">
            <h2 className="text-xl font-semibold">
              + Add Association
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create another association workspace.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}