"use server";

import { createClient } from "@/lib/supabase/server";
export async function addProduct({
  campaignId,
  name,
  price,
}: {
  campaignId: string;
  name: string;
  price: number;
}) {
    const cleanName = name.trim();
    if (!cleanName || !Number.isFinite(price) || price < 0) {

 throw new Error("Enter a product name and a valid price.");}

const supabase = await createClient();
 const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
 if (claimsError || !claimsData?.claims) {
 throw new Error("You must be signed in.");
}
const { error } = await supabase
  .from("products")
  .insert({
    campaign_id: campaignId,
    name: cleanName,
    price,
  });

if (error) {
  throw new Error(error.message);
}

return { success: true };
}
export async function getProducts(campaignId: string) {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
  await supabase.auth.getClaims();

if (claimsError || !claimsData?.claims) {
  throw new Error("You must be signed in.");
}
const { data: products, error } = await supabase
  .from("products")
  .select("id, name, price")
  .eq("campaign_id", campaignId)
  .order("name", { ascending: true });
  if (error) {
  throw new Error(error.message);
}

return products ?? [];
}