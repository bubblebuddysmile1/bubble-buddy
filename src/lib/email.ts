import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_ADDRESS = process.env.EMAIL_FROM ?? "Bubble Buddy <onboarding@resend.dev>";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export type EmailPayload = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(payload: EmailPayload) {
  if (!resend) {
    console.warn("[email] Resend API key is missing. Skipping email send.");
    return false;
  }

  try {
    const response = await resend.emails.send({
      from: FROM_ADDRESS,
      to: Array.isArray(payload.to) ? payload.to : [payload.to],
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });

    if (response.error) {
      console.error("[email] Resend failed to send email:", response.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[email] Failed to send email with Resend:", error);
    return false;
  }
}
