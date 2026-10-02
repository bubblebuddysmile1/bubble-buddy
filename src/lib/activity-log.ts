import { prisma } from "@/lib/prisma";
import type { ActivityType } from "@prisma/client";
import { isIP } from "node:net";

function parseIpAddress(value: string): string | undefined {
  let ip = value.trim();

  if (ip.startsWith("[")) {
    const bracketedAddress = ip.match(/^\[([^\]]+)\](?::\d+)?$/);
    if (!bracketedAddress) return undefined;
    ip = bracketedAddress[1];
  } else if (!ip.includes("::")) {
    const ipv4WithPort = ip.match(/^(.+):\d+$/);
    if (ipv4WithPort && isIP(ipv4WithPort[1]) === 4) {
      ip = ipv4WithPort[1];
    }
  }

  return isIP(ip) ? ip : undefined;
}

export function isLoopbackIp(ip: string) {
  const normalizedIp = ip.toLowerCase();
  const ipv4MappedAddress = normalizedIp.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
  const ipv4Address = ipv4MappedAddress?.[1] ?? normalizedIp;

  if (isIP(ipv4Address) === 4) {
    return Number(ipv4Address.split(".")[0]) === 127;
  }

  return (
    normalizedIp === "::1" ||
    /^(?:0{1,4}:){7}0{0,3}1$/.test(normalizedIp)
  );
}

export function getActivityRequestDetails(request: { headers: Headers }) {
  const headers = request.headers;
  const ipHeaders = [
    headers.get("cf-connecting-ip"),
    headers.get("x-vercel-forwarded-for"),
    headers.get("x-forwarded-for"),
    headers.get("x-real-ip"),
  ];
  const ip = ipHeaders
    .flatMap((value) => value?.split(",") ?? [])
    .map(parseIpAddress)
    .find((value): value is string => value !== undefined && !isLoopbackIp(value));

  return {
    ip,
    userAgent: headers.get("user-agent") ?? undefined,
  };
}

export async function logActivity(options: {
  userId?: number;
  eventType: ActivityType;
  action: string;
  description?: string;
  ip?: string;
  userAgent?: string;
  metadata?: string;
}) {
  return prisma.activityLog.create({
    data: {
      userId: options.userId,
      eventType: options.eventType,
      action: options.action,
      description: options.description,
      ip: options.ip,
      userAgent: options.userAgent,
      metadata: options.metadata,
      createdAt: new Date(),
    },
  });
}

export async function getRecentActivityLogs(limit = 30) {
  return prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function getActivityStats(periodMs = 30 * 24 * 60 * 60 * 1000) {
  const since = new Date(Date.now() - periodMs);

  return {
    loginCount: await prisma.activityLog.count({
      where: { eventType: "LOGIN", createdAt: { gte: since } },
    }),
    failedLoginCount: await prisma.activityLog.count({
      where: { eventType: "FAILED_LOGIN", createdAt: { gte: since } },
    }),
    adminActionCount: await prisma.activityLog.count({
      where: { eventType: "ADMIN_ACTION", createdAt: { gte: since } },
    }),
    securityAlertCount: await prisma.activityLog.count({
      where: { eventType: "SECURITY_ALERT", createdAt: { gte: since } },
    }),
  };
}
