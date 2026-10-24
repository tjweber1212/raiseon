"use server";

import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

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
export async function sendPlayerInvite(playerId: string) {
  const supabase = await createClient();

  const { data: player, error } = await supabase
    .from("players")
    .select(`
      id,
      name,
      email,
      slug,
      access_token,
      invite_count
    `)
    .eq("id", playerId)
    .single();

  if (error || !player) {
    throw new Error("Player not found.");
  }

  const playerUrl =
    "https://raiseon-alpha.vercel.app/p/" +
    player.slug +
    "?token=" +
    player.access_token;

const emailResult = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: player.email,
  subject: "You're Invited to Participate in a Fundraiser",
  html: `...`,
});

console.log("EMAIL RESULT:", emailResult);

  await supabase
    .from("players")
    .update({
      invite_sent_at: new Date().toISOString(),
      invite_count: (player.invite_count ?? 0) + 1,
    })
    .eq("id", player.id);

  return { success: true };
}