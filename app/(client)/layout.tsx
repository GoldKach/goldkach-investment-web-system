

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
  if (!session) redirect("/login?returnTo=/user");

  const r = await getAllUsers();
  const users = r.data;
  const user = users?.find((u: any) => u.id === session?.user?.id) ?? session.user;

  // 3) Authorize by role — fall back to session role if user lookup fails
  const role = user?.role ?? (session.user as any)?.role;

  if (role === "AGENT") redirect("/agent");
  if (role === "CLIENT_RELATIONS") redirect("/cr");
  if (role === "ACCOUNT_MANAGER") redirect("/accountant");
  if (role === "SUPER_ADMIN" || role === "ADMIN" || role === "MANAGER") redirect("/dashboard");

  // Only USER role (or unknown) continues here
  const hasUserRole = !role || role === "USER";
  if (!hasUserRole) redirect("/unauthorized?reason=role");

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

