"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    // fake submit delay
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSuccess(mode === "signin" ? "Signed in successfully" : "Account created successfully");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card/80 p-6 shadow-2xl shadow-primary/10 ring-1 ring-inset ring-white/5 backdrop-blur-xl">
        <div className="pointer-events-none absolute right-0 top-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Visual / marketing column */}
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-linear-to-br from-primary/5 to-transparent p-8 shadow-xl shadow-primary/10 transition duration-500 hover:-translate-y-1">
            <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-primary/10 to-transparent blur-3xl" />
            <div className="relative space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm shadow-primary/10 animate-pulse">
                Trusted Manufacturer
              </span>

              <h1 className="relative text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  {mode === "signin" ? "Welcome back to Bubble Buddy Smile" : "Partner with Bubble Buddy Smile"}
                </span>
              </h1>

              <p className="max-w-xl text-sm text-muted-foreground">
                India’s leading private label cosmetic manufacturer — trusted by startups, beauty brands, salon owners, and wholesalers. We turn your beauty vision into reality.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-background/80 p-5 shadow-sm shadow-primary/5 transition duration-300 hover:-translate-y-1">
                  <h4 className="text-sm font-semibold text-foreground">✨ OEM & ODM Manufacturing</h4>
                  <p className="mt-3 text-xs text-muted-foreground">Skincare • Haircare • Beauty products — fully customized formulations for your brand.</p>
                </div>
                <div className="rounded-3xl border border-border bg-background/80 p-5 shadow-sm shadow-primary/5 transition duration-300 hover:-translate-y-1">
                  <h4 className="text-sm font-semibold text-foreground">💎 Premium Quality</h4>
                  <p className="mt-3 text-xs text-muted-foreground">Face serums, creams, shampoos, hair oils, lotions, and herbal cosmetics — made with modern formulations.</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  "ISO Certified",
                  "500+ Happy Brands",
                  "Pan India Supply",
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-border bg-card/90 px-4 py-3 text-xs font-medium text-foreground/80 shadow-sm">
                    <span className="mr-2 text-green-500">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-background/95 p-8 shadow-2xl shadow-primary/10">
            <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-primary/10 to-transparent blur-3xl" />
            <div className="relative z-10 space-y-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-linear-to-br from-primary to-accent shadow-lg shadow-primary/20 text-2xl text-white animate-bounce">
                    😊
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Bubble Buddy Smile</div>
                    <div className="text-xs text-muted-foreground">
                      {mode === "signin" ? "Welcome back to your dashboard" : "Start your beauty brand journey"}
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow-sm">
                  Private Label Experts
                </div>
              </div>

              <div className="mb-4 flex gap-2 rounded-full bg-muted p-1 shadow-inner">
                <button
                  onClick={() => setMode("signin")}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${mode === "signin" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15" : "text-foreground"}`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${mode === "signup" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15" : "text-foreground"}`}
                >
                  Sign up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4 rounded-[2rem] border border-border bg-card/90 p-6 shadow-sm">
                  {mode === "signup" && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-muted-foreground">Full name / Brand name</label>
                      <Input placeholder="Your name or brand name" required className="bg-background/90" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-muted-foreground">Email</label>
                    <Input type="email" placeholder="hello@yourbrand.com" required className="bg-background/90" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-muted-foreground">Password</label>
                    <Input type="password" placeholder="Enter password" required className="bg-background/90" />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-border bg-card" />
                    Remember me
                  </label>
                  <Link href="/" className="font-semibold text-primary hover:underline">Forgot?</Link>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/15 transition duration-300 hover:-translate-y-0.5"
                  data-loading={loading ? true : false}
                >
                  {loading ? "Working..." : mode === "signin" ? "Sign in" : "Get a free consultation →"}
                </Button>

                {success && (
                  <div className="rounded-3xl border border-border bg-primary/10 p-3 text-sm text-primary animate-pulse">
                    {success}
                  </div>
                )}

                <div className="text-center text-xs text-muted-foreground">
                  By continuing, you agree to our <Link href="/terms" className="text-primary hover:underline">terms</Link>.
                  Need bulk orders? <Link href="/contact" className="text-primary hover:underline">Contact sales</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}