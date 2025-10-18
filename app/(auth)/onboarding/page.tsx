// // import { getSession } from "@/actions/auth";
// // import OnboardingForm from "@/components/onboarding/on-boarding-form";

// // export default async function OnboardingPage() {
// //   const session = await getSession(); 
// //   return (
// //     <div className="max-w-3xl mx-auto p-6">
// //       <OnboardingForm user={{ email: session?.user?.email, emailVerified: session?.user?.emailVerified }} />
// //     </div>
// //   );
// // }


// // app/onboarding/page.tsx
// import { getSession } from "@/actions/auth";
// import OnboardingForm from "@/components/onboarding/on-boarding-form";
// import { redirect } from "next/navigation";

// export default async function OnboardingPage() {
//   const session = await getSession();
//     // if (!session) redirect("/login");
//   return (
//     <OnboardingForm
//       user={{
//         id: session?.user?.id,
//         email: session?.user?.email,
//         emailVerified: session?.user?.emailVerified,
//         firstName: session?.user?.firstName,
//         lastName: session?.user?.lastName,
//         phone: session?.user?.phone,
//       }}
//     />
//   );
// }




// app/onboarding/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingForm from "@/components/onboarding/on-boarding-form";

type OnboardingUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  // onboardingToken?: string | null; // if you added one
};

export default function OnboardingPage() {
  const router = useRouter();
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
      setBootstrap(parsed);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  if (!bootstrap) return null; // or a skeleton

  // Your OnboardingForm expects a `user` prop; we supply it from localStorage.
  return (
    <OnboardingForm
      user={{
        id: bootstrap.id,
        email: bootstrap.email,
        emailVerified: true, // verified just happened
        firstName: bootstrap.firstName,
        lastName: bootstrap.lastName,
        phone: bootstrap.phone,
      }}
    />
  );
}

