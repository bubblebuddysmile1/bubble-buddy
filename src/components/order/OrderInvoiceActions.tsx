"use client";

import { useMemo, useState } from "react";
import { Download, Printer } from "lucide-react";
import { jsPDF } from "jspdf";

type OrderInvoiceActionsProps = {
  orderNumber: string;
  placedAt?: string | null;
  status: string;
  paymentStatus: string;
  paymentMethod?: string | null;
  totalAmount: number | string;
  shippingAmount: number | string;
  taxAmount: number | string;
  discountAmount: number | string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number | string;
    totalPrice: number | string;
  }>;
};

const formatCurrency = (value: number | string) => {
  const amount = typeof value === "string" ? Number(value) : value;
  return `$${amount.toFixed(2)}`;
};

const toNumber = (value: number | string) => (typeof value === "string" ? Number(value) : value);

function buildInvoicePdf(order: OrderInvoiceActionsProps) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  const maxWidth = 520;
  const lineHeight = 18;
  let cursor = 60;

  doc.setFontSize(20);
  doc.text("Bubble Buddy Smile", margin, cursor);

  cursor += 30;
  doc.setFontSize(10);
  doc.text(
    [
      "Tricity Plaza, 316,",
      "Peer Muchalla Rd, Sector 20, Zirakpur ",
      "Sanauli, Punjab 140603",
      "GSTIN: 07AAAAAAAAA1Z5",
      "support@buddybubble.com",
    ],
    margin,
    cursor,
    { maxWidth },
  );

  cursor += 65;
  doc.setFontSize(14);
  doc.text("Invoice", margin, cursor);

  cursor += 25;
  doc.setFontSize(10);
  doc.text(
    [`Invoice #: ${order.orderNumber}`, `Date: ${order.placedAt ? new Date(order.placedAt).toLocaleDateString("en-US") : "N/A"}`],
    margin,
    cursor,
  );
  doc.text([`Order status: ${order.status}`, `Payment status: ${order.paymentStatus}`], 320, cursor);

  cursor += 30;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(margin, cursor, margin + maxWidth, cursor);

  cursor += 20;
  doc.setFontSize(12);
  doc.text("Item", margin, cursor);
  doc.text("Qty", margin + 260, cursor);
  doc.text("Unit price", margin + 340, cursor);
  doc.text("Total", margin + 460, cursor);

  cursor += 10;
  doc.line(margin, cursor, margin + maxWidth, cursor);

  order.items.forEach((item, index) => {
    cursor += lineHeight;
    if (cursor > 760) {
      doc.addPage();
      cursor = margin;
    }

    doc.setFontSize(10);
    doc.text(item.name, margin, cursor, { maxWidth: 240 });
    doc.text(String(item.quantity), margin + 260, cursor);
    doc.text(formatCurrency(item.unitPrice), margin + 340, cursor);
    doc.text(formatCurrency(item.totalPrice), margin + 460, cursor);
  });

  cursor += 20;
  doc.setLineWidth(0.5);
  doc.line(margin, cursor, margin + maxWidth, cursor);

  const subtotal = order.items.reduce((sum, item) => sum + toNumber(item.totalPrice), 0);
  const discount = toNumber(order.discountAmount);
  const shipping = toNumber(order.shippingAmount);
  const tax = toNumber(order.taxAmount);
  const total = toNumber(order.totalAmount);

  cursor += 25;
  doc.setFontSize(12);
  doc.text("Subtotal", margin + 350, cursor);
  doc.text(formatCurrency(subtotal), margin + 460, cursor);

  cursor += lineHeight;
  doc.text("Discount", margin + 350, cursor);
  doc.text(formatCurrency(discount), margin + 460, cursor);

  cursor += lineHeight;
  doc.text("Shipping", margin + 350, cursor);
  doc.text(formatCurrency(shipping), margin + 460, cursor);

  cursor += lineHeight;
  doc.text("Tax", margin + 350, cursor);
  doc.text(formatCurrency(tax), margin + 460, cursor);

  cursor += lineHeight;
  doc.setFontSize(14);
  doc.text("Total", margin + 350, cursor);
  doc.text(formatCurrency(total), margin + 460, cursor);

  cursor += 40;
  doc.setFontSize(9);
  doc.text("This invoice is generated for your recent purchase at Bubble Buddy Smile.", margin, cursor, {
    maxWidth,
  });

  return doc;
}

export default function OrderInvoiceActions({
  orderNumber,
  placedAt,
  status,
  paymentStatus,
  paymentMethod,
  totalAmount,
  shippingAmount,
  taxAmount,
  discountAmount,
  items,
}: OrderInvoiceActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const orderData = useMemo(
    () => ({ orderNumber, placedAt, status, paymentStatus, paymentMethod, totalAmount, shippingAmount, taxAmount, discountAmount, items }),
    [orderNumber, placedAt, status, paymentStatus, paymentMethod, totalAmount, shippingAmount, taxAmount, discountAmount, items],
  );

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      const doc = buildInvoicePdf(orderData);
      doc.save(`invoice-${orderNumber}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = async () => {
    setIsGenerating(true);
    try {
      const doc = buildInvoicePdf(orderData);
      doc.autoPrint();
      if (typeof window !== "undefined") {
        const url = doc.output("bloburl");
        const printWindow = window.open(url, "_blank");
        printWindow?.focus();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleDownloadPdf}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Download className="size-4" />
        {isGenerating ? "Generating PDF..." : "Download invoice"}
      </button>
      <button
        type="button"
        onClick={handlePrint}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Printer className="size-4" />
        {isGenerating ? "Preparing print..." : "Print invoice"}
      </button>
    </div>
  );
}
