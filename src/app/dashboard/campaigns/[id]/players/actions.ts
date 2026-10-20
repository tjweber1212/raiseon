"use server";

import { createClient } from "@/lib/supabase/server";
export async function addPlayer({
  campaignId,
  name,
  email,
}: {
  campaignId: string;
  name: string;
  email: string;
}) {
  const cleanName = name.trim();
  const cleanEmail = email.trim();

  if (!cleanName || !cleanEmail) {
    throw new Error("Player name and email are required.");
  }

  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    throw new Error("You must be signed in.");
  }

  const { data,error } = await supabase
    .from("players")
    .insert({
      campaign_id: campaignId,
      name: cleanName,
      email: cleanEmail,
    }).select("id, name, email, campaign_id").single();
  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function getPlayers(campaignId: string) {
const supabase = await createClient();
const{data: claimsData, error: claimsError} = await
supabase.auth.getClaims();
if (claimsError|| !claimsData?.claims) {
    throw new Error ("You must be signed in.");
}
const { data: players, error } = await supabase
  .from("players")
  .select(`
  id,
  name,
  email,
  invite_sent_at,
  invite_count,
  onboarding_complete
`)
  .eq("campaign_id", campaignId)
  .order("name", { ascending: true });
  if (error) {
  throw new Error(error.message);
}

return players ?? [];
}