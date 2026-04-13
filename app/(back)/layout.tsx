




// app/(back)/dashboard/layout.tsx (SERVER COMPONENT)
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAllUsers, getSession } from "@/actions/auth";
import UserDashboardShell from "@/components/back/user-dashboard-shell";
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
  const adminRoles = ["SUPER_ADMIN", "ADMIN", "MANAGER"];
  const hasAdminRole =
    typeof user?.role === "string"
      ? adminRoles.includes(user.role)
      : Array.isArray(user?.roles) &&
        user.roles.some((r: any) => adminRoles.includes(r?.roleName ?? r));

  if (!hasAdminRole) {
    if (user?.role === "AGENT") redirect("/agent");
    if (user?.role === "CLIENT_RELATIONS") redirect("/cr");
    if (user?.role === "ACCOUNT_MANAGER") redirect("/accountant");
    if (user?.role === "USER") redirect("/user");
    redirect("/unauthorized?reason=role");
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
