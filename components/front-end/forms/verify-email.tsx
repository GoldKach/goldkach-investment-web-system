// // "use client";

// // import * as React from "react";
// // import { useSearchParams, useRouter } from "next/navigation";
// // import Image from "next/image";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { verifyEmailAction, resendVerificationAction } from "@/actions/auth";
// // import { toast } from "sonner";

// // export default function VerifyEmailForm() {
// //   const params = useSearchParams();
// //   const router = useRouter()


// //   const email = params.get("email") || "";

// //   const [code, setCode] = React.useState("");
// //   const [loading, setLoading] = React.useState(false);
// //   const [resending, setResending] = React.useState(false);
// //   const [error, setError] = React.useState<string | null>(null);

// //   const onSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setError(null);

// //     if (!/^\d{6}$/.test(code)) return setError("Enter the 6-digit code.");

// //     setLoading(true);
// //     const res = await verifyEmailAction({ email, token: code });
// //     setLoading(false);

// //     if (!res.success) {
// //       setError(res.error || "Verification failed.");
// //       return;
// //     }

// //     toast("Email verified You can now sign in.");
// //     router.replace("/login");
// //   };

// //   const resend = async () => {
// //     setResending(true);
// //     await resendVerificationAction(email);
// //     setResending(false);
// //     toast("Code sent We’ve resent the 6-digit code to your email." );
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <Image src="/logos/GoldKach-Logo-New-3.png" width={80} height={80} alt="logo" className="ml-40" />
// //       <div className="space-y-2 text-center lg:text-left">
// //         <h1 className="text-3xl font-bold tracking-tight">Verify your email</h1>
// //         <p className="text-muted-foreground">
// //           Enter the 6-digit code we sent to <span className="font-medium">{email}</span>
// //         </p>
// //       </div>

// //       <form onSubmit={onSubmit} className="space-y-4">
// //         <div className="space-y-2">
// //           <Label htmlFor="code">Verification code</Label>
// //           <Input
// //             id="code"
// //             inputMode="numeric"
// //             pattern="\d*"
// //             placeholder="123456"
// //             maxLength={6}
// //             value={code}
// //             onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
// //             required
// //           />
// //         </div>
// //         {error && <p className="text-sm text-red-600">{error}</p>}

// //         <Button type="submit" className="w-full" size="lg" disabled={loading}>
// //           {loading ? "Verifying…" : "Verify"}
// //         </Button>

// //         <Button type="button" variant="outline" className="w-full" onClick={resend} disabled={resending}>
// //           {resending ? "Resending…" : "Resend code"}
// //         </Button>
// //       </form>
// //     </div>
// //   );
// // }


// "use client";

// import * as React from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"; // if you have it; else use a single <Input>
// import { verifyEmailAction, resendVerificationAction } from "@/actions/auth";
// import { toast } from "sonner";

// export default function VerifyEmailForm() {
//   const router = useRouter();
//   const params = useSearchParams();
//   const email = params.get("email") || "";

//   const [code, setCode] = React.useState("");
//   const [loading, setLoading] = React.useState(false);
//   const [resending, setResending] = React.useState(false);

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!/^\d{6}$/.test(code)) return toast.error("Enter the 6-digit code.");

//     try {
//       setLoading(true);
//       const res = await verifyEmailAction({ email, token:code });
//       if (!res.success) {
//         toast.error(res.error || "Verification failed");
//         return;
//       }
//       toast.success("Email verified! You can now sign in.");
//       router.replace("/login?verified=1");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onResend = async () => {
//     try {
//       setResending(true);
//       await resendVerificationAction(email);
//       toast.success("If the email exists, a new code has been sent.");
//     } finally {
//       setResending(false);
//     }
//   };

//   return (
//     <form onSubmit={onSubmit} className="space-y-6">
//       <div className="space-y-2 text-center">
//         <h1 className="text-2xl font-semibold">Verify your email</h1>
//         <p className="text-muted-foreground text-sm">
//           Enter the 6-digit code we sent to <span className="font-medium">{email}</span>
//         </p>
//       </div>

//       {/* If you don't have InputOTP, swap for a single Input with maxLength={6} */}
//       <div className="flex justify-center">
//         <InputOTP maxLength={6} value={code} onChange={setCode}>
//           <InputOTPGroup>
//             <InputOTPSlot index={0} />
//             <InputOTPSlot index={1} />
//             <InputOTPSlot index={2} />
//             <InputOTPSlot index={3} />
//             <InputOTPSlot index={4} />
//             <InputOTPSlot index={5} />
//           </InputOTPGroup>
//         </InputOTP>
//       </div>

//       <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
//         {loading ? "Verifying…" : "Verify email"}
//       </Button>

//       <button type="button" onClick={onResend} className="text-sm text-primary underline" disabled={resending}>
//         {resending ? "Sending…" : "Resend code"}
//       </button>
//     </form>
//   );
// }


"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { verifyEmailAction, resendVerificationAction } from "@/actions/auth";
import { toast } from "sonner";

const RESEND_COOLDOWN = 60; // seconds

export default function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [resending, setResending] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);

  // Tick cooldown
  React.useEffect(() => {
    if (!cooldown) return;
    const id = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) return toast.error("Enter the 6-digit code.");

    try {
      setLoading(true);
      // supports { token } OR { code } thanks to the action update
      const res = await verifyEmailAction({ email, token: code });
      if (!res.success) {
        toast.error(res.error || "Verification failed");
        return;
      }
        localStorage.setItem(
      "onboardingUser",
      JSON.stringify({ id: res.userId, email: res.email })
    );
      // inside onSubmit success branch
     toast.success("Email verified! Let's finish your onboarding.");
     router.replace("/onboarding");
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (cooldown > 0) return; // guard
    try {
      setResending(true);
      await resendVerificationAction(email);
      toast.success("If the email exists, a new code has been sent.");
      setCooldown(RESEND_COOLDOWN);
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Verify your email</h1>
        <p className="text-muted-foreground text-sm">
          Enter the 6-digit code we sent to <span className="font-medium">{email}</span>
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
        {loading ? "Verifying…" : "Verify email"}
      </Button>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onResend}
          className="text-sm text-primary underline disabled:opacity-50"
          disabled={resending || cooldown > 0}
        >
          {resending ? "Sending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </div>
    </form>
  );
}
