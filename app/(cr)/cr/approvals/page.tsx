import { getClientsForAssignmentAction } from "@/actions/staff";
import PendingApprovals from "@/components/back/pending-approval";

export const dynamic = "force-dynamic";

export default async function CRApprovalsPage() {
  const res = await getClientsForAssignmentAction();
  const all = res.data ?? [];

  const pendingOnly = all.filter(
    (u: any) =>
      u.isApproved === false ||
      u.individualOnboarding?.isApproved === false ||
      u.companyOnboarding?.isApproved === false
  );

  return (
    <div className="container mx-auto px-8 py-8">
      <PendingApprovals users={pendingOnly as any} clientBasePath="/cr/clients" />
    </div>
  );
}
