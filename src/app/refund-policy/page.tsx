export const metadata = {
  title: "Refund Policy - Bubble Buddy",
  description: "Refund policy for Bubble Buddy Smile orders",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden border-b border-border bg-card/50 backdrop-blur-lg">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Refund Policy
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
            <h2 className="text-3xl font-bold">1. Eligibility for Refunds</h2>
            <p className="text-muted-foreground">
              Refunds are available for orders that are damaged, defective, incorrect, or not delivered as described. Customers must report such issues within 48 hours of delivery.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">2. Non-Refundable Items</h2>
            <ul className="ml-4 space-y-2 text-muted-foreground">
              <li>• Opened or used cosmetic products unless defective</li>
              <li>• Products damaged due to misuse or mishandling</li>
              <li>• Custom or personalized items</li>
              <li>• Items purchased during final-sale promotions</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">3. Refund Process</h2>
            <p className="text-muted-foreground">
              Once your refund request is approved, the amount will be credited back to your original payment method within 5–7 business days. In some cases, it may take longer depending on your payment provider.
            </p>
          </section>

          <section className="space-y-4 rounded-[2rem] border border-border bg-card/50 p-8 backdrop-blur-lg">
            <h2 className="text-3xl font-bold">4. Contact Us</h2>
            <p className="text-muted-foreground">
              For refund-related questions, email us at bubblebuddysmile.team@gmail.com or call +91 98888 88727.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
