import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getClientsForAssignmentAction } from "@/actions/staff";
import { getPortfolioSummary } from "@/actions/portfolio-summary";
import { listUserPortfolios } from "@/actions/user-portfolios";
import { getMasterWalletByUser } from "@/actions/master-wallets";
import { getDepositFeeSummary } from "@/actions/deposits";
import { AccountantReports } from "./components/accountant-reports";

export const dynamic = "force-dynamic";

export default async function AccountantReportsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const clientsRes = await getClientsForAssignmentAction();
  const clients = (clientsRes.data ?? []).filter((c: any) => !c.role || c.role === "USER");

  // Fetch portfolio summaries for ALL clients — no slice limit
  const summaryResults = await Promise.allSettled(
    clients.map((c: any) => getPortfolioSummary(c.id))
  );

  // For clients where getPortfolioSummary failed, fall back to listUserPortfolios
  const clientPortfolios = await Promise.all(
    summaryResults.map(async (r, i) => {
      const client = clients[i];

      // Always fetch portfolio wallets with fee breakdown (bankFee, transactionFee, feeAtBank)
      // AND deposit fee summary (the authoritative source for bank/transaction/cash fees)
      const [portfoliosRes, depositFeeRes] = await Promise.allSettled([
        listUserPortfolios({
          userId: client.id,
          include: { portfolio: true, userAssets: true, wallet: true },
        }),
        getDepositFeeSummary(client.id),
      ]);
      const portfoliosWithWallets: any[] = portfoliosRes.status === "fulfilled" && portfoliosRes.value?.success
        ? (portfoliosRes.value.data ?? [])
        : [];
      const depositFeeSummary = depositFeeRes.status === "fulfilled" && depositFeeRes.value?.success
        ? depositFeeRes.value.data ?? null
        : null;

      // Sum fee totals across all portfolio wallets for this client (fallback if no deposit summary)
      const feeTotals = portfoliosWithWallets.reduce(
        (acc, p) => ({
          bankFee: acc.bankFee + (p.wallet?.bankFee ?? 0),
          transactionFee: acc.transactionFee + (p.wallet?.transactionFee ?? 0),
          feeAtBank: acc.feeAtBank + (p.wallet?.feeAtBank ?? 0),
        }),
        { bankFee: 0, transactionFee: 0, feeAtBank: 0 }
      );

      if (r.status === "fulfilled" && r.value?.success && r.value.data?.portfolios?.length) {
        return {
          client,
          portfolios: r.value.data.portfolios,
          masterWallet: r.value.data.masterWallet ?? null,
          feeTotals,
          depositFeeSummary,
        };
      }

      // Full fallback
      const walletRes = await getMasterWalletByUser(client.id);
      const masterWallet = walletRes.success
        ? (walletRes.data as any)?.masterWallet ?? walletRes.data ?? null
        : null;

      return { client, portfolios: portfoliosWithWallets, masterWallet, feeTotals, depositFeeSummary };
    })
  );

  // Only include clients that have at least one portfolio
  const withPortfolios = clientPortfolios.filter((x) => x.portfolios.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Performance Reports</h1>
        <p className="text-sm text-slate-400 mt-1">
          View and download portfolio performance reports for all clients
        </p>
      </div>
      <AccountantReports clientPortfolios={withPortfolios} />
    </div>
  );
}
