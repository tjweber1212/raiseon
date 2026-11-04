"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
  useRouter,
} from "next/navigation";
import { getContacts, markContactInvited } from "./actions";

type Contact = {
  id: string;
  name: string;
  phone: string;
  invited_at: string | null;
  invite_token: string;
};

export default function ViewContactsPage() {
    const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("token") ?? "";

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadContacts() {
    try {
    const data = await getContacts(slug, accessToken);
      setContacts(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load contacts.";

      alert(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  loadContacts();
}, [slug, accessToken]);

async function handleInvite(contact: Contact) {
  const inviteUrl =
    `${window.location.origin}/p/${slug}/shop?invite=${contact.invite_token}`;

  const message = encodeURIComponent(
    `Hi ${contact.name},

I'm participating in a fundraiser.

Please support me here:

${inviteUrl}

Thank you!`
  );

  const { invitedAt } = await markContactInvited({
    slug,
    accessToken,
    contactId: contact.id,
  });

  setContacts((currentContacts) =>
    currentContacts.map((currentContact) =>
      currentContact.id === contact.id
        ? { ...currentContact, invited_at: invitedAt }
        : currentContact
    )
  );

  window.location.href = `sms:${contact.phone}?body=${message}`;
}



  if (loading) {
    return (
      <main className="p-10">
        <p>Loading contacts...</p>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-2xl p-10">
     <button
  type="button"
  onClick={() =>
    router.push(
      "/p/" +
        slug +
        "?token=" +
        encodeURIComponent(accessToken)
    )
  }
  className="mb-6 text-sm font-semibold text-blue-600 hover:underline"
>
  ← Back to Dashboard
</button>   
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          My Contacts
        </h1>

      <button
  onClick={() => {
    window.location.href =
      "/p/" +
      slug +
      "/contacts?token=" +
      encodeURIComponent(accessToken);
  }}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
        >
          + Add Contact
        </button>
      </div>

      {contacts.length === 0 ? (
        <p>No contacts added yet.</p>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-semibold">{contact.name}</p>
                <p className="text-gray-600">{contact.phone}</p>
              </div>

<div className="text-right">
  {contact.invited_at && (
    <>
      <p className="font-semibold text-green-600">
        ✓ Invited
      </p>

      <p className="text-sm text-gray-500">
        {new Date(contact.invited_at).toLocaleString()}
      </p>
    </>
  )}

  <button
    onClick={() => handleInvite(contact)}
    className="mt-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white"
  >
    {contact.invited_at ? "Invite Again" : "Invite"}
  </button>
</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}