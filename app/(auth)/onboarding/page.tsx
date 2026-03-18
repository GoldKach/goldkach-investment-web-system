


// // app/onboarding/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import OnboardingForm from "@/components/onboarding/on-boarding-form";

// type OnboardingUser = {
//   id: string;
//   email: string;
//   firstName?: string;
//   lastName?: string;
//   phone?: string;
//   // onboardingToken?: string | null; // if you added one
// };

// export default function OnboardingPage() {
//   const router = useRouter();
//   const [bootstrap, setBootstrap] = useState<OnboardingUser | null>(null);

//   useEffect(() => {
//     const raw = typeof window !== "undefined" ? localStorage.getItem("onboardingUser") : null;
//     if (!raw) {
//       router.replace("/login");
//       return;
//     }
//     try {
//       const parsed = JSON.parse(raw) as OnboardingUser | null;
//       if (!parsed?.id || !parsed?.email) {
//         router.replace("/login");
//         return;
//       }
//       setBootstrap(parsed);
//     } catch {
//       router.replace("/login");
//     }
//   }, [router]);

//   if (!bootstrap) return null; // or a skeleton

//   // Your OnboardingForm expects a `user` prop; we supply it from localStorage.
//   return (
//     <OnboardingForm
//       user={{
//         id: bootstrap.id,
//         email: bootstrap.email,
//         emailVerified: true, // verified just happened
//         firstName: bootstrap.firstName,
//         lastName: bootstrap.lastName,
//         phone: bootstrap.phone,
//       }}
//     />
//   );
// }



// app/onboarding/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CompanyOnboardingForm from "./components/company-onboarding";
import IndividualOnboardingForm from "./components/individual-onboarding";

type OnboardingUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  entityType?: "individual" | "company";
};

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bootstrap, setBootstrap] = useState<OnboardingUser | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("onboardingUser") : null;
    if (!raw) {
      router.replace("/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as OnboardingUser | null;
      if (!parsed?.id || !parsed?.email) {
        router.replace("/login");
        return;
      }

      // entityType can come from:
      // 1. localStorage (set during registration)
      // 2. ?entityType= query param (appended to verify-email redirect)
      const entityTypeFromQuery = searchParams.get("entityType") as "individual" | "company" | null;
      setBootstrap({
        ...parsed,
        entityType: parsed.entityType ?? entityTypeFromQuery ?? "individual",
      });
    } catch {
      router.replace("/login");
    }
  }, [router, searchParams]);

  if (!bootstrap) return null;

  const user = {
    id: bootstrap.id,
    email: bootstrap.email,
    emailVerified: true,
    firstName: bootstrap.firstName,
    lastName: bootstrap.lastName,
    phone: bootstrap.phone,
  };

  if (bootstrap.entityType === "company") {
    return <CompanyOnboardingForm user={user} />;
  }

  return <IndividualOnboardingForm user={user} />;
}