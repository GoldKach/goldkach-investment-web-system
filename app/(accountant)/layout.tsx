import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAllUsers, getSession } from "@/actions/auth";
import AccountantShell from "@/components/accountant/accountant-shell";

export const dynamic = "force-dynamic";

export default async function AccountantLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  if (session.user?.role !== "ACCOUNT_MANAGER") {
    if (session.user?.role === "AGENT") redirect("/agent");
    if (session.user?.role === "CLIENT_RELATIONS") redirect("/cr");
    if (session.user?.role === "SUPER_ADMIN" || session.user?.role === "ADMIN") redirect("/dashboard");
    if (session.user?.role === "USER") redirect("/user");
    redirect("/unauthorized");
  }

  const r = await getAllUsers();
  const users = r?.data ?? [];
  const user = users.find((u: any) => u.id === session.user.id) ?? session.user;

  return <AccountantShell user={user}>{children}</AccountantShell>;
}
