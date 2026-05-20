import { getSession } from "@/actions/auth";
import { redirect } from "next/navigation";
import { WithdrawalsShell } from "./components/withdrawals-shell";

export const dynamic = "force-dynamic";

export default async function WithdrawalsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const role = (session.user as any)?.role;
  const adminRoles = ["ADMIN", "SUPER_ADMIN", "MANAGER"];
  if (!adminRoles.includes(role)) {
    if (role === "AGENT") redirect("/agent");
    if (role === "CLIENT_RELATIONS") redirect("/cr");
    if (role === "ACCOUNT_MANAGER") redirect("/accountant");
    if (role === "USER") redirect("/user");
    redirect("/unauthorized");
  }

  return (
    <WithdrawalsShell
      adminId={session.user.id}
      adminName={(session.user as any)?.name || session.user.email || "Admin"}
    />
  );
}
