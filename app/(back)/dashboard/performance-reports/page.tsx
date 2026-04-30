import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getClientsForAssignmentAction } from "@/actions/staff";
import { getPortfolioSummary } from "@/actions/portfolio-summary";
import { listUserPortfolios } from "@/actions/user-portfolios";
import { getMasterWalletByUser } from "@/actions/master-wallets";
import { getDepositFeeSummary } from "@/actions/deposits";
import { AccountantReports } from "@/components/back/aum-reports";

export const dynamic = "force-dynamic";

/** Process an array in batches to avoid overwhelming the API */
async function batchSettled<T>(
  items: any[],
  fn: (item: any) => Promise<T>,
  batchSize = 10
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);
    const chunkResults = await Promise.allSettled(chunk.map(fn));
    results.push(...chunkResults);
  }
  return results;
}

export default async function PerformanceReportsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const clientsRes = await getClientsForAssignmentAction();
  const clients = (clientsRes.data ?? []).filter((c: any) => !c.role || c.role === "USER");

  // Fetch portfolio summaries in batches of 10 — same as accountant page
  const summaryResults = await batchSettled(
    clients,
    (c: any) => getPortfolioSummary(c.id),
    10
  );

  const clientPortfolios = await Promise.all(
    summaryResults.map(async (r, i) => {
      const client = clients[i];

      const [portfoliosRes, depositFeeRes] = await Promise.allSettled([
        listUserPortfolios({
          userId: client.id,
          include: { portfolio: true, userAssets: true, wallet: true },
        }),
        getDepositFeeSummary(client.id),
      ]);

      const portfoliosWithWallets: any[] =
        portfoliosRes.status === "fulfilled" && portfoliosRes.value?.success
          ? (portfoliosRes.value.data ?? [])
          : [];

      const depositFeeSummary =
        depositFeeRes.status === "fulfilled" && depositFeeRes.value?.success
          ? depositFeeRes.value.data ?? null
          : null;

      const feeTotals = portfoliosWithWallets.reduce(
        (acc, p) => ({
          bankFee:       acc.bankFee       + (p.wallet?.bankFee       ?? 0),
          transactionFee: acc.transactionFee + (p.wallet?.transactionFee ?? 0),
          feeAtBank:     acc.feeAtBank     + (p.wallet?.feeAtBank     ?? 0),
        }),
        { bankFee: 0, transactionFee: 0, feeAtBank: 0 }
      );

      if (r.status === "fulfilled" && r.value?.success && r.value.data?.portfolios?.length) {
        return {
          client,
          portfolios:      r.value.data.portfolios,
          masterWallet:    r.value.data.masterWallet ?? null,
          feeTotals,
          depositFeeSummary,
        };
      }

      // Fallback
      const walletRes = await getMasterWalletByUser(client.id);
      const masterWallet = walletRes.success
        ? (walletRes.data as any)?.masterWallet ?? walletRes.data ?? null
        : null;

      return { client, portfolios: portfoliosWithWallets, masterWallet, feeTotals, depositFeeSummary };
    })
  );

  const withPortfolios = clientPortfolios.filter((x) => x.portfolios.length > 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Performance Reports</h1>
        <p className="text-sm text-slate-400 mt-1">
          View, generate and download portfolio performance reports for all clients
        </p>
      </div>
      <AccountantReports clientPortfolios={withPortfolios} />
    </div>
  );
}
