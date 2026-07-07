import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const phone = String(body?.phone ?? "").trim();
    const subject = String(body?.subject ?? "").trim();
    const message = String(body?.message ?? "").trim();
    const orderNumber = String(body?.orderNumber ?? "").trim();
    const isPriority = Boolean(body?.isPriority);

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
    }

    const payload = {
      name,
      email,
      phone: phone || null,
      subject,
      message,
      orderNumber: orderNumber || null,
      isPriority,
    };

    const contactMessageDelegate = (prisma as typeof prisma & {
      contactMessage?: {
        create: (args: { data: typeof payload }) => Promise<{ id: number }>;
      };
    }).contactMessage;

    let createdMessageId: number | null = null;

    try {
      if (contactMessageDelegate?.create) {
        const contactMessage = await contactMessageDelegate.create({ data: payload });
        createdMessageId = contactMessage.id;
      } else {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "ContactMessage" ("name", "email", "phone", "subject", "message", "orderNumber", "isPriority", "status", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, 'NEW', NOW(), NOW())`,
          payload.name,
          payload.email,
          payload.phone || null,
          payload.subject,
          payload.message,
          payload.orderNumber || null,
          payload.isPriority,
        );
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const isMissingTableError = message.includes("does not exist") || message.includes("TableDoesNotExist") || message.includes("P2021");

      if (!isMissingTableError) {
        throw error;
      }

      await prisma.$executeRawUnsafe(
        `INSERT INTO "ContactMessage" ("name", "email", "phone", "subject", "message", "orderNumber", "isPriority", "status", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, 'NEW', NOW(), NOW())`,
        payload.name,
        payload.email,
        payload.phone || null,
        payload.subject,
        payload.message,
        payload.orderNumber || null,
        payload.isPriority,
      );
    }

    return NextResponse.json({
      message: "Thanks! Your message has been saved and the admin team will review it shortly.",
      id: createdMessageId,
    });
  } catch (error) {
    console.error("[api/contact]", error);
    return NextResponse.json({ error: "Unable to save your message right now." }, { status: 500 });
  }
}
