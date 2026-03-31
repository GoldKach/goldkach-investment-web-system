

// app/dashboard/layout.tsx  (SERVER COMPONENT)
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import UserDashboardShell from "@/components/back/user-dashboard-shell";
import { fetchMe, getAllUsers, getSession } from "@/actions/auth";
import { ZustandHydration } from "@/components/providers/zustand-hydration";
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // 1) Must be logged in
  const session = await getSession();
    if (!session) redirect("/login?returnTo=/dashboard");

    const r = await getAllUsers();
    const users = r.data;
    const user = users?.find((u:any) => u.id === session?.user?.id);  

  // 2) Get the freshest user (or fall back to session)
  // const me = await fetchMe(); // your server action that calls /me


  // 3) Authorize by role
  // If your app sometimes uses array roles, this handles both string and array.
  const hasUserRole =
    (typeof user?.role === "string" && user.role === "USER") ||
    (Array.isArray(user?.roles) && user.roles.some((r: any) => r?.roleName === "USER" || r === "USER"));

  if (!hasUserRole) {
    if (user?.role === "AGENT") redirect("/agent");
    if (user?.role === "CLIENT_RELATIONS") redirect("/cr");
    if (user?.role === "SUPER_ADMIN" || user?.role === "ADMIN") redirect("/dashboard");
    redirect("/unauthorized?reason=role");
  }

  // If the user hasn't completed onboarding, send them there first
  const hasOnboarding = !!(user?.individualOnboarding || user?.companyOnboarding);
  if (!hasOnboarding) {
    redirect("/onboarding?alert=Please+complete+your+onboarding+to+access+your+account");
  }

  return  <ZustandHydration
    fallback={
      // Simple loading skeleton while store rehydrates
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-pulse" />
    }
  >
    <UserDashboardShell user={user}>{children}</UserDashboardShell>
  </ZustandHydration>;
}

