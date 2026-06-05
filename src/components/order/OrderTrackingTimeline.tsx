import { OrderStatus } from "@prisma/client";

type TrackingEvent = {
  id: number;
  status: OrderStatus;
  description?: string | null;
  createdAt: string;
};

type OrderTrackingTimelineProps = {
  events: TrackingEvent[];
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Order placed",
  CONFIRMED: "Payment confirmed",
  PROCESSING: "Order processing",
  SHIPPED: "Order shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Order cancelled",
  RETURNED: "Order returned",
};

export default function OrderTrackingTimeline({ events }: OrderTrackingTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-border bg-background/80 p-6 text-sm text-muted-foreground">
        <p>No tracking updates are available for this order yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4 rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="text-sm font-semibold">{index + 1}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-[0.28em] text-primary">{statusLabels[event.status]}</p>
            <p className="mt-2 text-sm font-semibold text-foreground">{event.status}</p>
            <p className="mt-2 text-sm text-muted-foreground">{event.description ?? "Status updated."}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {new Date(event.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
