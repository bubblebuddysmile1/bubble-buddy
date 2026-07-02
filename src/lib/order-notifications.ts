import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail, sendPaymentFailureEmail, sendAdminOrderNotificationEmail } from "@/lib/order-emails";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "support@bubblebuddy.com";

type OrderContact = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

export async function notifyOrderConfirmation(orderNumber: string) {
  await sendOrderConfirmationEmail(orderNumber).catch((error) => {
    console.error("[order-notifications] Email confirmation failed:", error);
  });
  await sendAdminOrderNotificationEmail(orderNumber, "received").catch((error) => {
    console.error("[order-notifications] Admin order notification failed:", error);
  });
  await sendOrderWhatsApp(orderNumber, "confirmation").catch((error) => {
    console.error("[order-notifications] WhatsApp confirmation failed:", error);
  });
}

export async function notifyPaymentFailure(orderNumber: string) {
  await sendPaymentFailureEmail(orderNumber).catch((error) => {
    console.error("[order-notifications] Email payment failure failed:", error);
  });
  await sendAdminOrderNotificationEmail(orderNumber, "payment_failed").catch((error) => {
    console.error("[order-notifications] Admin payment failure notification failed:", error);
  });
  await sendOrderWhatsApp(orderNumber, "payment_failed").catch((error) => {
    console.error("[order-notifications] WhatsApp payment failure failed:", error);
  });
}

export async function notifyOrderStatusUpdate(orderNumber: string, status: string) {
  await sendOrderStatusUpdateEmail(orderNumber, status).catch((error) => {
    console.error("[order-notifications] Email status update failed:", error);
  });
  await sendAdminOrderNotificationEmail(orderNumber, "status_update", status).catch((error) => {
    console.error("[order-notifications] Admin status update notification failed:", error);
  });
  await sendOrderWhatsApp(orderNumber, "status_update", status).catch((error) => {
    console.error("[order-notifications] WhatsApp status update failed:", error);
  });
}

async function loadOrder(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      status: true,
      paymentStatus: true,
      totalAmount: true,
      user: { select: { name: true, email: true } },
      shippingAddress: { select: { phone: true, recipient: true } },
    },
  });
}

function formatAmount(amount: string | number | { toNumber(): number }) {
  const value = typeof amount === "object" ? Number((amount).toNumber?.() ?? amount) : Number(amount);
  return `$${value.toFixed(2)}`;
}

function buildWhatsAppBody(
  order: Exclude<Awaited<ReturnType<typeof loadOrder>>, null>,
  type: "confirmation" | "payment_failed" | "status_update",
  status?: string,
) {
  const recipient = order.user?.name ?? order.shippingAddress?.recipient ?? "Customer";
  const orderLink = `${APP_URL}/orders/${order.orderNumber}`;

  switch (type) {
    case "confirmation":
      return `Hi ${recipient},\n\nYour order *#${order.orderNumber}* is confirmed!\nTotal: ${formatAmount(order.totalAmount)}\n\nYou can follow the order here: ${orderLink}\n\nNeed help? Reply or contact us at ${SUPPORT_EMAIL}.`;
    case "payment_failed":
      return `Hi ${recipient},\n\nWe could not process payment for order *#${order.orderNumber}*. The order has been cancelled and no charges were captured.\n\nPlease try again through checkout or contact support at ${SUPPORT_EMAIL}.`;
    case "status_update": {
      const statusMessage = status === "SHIPPED"
        ? "Your order has shipped and is on the way."
        : status === "DELIVERED"
        ? "Your order has been delivered successfully."
        : status === "CANCELLED"
        ? "Your order has been cancelled."
        : status === "RETURN_REQUESTED"
        ? "Your return request has been received and is under review."
        : status === "RETURNED"
        ? "Your return has been completed and refund processing has started."
        : `The status of your order is now ${status}.`;

      return `Hi ${recipient},\n\n${statusMessage}\n\nOrder #${order.orderNumber} is now ${status}.\nTrack details: ${orderLink}\n\nFor questions, contact support at ${SUPPORT_EMAIL}.`;
    }
    default:
      return `Hi ${recipient},\n\nThere is an update for your order #${order.orderNumber}.\nTrack it here: ${orderLink}\n\nContact support at ${SUPPORT_EMAIL}.`;
  }
}

async function sendOrderWhatsApp(orderNumber: string, type: "confirmation" | "payment_failed" | "status_update", status?: string) {
  const order = await loadOrder(orderNumber);
  if (!order || !order.shippingAddress?.phone) {
    console.warn("[order-notifications] Missing WhatsApp phone number for order", orderNumber);
    return false;
  }

  const body = buildWhatsAppBody(order, type, status);
  return sendWhatsAppMessage(order.shippingAddress.phone, body);
}
