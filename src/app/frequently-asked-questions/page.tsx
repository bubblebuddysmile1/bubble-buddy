export const metadata = {
  title: "Bubble Buddy Smile FAQ | Oral Care Products Questions & Answers",
  description:
    "Find answers to frequently asked questions about Bubble Buddy Smile. Learn about our oral care products, shipping, returns, payments, and customer support.",
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header with Advanced Gradient & Animation */}
      <div className="relative overflow-hidden border-b border-border bg-card/50 backdrop-blur-lg">
        {/* Animated Background Elements */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 animate-pulse rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/5 blur-3xl" />

        {/* Floating Badge */}
        <div className="absolute left-1/2 top-4 -translate-x-1/2">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            We are here to help
          </span>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="space-y-6 text-center">
            <h1 className="text-5xl font-bold leading-tight sm:text-7xl">
              <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Frequently Asked Questions
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Everything you need to know about Bubble Buddy Smile. Cant find
              what you are looking for?{" "}
              <a
                href="/contact"
                className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 transition-all hover:gap-2 hover:underline"
              >
                Contact us
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </p>

            {/* Search Bar */}
            <div className="mx-auto max-w-xl pt-4">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search for answers..."
                  className="w-full rounded-full border border-border bg-card/80 px-12 py-3.5 text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <kbd className="absolute right-4 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-16">
          {/* Quick Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-border pb-8">
            {[
              "General",
              "Products",
              "Shipping",
              "Returns",
              "Payments",
              "Account",
              "Legal",
            ].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="rounded-full border border-border bg-card/50 px-4 py-2 text-sm text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                {item}
              </a>
            ))}
          </div>

          {/* General Questions */}
          <section id="general" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">General Questions</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "What is Bubble Buddy Smile?",
                  a: "Bubble Buddy Smile is a premium provider of high-quality oral care products. We specialize in innovative solutions that make maintaining your smile easy, effective, and enjoyable. Our products are designed with the latest dental technology to ensure optimal oral health.",
                },
                {
                  q: "Are your products safe?",
                  a: "Absolutely. All our products are rigorously tested for safety and efficacy. They are made from high-quality, non-toxic materials and are free from harmful chemicals. We adhere to all international safety standards to ensure you get the best care possible.",
                },
                {
                  q: "Where are your products manufactured?",
                  a: "Our products are manufactured in state-of-the-art facilities that follow strict quality control and hygiene protocols. We partner with leading manufacturers to maintain the highest standards of production and quality assurance.",
                },
              ].map((item, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-border bg-card/30 transition-all hover:border-primary/20 hover:bg-card/50"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-medium">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      {item.q}
                    </span>
                    <svg
                      className="h-5 w-5 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-muted-foreground">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Products & Usage */}
          <section id="products" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-accent/10 p-3">
                <svg
                  className="h-6 w-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Products & Usage</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Which product is right for me?",
                  a: "We offer a range of products tailored to different needs. If you're looking for everyday cleaning, our standard bundle is perfect. For sensitive teeth, we recommend our gentle care line. Please visit our shop page for detailed descriptions of each product, or contact our support team for personalized advice.",
                },
                {
                  q: "How do I use the Bubble Buddy Smile kit?",
                  a: "Each kit comes with a detailed user manual. Generally, we recommend using the product twice daily for best results. Please follow the instructions provided in the package. If you have any concerns, consult your dentist before use.",
                },
                {
                  q: "How long does a product last?",
                  a: "The lifespan of our products depends on usage frequency. On average, our refill kits last up to one month with regular use. We recommend checking the packaging for specific information about your product's longevity.",
                },
              ].map((item, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-border bg-card/30 transition-all hover:border-accent/20 hover:bg-card/50"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-medium">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                        {index + 1}
                      </span>
                      {item.q}
                    </span>
                    <svg
                      className="h-5 w-5 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-muted-foreground">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Orders & Shipping */}
          <section id="shipping" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-secondary/10 p-3">
                <svg
                  className="h-6 w-6 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Orders & Shipping</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "What are your shipping options?",
                  a: "We offer standard and express shipping options. Standard shipping typically takes 3-5 business days, while express shipping can deliver within 1-2 business days. Shipping costs and times are calculated at checkout based on your location.",
                },
                {
                  q: "Do you ship internationally?",
                  a: "Currently, we ship within India. We are working on expanding our shipping capabilities to serve our customers globally. Please check our shipping policy for the most up-to-date information on international delivery.",
                },
                {
                  q: "How can I track my order?",
                  a: "Once your order is shipped, you will receive a confirmation email with a tracking number. You can use this number to track your package's journey on our carrier's website. If you have any issues, our support team is here to help.",
                },
                {
                  q: "Can I change or cancel my order?",
                  a: "You can change or cancel your order within 12 hours of placing it. To do so, please contact our support team immediately with your order details. Once the order has been processed, we may not be able to make changes.",
                },
              ].map((item, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-border bg-card/30 transition-all hover:border-secondary/20 hover:bg-card/50"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-medium">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-sm font-bold text-secondary">
                        {index + 1}
                      </span>
                      {item.q}
                    </span>
                    <svg
                      className="h-5 w-5 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-muted-foreground">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Returns & Refunds */}
          <section id="returns" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-destructive/10 p-3">
                <svg
                  className="h-6 w-6 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Returns & Refunds</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "What is your return policy?",
                  a: "We want you to be completely satisfied with your purchase. If you're not happy, you can initiate a return within 7 days of delivery. Products must be unused and in their original packaging. Please review our full returns policy for more details.",
                },
                {
                  q: "How do I return a product?",
                  a: "To start a return, please contact our support team with your order number and reason for return. We will guide you through the process. You will be responsible for return shipping costs unless the product is defective or we made an error.",
                },
                {
                  q: "How soon will I receive my refund?",
                  a: "Once we receive and inspect your returned item, we will process your refund. This can take 5-7 business days. The refund will be credited to your original payment method. We will notify you via email once the refund is processed.",
                },
              ].map((item, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-border bg-card/30 transition-all hover:border-destructive/20 hover:bg-card/50"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-medium">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-sm font-bold text-destructive">
                        {index + 1}
                      </span>
                      {item.q}
                    </span>
                    <svg
                      className="h-5 w-5 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-muted-foreground">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Payments & Discounts */}
          <section id="payments" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-green-500/10 p-3">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 1v1m-6-1h12M5 12h14M5 12h14"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Payments & Discounts</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit and debit cards, including Visa, Mastercard, and RuPay. We also accept payments via UPI, net banking, and popular digital wallets. All transactions are secured and encrypted for your safety.",
                },
                {
                  q: "Is my payment information secure?",
                  a: "Yes, we take security very seriously. Our payment gateway uses industry-standard encryption to protect your information. We do not store your credit card details on our servers, ensuring your data remains confidential and secure.",
                },
                {
                  q: "Do you offer discounts or promotions?",
                  a: "Yes, we frequently run promotions and offer discounts for our subscribers. Please sign up for our newsletter or follow us on social media to stay updated on the latest deals and special offers.",
                },
              ].map((item, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-border bg-card/30 transition-all hover:border-green-500/20 hover:bg-card/50"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-medium">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-sm font-bold text-green-500">
                        {index + 1}
                      </span>
                      {item.q}
                    </span>
                    <svg
                      className="h-5 w-5 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-muted-foreground">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Account & Support */}
          <section id="account" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-purple-500/10 p-3">
                <svg
                  className="h-6 w-6 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Account & Support</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How do I create an account?",
                  a: "You can create an account by clicking on the 'Login/Sign Up' button at the top of our website. Fill in the required details and set up your password. You'll be ready to shop and manage your orders in no time.",
                },
                {
                  q: "I forgot my password. What do I do?",
                  a: "No worries! Just click on the 'Forgot Password' link on the login page. You will receive an email with instructions to reset your password. If you don't see the email, please check your spam folder.",
                },
                {
                  q: "How can I contact customer support?",
                  a: "We're here for you! You can reach us via email at support@buddybubble.com or call us at +91 98888 88727. Our support hours are from 9 AM to 9 PM, Monday to Saturday. We'll get back to you as soon as possible.",
                },
              ].map((item, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-border bg-card/30 transition-all hover:border-purple-500/20 hover:bg-card/50"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-medium">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-sm font-bold text-purple-500">
                        {index + 1}
                      </span>
                      {item.q}
                    </span>
                    <svg
                      className="h-5 w-5 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-muted-foreground">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Legal & Other */}
          <section
            id="legal"
            className="space-y-6 scroll-mt-24 rounded-[2rem] border border-border bg-card/30 p-8 backdrop-blur-lg"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-500/10 p-3">
                <svg
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Legal & Other</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How is my data protected?",
                  a: "We value your privacy. Our privacy policy outlines how we collect, use, and protect your personal information. We use advanced security measures to keep your data safe and never share your information with third parties without your consent.",
                },
                {
                  q: "Do you have a loyalty program?",
                  a: "Yes, we value our loyal customers! Stay tuned for updates on our loyalty program, which will offer exclusive discounts, early access to new products, and special perks. Follow us on social media for announcements.",
                },
                {
                  q: "Can I become a wholesaler or partner?",
                  a: "We are always open to new partnerships. If you are interested in becoming a wholesaler or a business partner, please contact us at partners@buddybubble.com with your business details and requirements. Our team will get in touch with you.",
                },
              ].map((item, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-border bg-card/30 transition-all hover:border-blue-500/20 hover:bg-card/50"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-medium">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-500">
                        {index + 1}
                      </span>
                      {item.q}
                    </span>
                    <svg
                      className="h-5 w-5 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-muted-foreground">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>

            {/* Contact Card */}
            <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-8">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg
                    className="h-8 w-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Still have questions?</h3>
                  <p className="text-muted-foreground">
                    We are happy to help. Contact our support team and we ll get
                    back to you within 24 hours.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                    <a
                      href="mailto:support@buddybubble.com"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Email Us
                    </a>
                    <a
                      href="tel:+919888888727"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-6 py-2.5 text-sm font-medium transition-all hover:border-primary hover:bg-primary/10"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted-foreground">
                <p>
                  <strong>Bubble Buddy Smile</strong>
                </p>
                <p>
                  Tricity Plaza, 316, Peer Muchalla Rd, Sector 20, Zirakpur,
                  Sanauli, Punjab 140603
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}