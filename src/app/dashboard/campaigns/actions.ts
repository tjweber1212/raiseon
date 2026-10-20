"use server";

import { supabaseServer } from "@/lib/supabase-server";

export async function toggleFundraiser(
  id: string,
  active: boolean
) {
  await supabaseServer
    .from("campaigns")
    .update({ active: !active })
    .eq("id", id);
}