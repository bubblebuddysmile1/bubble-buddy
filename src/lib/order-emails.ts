import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "support@bubblebuddy.com";

type MoneyValue = string | number | Prisma.Decimal;

function formatMoney(amount: MoneyValue) {
  return `$${Number(amount).toFixed(2)}`;
}

function formatAddress(address: {
  recipient?: string | null;
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
} | null) {
  if (!address) return "N/A";
  const lines = [address.recipient, address.line1, address.line2, `${address.city ?? ""} ${address.state ?? ""}`.trim(), address.postalCode, address.country];
  return lines.filter(Boolean).join("\n");
}

function buildItemsText(items: Array<{ name: string; quantity: number; totalPrice: MoneyValue }>) {
  return items
    .map((item) => `- ${item.name} x${item.quantity} — ${formatMoney(item.totalPrice)}`)
    .join("\n");
}

function buildItemsHtml(items: Array<{ name: string; quantity: number; totalPrice: MoneyValue }>) {
  return items
    .map(
      (item) =>
        `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;">${item.name}</td><td style="padding:6px 10px;border:1px solid #e2e8f0;text-align:center;">${item.quantity}</td><td style="padding:6px 10px;border:1px solid #e2e8f0;text-align:right;">${formatMoney(item.totalPrice)}</td></tr>`,
    )
    .join("");
}

function orderUrl(orderNumber: string) {
  return `${APP_URL}/orders/${orderNumber}`;
}

async function loadOrder(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      totalAmount: true,
      shippingAmount: true,
      discountAmount: true,
      items: { select: { name: true, quantity: true, totalPrice: true } },
      shippingAddress: {
        select: {
          recipient: true,
          line1: true,
          line2: true,
          city: true,
          state: true,
          postalCode: true,
          country: true,
          phone: true,
        },
      },
      user: { select: { name: true, email: true } },
    },
  });
}

async function sendOrderEmail(subject: string, text: string, html: string, to: string) {
  if (!to) {
    console.warn("[order-emails] No customer email available for order notification.");
    return false;
  }

  return sendEmail({
    to,
    subject,
    text,
    html,
  });
}

export async function sendOrderConfirmationEmail(orderNumber: string) {
  const order = await loadOrder(orderNumber);
  if (!order || !order.user?.email) return false;

  const subject = `Bubble Buddy order confirmed — #${order.orderNumber}`;
  const text = `Hi ${order.user.name ?? "Customer"},\n\n` +
    `Thanks for your purchase! Your order ${order.orderNumber} has been confirmed and is being prepared for shipping.\n\n` +
    `Order total: ${formatMoney(order.totalAmount)}\n` +
    `Payment status: ${order.paymentStatus}\n\n` +
    `Items:\n${buildItemsText(order.items)}\n\n` +
    `Shipping address:\n${formatAddress(order.shippingAddress)}\n\n` +
    `Track your order: ${orderUrl(order.orderNumber)}\n\n` +
    `If you have questions, reply to this email or contact our support team at ${SUPPORT_EMAIL}.\n\n` +
    `Thanks,\nBubble Buddy Team`;

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height:1.6; color:#1f2937;">` +
    `<h1 style="font-size:22px;">Order confirmed</h1>` +
    `<p>Hi ${order.user.name ?? "Customer"},</p>` +
    `<p>Your order <strong>#${order.orderNumber}</strong> has been confirmed and is being prepared for shipping.</p>` +
    `<table style="width:100%;border-collapse:collapse;margin:16px 0;"><thead><tr><th style="padding:10px;border:1px solid #e2e8f0;text-align:left;">Product</th><th style="padding:10px;border:1px solid #e2e8f0;text-align:center;">Qty</th><th style="padding:10px;border:1px solid #e2e8f0;text-align:right;">Total</th></tr></thead><tbody>${buildItemsHtml(order.items)}</tbody></table>` +
    `<p style="margin:16px 0;"><strong>Order total:</strong> ${formatMoney(order.totalAmount)}</p>` +
    `<p style="margin:16px 0;"><strong>Shipping address:</strong><br>${formatAddress(order.shippingAddress).replace(/\n/g, "<br>")}</p>` +
    `<p><a href="${orderUrl(order.orderNumber)}" style="display:inline-block;padding:12px 18px;background:#a67c52;color:white;text-decoration:none;border-radius:9999px;">Track your order</a></p>` +
    `<p>If you have questions, reply to this email or contact support at ${SUPPORT_EMAIL}.</p>` +
    `<p>Thanks,<br>Bubble Buddy Team</p>` +
    `</body></html>`;

  return sendOrderEmail(subject, text, html, order.user.email);
}

