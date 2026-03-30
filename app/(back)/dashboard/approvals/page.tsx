import PendingApprovals from "@/components/back/pending-approval";
import { getAllUsers } from "@/actions/auth"; // already in your project

export default async function PendingApprovalsPage() {
  const res = await getAllUsers(); // { data, error } from your action
  const all = res?.data ?? [];

  // show only accounts that are not approved
  const pendingOnly = all.filter(
    (u: any) =>
      u.isApproved === false ||
      u.individualOnboarding?.isApproved === false ||
      u.companyOnboarding?.isApproved === false
  );

  return (
    <div className="container mx-auto px-8 py-8">
      <PendingApprovals users={pendingOnly} />
    </div>
  );
}
