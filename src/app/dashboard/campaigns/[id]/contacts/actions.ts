"use server";

import { supabaseServer } from "@/lib/supabase-server";

export async function addDashboardContact({
  playerId,
  name,
  phone,
}: {
  playerId: string;
  name: string;
  phone: string;
}) {
  const cleanPlayerId = playerId.trim();
  const cleanName = name.trim();
  const cleanPhone = phone.trim();

  if (!cleanPlayerId || !cleanName || !cleanPhone) {
    throw new Error("Player ID, name, and phone number are required.");
  }

  const { data: player, error: playerError } = await supabaseServer
    .from("players")
    .select("id")
    .eq("id", cleanPlayerId)
    .single();

  if (playerError || !player) {
    throw new Error("Player not found.");
  }

  const inviteToken = crypto.randomUUID();

  const { error } = await supabaseServer
    .from("contacts")
    .insert([
      {
        player_id: player.id,
        name: cleanName,
        phone: cleanPhone,
        invite_token: inviteToken,
      },
    ]);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}