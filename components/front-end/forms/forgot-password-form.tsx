// "use client"

// import type React from "react"

// import { useState } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { CheckCircle2, ArrowLeft } from "lucide-react"
// import Image from "next/image"

// export function ForgotPasswordForm() {
//   const [email, setEmail] = useState("")
//   const [isSubmitted, setIsSubmitted] = useState(false)

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log("Password reset requested for:", email)
//     setIsSubmitted(true)
//   }

//   if (isSubmitted) {
//     return (
//       <div className="space-y-6">
//         <div className="space-y-2 text-center lg:text-left">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
//             <CheckCircle2 className="w-8 h-8 text-primary" />
//           </div>
//           <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
//           <p className="text-muted-foreground">
//             We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
//           </p>
//         </div>

//         <Alert>
//           <AlertDescription>
//             If you don't see the email, check your spam folder or try again with a different email address.
//           </AlertDescription>
//         </Alert>

//         <div className="space-y-3">
//           <Button variant="outline" className="w-full bg-transparent" size="lg" onClick={() => setIsSubmitted(false)}>
//             Try another email
//           </Button>

//           <Link href="/login" className="block">
//             <Button variant="ghost" className="w-full" size="lg">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to sign in
//             </Button>
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="space-y-2 text-center lg:text-left">
//           <Image src="/logos/GoldKach-Logo-New-3.png" className="justify-center items-center ml-40" width={100} height={100} alt="logo"/>
//         <h1 className="text-3xl font-bold tracking-tight">Reset your password</h1>
//         <p className="text-muted-foreground">
//           Enter your email address and we'll send you a link to reset your password
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="email">Email address</Label>
//           <Input
//             id="email"
//             type="email"
//             placeholder="you@example.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <Button type="submit" className="w-full" size="lg">
//           Send reset link
//         </Button>
//       </form>

//       <div className="text-center">
//         <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to sign in
//         </Link>
//       </div>

//       <div className="pt-4 border-t">
//         <p className="text-center text-sm text-muted-foreground">
//           {"Don't have an account? "}
//           <Link href="/register" className="font-medium text-primary hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   )
// }


"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Always returns 200 with a generic message on your server (to avoid user enumeration)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-store",
      });

      setIsSubmitted(true);
    } catch (err) {
      // Even if network fails, we still show the success screen by default.
      // If you prefer to show an error, uncomment the next line and remove setIsSubmitted(true).
      // setError("Something went wrong. Please try again.");
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <Alert>
          <AlertDescription>
            If you don&apos;t see the email, check your spam folder. You can also try again with a different email address.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full bg-transparent"
            size="lg"
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
          >
            Try another email
          </Button>

          <Link href="/login" className="block">
            <Button variant="ghost" className="w-full" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <Image
          src="/logos/GoldKach-Logo-New-3.png"
          className="justify-center items-center ml-40"
          width={100}
          height={100}
          alt="logo"
        />
        <h1 className="text-3xl font-bold tracking-tight">Reset your password</h1>
        <p className="text-muted-foreground">
          Enter your email address and we&apos;ll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <div className="text-center">
        <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>
      </div>

      <div className="pt-4 border-t">
        <p className="text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
