export const metadata = {
  title: "Shipping Policy - Bubble Buddy",
  description: "Shipping policy for Bubble Buddy Smile orders",
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden border-b border-border bg-card/50 backdrop-blur-lg">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Shipping Policy
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Last updated: July 7, 2026
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">1. Processing Time</h2>
            <p className="text-muted-foreground">
              Orders are processed within 1–2 business days after payment confirmation. You will receive a tracking link once your order has shipped.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">2. Delivery Timeline</h2>
            <p className="text-muted-foreground">
              Delivery times depend on your location and chosen shipping method. Standard delivery typically takes 4–7 business days, while express delivery may take 1–3 business days.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">3. Shipping Charges</h2>
            <p className="text-muted-foreground">
              Shipping charges are calculated at checkout based on your order value and delivery address. Free shipping may be available for eligible orders.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">4. Delivery Issues</h2>
            <p className="text-muted-foreground">
              If your package is delayed, lost, or delivered incorrectly, please contact us immediately so we can assist you with the next steps.
            </p>
          </section>

          <section className="space-y-4 rounded-[2rem] border border-border bg-card/50 p-8 backdrop-blur-lg">
            <h2 className="text-3xl font-bold">5. Contact Us</h2>
            <p className="text-muted-foreground">
              For shipping inquiries, email us at bubblebuddysmile.team@gmail.com or call +91 98888 88727.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
