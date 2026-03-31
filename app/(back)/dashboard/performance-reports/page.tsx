import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getClientsForAssignmentAction } from "@/actions/staff";
import { getPortfolioSummary } from "@/actions/portfolio-summary";
import { PerformanceReportsManager } from "./components/performance-reports-manager";

export const dynamic = "force-dynamic";

export default async function PerformanceReportsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const clientsRes = await getClientsForAssignmentAction();
  const clients = (clientsRes.data ?? []).filter((c: any) => !c.role || c.role === "USER");

  // Fetch portfolio summaries for all clients to get portfolio IDs
  const summaryResults = await Promise.allSettled(
    clients.slice(0, 30).map((c: any) => getPortfolioSummary(c.id))
  );

  const clientPortfolios = summaryResults
    .map((r, i) => ({
      client: clients[i],
      portfolios: r.status === "fulfilled" && r.value?.success
        ? (r.value.data?.portfolios ?? [])
        : [],
    }))
    .filter((x) => x.portfolios.length > 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Performance Reports</h1>
        <p className="text-sm text-slate-400 mt-1">
          Generate portfolio performance reports for individual clients or all portfolios at once
        </p>
      </div>
      <PerformanceReportsManager
        clientPortfolios={clientPortfolios}
        adminId={session.user.id}
        adminName={session.user.name || session.user.email || "Admin"}
      />
    </div>
  );
}
