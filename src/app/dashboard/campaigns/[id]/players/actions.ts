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
    html: `
      <h2>Welcome to RaiseOn!</h2>

      <p>Hi ${player.name}'s Family,</p>

      <p>
        You've been invited to participate in a fundraiser.
      </p>

      <p>
        Click the button below to access your fundraising dashboard:
      </p>

      <p>
        <a
          href="${playerUrl}"
          style="
            background:#2563eb;
            color:white;
            padding:12px 20px;
            text-decoration:none;
            border-radius:6px;
            display:inline-block;
          "
        >
          Access Fundraising Dashboard
        </a>
      </p>

      <p>
        If the button doesn't work, copy and paste this link into your browser:
      </p>

      <p>
        ${playerUrl}
      </p>

      <p>
        Thank you for participating in the fundraiser!
      </p>
    `,
  });

  console.log("EMAIL RESULT:", emailResult);

  await supabase
    .from("players")
    .update({
      invite_sent_at: new Date().toISOString(),
      invite_count: (player.invite_count ?? 0) + 1,
    })
    .eq("id", player.id);

  return {
    success: true,
    emailResult,
  };
}