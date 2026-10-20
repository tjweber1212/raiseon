"use client";

import { useState } from "react";
import { addDashboardContact } from "./actions";

export default function ContactsPage() {
  const [playerId, setPlayerId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  try {
    await addDashboardContact({
      playerId,
      name,
      phone,
    });

    alert("Contact added!");

    setPlayerId("");
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
      <h1 className="mb-6 text-4xl font-bold">
        Contacts
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          placeholder="Player ID"
          className="w-full rounded-lg border p-3"
        />

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
