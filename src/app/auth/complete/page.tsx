"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AccountCompletePage() {
  const router = useRouter();
  const search = useSearchParams();
  const email = String(search?.get("email") ?? "");
  const orderId = String(search?.get("order_id") ?? "");
  const paymentId = String(search?.get("payment_id") ?? "");
  const orderNumber = String(search?.get("order_number") ?? "");
  const dbOrderId = String(search?.get("dbOrderId") ?? "");

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buildSuccessRedirect = () => {
    const params = new URLSearchParams({ order_id: orderId, payment_id: paymentId });
    if (orderNumber) params.set("order_number", orderNumber);
    return `/payment/success?${params.toString()}`;
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to send OTP.");
      } else {
        setMessage(data.message || "OTP sent. Check your email.");
      }
    } catch (err) {
      setError("Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "OTP verification failed.");
      } else {
        // verified and server sets auth cookie
        router.push(buildSuccessRedirect());
      }
    } catch (err) {
      setError("OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (!password) {
      setError("Enter a password to continue.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to set password.");
      } else {
        setMessage(data.message || "Password set. Check your email for verification OTP.");
      }
    } catch (err) {
      setError("Unable to set password.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-2xl font-semibold">Email is required</h2>
          <p className="mt-2 text-sm text-muted-foreground">This page needs your email address to send the verification code.</p>
          <div className="mt-6">
            <Button onClick={() => router.push("/auth")}>Go to Sign in</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-8">
        <h2 className="text-2xl font-semibold">Complete your account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Finish setup for <strong>{email}</strong> so you can access your order and login later with a password.
        </p>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Set a password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Choose a password"
            />
            <p className="text-xs text-muted-foreground">Save a password now so you can log in after verification without OTP.</p>
            <div className="flex gap-2 mt-2">
              <Button onClick={handleSetPassword} disabled={loading}>{loading ? "Working…" : "Set password"}</Button>
              <Button variant="secondary" onClick={() => setPassword("")}>Clear</Button>
            </div>
          </div>

          <div className="pt-4 border-t border-border" />

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Verify with email OTP</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={handleSendOtp} disabled={loading}>{loading ? "Sending…" : "Send / Resend OTP"}</Button>
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" />
              <Button onClick={handleVerifyOtp} disabled={loading || !otp}>{loading ? "Verifying…" : "Verify OTP"}</Button>
            </div>
            <p className="text-xs text-muted-foreground">If you already have a password, you can also sign in from the regular login page after verification.</p>
          </div>

          {message && <div className="rounded-md bg-primary/10 p-2 text-sm text-primary">{message}</div>}
          {error && <div className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">{error}</div>}

          <div className="mt-4 text-sm text-muted-foreground">After verification you'll be redirected to your order confirmation.</div>
        </div>
      </div>
    </div>
  );
}
