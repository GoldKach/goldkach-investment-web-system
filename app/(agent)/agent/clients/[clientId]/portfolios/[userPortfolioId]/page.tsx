import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getSession } from "@/actions/auth";
import {
  getLatestPerformanceReport,
  listPerformanceReports,
} from "@/actions/portfolioPerformanceReports";
import { getPortfolioSummary } from "@/actions/portfolio-summary";
import { PortfolioPerformanceView } from "@/components/agent/portfolio-performance-view";
import { ErrorSection } from "@/components/agent/error-section";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ clientId: string; userPortfolioId: string }>;
}

export default async function PortfolioPerformancePage({ params }: Props) {
  const { clientId, userPortfolioId } = await params;

  const session = await getSession();
  if (!session) redirect("/login");

  const [latestRes, historyRes, summaryRes] = await Promise.allSettled([
    getLatestPerformanceReport(userPortfolioId),
    listPerformanceReports({ userPortfolioId, period: "monthly" }),
    getPortfolioSummary(clientId),
  ]);

  if (historyRes.status === "rejected" || (historyRes.status === "fulfilled" && !historyRes.value?.success)) {
    return (
      <div className="space-y-4">
        <BackLink clientId={clientId} />
        <ErrorSection message="Failed to load performance reports." />
      </div>
    );
  }

  // Find the specific portfolio from the summary
  const portfolioSummary =
    summaryRes.status === "fulfilled" && summaryRes.value?.success
      ? summaryRes.value.data
      : null;

  const portfolioItem = portfolioSummary?.portfolios.find((p) => p.id === userPortfolioId);

  // Build a UserPortfolio shape from the summary item
  const userPortfolio = portfolioItem
    ? {
        id: portfolioItem.id,
        userId: clientId,
        portfolioId: portfolioItem.portfolio.id,
        customName: portfolioItem.customName,
        portfolioValue: portfolioItem.portfolioValue,
        totalInvested: portfolioItem.totalInvested,
        totalLossGain: portfolioItem.totalLossGain,
        isActive: true,
        portfolio: portfolioItem.portfolio,
        userAssets: portfolioItem.assets.map((a) => ({
          id: a.id,
          userPortfolioId,
          assetId: a.assetId,
          allocationPercentage: a.allocationPercentage,
          costPerShare: a.costPerShare,
          costPrice: a.costPrice,
          stock: a.stock,
          closeValue: a.closeValue,
          lossGain: a.lossGain,
          asset: a.asset
            ? { ...a.asset, sector: "", defaultCostPerShare: a.costPerShare }
            : undefined,
        })),
        wallet: portfolioItem.wallet
          ? {
              id: portfolioItem.wallet.id,
              netAssetValue: portfolioItem.wallet.netAssetValue,
              totalFees: portfolioItem.wallet.totalFees,
              balance: portfolioItem.wallet.balance,
            }
          : null,
      }
    : {
        id: userPortfolioId,
        userId: clientId,
        portfolioId: "",
        customName: "Portfolio",
        portfolioValue: 0,
        totalInvested: 0,
        totalLossGain: 0,
        isActive: true,
        portfolio: null,
        userAssets: [],
        wallet: null,
      };

  const latestReport =
    latestRes.status === "fulfilled" && latestRes.value?.success
      ? latestRes.value.data ?? null
      : null;

  const initialReports = historyRes.status === "fulfilled" && historyRes.value?.data
    ? [...historyRes.value.data].sort(
        (a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
      )
    : [];

  return (
    <div className="space-y-6">
      <BackLink clientId={clientId} />
      <PortfolioPerformanceView
        userPortfolioId={userPortfolioId}
        clientId={clientId}
        latestReport={latestReport}
        userPortfolio={userPortfolio}
        initialReports={initialReports}
        initialPeriod="monthly"
      />
    </div>
  );
}

function BackLink({ clientId }: { clientId: string }) {
  return (
    <Link
      href={`/agent/clients/${clientId}`}
      className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
    >
      <ChevronLeft className="h-4 w-4" />
      Back to client
    </Link>
  );
}
