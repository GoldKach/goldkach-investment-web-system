import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { WithdrawalsShell } from "@/app/(back)/dashboard/withdrawals/components/withdrawals-shell";

export const dynamic = "force-dynamic";

export default async function CRWithdrawalsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <WithdrawalsShell
      adminId={session.user.id}
      adminName={(session.user as any)?.name || session.user.email || "CR Staff"}
    />
  );
}
