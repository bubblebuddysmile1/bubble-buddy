import AdminHeader from "@/components/admin/AdminHeader";
import { requireAdminSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export default async function AdminNewsletterSubscriptionsPage() {
  await requireAdminSession("/admin/newsletter-subscriptions");

  const subscriptions = await prisma.newsletterSubscription.findMany({
    orderBy: { subscribedAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <div>
      <AdminHeader
        title="Newsletter Subscribers"
        description="View all users and emails subscribed to the newsletter."
      />

      <div className="p-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-muted/40 px-4 py-3">
            <p className="text-sm font-semibold text-foreground">
              {subscriptions.length} subscriber{subscriptions.length === 1 ? "" : "s"}
            </p>
          </div>

          {subscriptions.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No newsletter subscribers yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {subscriptions.map((subscription) => (
                <article key={subscription.id} className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold text-foreground">{subscription.email}</h2>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            subscription.isConfirmed
                              ? "bg-emerald-500/15 text-emerald-700"
                              : "bg-amber-500/15 text-amber-700"
                          }`}
                        >
                          {subscription.isConfirmed ? "Confirmed" : "Pending"}
                        </span>
                      </div>

                      {subscription.user ? (
                        <p className="text-sm text-muted-foreground">
                          Linked account: {subscription.user.name || subscription.user.email || "Unknown user"}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">No linked account</p>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground sm:text-right">
                      <p>Subscribed: {new Date(subscription.subscribedAt).toLocaleString()}</p>
                      {subscription.unsubscribedAt ? (
                        <p className="mt-1 text-xs uppercase tracking-[0.18em]">
                          Unsubscribed: {new Date(subscription.unsubscribedAt).toLocaleString()}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs uppercase tracking-[0.18em]">Active</p>
                      )}
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
