"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NewCampaignPage() {
  const [name, setName] = useState("");
const today = new Date().toISOString().split("T")[0];

const [startDate, setStartDate] = useState(today);
const [endDate, setEndDate] = useState(today);
  const [description, setDescription] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

const { data, error } = await supabase
  .from("campaigns")
  .insert([
    {
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      active: true,
    },
  ]);


    if (error) {
      alert(error.message);
      console.error(error);
      return;
    }

window.location.href = "/dashboard/campaigns";
  }

  return (
    <main className="mx-auto max-w-2xl p-10">
      <h1 className="mb-6 text-4xl font-bold">
        Create Fundraiser
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Fundraiser Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border p-3"
        />

<div>
  <label
    htmlFor="startDate"
    className="mb-2 block text-sm font-medium text-gray-700"
  >
    Start Date
  </label>

  <input
    id="startDate"
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="w-full rounded-lg border p-3"
  />
</div>

<div>
  <label
    htmlFor="endDate"
    className="mb-2 block text-sm font-medium text-gray-700"
  >
    End Date
  </label>

  <input
    id="endDate"
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className="w-full rounded-lg border p-3"
  />
</div>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows={4}
          className="w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          className="rounded-lg bg-black px-6 py-3 text-white"
        >
          Save Fundraiser
        </button>
      </form>
    </main>
  );
}
