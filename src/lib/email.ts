import { Resend } from "resend";

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";
}

function getSupportEmail() {
  return process.env.SUPPORT_EMAIL ?? "support@bubblebuddy.com";
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL ?? getSupportEmail();
}

function getFromAddress() {
  return process.env.EMAIL_FROM ?? "Bubble Buddy <onboarding@resend.dev>";
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

function parseRecipients(value?: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

export type EmailPayload = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(payload: EmailPayload) {
  const resend = getResendClient();
  const fromAddress = getFromAddress();

  if (!resend) {
    console.warn("[email] Resend API key is missing. Skipping email send.");
    return false;
  }

  const recipients = Array.isArray(payload.to) ? payload.to : [payload.to];
  try {
    const response = await resend.emails.send({
      from: fromAddress,
      to: recipients,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });

    if (response.error) {
      console.error("[email] Resend failed to send email:", response.error);
      return false;
    }

    console.log(`[email] Email sent successfully via Resend to: ${recipients.join(", ")}`);
    return true;
  } catch (error) {
    console.error("[email] Failed to send email with Resend:", error);
    return false;
  }
}

export async function sendCustomerAndAdminEmail(payload: Omit<EmailPayload, "to"> & { customerEmail?: string | null; includeAdmin?: boolean }) {
  const recipients = [
    ...(payload.customerEmail ? [payload.customerEmail] : []),
    ...(payload.includeAdmin === false ? [] : parseRecipients(getAdminEmail())),
  ].filter(Boolean);

  if (!recipients.length) {
    console.warn("[email] No recipients available for customer/admin email notification.");
    return false;
  }

  return sendEmail({
    to: [...new Set(recipients)],
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
}

export async function sendLoginNotificationEmail(user: { name?: string | null; email?: string | null }, event: "success" | "failed" = "success") {
  const subject = event === "success" ? "Bubble Buddy sign-in successful" : "Bubble Buddy sign-in attempt failed";
  const intro = event === "success"
    ? "A new sign-in to your Bubble Buddy account was detected."
    : "We detected a failed sign-in attempt to your Bubble Buddy account.";

  const text = `Hi ${user.name ?? user.email ?? "Customer"},\n\n${intro}\n\n` +
    `Time: ${new Date().toLocaleString("en-US")}\n` +
    `If this was you, no further action is needed. If this was not you, please reset your password immediately and contact support at ${getSupportEmail()}.\n\n` +
    `Bubble Buddy Team`;

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height:1.6; color:#1f2937;">` +
    `<h1 style="font-size:22px;">${subject}</h1>` +
    `<p>Hi ${user.name ?? user.email ?? "Customer"},</p>` +
    `<p>${intro}</p>` +
    `<p><strong>Time:</strong> ${new Date().toLocaleString("en-US")}</p>` +
    `<p>If this was you, no further action is needed. If this was not you, please reset your password immediately and contact support at ${getSupportEmail()}.</p>` +
    `<p><a href="${getAppUrl()}" style="display:inline-block;padding:12px 18px;background:#a67c52;color:white;text-decoration:none;border-radius:9999px;">Visit Bubble Buddy</a></p>` +
    `<p>Bubble Buddy Team</p>` +
    `</body></html>`;

  return sendCustomerAndAdminEmail({
    customerEmail: user.email,
    subject,
    text,
    html,
  });
}
