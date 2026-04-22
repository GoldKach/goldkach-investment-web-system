import { getSession } from "@/actions/auth";
import { getAgentClientsAction, getAllStaffAction } from "@/actions/staff";
import { redirect } from "next/navigation";
import { AccountantMyClientsTable } from "./components/accountant-my-clients-table";

export const dynamic = "force-dynamic";

export default async function AccountantMyClientsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Get the current Accountant staff member's ID
  const staffRes = await getAllStaffAction({ role: "ACCOUNT_MANAGER" });
  const staff = staffRes.data?.find((s) => s.id === session.user.id);

  if (!staff) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">My Clients</h1>
        <p className="text-slate-500">Unable to load your staff profile. Please contact support.</p>
      </div>
    );
  }

  // Fetch assigned clients
  const res = await getAgentClientsAction(staff.id);

  if (!res.success) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">My Clients</h1>
        <p className="text-red-500">{res.error || "Failed to load your assigned clients."}</p>
      </div>
    );
  }

  const assignments = res.data ?? [];

  return <AccountantMyClientsTable assignments={assignments} staffId={staff.id} />;
}
