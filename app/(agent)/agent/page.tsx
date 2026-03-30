import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getAllStaffAction, getAgentClientsAction } from "@/actions/staff";
import { ClientList } from "@/components/agent/client-list";
import { ErrorSection } from "@/components/agent/error-section";

export const dynamic = "force-dynamic";

export default async function AgentHomePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Find the agent's staff record by matching user ID
  const allStaffRes = await getAllStaffAction({ role: "AGENT" });
  const staffMember = allStaffRes.data?.find((s) => s.id === session.user.id);

  if (!staffMember) {
    return (
      <ErrorSection message="No staff profile found for your account. Please contact an administrator." />
    );
  }

  // Use staffMember.id (user ID) — same as how admin staff listing calls it
  const clientsRes = await getAgentClientsAction(staffMember.id);
  if (!clientsRes.success) {
    return <ErrorSection message={clientsRes.error || "Failed to load your clients."} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">My Clients</h1>
        <p className="text-sm text-slate-400 mt-1">
          {clientsRes.data?.length ?? 0} active{" "}
          {(clientsRes.data?.length ?? 0) === 1 ? "client" : "clients"} assigned to you
        </p>
      </div>
      <ClientList assignments={clientsRes.data ?? []} />
    </div>
  );
}
