import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { CRPendingApprovalsShell } from "@/components/back/cr-approvals-shell";

export const dynamic = "force-dynamic";

export default async function CRApprovalsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="container mx-auto px-8 py-8">
      <CRPendingApprovalsShell />
    </div>
  );
}
