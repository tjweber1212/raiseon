"use server";

import { supabaseServer } from "@/lib/supabase-server";

export async function toggleCampaignActive(
  id: string,
  currentActive: boolean
) {
  await supabaseServer
    .from("campaigns")
    .update({
      active: !currentActive,
    })
    .eq("id", id);
}
export async function inviteAllPlayers(
  campaignId: string
) {
  const supabase = await createClient();

  const { data: players, error } = await supabase
    .from("players")
    .select("id, onboarding_complete")
    .eq("campaign_id", campaignId);

  if (error) {
    throw new Error(error.message);
  }

  const playersToInvite =
    players?.filter(
      (player) => !player.onboarding_complete
    ) ?? [];

  for (const player of playersToInvite) {
    await sendPlayerInvite(player.id);
  }

  return {
    success: true,
    count: playersToInvite.length,
  };
}