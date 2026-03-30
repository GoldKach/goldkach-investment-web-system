




// app/(back)/dashboard/layout.tsx (SERVER COMPONENT)
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAllUsers, getSession } from "@/actions/auth";
import UserDashboardShell from "@/components/back/user-dashboard-shell";
import AdminDashboard from "@/components/back/super-admin-dashboard";
import DashboardShell from "@/components/back/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // 1. Session check first
  const session = await getSession();
  if (!session) redirect("/login?returnTo=/dashboard");

  // 2. Get full user data
  const r = await getAllUsers();
  const users = r?.data;
  const user = users?.find((u: any) => u.id === session.user?.id) ?? session.user;

  // 3. Authorize by role
  const hasSuperAdminRole =
  typeof user?.role === "string"
    ? user.role === "SUPER_ADMIN"
    : Array.isArray(user?.roles) &&
      user.roles.some((r: any) => r?.roleName === "SUPER_ADMIN" || r === "SUPER_ADMIN");

if (!hasSuperAdminRole) {
  // Redirect agents to their own portal instead of showing unauthorized
  if (user?.role === "AGENT") redirect("/agent");
  redirect("/unauthorized?reason=role");
}

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
