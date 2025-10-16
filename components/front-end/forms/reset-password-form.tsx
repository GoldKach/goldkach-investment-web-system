"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") ?? "";
  const uid = searchParams.get("uid") ?? "";

  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL; // e.g. http://localhost:8000/api/v1

  const validate = () => {
    if (!token || !uid) return "This reset link is invalid or incomplete.";
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (password !== confirm) return "Passwords do not match.";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          uid,
          token,
          newPassword: password,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Reset failed. The link may be invalid or expired.");
      }

      setDone(true);
      // Optional: short delay then go to login
      setTimeout(() => router.replace("/login"), 1200);
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // If token/uid missing, show a helpful notice
  if (!token || !uid) {
    return (
      <Alert>
        <AlertDescription>
          This reset link is invalid or incomplete. Please request a new one from{" "}
          <Link className="underline" href="/forgot-password">
            Forgot password
          </Link>
          .
        </AlertDescription>
      </Alert>
    );
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p className="text-lg font-semibold">Password updated ✅</p>
        <p>You can now sign in with your new password.</p>
        <Button onClick={() => router.replace("/login")}>Go to sign in</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        <p className="text-xs text-muted-foreground">Use at least 8 characters.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm new password</Label>
        <Input
          id="confirm"
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          minLength={8}
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating…" : "Set new password"}
      </Button>

      <div className="text-center">
        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground underline">
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
