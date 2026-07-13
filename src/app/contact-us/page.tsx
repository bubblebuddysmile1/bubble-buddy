"use client";

import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  orderNumber: "",
  priority: false,
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const checkbox = event.target as HTMLInputElement;
      setForm((current) => ({ ...current, [name]: checkbox.checked }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          isPriority: form.priority,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to send your message right now.");
      } else {
        setMessage(data.message || "Your message has been saved successfully.");
        setForm(initialForm);
      }
    } catch {
      setError("Unable to send your message right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden border-b border-border bg-card/50 backdrop-blur-lg">
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
              Have questions or need assistance? We are here to help you smile brighter. Reach out to us through any of the channels below.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <h2 className="text-2xl font-bold">Get in Touch</h2>
              <p className="text-muted-foreground">
                We would love to hear from you! Choose your preferred way to connect with us.
              </p>

              <div className="space-y-4">
                <div className="group rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-primary/20 hover:bg-card/70">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-primary/10 p-3 transition-all group-hover:bg-primary/20">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <a href="mailto:bubblebuddysmile.team@gmail.com" className="text-sm text-muted-foreground transition-colors hover:text-primary">bubblebuddysmile.team@gmail.com</a>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-accent/20 hover:bg-card/70">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-accent/10 p-3 transition-all group-hover:bg-accent/20">
                      <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <a href="tel:+919888888727" className="text-sm text-muted-foreground transition-colors hover:text-accent">+91 98888 88727</a>
                      <p className="mt-1 text-xs text-muted-foreground">Mon-Sat, 9 AM - 9 PM</p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-secondary/20 hover:bg-card/70">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-secondary/10 p-3 transition-all group-hover:bg-secondary/20">
                      <svg className="h-6 w-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-[2rem] border border-border bg-card/30 p-6 backdrop-blur-lg sm:p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold">Send Us a Message</h2>
                <p className="mt-2 text-muted-foreground">
                  Fill in the form below and we will get back to you within 24 hours.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-border bg-card/80 px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your Gmail address"
                      className="w-full rounded-xl border border-border bg-card/80 px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-border bg-card/80 px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-foreground">
                      Subject <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
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

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full rounded-xl border border-border bg-card/80 px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="orderNumber" className="text-sm font-medium text-foreground">
                    Order Number (Optional)
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    value={form.orderNumber}
                    onChange={handleChange}
                    placeholder="#BB-12345"
                    className="w-full rounded-xl border border-border bg-card/80 px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-primary/5 p-4">
                  <input
                    type="checkbox"
                    id="priority"
                    name="priority"
                    checked={form.priority}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 rounded border-border bg-card text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <label htmlFor="priority" className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Priority Support</span>
                    <br />
                    Check this box if your query is urgent. We will prioritize your request.
                  </label>
                </div>

                {message ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">{message}</div> : null}
                {error ? <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-linear-to-r from-primary to-accent px-8 py-4 text-base font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-70"
                >
                  <span className="relative flex items-center gap-2">
                    {loading ? "Sending..." : "Send Message"}
                  </span>
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  By submitting this form, you agree to our{" "}
                  <a href="/privacy-policy" className="text-primary underline-offset-4 hover:underline">
                    Privacy Policy
                  </a>
                  . We will never share your information with third parties.
                </p>
              </form>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2rem] border border-border bg-card/30 p-6 backdrop-blur-lg">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">Need Quick Answers?</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Visit our FAQ section for common questions about orders, shipping, refunds, and product care.
                    </p>
                  </div>
                  <a
                    href="/frequently-asked-questions"
                    className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    View FAQ
                  </a>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <a href="/frequently-asked-questions" className="rounded-xl border border-border bg-card/60 p-4 text-sm transition-colors hover:border-primary/20 hover:bg-card/80">
                    <span className="font-semibold text-foreground">Orders & Delivery</span>
                    <p className="mt-1 text-muted-foreground">Track order status and delivery timelines.</p>
                  </a>
                  <a href="/refund-policy" className="rounded-xl border border-border bg-card/60 p-4 text-sm transition-colors hover:border-primary/20 hover:bg-card/80">
                    <span className="font-semibold text-foreground">Returns & Refunds</span>
                    <p className="mt-1 text-muted-foreground">Read our refund and return policy.</p>
                  </a>
                  <a href="/shipping-policy" className="rounded-xl border border-border bg-card/60 p-4 text-sm transition-colors hover:border-primary/20 hover:bg-card/80">
                    <span className="font-semibold text-foreground">Shipping Policy</span>
                    <p className="mt-1 text-muted-foreground">Find shipping charges and delivery details.</p>
                  </a>
                  <a href="/privacy-policy" className="rounded-xl border border-border bg-card/60 p-4 text-sm transition-colors hover:border-primary/20 hover:bg-card/80">
                    <span className="font-semibold text-foreground">Privacy Policy</span>
                    <p className="mt-1 text-muted-foreground">Know how your data is handled.</p>
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-card/30 p-6 backdrop-blur-lg">
                <h3 className="text-xl font-bold">Find Our Store</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Visit us at our showroom for product guidance, demos, and personalized smile recommendations.
                </p>

                <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                  <iframe
                    title="Bubble Buddy Smile location"
                    src="https://www.google.com/maps?q=Tricity%20Plaza%20Peer%20Muchalla%20Rd%20Sector%2020%20Zirakpur%20Punjab%20140603&output=embed"
                    className="h-64 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="mt-4 rounded-xl border border-dashed border-border bg-card/60 p-4 text-sm text-muted-foreground">
                  Tricity Plaza, 316, Peer Muchalla Rd, Sector 20, Zirakpur, Punjab 140603
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}