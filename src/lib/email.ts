import fs from "fs";
import path from "path";
import { Resend } from "resend";

function readEnvValue(name: string): string | undefined {
  const fromProcess = process.env[name];
  if (fromProcess) return fromProcess;

  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) return undefined;
    const raw = fs.readFileSync(envPath, "utf8");
    const match = raw.match(new RegExp(`^${name}=(.*)$`, "m"));
    return match ? match[1].trim().replace(/^['"]|['"]$/g, "") : undefined;
  } catch {
    return undefined;
  }
}

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = readEnvValue("RESEND_API_KEY");
  if (!apiKey) return null;
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

export type EmailPayload = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    console.error("[email] Resend API key not configured");
    return false;
  }

  const from = readEnvValue("EMAIL_FROM") || "Bubble Buddy <onboarding@resend.dev>";
  const recipients = Array.isArray(payload.to) ? payload.to : [payload.to];
  const cleanRecipients = recipients.filter((e) => e && typeof e === "string").map((e) => e.trim());

  if (!cleanRecipients.length) {
    console.warn("[email] No recipients provided");
    return false;
  }

  try {
    console.log(`[email] Sending to: ${cleanRecipients.join(", ")}`);
    const response = await resend.emails.send({
      from,
      to: cleanRecipients,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    if (response.error) {
      console.error("[email] Error:", response.error);
      return false;
    }

    console.log(`[email] Sent. ID: ${response.data?.id}`);
    return true;
  } catch (error) {
    console.error("[email] Exception:", error instanceof Error ? error.message : error);
    return false;
  }
}

export async function sendCustomerAndAdminEmail(options: {
  customerEmail?: string | null;
  subject: string;
  text: string;
  html?: string;
  includeAdmin?: boolean;
}): Promise<boolean> {
  const recipients: string[] = [];

  if (options.customerEmail?.trim()) {
    recipients.push(options.customerEmail.trim());
  }

  if (options.includeAdmin !== false) {
    const adminEmail = readEnvValue("ADMIN_EMAIL") || readEnvValue("SUPPORT_EMAIL") || "support@bubblebuddy.com";
    if (adminEmail?.trim()) {
      adminEmail.split(",").forEach((e) => {
        const trimmed = e.trim();
        if (trimmed) recipients.push(trimmed);
      });
    }
  }

  const uniqueRecipients = [...new Set(recipients)];
  if (!uniqueRecipients.length) {
    console.warn("[email] No valid recipients");
    return false;
  }

  return sendEmail({
    to: uniqueRecipients,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}

export async function sendLoginNotificationEmail(
  user: { name?: string | null; email?: string | null },
  event: "success" | "failed" = "success"
): Promise<boolean> {
  if (!user.email?.trim()) {
    console.warn("[email] No user email for login notification");
    return false;
  }

  const subject = event === "success" ? "Bubble Buddy Sign-in Successful" : "Bubble Buddy Sign-in Failed";
  const intro =
    event === "success"
      ? "A new sign-in to your Bubble Buddy account was detected."
      : "We detected a failed sign-in attempt to your Bubble Buddy account.";

  const supportEmail = readEnvValue("SUPPORT_EMAIL") || "support@bubblebuddy.com";
  const appUrl = (readEnvValue("NEXT_PUBLIC_APP_URL") || "http://localhost:3000").replace(/\/+$/, "");

  const text =
    `Hi ${user.name || user.email},\n\n` +
    `${intro}\n\n` +
    `Time: ${new Date().toLocaleString("en-US")}\n` +
    `If this was you, no further action needed.\n` +
    `If not, reset your password at ${appUrl}\n\n` +
    `Support: ${supportEmail}\n` +
    `Bubble Buddy Team`;

  const html =
    `<!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.6;color:#333;">` +
    `<h2>${subject}</h2>` +
    `<p>Hi ${user.name || user.email},</p>` +
    `<p>${intro}</p>` +
    `<p><strong>Time:</strong> ${new Date().toLocaleString("en-US")}</p>` +
    `<p>If this was you, no action needed. If not, <a href="${appUrl}/auth">reset your password</a>.</p>` +
    `<p>Questions? <a href="mailto:${supportEmail}">Contact support</a></p>` +
    `<p>Bubble Buddy Team</p>` +
    `</body></html>`;

  return sendCustomerAndAdminEmail({
    customerEmail: user.email,
    subject,
    text,
    html,
  });
}
