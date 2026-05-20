import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { DepositsShell } from "@/app/(back)/dashboard/deposits/components/deposits-shell";

export const dynamic = "force-dynamic";

export default async function CRDepositsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <DepositsShell
      adminId={session.user.id}
      adminName={(session.user as any)?.name || session.user.email || "CR Staff"}
    />
  );
}
