import AdminHeader from "@/components/admin/AdminHeader";
import ActivityLogTime from "@/components/admin/ActivityLogTime";
import { prisma } from "@/lib/prisma";
import { isLoopbackIp } from "@/lib/activity-log";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { ActivityLog } from "@prisma/client";

const PAGE_SIZE = 20;

function formatEventType(eventType: ActivityLog["eventType"]) {
  switch (eventType) {
    case "LOGIN":
      return "Login";
    case "LOGOUT":
      return "Logout";
    case "FAILED_LOGIN":
      return "Failed login";
    case "ADMIN_ACTION":
      return "Admin action";
    case "SECURITY_ALERT":
      return "Security alert";
    case "AUDIT_TRAIL":
      return "Audit trail";
    default:
      return eventType;
  }
}

export default async function AdminActivityLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const requestedPage = Number(rawPage);
  const parsedPage =
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const totalLogs = await prisma.activityLog.count();
  const totalPages = Math.max(1, Math.ceil(totalLogs / PAGE_SIZE));
  const currentPage = Math.min(parsedPage, totalPages);
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  });
  const firstLog = totalLogs === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastLog = Math.min(currentPage * PAGE_SIZE, totalLogs);

  return (
    <>
      <AdminHeader
        title="Activity Logs"
        description="Review login history, administrative actions, and security events for audit and monitoring."
      />

      <div className="space-y-6 p-6">
        <section className="rounded-4xl border border-border bg-card p-6 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Admin Activity Logs</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Recent authentication events and administrative actions are displayed here.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Localhost or unavailable means the server did not receive the client IP, which can happen during local testing without a forwarding proxy.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-3xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
              <ShieldCheck className="size-5" /> Security monitoring
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {firstLog}-{lastLog} of {totalLogs} activity logs
            </p>
            <nav aria-label="Activity log pagination" className="flex items-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={`/admin/activity-logs?page=${currentPage - 1}`}
                  className="rounded-xl border border-border px-3 py-2 text-foreground hover:bg-muted"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-xl border border-border px-3 py-2 opacity-50">
                  Previous
                </span>
              )}
              <span className="px-2">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link
                  href={`/admin/activity-logs?page=${currentPage + 1}`}
                  className="rounded-xl border border-border px-3 py-2 text-foreground hover:bg-muted"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-xl border border-border px-3 py-2 opacity-50">
                  Next
                </span>
              )}
            </nav>
          </div>

          <div className="mt-6 overflow-x-auto rounded-3xl border border-border bg-background">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-border hover:bg-muted/40">
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      <ActivityLogTime value={log.createdAt.toISOString()} />
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{formatEventType(log.eventType)}</td>
                    <td className="px-4 py-3 text-foreground">
                      {log.user ? `${log.user.name ?? log.user.email}` : "Guest"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {log.ip
                        ? isLoopbackIp(log.ip)
                          ? "Localhost (client IP unavailable)"
                          : log.ip
                        : "Unavailable"}
                    </td>
                    <td className="px-4 py-3 text-foreground">{log.action}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground wrap-break-word max-w-[24rem]">
                      {log.description ?? log.metadata ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
