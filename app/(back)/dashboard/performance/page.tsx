import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { listAssets } from "@/actions/assets";
import { getClientsForAssignmentAction } from "@/actions/staff";
import { getPortfolioSummary } from "@/actions/portfolio-summary";
import { PerformanceDashboard } from "./components/performance-dashboard";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  // Fetch assets and clients in parallel
  const [assetsRes, clientsRes] = await Promise.all([
    listAssets(),
    getClientsForAssignmentAction(),
  ]);

  const assets = assetsRes.success ? (assetsRes.data ?? []) : [];
  const clients = clientsRes.success ? (clientsRes.data ?? []) : [];

  // Fetch portfolio summaries for all clients (limit to first 20 to avoid timeout)
  const clientSample = clients.slice(0, 20);
  const summaryResults = await Promise.allSettled(
    clientSample.map((c: any) => getPortfolioSummary(c.id))
  );

  const portfolioSummaries = summaryResults
    .map((r, i) => ({
      client: clientSample[i],
      summary: r.status === "fulfilled" && r.value?.success ? r.value.data : null,
    }))
    .filter((x) => x.summary !== null);

  return (
    <PerformanceDashboard
      assets={assets}
      portfolioSummaries={portfolioSummaries as any[]}
    />
  );
}
