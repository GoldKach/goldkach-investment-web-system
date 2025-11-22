

// "use client";

// import * as React from "react";
// import { useState, useTransition } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { loginUser } from "@/actions/auth"; // your server action

// type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN" | string;

// function routeForRole(role: UserRole) {
//   switch (role) {
//     case "USER":
//       return "/user";
//     case "ADMIN":
//     case "SUPER_ADMIN":
//       return "/dashboard";
//     default:
//       return "/dashboard";
//   }
// }

// export function LoginForm() {
//   const router = useRouter();
//   const params = useSearchParams();
//   const nextParam = params.get("next"); // optional override

//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isPending, startTransition] = useTransition();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     startTransition(async () => {
//       const res = await loginUser({ identifier, password });
//       if (!res.success) {
//         setError(res.error || "Login failed");
//         return;
//       }

//       // res.data.user.role is set by your backend controller
//       const userRole = res.data?.user?.role as UserRole | undefined;

//       // If ?next= is present, it wins; else route by role
//       const target = nextParam || routeForRole(userRole ?? "USER");

//       // (Optional) Use rememberMe to adjust cookie maxAge in your server action
//       // if (rememberMe) { await extendCookieLifetimeServerAction(); }

//       router.replace(target);
//     });
//   };

//   return (
//     <div className="space-y-6 justify-center">
//       <Image
//         src="/logos/GoldKach-Logo-New-3.png"
//         width={100}
//         height={100}
//         alt="logo"
//         className="mx-auto"
//         priority
//       />

//       <div className="space-y-2 text-center lg:text-left">
//         <h1 className="text-3xl font-bold tracking-tight">Sign in to your account</h1>
//         <p className="text-muted-foreground">
//           Enter your credentials to access your portfolio
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="identifier">Email or Phone</Label>
//           <Input
//             id="identifier"
//             type="text"
//             placeholder="you@example.com or +2567…"
//             value={identifier}
//             onChange={(e) => setIdentifier(e.target.value)}
//             required
//           />
//         </div>

//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label htmlFor="password">Password</Label>
//             <Link href="/forgot-password" className="text-sm text-primary hover:underline">
//               Forgot password?
//             </Link>
//           </div>
//           <Input
//             id="password"
//             type="password"
//             placeholder="••••••••"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <div className="flex items-center space-x-2">
//           <Checkbox
//             id="remember"
//             checked={rememberMe}
//             onCheckedChange={(checked) => setRememberMe(!!checked)}
//           />
//           <label
//             htmlFor="remember"
//             className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//           >
//             Remember me for 30 days
//           </label>
//         </div>

//         {error && <p className="text-sm text-red-600">{error}</p>}

//         <Button type="submit" className="w-full" size="lg" disabled={isPending}>
//           {isPending ? "Signing in…" : "Sign in"}
//         </Button>

//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <span className="w-full border-t" />
//           </div>
//         </div>
//       </form>

//       <p className="text-center text-sm text-muted-foreground">
//         {"Don't have an account? "}
//         <Link href="/register" className="font-medium text-primary hover:underline">
//           Sign up
//         </Link>
//       </p>
//     </div>
//   );
// }






"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/actions/auth"; // your server action

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

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextParam = params.get("next"); // optional override

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await loginUser({ identifier, password });
      if (!res.success) {
        setError(res.error || "Login failed");
        return;
      }

      // res.data.user.role is set by your backend controller
      const userRole = res.data?.user?.role as UserRole | undefined;

      // If ?next= is present, it wins; else route by role
      const target = nextParam || routeForRole(userRole ?? "USER");

      // (Optional) Use rememberMe to adjust cookie maxAge in your server action
      // if (rememberMe) { await extendCookieLifetimeServerAction(); }

      router.replace(target);
    });
  };

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
        <h1 className="text-3xl font-bold tracking-tight">Sign in to your account</h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your portfolio
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="identifier">Email or Phone</Label>
          <Input
            id="identifier"
            type="text"
            placeholder="you@example.com or +2567…"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(!!checked)}
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me for 30 days
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? "Signing in…" : "Sign in"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {"Don't have an account? "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
