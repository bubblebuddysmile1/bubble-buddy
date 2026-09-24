export type AnalyticsProductLike = {
  id: number | string;
  name: string;
  price?: number | string;
  quantity?: number;
  currency?: string;
  category?: string | null;
};

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  currency: string;
  price: number;
  quantity: number;
};

export function buildPurchaseDedupKey(orderId: string): string {
  return `purchase:${String(orderId ?? "").trim()}`;
}

export function shouldTrackPurchaseEvent(orderId: string, trackedKeys: string[] = []): boolean {
  const key = buildPurchaseDedupKey(orderId);
  return Boolean(key && !trackedKeys.includes(key));
}

function normalizeCurrency(currency?: string): string {
  return (currency ?? "INR").toUpperCase();
}

function unwrapPrice(value: number | string | undefined): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? "0"));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeAnalyticsItem(item: AnalyticsProductLike, quantityOverride?: number): AnalyticsItem {
  const quantity = Math.max(1, Number(quantityOverride ?? item.quantity ?? 1));
  const price = unwrapPrice(item.price);

  return {
    item_id: String(item.id),
    item_name: item.name,
    item_category: item.category ?? undefined,
    currency: normalizeCurrency(item.currency),
    price,
    quantity,
  };
}

function readTrackedPurchaseKeys(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.sessionStorage.getItem("bubble-buddy-analytics-purchases");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === "string") : [];
  } catch {
    return [];
  }
}

function writeTrackedPurchaseKeys(keys: string[]): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem("bubble-buddy-analytics-purchases", JSON.stringify(keys));
  } catch {
    // Ignore storage quota or privacy errors silently.
  }
}

export function pushAnalyticsEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  const payload = { event: eventName, ...params };

  if (Array.isArray((window as Window & { dataLayer?: unknown[] }).dataLayer)) {
    (window as Window & { dataLayer?: unknown[] }).dataLayer?.push(payload);
  }

  if (typeof (window as Window & { gtag?: (...args: unknown[]) => void }).gtag === "function") {
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.("event", eventName, params);
  }
}

export function trackViewItem(product: AnalyticsProductLike): void {
  const item = normalizeAnalyticsItem(product);
  pushAnalyticsEvent("view_item", {
    currency: item.currency,
    value: Number((item.price * item.quantity).toFixed(2)),
    items: [item],
  });
}

export function trackAddToCart(product: AnalyticsProductLike, quantity = 1): void {
  const item = normalizeAnalyticsItem(product, quantity);
  pushAnalyticsEvent("add_to_cart", {
    currency: item.currency,
    value: Number((item.price * item.quantity).toFixed(2)),
    items: [item],
  });
}

export function trackBeginCheckout(items: AnalyticsProductLike[], currency?: string, valueOverride?: number): void {
  const normalized = items.map((item) => normalizeAnalyticsItem(item));
  const currencyValue = normalizeCurrency(currency ?? normalized[0]?.currency ?? "INR");
  const value = typeof valueOverride === "number"
    ? valueOverride
    : normalized.reduce((sum, item) => sum + item.price * item.quantity, 0);

  pushAnalyticsEvent("begin_checkout", {
    currency: currencyValue,
    value: Number(value.toFixed(2)),
    items: normalized.map((item) => ({ ...item, currency: currencyValue })),
  });
}

export function buildPurchaseEventPayload({
  orderId,
  transactionId,
  currency,
  value,
  items = [],
}: {
  orderId: string;
  transactionId?: string;
  currency: string;
  value: number;
  items?: AnalyticsProductLike[];
}) {
  const normalizedCurrency = normalizeCurrency(currency);
  const normalizedItems = items.map((item) => normalizeAnalyticsItem(item));

  return {
    transaction_id: transactionId || orderId,
    order_id: orderId,
    currency: normalizedCurrency,
    value: Number(value.toFixed(2)),
    items:
      normalizedItems.length > 0
        ? normalizedItems
        : [
            {
              item_id: "order",
              item_name: "Order",
              currency: normalizedCurrency,
              price: Number(value.toFixed(2)),
              quantity: 1,
            },
          ],
  };
}

export function trackPurchase(
  orderId: string,
  currency: string,
  value: number,
  items: AnalyticsProductLike[] = [],
  transactionId?: string,
): boolean {
  if (!orderId) return false;

  const dedupKey = buildPurchaseDedupKey(orderId);
  const trackedKeys = readTrackedPurchaseKeys();
  if (!shouldTrackPurchaseEvent(orderId, trackedKeys)) {
    return false;
  }

  const payload = buildPurchaseEventPayload({
    orderId,
    transactionId,
    currency,
    value,
    items,
  });

  pushAnalyticsEvent("purchase", payload);

  writeTrackedPurchaseKeys([...trackedKeys, dedupKey]);
  return true;
}

export function trackPaymentFailure(orderId: string | null, reason: string, currency?: string, value?: number, items: AnalyticsProductLike[] = []): void {
  const normalizedOrderId = orderId ?? "unknown";
  const normalizedItems = items.map((item) => normalizeAnalyticsItem(item));
  pushAnalyticsEvent("payment_failed", {
    order_id: normalizedOrderId,
    payment_failure_reason: reason,
    currency: normalizeCurrency(currency ?? normalizedItems[0]?.currency ?? "INR"),
    value: Number((typeof value === "number" ? value : normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)).toFixed(2)),
    items: normalizedItems,
  });
}
