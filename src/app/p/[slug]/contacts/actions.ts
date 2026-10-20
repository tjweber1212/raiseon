"use server";

import { supabaseServer } from "@/lib/supabase-server";

export async function addContact({
  slug,
  accessToken,
  name,
  phone,
}: {
  slug: string;
  accessToken: string;
  name: string;
  phone: string;
}) {
  const cleanName = name.trim();
  const cleanPhone = phone.trim();

  if (!cleanName || !cleanPhone) {
    throw new Error("Name and phone number are required.");
  }

  const { data: player, error: playerError } = await supabaseServer
    .from("players")
    .select("id")
    .eq("slug", slug)
    .eq("access_token", accessToken)
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
export async function validatePlayerAccess(
  slug: string,
  accessToken: string
) {
  if (!accessToken) {
    return false;
  }

  const { data: player, error } = await supabaseServer
    .from("players")
    .select("id")
    .eq("slug", slug)
    .eq("access_token", accessToken)
    .single();

  if (error || !player) {
    return false;
  }

  return true;
}