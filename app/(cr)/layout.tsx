import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getAllStaffAction } from "@/actions/staff";
import CRShell from "@/components/cr/cr-shell";

export const dynamic = "force-dynamic";

export default async function CRLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  if (session.user?.role !== "CLIENT_RELATIONS") {
    if (session.user?.role === "AGENT") redirect("/agent");
    if (session.user?.role === "SUPER_ADMIN" || session.user?.role === "ADMIN") redirect("/dashboard");
    if (session.user?.role === "USER") redirect("/user");
    redirect("/unauthorized");
  }

  // Use staff action to get CR user's own profile (avoids admin-only /users endpoint)
  const staffRes = await getAllStaffAction({ role: "CLIENT_RELATIONS" });
  const staffUser = staffRes.data?.find((s) => s.id === session.user.id);
  // Fall back to session data if staff lookup fails
  const user = staffUser ?? session.user;

  return <CRShell user={user}>{children}</CRShell>;
}
