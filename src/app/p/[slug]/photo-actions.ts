"use server";

import { supabaseServer } from "@/lib/supabase-server";

export async function uploadPlayerPhoto(
  playerId: string,
  formData: FormData
) {
    console.log("UPLOAD ACTION CALLED");
  const file = formData.get("photo") as File;

  if (!file || file.size === 0) {
    throw new Error("Please select a photo.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName =
    playerId +
    "-" +
    Date.now() +
    "-" +
    file.name;

  const { error: uploadError } = await supabaseServer.storage
    .from("player-photos")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabaseServer.storage
    .from("player-photos")
    .getPublicUrl(fileName);

  const photoUrl = data.publicUrl;

  const { error: updateError } = await supabaseServer
    .from("players")
    .update({
      photo_url: photoUrl,
    })
    .eq("id", playerId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return photoUrl;
}