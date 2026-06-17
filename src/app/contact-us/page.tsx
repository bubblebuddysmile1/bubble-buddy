export const metadata = {
  title: "Contact Us - Bubble Buddy Smile | Get in Touch",
  description:
    "Contact Bubble Buddy Smile for any queries about our oral care products. Reach us via email, phone, or visit our store. We're here to help you with your smile journey.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header with Advanced Gradient & Animation */}
      <div className="relative overflow-hidden border-b border-border bg-card/50 backdrop-blur-lg">
        {/* Animated Background Elements */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 animate-pulse rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/5 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="space-y-6 text-center">
            <h1 className="text-5xl font-bold leading-tight sm:text-7xl">
              <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Contact Us
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Have questions or need assistance? We are here to help you smile
              brighter. Reach out to us through any of the channels below.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Contact Information */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <h2 className="text-2xl font-bold">Get in Touch</h2>
              <p className="text-muted-foreground">
                We would love to hear from you! Choose your preferred way to connect
                with us.
              </p>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Email Card */}
                <div className="group rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-primary/20 hover:bg-card/70">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-primary/10 p-3 transition-all group-hover:bg-primary/20">
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <a
                        href="mailto:support@buddybubble.com"
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        support@buddybubble.com
                      </a>
                      <br />
                      <a
                        href="mailto:partners@buddybubble.com"
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        partners@buddybubble.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="group rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-accent/20 hover:bg-card/70">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-accent/10 p-3 transition-all group-hover:bg-accent/20">
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <a
                        href="tel:+919888888727"
                        className="text-sm text-muted-foreground transition-colors hover:text-accent"
                      >
                        +91 98888 88727
                      </a>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Mon-Sat, 9 AM - 9 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="group rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-secondary/20 hover:bg-card/70">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-secondary/10 p-3 transition-all group-hover:bg-secondary/20">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Visit Us</h3>
                      <p className="text-sm text-muted-foreground">
                        Tricity Plaza, 316, Peer Muchalla Rd
                        <br />
                        Sector 20, Zirakpur, Sanauli
                        <br />
                        Punjab 140603
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="rounded-2xl border border-border bg-card/30 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {[
                    {
                      name: "Instagram",
                      icon: (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4V8z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0z"
                          />
                        </svg>
                      ),
                    },
                    {
                      name: "Facebook",
                      icon: (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4h16v16H4V4z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11h-3v-2a1 1 0 011-1h1V5h-2a3 3 0 00-3 3v3H9v3h1v5h3v-5h2l1-3z"
                          />
                        </svg>
                      ),
                    },
                    {
                      name: "YouTube",
                      icon: (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M22 6.5a2.5 2.5 0 00-2.5-2.5h-15A2.5 2.5 0 002 6.5v11A2.5 2.5 0 004.5 20h15a2.5 2.5 0 002.5-2.5v-11z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 9l5 3-5 3V9z"
                          />
                        </svg>
                      ),
                    },
                    {
                      name: "Twitter",
                      icon: (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H5v14h14v-3M10 14L21 3M15 3h6v6"
                          />
                        </svg>
                      ),
                    },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href="#"
                      className="rounded-full border border-border bg-card/50 p-2.5 text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-[2rem] border border-border bg-card/30 p-6 backdrop-blur-lg sm:p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold">Send Us a Message</h2>
                <p className="mt-2 text-muted-foreground">
                  Fill in the form below and we will get back to you within 24
                  hours.
                </p>
              </div>

              <form className="space-y-6">
                {/* Name & Email */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-foreground"
                    >
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-border bg-card/80 px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-border bg-card/80 px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                {/* Phone & Subject */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-foreground"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-border bg-card/80 px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-foreground"
                    >
                      Subject <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full rounded-xl border border-border bg-card/80 px-4 py-3 text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="product">Product Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="wholesale">Wholesale/Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-foreground"
                  >
                    Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Write your message here..."
                    className="w-full rounded-xl border border-border bg-card/80 px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                {/* Order Number (Optional) */}
                <div className="space-y-2">
                  <label
                    htmlFor="orderNumber"
                    className="text-sm font-medium text-foreground"
                  >
                    Order Number (Optional)
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    placeholder="#BB-12345"
                    className="w-full rounded-xl border border-border bg-card/80 px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Priority Support Option */}
                <div className="flex items-start gap-3 rounded-xl bg-primary/5 p-4">
                  <input
                    type="checkbox"
                    id="priority"
                    className="mt-0.5 h-4 w-4 rounded border-border bg-card text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <label htmlFor="priority" className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Priority Support</span>
                    <br />
                    Check this box if your query is urgent. We will prioritize your request.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-linear-to-r from-primary to-accent px-8 py-4 text-base font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                  <span className="relative flex items-center gap-2">
                    Send Message
                    <svg
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  By submitting this form, you agree to our{" "}
                  <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
                    Privacy Policy
                  </a>
                  . We will never share your information with third parties.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="rounded-[2rem] border border-border bg-card/30 overflow-hidden">
            <div className="relative h-64 w-full bg-muted">
              {/* Google Maps Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6869.659735984242!2d76.81690070938258!3d30.648666100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fefc3c24a7a53%3A0x6bd5d13b5c7394a7!2sTricity%20Plaza!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bubble Buddy Smile Location Map"
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Find Us Here</p>
                  <p className="text-xs text-muted-foreground">
                    Tricity Plaza, Sector 20, Zirakpur
                  </p>
                </div>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-6 py-2.5 text-sm font-medium transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                Get Directions
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* FAQ CTA */}
        <div className="mt-16 rounded-[2rem] border border-border bg-card/30 p-8 text-center backdrop-blur-lg">
          <div className="mx-auto max-w-2xl space-y-4">
            <h3 className="text-2xl font-bold">Quick Answers</h3>
            <p className="text-muted-foreground">
              Before reaching out, check our FAQ page for instant answers to
              common questions.
            </p>
            <a
              href="/frequently-asked-questions"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-8 py-3 font-medium transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
              Visit FAQ Page
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}