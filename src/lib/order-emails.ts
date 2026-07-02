import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendCustomerAndAdminEmail, sendEmail } from "@/lib/email";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "support@bubblebuddy.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? SUPPORT_EMAIL;

type MoneyValue = string | number | Prisma.Decimal;

type OrderWithDetails = NonNullable<Awaited<ReturnType<typeof loadOrder>>>;

function formatMoney(amount: MoneyValue) {
  return `$${Number(amount).toFixed(2)}`;
}

function formatDateTime(value?: Date | string | null) {
  if (!value) return "N/A";
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? "N/A" : parsed.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
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

function parseRecipients(value?: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

async function loadOrder(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      couponCode: true,
      razorpayOrderId: true,
      razorpayPaymentId: true,
      totalAmount: true,
      taxAmount: true,
      shippingAmount: true,
      discountAmount: true,
      redeemedLoyaltyPoints: true,
      loyaltyPointsEarned: true,
      placedAt: true,
      createdAt: true,
      updatedAt: true,
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
      billingAddress: {
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

async function sendOrderEmail(subject: string, text: string, html: string, to: string | string[]) {
  const recipients = Array.isArray(to) ? to : [to];
  const validRecipients = recipients.filter(Boolean);

  if (!validRecipients.length) {
    console.warn("[order-emails] No recipient email available for order notification.");
    return false;
  }

  return sendEmail({
    to: validRecipients,
    subject,
    text,
    html,
  });
}

function buildCustomerOrderEmail(order: OrderWithDetails, heading: string, intro: string) {
  const subject = `${heading} — #${order.orderNumber}`;
  const text = `Hi ${order.user?.name ?? "Customer"},\n\n${intro}\n\n` +
    `Order number: ${order.orderNumber}\n` +
    `Status: ${order.status}\n` +
    `Payment status: ${order.paymentStatus}\n` +
    `Payment method: ${order.paymentMethod ?? "N/A"}\n` +
    `Order total: ${formatMoney(order.totalAmount)}\n` +
    `Shipping: ${formatMoney(order.shippingAmount)}\n` +
    `Tax: ${formatMoney(order.taxAmount)}\n` +
    `Discount: ${formatMoney(order.discountAmount)}\n` +
    `Coupon code: ${order.couponCode ?? "N/A"}\n\n` +
    `Items:\n${buildItemsText(order.items)}\n\n` +
    `Shipping address:\n${formatAddress(order.shippingAddress)}\n\n` +
    `Track your order: ${orderUrl(order.orderNumber)}\n\n` +
    `If you have questions, reply to this email or contact our support team at ${SUPPORT_EMAIL}.\n\n` +
    `Thanks,\nBubble Buddy Team`;

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height:1.6; color:#1f2937;">` +
    `<h1 style="font-size:22px;">${heading}</h1>` +
    `<p>Hi ${order.user?.name ?? "Customer"},</p>` +
    `<p>${intro}</p>` +
    `<p><strong>Order number:</strong> #${order.orderNumber}<br><strong>Status:</strong> ${order.status}<br><strong>Payment status:</strong> ${order.paymentStatus}<br><strong>Payment method:</strong> ${order.paymentMethod ?? "N/A"}</p>` +
    `<table style="width:100%;border-collapse:collapse;margin:16px 0;"><thead><tr><th style="padding:10px;border:1px solid #e2e8f0;text-align:left;">Product</th><th style="padding:10px;border:1px solid #e2e8f0;text-align:center;">Qty</th><th style="padding:10px;border:1px solid #e2e8f0;text-align:right;">Total</th></tr></thead><tbody>${buildItemsHtml(order.items)}</tbody></table>` +
    `<p><strong>Order total:</strong> ${formatMoney(order.totalAmount)}<br><strong>Shipping:</strong> ${formatMoney(order.shippingAmount)}<br><strong>Tax:</strong> ${formatMoney(order.taxAmount)}<br><strong>Discount:</strong> ${formatMoney(order.discountAmount)}</p>` +
    `<p><strong>Shipping address:</strong><br>${formatAddress(order.shippingAddress).replace(/\n/g, "<br>")}</p>` +
    `<p><a href="${orderUrl(order.orderNumber)}" style="display:inline-block;padding:12px 18px;background:#a67c52;color:white;text-decoration:none;border-radius:9999px;">View order details</a></p>` +
    `<p>If you have questions, reply to this email or contact support at ${SUPPORT_EMAIL}.</p>` +
    `<p>Thanks,<br>Bubble Buddy Team</p>` +
    `</body></html>`;

  return { subject, text, html };
}

function buildAdminOrderEmail(order: OrderWithDetails, event: "received" | "payment_failed" | "status_update", status?: string) {
  const eventLabel = event === "payment_failed" ? "Payment failed" : event === "status_update" ? `Status updated to ${status ?? order.status}` : "New order received";
  const subject = event === "payment_failed"
    ? `Payment failed for order #${order.orderNumber}`
    : event === "status_update"
    ? `Order #${order.orderNumber} status updated to ${status ?? order.status}`
    : `New order received #${order.orderNumber}`;

  const intro = event === "payment_failed"
    ? `Payment for this order could not be completed. Please review the order and customer contact details.`
    : event === "status_update"
    ? `The order status was updated. Please review the current order status and fulfillment details.`
    : `A new customer order has been placed and requires attention.`;

  const text = `Admin notification\n\n${intro}\n\n` +
    `Customer: ${order.user?.name ?? "Guest"} <${order.user?.email ?? "N/A"}>\n` +
    `Order number: ${order.orderNumber}\n` +
    `Current status: ${order.status}\n` +
    `Payment status: ${order.paymentStatus}\n` +
    `Payment method: ${order.paymentMethod ?? "N/A"}\n` +
    `Placed at: ${formatDateTime(order.placedAt ?? order.createdAt)}\n` +
    `Order total: ${formatMoney(order.totalAmount)}\n` +
    `Shipping: ${formatMoney(order.shippingAmount)}\n` +
    `Tax: ${formatMoney(order.taxAmount)}\n` +
    `Discount: ${formatMoney(order.discountAmount)}\n` +
    `Coupon code: ${order.couponCode ?? "N/A"}\n` +
    `Razorpay order ID: ${order.razorpayOrderId ?? "N/A"}\n` +
    `Razorpay payment ID: ${order.razorpayPaymentId ?? "N/A"}\n\n` +
    `Items:\n${buildItemsText(order.items)}\n\n` +
    `Shipping address:\n${formatAddress(order.shippingAddress)}\n\n` +
    `Billing address:\n${formatAddress(order.billingAddress)}\n\n` +
    `Order link: ${orderUrl(order.orderNumber)}`;

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height:1.6; color:#1f2937;">` +
    `<h1 style="font-size:22px;">${eventLabel}</h1>` +
    `<p>${intro}</p>` +
    `<p><strong>Customer:</strong> ${order.user?.name ?? "Guest"} &lt;${order.user?.email ?? "N/A"}&gt;<br><strong>Order:</strong> #${order.orderNumber}<br><strong>Status:</strong> ${order.status}<br><strong>Payment status:</strong> ${order.paymentStatus}<br><strong>Payment method:</strong> ${order.paymentMethod ?? "N/A"}</p>` +
    `<table style="width:100%;border-collapse:collapse;margin:16px 0;"><thead><tr><th style="padding:10px;border:1px solid #e2e8f0;text-align:left;">Product</th><th style="padding:10px;border:1px solid #e2e8f0;text-align:center;">Qty</th><th style="padding:10px;border:1px solid #e2e8f0;text-align:right;">Total</th></tr></thead><tbody>${buildItemsHtml(order.items)}</tbody></table>` +
    `<p><strong>Order total:</strong> ${formatMoney(order.totalAmount)}<br><strong>Shipping:</strong> ${formatMoney(order.shippingAmount)}<br><strong>Tax:</strong> ${formatMoney(order.taxAmount)}<br><strong>Discount:</strong> ${formatMoney(order.discountAmount)}</p>` +
    `<p><strong>Shipping address:</strong><br>${formatAddress(order.shippingAddress).replace(/\n/g, "<br>")}</p>` +
    `<p><strong>Billing address:</strong><br>${formatAddress(order.billingAddress).replace(/\n/g, "<br>")}</p>` +
    `<p><a href="${orderUrl(order.orderNumber)}" style="display:inline-block;padding:12px 18px;background:#a67c52;color:white;text-decoration:none;border-radius:9999px;">Open order details</a></p>` +
    `</body></html>`;

  return { subject, text, html };
}

export async function sendOrderConfirmationEmail(orderNumber: string) {
  const order = await loadOrder(orderNumber);
  if (!order || !order.user?.email) return false;

  const { subject, text, html } = buildCustomerOrderEmail(
    order,
    "Order confirmed",
    "Thanks for your purchase! Your order has been confirmed and is being prepared for shipping.",
  );

  return sendCustomerAndAdminEmail({
    customerEmail: order.user.email,
    subject,
    text,
    html,
  });
}

export async function sendPaymentFailureEmail(orderNumber: string) {
  const order = await loadOrder(orderNumber);
  if (!order || !order.user?.email) return false;

  const { subject, text, html } = buildCustomerOrderEmail(
    order,
    "Payment failed",
    "We were unable to process payment for your order. The order has been cancelled and no charges were captured.",
  );

  return sendCustomerAndAdminEmail({
    customerEmail: order.user.email,
    subject,
    text,
    html,
  });
}

export async function sendOrderStatusUpdateEmail(orderNumber: string, status: string) {
  const order = await loadOrder(orderNumber);
  if (!order || !order.user?.email) return false;

  let heading = "Order status updated";
  let intro = `The status of your order has been updated to ${status}.`;

  switch (status) {
    case "SHIPPED":
      heading = "Your order is on the way";
      intro = "Great news! Your order has shipped and is on its way to you.";
      break;
    case "DELIVERED":
      heading = "Your order has been delivered";
      intro = "Your order has been delivered successfully. We hope you enjoy your purchase!";
      break;
    case "CANCELLED":
      heading = "Your order was cancelled";
      intro = "Your order has been cancelled. If this was a mistake or you need help, please contact support.";
      break;
    case "RETURN_REQUESTED":
      heading = "Return request received";
      intro = "We received your return request and the admin team will review it shortly.";
      break;
    case "RETURNED":
      heading = "Your return is complete";
      intro = "Your return has been approved and processed. Refund status will appear in your account shortly.";
      break;
    default:
      break;
  }

  const { subject, text, html } = buildCustomerOrderEmail(order, heading, intro);
  return sendCustomerAndAdminEmail({
    customerEmail: order.user.email,
    subject,
    text,
    html,
  });
}

export async function sendAdminOrderNotificationEmail(orderNumber: string, event: "received" | "payment_failed" | "status_update" = "received", status?: string) {
  const order = await loadOrder(orderNumber);
  if (!order) return false;

  const recipients = parseRecipients(ADMIN_EMAIL);
  if (!recipients.length) {
    console.warn("[order-emails] No admin email configured for order notification.");
    return false;
  }

  const { subject, text, html } = buildAdminOrderEmail(order, event, status);
  return sendOrderEmail(subject, text, html, recipients);
}