export async function sendPaymentFailureEmail(orderNumber: string) {
  const order = await loadOrder(orderNumber);
  if (!order || !order.user?.email) return false;

  const subject = `Payment failed for order #${order.orderNumber}`;
  const text = `Hi ${order.user.name ?? "Customer"},\n\n` +
    `We were unable to process payment for your order ${order.orderNumber}. The order has been cancelled and no charges were captured.\n\n` +
    `If you would like to try again, please place a new order through the checkout page.\n\n` +
    `Need help? Contact support at ${SUPPORT_EMAIL}.\n\n` +
    `Bubble Buddy Team`;

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height:1.6; color:#1f2937;">` +
    `<h1 style="font-size:22px;">Payment failed</h1>` +
    `<p>Hi ${order.user.name ?? "Customer"},</p>` +
    `<p>We were unable to process payment for your order <strong>#${order.orderNumber}</strong>. The order has been cancelled and no charges were captured.</p>` +
    `<p>If you would like to try again, place a new order through our checkout page.</p>` +
    `<p>If you need help, contact support at ${SUPPORT_EMAIL}.</p>` +
    `<p>Bubble Buddy Team</p>` +
    `</body></html>`;

  return sendOrderEmail(subject, text, html, order.user.email);
}

export async function sendOrderStatusUpdateEmail(orderNumber: string, status: string) {
  const order = await loadOrder(orderNumber);
  if (!order || !order.user?.email) return false;

  let subject = `Update for order #${order.orderNumber}`;
  let intro = "";

  switch (status) {
    case "SHIPPED":
      subject = `Your order #${order.orderNumber} is on the way`;
      intro = `Great news! Your order has shipped and is on its way to you.`;
      break;
    case "DELIVERED":
      subject = `Your order #${order.orderNumber} has been delivered`;
      intro = `Your order has been delivered successfully. We hope you enjoy your purchase!`;
      break;
    case "CANCELLED":
      subject = `Order #${order.orderNumber} was cancelled`;
      intro = `Your order has been cancelled. If this was a mistake or you need help, please contact support.`;
      break;
    case "RETURN_REQUESTED":
      subject = `Return request received for order #${order.orderNumber}`;
      intro = `We've received your return request and the admin team will review it shortly.`;
      break;
    case "RETURNED":
      subject = `Your return for order #${order.orderNumber} is complete`;
      intro = `Your return has been approved and processed. Refund status will appear in your account shortly.`;
      break;
    default:
      subject = `Order #${order.orderNumber} status updated`;
      intro = `The status of your order has been updated to ${status}.`;
  }

  const text = `Hi ${order.user.name ?? "Customer"},\n\n${intro}\n\n` +
    `Order number: ${order.orderNumber}\n` +
    `Current status: ${status}\n\n` +
    `Track it here: ${orderUrl(order.orderNumber)}\n\n` +
    `If you have questions, contact us at ${SUPPORT_EMAIL}.\n\n` +
    `Bubble Buddy Team`;

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height:1.6; color:#1f2937;">` +
    `<h1 style="font-size:22px;">${subject}</h1>` +
    `<p>Hi ${order.user.name ?? "Customer"},</p>` +
    `<p>${intro}</p>` +
    `<p><strong>Order</strong>: #${order.orderNumber}<br><strong>Status</strong>: ${status}</p>` +
    `<p><a href="${orderUrl(order.orderNumber)}" style="display:inline-block;padding:12px 18px;background:#a67c52;color:white;text-decoration:none;border-radius:9999px;">View order details</a></p>` +
    `<p>If you have questions, contact support at ${SUPPORT_EMAIL}.</p>` +
    `<p>Bubble Buddy Team</p>` +
    `</body></html>`;

  return sendOrderEmail(subject, text, html, order.user.email);
}
