"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyEmailAction, resendVerificationAction } from "@/actions/auth";
import { toast } from "sonner";

export default function VerifyEmailForm() {
  const params = useSearchParams();
  const router = useRouter()


  const email = params.get("email") || "";

  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [resending, setResending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^\d{6}$/.test(code)) return setError("Enter the 6-digit code.");

    setLoading(true);
    const res = await verifyEmailAction({ email, token: code });
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Verification failed.");
      return;
    }

    toast("Email verified You can now sign in.");
    router.replace("/login");
  };

  const resend = async () => {
    setResending(true);
    await resendVerificationAction(email);
    setResending(false);
    toast("Code sent We’ve resent the 6-digit code to your email." );
  };

  return (
    <div className="space-y-6">
      <Image src="/logos/GoldKach-Logo-New-3.png" width={80} height={80} alt="logo" className="ml-40" />
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Verify your email</h1>
        <p className="text-muted-foreground">
          Enter the 6-digit code we sent to <span className="font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Verification code</Label>
          <Input
            id="code"
            inputMode="numeric"
            pattern="\d*"
            placeholder="123456"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Verifying…" : "Verify"}
        </Button>

        <Button type="button" variant="outline" className="w-full" onClick={resend} disabled={resending}>
          {resending ? "Resending…" : "Resend code"}
        </Button>
      </form>
    </div>
  );
}
