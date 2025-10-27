import PendingApprovals from "@/components/back/pending-approval";
import { getAllUsers } from "@/actions/auth"; // already in your project

export default async function PendingApprovalsPage() {
  const res = await getAllUsers(); // { data, error } from your action
  const all = res?.data ?? [];

  // show only pending approvals
  const pendingOnly = all.filter(
    (u: any) => u.status === "PENDING" || u?.entityOnboarding?.isApproved === false
  );

  return (
    <div className="container mx-auto py-8">
      <PendingApprovals users={pendingOnly} />
    </div>
  );
}
