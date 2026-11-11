import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function createAssociation(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = formData.get("name")?.toString();

  if (!name) {
    return;
  }

  const { error } = await supabase
    .from("organizations")
    .insert({
      name,
      owner_id: user.id,
    });

  if (error) {
    console.error(error);
    return;
  }

  redirect("/associations");
}

export default function NewAssociationPage() {
  return (
    <main className="mx-auto max-w-2xl p-10">
      <h1 className="mb-6 text-4xl font-bold">
        Add Organization
      </h1>

      <form action={createAssociation} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Association Name"
          className="w-full rounded-lg border p-3"
          required
        />

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          Create Organization
        </button>
      </form>
    </main>
  );
}