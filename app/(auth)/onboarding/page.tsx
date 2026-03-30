


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
import { toast } from "sonner";
import { getSession } from "@/actions/auth";
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
    const alert = searchParams.get("alert");
    if (alert) toast.warning(alert);
  }, [searchParams]);

  useEffect(() => {
    async function init() {
      const entityTypeFromQuery = searchParams.get("entityType") as "individual" | "company" | null;

      // 1. Try localStorage first (new registration flow)
      const raw = typeof window !== "undefined" ? localStorage.getItem("onboardingUser") : null;
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as OnboardingUser | null;
          if (parsed?.id && parsed?.email) {
            setBootstrap({ ...parsed, entityType: parsed.entityType ?? entityTypeFromQuery ?? "individual" });
            return;
          }
        } catch {}
      }

      // 2. Fall back to session (existing USER redirected from dashboard)
      const session = await getSession();
      if (session?.user?.id && session?.user?.email) {
        setBootstrap({
          id: session.user.id,
          email: session.user.email,
          entityType: entityTypeFromQuery ?? "individual",
        });
        return;
      }

      // 3. No session at all — send to login
      router.replace("/login");
    }

    init();
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