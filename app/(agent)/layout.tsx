import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getAllStaffAction, getAgentClientsAction } from "@/actions/staff";
import AgentShell from "@/components/agent/agent-shell";

export const dynamic = "force-dynamic";

export default async function AgentLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user?.role !== "AGENT") redirect("/unauthorized");

  // Find the agent's staff record by matching user ID across all agents
  const allStaffRes = await getAllStaffAction({ role: "AGENT" });
  const staff = allStaffRes.data?.find((s) => s.id === session.user.id);

  if (!staff) redirect("/unauthorized");

  const staffProfileId = staff.id; // user ID — what the /staff/:id/clients endpoint expects
  let activeClientCount = 0;
  if (staffProfileId) {
    const clientsRes = await getAgentClientsAction(staffProfileId);
    if (clientsRes.success && clientsRes.data) {
      activeClientCount = clientsRes.data.length;
    }
  }

  return (
    <AgentShell staff={staff} activeClientCount={activeClientCount}>
      {children}
    </AgentShell>
  );
}
