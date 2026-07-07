import AdminHeader from "@/components/admin/AdminHeader";
import { requireAdminSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export default async function AdminContactMessagesPage() {
  await requireAdminSession("/admin/contact-messages");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminHeader
        title="Contact Messages"
        description="Review customer inquiries and support requests submitted from the contact page."
      />

      <div className="p-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-muted/40 px-4 py-3">
            <p className="text-sm font-semibold text-foreground">
              {messages.length} message{messages.length === 1 ? "" : "s"} received
            </p>
          </div>

          {messages.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No contact messages have been submitted yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {messages.map((message) => (
                <article key={message.id} className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold text-foreground">{message.name}</h2>
                        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {message.subject}
                        </span>
                        {message.isPriority && (
                          <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-700">
                            Priority
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{message.email}</p>
                      {message.phone && <p className="text-sm text-muted-foreground">{message.phone}</p>}
                      <p className="whitespace-pre-wrap text-sm text-foreground">{message.message}</p>
                    </div>

                    <div className="text-sm text-muted-foreground sm:text-right">
                      <p>{new Date(message.createdAt).toLocaleString()}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em]">{message.status}</p>
                      {message.orderNumber && <p className="mt-1">Order: {message.orderNumber}</p>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
