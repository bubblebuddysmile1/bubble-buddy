import { prisma } from "@/lib/prisma";
import type { ActivityType } from "@prisma/client";

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
