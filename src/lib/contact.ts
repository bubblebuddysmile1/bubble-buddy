export const CONTACT_INFO = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.SUPPORT_EMAIL || "info@bubblebuddysmile.com",
  phoneDisplay: process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY || "+91 98888 88329",
  phoneHref: process.env.NEXT_PUBLIC_CONTACT_PHONE_HREF || "+919888888329",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919888888329",
  whatsappMessage: "Hello Bubble Buddy Smile, I need help.",
  address: "Tricity Plaza, 316, Peer Muchalla Rd, Sector 20, Zirakpur, Sanauli, Punjab 140603",
} as const;

export function getWhatsAppLink(message = CONTACT_INFO.whatsappMessage) {
  const digits = CONTACT_INFO.whatsappNumber.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encodedMessage}`;
}

export const BUSINESS_EMAIL = CONTACT_INFO.email;
export const BUSINESS_PHONE = CONTACT_INFO.phoneDisplay;
export const BUSINESS_WHATSAPP_LINK = getWhatsAppLink();
