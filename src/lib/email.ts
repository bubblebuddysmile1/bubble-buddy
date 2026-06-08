import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_ADDRESS = process.env.EMAIL_FROM ?? `Bubble Buddy <no-reply@bubblebuddy.com>`;

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (!SMTP_HOST) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: SMTP_USER
      ? {
          user: SMTP_USER,
          pass: SMTP_PASS,
        }
      : undefined,
  });

  return transporter;
}

export type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(payload: EmailPayload) {
  const transport = getTransporter();
  if (!transport) {
    console.warn("[email] SMTP configuration is missing. Skipping email send.");
    return false;
  }

  try {
    await transport.sendMail({
      from: FROM_ADDRESS,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
    return true;
  } catch (error) {
    console.error("[email] Failed to send email:", error);
    return false;
  }
}
