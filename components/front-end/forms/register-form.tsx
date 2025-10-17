
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area"; // if not present, replace with a div
import { createUser as createUserAction } from "@/actions/auth";
import { toast } from "sonner";

export function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Dialog control
  const [openTos, setOpenTos] = React.useState(false);
  const [openPrivacy, setOpenPrivacy] = React.useState(false);

  // Acceptance gates
  const [acceptedTos, setAcceptedTos] = React.useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = React.useState(false);

  // Inside-dialog checkboxes (forces user to confirm)
  const [tosConfirm, setTosConfirm] = React.useState(false);
  const [privacyConfirm, setPrivacyConfirm] = React.useState(false);

  const canSubmit = acceptedTos && acceptedPrivacy && !loading;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (!acceptedTos || !acceptedPrivacy) return setError("You must accept the Terms and the Privacy Policy.");

    try {
      setLoading(true);
      await createUserAction({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      });
      toast.success("Account created! Check your email for the 6-digit verification code.");
      router.replace(`/verify-email?email=${encodeURIComponent(form.email.trim().toLowerCase())}`);
    } catch (err: any) {
      setError(err?.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Image
        src="/logos/GoldKach-Logo-New-3.png"
        className="justify-center items-center ml-[calc(50%-40px)]"
        width={80}
        height={80}
        alt="logo"
      />

      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground">Get started with your investment journey today</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              value={form.firstName}
              onChange={onChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              value={form.lastName}
              onChange={onChange}
              required
            />
          </div>
        </div>

       <div className="grid md:grid-cols-2 gap-4">
         <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>
        <div className="gap-4">
            <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+2567…"
            value={form.phone}
            onChange={onChange}
            required
          />
        </div>
       </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={onChange}
            required
            minLength={8}
          />
          <p className="text-xs text-muted-foreground">At least 8 characters.</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={onChange}
            required
            minLength={8}
          />
        </div>
        </div>


        {/* Consent row */}
        <div className="rounded-md border p-3 space-y-2">
          <p className="text-sm leading-relaxed">
            You must accept the{" "}
            <button
              type="button"
              className="text-primary underline underline-offset-2"
              onClick={() => setOpenTos(true)}
            >
              Terms of Service
            </button>{" "}
            and the{" "}
            <button
              type="button"
              className="text-primary underline underline-offset-2"
              onClick={() => setOpenPrivacy(true)}
            >
              Privacy Policy
            </button>{" "}
            to create your account.
          </p>

          <div className="text-xs text-muted-foreground">
            Status:{" "}
            <span className={acceptedTos ? "text-green-600" : "text-amber-600"}>
              Terms {acceptedTos ? "accepted" : "pending"}
            </span>{" "}
            •{" "}
            <span className={acceptedPrivacy ? "text-green-600" : "text-amber-600"}>
              Privacy {acceptedPrivacy ? "accepted" : "pending"}
            </span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={!canSubmit}>
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </a>
      </p>

      {/* Terms Dialog */}
      <Dialog open={openTos} onOpenChange={(o:any) => { setOpenTos(o); if (!o) setTosConfirm(false); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-80 pr-2">
            {/* Replace with your real ToS content */}
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><strong>Welcome to Goldkach.</strong> These Terms govern your use of our platform...</p>
              <p>1. Eligibility...</p>
              <p>2. Accounts & Security...</p>
              <p>3. Investments & Risks...</p>
              <p>4. Fees...</p>
              <p>5. Limitation of liability...</p>
              <p>6. Governing law...</p>
              <p>… (full legal copy here) …</p>
            </div>
          </ScrollArea>

          <div className="mt-3 flex items-center gap-2">
            <input
              id="tosConfirm"
              type="checkbox"
              className="h-4 w-4"
              checked={tosConfirm}
              onChange={(e) => setTosConfirm(e.target.checked)}
            />
            <label htmlFor="tosConfirm" className="text-sm">
              I have read and agree to the Terms of Service.
            </label>
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setOpenTos(false)}>Close</Button>
            <Button
              onClick={() => {
                setAcceptedTos(true);
                setOpenTos(false);
              }}
              disabled={!tosConfirm}
            >
              Accept Terms
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog open={openPrivacy} onOpenChange={(o:any) => { setOpenPrivacy(o); if (!o) setPrivacyConfirm(false); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-80 pr-2">
            {/* Replace with your real Privacy content */}
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><strong>Your privacy matters.</strong> This Policy explains how we collect, use, and protect your data…</p>
              <p>1. Information we collect...</p>
              <p>2. How we use information...</p>
              <p>3. Sharing & disclosures...</p>
              <p>4. Security...</p>
              <p>5. Data retention...</p>
              <p>6. Your rights...</p>
              <p>… (full legal copy here) …</p>
            </div>
          </ScrollArea>

          <div className="mt-3 flex items-center gap-2">
            <input
              id="privacyConfirm"
              type="checkbox"
              className="h-4 w-4"
              checked={privacyConfirm}
              onChange={(e) => setPrivacyConfirm(e.target.checked)}
            />
            <label htmlFor="privacyConfirm" className="text-sm">
              I have read and agree to the Privacy Policy.
            </label>
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setOpenPrivacy(false)}>Close</Button>
            <Button
              onClick={() => {
                setAcceptedPrivacy(true);
                setOpenPrivacy(false);
              }}
              disabled={!privacyConfirm}
            >
              Accept Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
