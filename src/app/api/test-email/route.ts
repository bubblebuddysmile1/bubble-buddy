import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function GET() {
  const sent = await sendEmail({
    to: [process.env.ADMIN_EMAIL ?? "bubblebuddysmile.developer@gmail.com"],
    subject: "Bubble Buddy Test Email",
    text: "This is a test email from Bubble Buddy.",
    html: "<p>This is a test email from Bubble Buddy.</p>",
  });

  return NextResponse.json({ ok: sent });
}
