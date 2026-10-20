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