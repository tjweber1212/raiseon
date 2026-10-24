"use server";

import { supabaseServer } from "@/lib/supabase-server";

export async function savePhoneNumber(
  playerId: string,
  phone: string,
  dashboardUrl: string
) {
  const { error } = await supabaseServer
    .from("players")
    .update({
      phone,
      onboarding_complete: true,
    })
    .eq("id", playerId);

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
  };
}