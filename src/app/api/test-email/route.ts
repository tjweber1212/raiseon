import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "tjweber12@gmail.com",
      subject: "RaiseOn Test Email",
      html: "<p>Your first RaiseOn email is working!</p>",
    });

    return Response.json(result);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}