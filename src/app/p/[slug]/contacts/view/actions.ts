"use server";

import { supabaseServer } from "@/lib/supabase-server";

export async function getContacts(
  slug: string,
  accessToken: string
) {
  const { data: player, error: playerError } = await supabaseServer
    .from("players")
    .select("id")
.eq("slug", slug)
.eq("access_token", accessToken)
.single();

  if (playerError || !player) {
    throw new Error("Player not found.");
  }

  const { data: contacts, error: contactsError } = await supabaseServer
    .from("contacts")
    .select("id, name, phone, invited_at")
    .eq("player_id", player.id);

  if (contactsError) {
    throw new Error(contactsError.message);
  }

  return contacts ?? [];
}

export async function markContactInvited({
  slug,
  accessToken,
  contactId,
}: {
  slug: string;
  accessToken: string;
  contactId: string;
}) {
  const { data: player, error: playerError } = await supabaseServer
    .from("players")
    .select("id")
    .eq("slug", slug)
    .single();

  if (playerError || !player) {
    throw new Error("Player not found.");
  }

  const invitedAt = new Date().toISOString();

  const { data: contact, error: contactError } = await supabaseServer
    .from("contacts")
    .update({
      invited_at: invitedAt,
    })
    .eq("id", contactId)
    .eq("player_id", player.id)
    .select("id")
    .single();

  if (contactError || !contact) {
    throw new Error(
      contactError?.message || "Unable to update contact."
    );
  }

  return { invitedAt };
}