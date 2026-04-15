


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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const alert = searchParams.get("alert");
    if (alert) toast.warning(alert);
  }, [searchParams]);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const entityTypeFromQuery = searchParams.get("entityType") as "individual" | "company" | null;

      // 1. Try localStorage first (new registration flow)
      const raw = typeof window !== "undefined" ? localStorage.getItem("onboardingUser") : null;
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as OnboardingUser | null;
          if (parsed?.id && parsed?.email) {
            setBootstrap({ ...parsed, entityType: parsed.entityType ?? entityTypeFromQuery ?? "individual" });
            setIsLoading(false);
            return;
          }
        } catch {}
      }

      // 2. Fall back to session (existing USER redirected from dashboard)
      const session = await getSession();
      if (session?.user?.id && session?.user?.email) {
        // Fetch the user's entity type from the database via API
        let entityType: "individual" | "company" | null = entityTypeFromQuery;
        
        if (!entityType) {
          try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const baseUrl = API_URL.endsWith("/api/v1") ? API_URL : `${API_URL}/api/v1`;
            const res = await fetch(`${baseUrl}/users/${session.user.id}`, {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            });
            if (res.ok) {
              const data = await res.json();
              // Check individual onboarding first
              if (data.data?.individualOnboarding) {
                entityType = "individual";
              } else if (data.data?.companyOnboarding) {
                entityType = "company";
              }
            }
          } catch (err) {
            console.error("Failed to fetch user entity type:", err);
          }
        }

        setBootstrap({
          id: session.user.id,
          email: session.user.email,
          firstName: session.user.firstName,
          lastName: session.user.lastName,
          entityType: entityType ?? "individual",
        });
        setIsLoading(false);
        return;
      }

      // 3. No session at all — send to login
      router.replace("/login");
    }

    init();
  }, [router, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

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