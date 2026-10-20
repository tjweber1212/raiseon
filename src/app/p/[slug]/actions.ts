"use server";

import twilio from "twilio";
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
    })
    .eq("id", playerId);

  if (error) {
    throw new Error(error.message);
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    throw new Error("Twilio configuration is missing.");
  }

  const client = twilio(accountSid, authToken);

  await client.messages.create({
    body:
      "Welcome to your fundraiser! Save this link to access your fundraising dashboard anytime: " +
      dashboardUrl,
    from: twilioPhoneNumber,
    to: phone,
  });
}