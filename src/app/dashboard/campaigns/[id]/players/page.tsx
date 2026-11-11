"use client";
import { useRouter } from "next/navigation";

import { use, useEffect, useState } from "react";
import {
  addPlayer,
  getPlayers,
  sendPlayerInvite,
  inviteAllPlayers,
} from "./actions";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function PlayersPage({
  params,
}: Props) {
  const { id: campaignId } = use(params);
const router = useRouter();
const [campaignName, setCampaignName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [players, setPlayers] = useState<{
  id: string;
  name: string;
  email: string;
  invite_sent_at: string | null;
  invite_count: number | null;
  onboarding_complete: boolean;
}[]>([]);

  useEffect(() => {
  async function loadPlayers() {
    const data = await getPlayers(campaignId);
    setPlayers(data);
  }

  loadPlayers();
}, [campaignId]);
async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  console.log("Campaign ID:", campaignId);

  try {
    await addPlayer({
      campaignId,
      name,
      email,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to add player.";

    alert(message);
    console.error(error);
    return;
  }

  const updatedPlayers = await getPlayers(campaignId);
  setPlayers(updatedPlayers);

  alert("Player added!");

  setName("");
  setEmail("");
}

async function handleSendInvite(playerId: string) {
  try {
    await sendPlayerInvite(playerId);

    const updatedPlayers = await getPlayers(campaignId);
    setPlayers(updatedPlayers);

    alert("Invitation sent!");
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to send invite.";

    alert(message);
    console.error(error);
  }
}
async function handleInviteAll() {
  try {
    const result =
      await inviteAllPlayers(campaignId);

    const updatedPlayers =
      await getPlayers(campaignId);

    setPlayers(updatedPlayers);

    alert(
      `${result.count} invitations sent successfully!`
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to send invitations.";

    alert(message);
    console.error(error);
  }
}
  
  return (
    <main className="mx-auto max-w-2xl p-10">
 <button
  type="button"
  onClick={() =>
    router.push("/dashboard/campaigns/" + campaignId)
  }
  className="mb-6 text-sm font-semibold text-blue-600 hover:underline"
>
  ← Back to Fundraiser
</button>
      <h1 className="mb-6 text-4xl font-bold">
        Players
      </h1>



      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Player Name"
          className="w-full rounded-lg border p-3"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg border p-3"
        />

<div className="flex gap-3">
  <button
    type="submit"
    className="rounded-lg bg-black px-6 py-3 text-white"
  >
    Add Player
  </button>

  <button
    type="button"
    onClick={() =>
      router.push(
        `/dashboard/campaigns/${campaignId}/players/import`
      )
    }
    className="rounded-lg border px-6 py-3"
  >
    Import Roster
  </button>
</div>
      </form>
      <h2 className="mt-10 text-2xl font-bold">
  Current Players ({players.length})
</h2>
<div className="mt-4 mb-6">
  <button
    type="button"
    onClick={handleInviteAll}
    className="rounded-lg bg-green-600 px-4 py-2 text-white"
  >
    Invite All Players
  </button>
</div>
     <div className="mt-4 space-y-3">
      {players.map((player) => (   
 <div key={player.id} className="rounded-lg border bg-white p-4">
  <p className="font-semibold">{player.name}</p>
  <p className="text-sm text-gray-600">{player.email}</p>
  <div className="mt-2">
  {player.onboarding_complete ? (
    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
      🟢 Activated
    </span>
  ) : player.invite_sent_at ? (
    <div>
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
        🟡 Invited
      </span>

      <p className="mt-1 text-xs text-gray-500">
        Sent {new Date(player.invite_sent_at).toLocaleDateString()}
      </p>
    </div>
  ) : (
    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
      ⚫ Not Invited
    </span>
  )}
</div>

<div className="mt-3 flex gap-2">
  {!player.onboarding_complete && (
    <button
      type="button"
      onClick={() => handleSendInvite(player.id)}
      className="rounded bg-green-600 px-3 py-2 text-sm text-white"
    >
      {player.invite_sent_at
        ? "Resend Invite"
        : "Send Invite"}
    </button>
  )}

</div>
</div>
      ))}
      </div>
    </main>
  );
}