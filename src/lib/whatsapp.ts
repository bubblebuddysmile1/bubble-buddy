const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

function normalizePhoneNumber(raw: string) {
  const normalized = raw.trim();
  const digits = normalized.replace(/[^0-9]/g, "");
  if (!digits) return "";
  return normalized.startsWith("+") ? `+${digits}` : `+${digits}`;
}

function missingConfig() {
  return !accountSid || !authToken || !whatsappFrom;
}

export async function sendWhatsAppMessage(to: string, body: string) {
  if (missingConfig()) {
    console.warn("[whatsapp] Twilio WhatsApp config is missing. Skipping message.");
    return false;
  }

  const phone = normalizePhoneNumber(to);
  if (!phone) {
    console.warn("[whatsapp] Invalid recipient phone number. Skipping message.");
    return false;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const fromNumber = whatsappFrom as string;
  const payload = new URLSearchParams();
  payload.append("From", fromNumber);
  payload.append("To", `whatsapp:${phone}`);
  payload.append("Body", body);

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[whatsapp] Twilio API failed:", response.status, text);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[whatsapp] Failed to send WhatsApp message:", error);
    return false;
  }
}
