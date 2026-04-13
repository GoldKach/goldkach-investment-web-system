import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getClientsForAssignmentAction } from "@/actions/staff";
import { getPortfolioSummary } from "@/actions/portfolio-summary";
import { AccountantReports } from "./components/accountant-reports";

export const dynamic = "force-dynamic";

export default async function AccountantReportsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const clientsRes = await getClientsForAssignmentAction();
  const clients = (clientsRes.data ?? []).filter((c: any) => !c.role || c.role === "USER");

  // Fetch portfolio summaries for all clients
  const summaryResults = await Promise.allSettled(
    clients.slice(0, 25).map((c: any) => getPortfolioSummary(c.id))
  );

  const clientPortfolios = summaryResults
    .map((r, i) => ({
      client: clients[i],
      portfolios: r.status === "fulfilled" && r.value?.success
        ? (r.value.data?.portfolios ?? [])
        : [],
      masterWallet: r.status === "fulfilled" && r.value?.success
        ? r.value.data?.masterWallet ?? null
        : null,
    }))
    .filter((x) => x.portfolios.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Performance Reports</h1>
        <p className="text-sm text-slate-400 mt-1">
          View and download portfolio performance reports for all clients
        </p>
      </div>
      <AccountantReports clientPortfolios={clientPortfolios} />
    </div>
  );
}
