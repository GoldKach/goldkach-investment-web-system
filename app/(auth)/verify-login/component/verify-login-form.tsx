"use client";

import * as React from "react";
import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import { verifyLoginCode, resendLoginCode } from "@/actions/auth";
import { toast } from "sonner";

type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN" | string;

function routeForRole(role: UserRole) {
  switch (role) {
    case "USER":
      return "/user";
    case "ADMIN":
    case "SUPER_ADMIN":
      return "/dashboard";
    default:
      return "/dashboard";
  }
}

export function VerifyLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  
  const userId = params.get("userId");
  const email = params.get("email");
  const nextParam = params.get("next");

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Redirect if no userId
  useEffect(() => {
    if (!userId) {
      router.push("/login");
    }
  }, [userId, router]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        // Enable resend button after 60 seconds (when 9 minutes left)
        if (newTime === 540) {
          setCanResend(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setError(null);
    setSuccess(null);

    if (code.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    startTransition(async () => {
      const res = await verifyLoginCode({ userId, code });
      
      if (!res.success) {
        setError(res.error || "Verification failed");
        toast.error(res.error || "Verification failed");
        return;
      }

      setSuccess("Login successful! Redirecting...");
      toast.success("Login successful!");

      // Get user role and redirect
      const userRole = res.data?.user?.role as UserRole | undefined;
      const target = nextParam || routeForRole(userRole ?? "USER");

      setTimeout(() => {
        router.replace(target);
      }, 1000);
    });
  };

  const handleResendCode = async () => {
    if (!userId || isResending || !canResend) return;
    
    setIsResending(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await resendLoginCode({ userId });
      
      if (!res.success) {
        setError(res.error || "Failed to resend code");
      } else {
        setSuccess("New code sent to your email!");
        setTimeLeft(600); // Reset timer to 10 minutes
        setCanResend(false); // Disable resend button again
        setCode(""); // Clear input
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length <= 6) {
      setCode(value);
    }
  };

  if (!userId) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-6 justify-center">
      <Image
        src="/logos/GoldKach-Logo-New-3.png"
        width={100}
        height={100}
        alt="logo"
        className="mx-auto"
        priority
      />

      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Verify Your Login</h1>
        <p className="text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            value={code}
            onChange={handleCodeChange}
            required
            maxLength={6}
            className="text-center text-2xl tracking-widest font-mono"
            autoComplete="one-time-code"
            autoFocus
          />
          <p className="text-xs text-muted-foreground text-center">
            Code expires in{" "}
            <span className={timeLeft < 60 ? "text-red-600 font-semibold" : "font-semibold"}>
              {formatTime(timeLeft)}
            </span>
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-md">
            {success}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          size="lg" 
          disabled={isPending || code.length !== 6}
        >
          {isPending ? "Verifying…" : "Verify Code"}
        </Button>

        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Didn&apos;t receive the code?
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResendCode}
            disabled={isResending || !canResend}
          >
            <Mail className="mr-2 h-4 w-4" />
            {isResending 
              ? "Sending…" 
              : canResend 
                ? "Resend Code" 
                : `Resend in ${formatTime(600 - timeLeft)}`
            }
          </Button>
        </div>
      </form>

      <div className="flex items-center justify-center">
        <Link
          href="/login"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>

      {/* Security Notice */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Security Notice
            </h3>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
              If you didn&apos;t attempt to login, please secure your account immediately by
              changing your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}