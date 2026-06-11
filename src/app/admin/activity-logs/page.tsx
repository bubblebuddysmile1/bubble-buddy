import AdminHeader from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { Activity, Clock, ShieldCheck } from "lucide-react";
import type { ActivityLog } from "@prisma/client";

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

export default async function AdminActivityLogsPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  });

  return (
    <>
      <AdminHeader
        title="Activity Logs"
        description="Review login history, administrative actions, and security events for audit and monitoring."
      />

      <div className="space-y-6 p-6">
        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Admin Activity Logs</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Recent authentication events and administrative actions are displayed here.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-3xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
              <ShieldCheck className="size-5" /> Security monitoring
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-border bg-background">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-border hover:bg-muted/40">
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{formatEventType(log.eventType)}</td>
                    <td className="px-4 py-3 text-foreground">
                      {log.user ? `${log.user.name ?? log.user.email}` : "Guest"}
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
