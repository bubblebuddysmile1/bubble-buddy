"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProfileEditFormProps = {
  initialName: string;
  initialPhone: string;
};

export default function ProfileEditForm({ initialName, initialPhone }: ProfileEditFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to update profile.");
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setError("Unable to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-border bg-background/80 p-6">
      <h2 className="text-xl font-semibold">Edit profile</h2>
      <p className="mt-2 text-sm text-muted-foreground">Update your display name and phone number.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="font-medium text-foreground">Full name</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium text-foreground">Phone</span>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {success && <p className="mt-4 text-sm text-emerald-700">Profile updated successfully.</p>}

      <Button type="submit" disabled={isSaving} className="mt-5 rounded-full">
        {isSaving ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
