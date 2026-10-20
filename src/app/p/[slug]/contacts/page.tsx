"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addContact, validatePlayerAccess } from "./actions";

export default function ContactsPage() {
    const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("token") ?? "";
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [accessValid, setAccessValid] = useState<boolean | null>(null);
useEffect(() => {
  async function checkAccess() {
    const valid = await validatePlayerAccess(slug, accessToken);
    setAccessValid(valid);
  }

  checkAccess();
}, [slug, accessToken]);
  
if (accessValid === null) {
  return (
    <main className="p-6">
      <p>Checking access...</p>
    </main>
  );
}

if (!accessValid) {
  return (
    <main className="p-6">
      <h1>Player Not Found</h1>
    </main>
  );
}


  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

 try {
await addContact({
  slug,
  accessToken,
  name,
  phone,
});

  alert("Contact added!");

  setName("");
  setPhone("");
} catch (error) {
  const message =
    error instanceof Error
      ? error.message
      : "Unable to add contact.";

  alert(message);
  console.error(error);
}
  }

  return (
    <main className="mx-auto max-w-2xl p-10">
        <button
  type="button"
  onClick={() =>
    router.push(
      "/p/" +
        slug +
        "/contacts/view?token=" +
        encodeURIComponent(accessToken)
    )
  }
  className="mb-6 text-sm font-semibold text-blue-600 hover:underline"
>
  ← Back to My Contacts
</button>
      <h1 className="mb-6 text-4xl font-bold">
        Add Contacts
      </h1>

      <p className="mb-6 text-gray-700">
        Fundraiser Code: {slug}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contact Name"
          className="w-full rounded-lg border p-3"
        />

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          className="rounded-lg bg-black px-6 py-3 text-white"
        >
          Add Contact
        </button>
      </form>
    </main>
  );
}