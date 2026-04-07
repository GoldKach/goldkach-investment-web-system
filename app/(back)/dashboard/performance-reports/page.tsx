import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getClientsForAssignmentAction } from "@/actions/staff";
import { getPortfolioSummary } from "@/actions/portfolio-summary";
import { listPerformanceReports } from "@/actions/portfolioPerformanceReports";
import { PerformanceReportsManager } from "./components/performance-reports-manager";

export const dynamic = "force-dynamic";

export default async function PerformanceReportsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const clientsRes = await getClientsForAssignmentAction();
  const clients = (clientsRes.data ?? []).filter((c: any) => !c.role || c.role === "USER");

  // Fetch portfolio summaries for all clients
  const summaryResults = await Promise.allSettled(
    clients.slice(0, 30).map((c: any) => getPortfolioSummary(c.id))
  );

  const clientPortfoliosRaw = summaryResults
    .map((r, i) => ({
      client: clients[i],
      portfolios: r.status === "fulfilled" && r.value?.success
        ? (r.value.data?.portfolios ?? [])
        : [],
    }))
    .filter((x) => x.portfolios.length > 0);

  // Fetch recent reports for each portfolio (monthly, last 6)
  const allPortfolioIds = clientPortfoliosRaw.flatMap((cp) => cp.portfolios.map((p: any) => p.id));

  const reportResults = await Promise.allSettled(
    allPortfolioIds.map((id: string) =>
      listPerformanceReports({ userPortfolioId: id, period: "monthly" })
    )
  );

  const reportsByPortfolio: Record<string, any[]> = {};
  allPortfolioIds.forEach((id: string, i: number) => {
    const r = reportResults[i];
    reportsByPortfolio[id] =
      r.status === "fulfilled" && r.value?.success
        ? (r.value.data ?? []).sort(
            (a: any, b: any) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
          ).slice(0, 6)
        : [];
  });

  // Attach reports to each portfolio
  const clientPortfolios = clientPortfoliosRaw.map((cp) => ({
    ...cp,
    portfolios: cp.portfolios.map((p: any) => ({
      ...p,
      reports: reportsByPortfolio[p.id] ?? [],
    })),
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Performance Reports</h1>
        <p className="text-sm text-slate-400 mt-1">
          View, generate and manage portfolio performance reports
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
