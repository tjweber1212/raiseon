"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { importPlayers } from "../actions";


export default function ImportRosterPage() {
  const router = useRouter();

  const [previewPlayers, setPreviewPlayers] = useState<
  { name: string; email: string }[]
>([]);
const [fileName, setFileName] = useState("");
async function handleFileUpload(
  e: React.ChangeEvent<HTMLInputElement>
) {
const file = e.target.files?.[0];

if (!file) return;

setFileName(file.name);

  const text = await file.text();

  const rows = text
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean);

  const players = rows
    .slice(1)
    .map((row) => {
      const [name, email] = row.split(",");

      return {
        name: name?.trim() ?? "",
        email: email?.trim() ?? "",
      };
    })
    .filter((player) => player.name);

  setPreviewPlayers(players);
}
async function handleImportPlayers() {
  try {
    const campaignId =
      window.location.pathname.split("/")[3];

    await importPlayers({
      campaignId,
      players: previewPlayers,
    });

    alert(
      `${previewPlayers.length} players imported successfully!`
    );

    router.push(
      `/dashboard/campaigns/${campaignId}/players`
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to import players.";

    alert(message);
    console.error(error);
  }
}
  return (
    <main className="mx-auto max-w-3xl p-10">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 text-sm font-semibold text-blue-600 hover:underline"
      >
        ← Back to Players
      </button>

      <h1 className="mb-4 text-4xl font-bold">
        Import Roster
      </h1>

      <p className="mb-8 text-gray-600">
        Upload a CSV file containing player names and email
        addresses.
      </p>

      <div className="mb-8 rounded-xl border bg-white p-6">
        <h2 className="mb-3 text-xl font-semibold">
          Step 1: Create a CSV File
        </h2>

<p className="mb-4 text-gray-600">
  Create a CSV file using Excel, Google Sheets, or another spreadsheet application and save it as a .csv file using this format:
</p>

        <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
{`name,email
Cora Weber,cora@email.com
Ryan Smith,ryan@email.com
Emma Jones,emma@email.com`}
        </pre>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-3 text-xl font-semibold">
          Step 2: Upload Your CSV
        </h2>

<input
  type="file"
  accept=".csv"
  onChange={handleFileUpload}
  className="w-full rounded-lg border p-3"
/>
{previewPlayers.length > 0 && (
  <div className="mt-8 rounded-xl border bg-white p-6">
    <h2 className="mb-4 text-xl font-semibold">
    Found {previewPlayers.length} Players

{fileName && (
  <p className="mt-2 text-sm text-gray-500">
    File: {fileName}
  </p>
)}
    </h2>

    <div className="space-y-2">
      {previewPlayers.map((player, index) => (
        <div
          key={index}
          className="rounded border p-3"
        >
          <div className="font-medium">
            {player.name}
          </div>

          <div className="text-sm text-gray-600">
            {player.email}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
{previewPlayers.length > 0 && (
  <div className="mt-4 flex gap-3">
    <button
      type="button"
      onClick={handleImportPlayers}
      className="rounded-lg bg-green-600 px-4 py-2 text-white"
    >
      Import {previewPlayers.length} Players
    </button>

    <button
      type="button"
      onClick={() => {
        setPreviewPlayers([]);
        setFileName("");
      }}
      className="rounded-lg border px-4 py-2"
    >
      Reset & Re-upload
    </button>
  </div>
)}
      </div>
    </main>
  );
}