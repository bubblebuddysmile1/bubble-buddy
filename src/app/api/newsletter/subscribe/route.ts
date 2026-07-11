import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCustomerAndAdminEmail } from "@/lib/email";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Please enter your email address." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      if (existingSubscription.unsubscribedAt) {
        await prisma.newsletterSubscription.update({
          where: { id: existingSubscription.id },
          data: {
            isConfirmed: true,
            unsubscribedAt: null,
            subscribedAt: new Date(),
          },
        });
      }

      return NextResponse.json({
        message: existingSubscription.unsubscribedAt
          ? "Welcome back! Your newsletter subscription has been restored."
          : "You are already subscribed to our newsletter.",
      });
    }

    const createData: { email: string; isConfirmed: boolean; userId?: number } = {
      email,
      isConfirmed: true,
    };

    if (existingUser?.id) {
      createData.userId = existingUser.id;
    }

    await prisma.newsletterSubscription.create({ data: createData });

    const emailSent = await sendCustomerAndAdminEmail({
      customerEmail: email,
      subject: "Welcome to Bubble Buddy newsletter",
      text: `Thanks for subscribing to Bubble Buddy newsletter. Subscriber email: ${email}. We will send you beauty tips, offers, and updates straight to your inbox.`,
      html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
        <h2>Welcome to Bubble Buddy newsletter</h2>
        <p>Thanks for subscribing! We will share beauty tips, offers, and updates with you soon.</p>
        <p><strong>Subscriber email:</strong> ${email}</p>
        <p>Bubble Buddy Team</p>
      </body></html>`,
    });

    if (!emailSent) {
      console.warn("[api/newsletter/subscribe] Newsletter confirmation email could not be sent.");
    }

    return NextResponse.json({ message: "Thanks for subscribing to our newsletter!" });
  } catch (error) {
    console.error("[api/newsletter/subscribe]", error);
    return NextResponse.json(
      { error: "Unable to subscribe right now. Please try again later." },
      { status: 500 },
    );
  }
}
