import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getSession } from "@/actions/auth";
import { getPortfolioSummary } from "@/actions/portfolio-summary";
import { getLatestPerformanceReport, listPerformanceReports } from "@/actions/portfolioPerformanceReports";
import { PortfolioPerformanceView } from "@/components/agent/portfolio-performance-view";
import { ErrorSection } from "@/components/agent/error-section";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string; portfolioId: string }>;
}

function fmt(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function CRPortfolioReportsPage({ params }: Props) {
  const { id: userId, portfolioId } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const [latestRes, historyRes, summaryRes] = await Promise.allSettled([
    getLatestPerformanceReport(portfolioId),
    listPerformanceReports({ userPortfolioId: portfolioId, period: "monthly" }),
    getPortfolioSummary(userId),
  ]);

  if (historyRes.status === "rejected" || (historyRes.status === "fulfilled" && !historyRes.value?.success)) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        <Link href={`/cr/clients/${userId}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to client
        </Link>
        <ErrorSection message="Failed to load performance reports." />
      </div>
    );
  }

  const portfolioSummary = summaryRes.status === "fulfilled" && summaryRes.value?.success ? summaryRes.value.data : null;
  const portfolioItem = portfolioSummary?.portfolios.find((p) => p.id === portfolioId);

  const userPortfolio = portfolioItem
    ? {
        id: portfolioItem.id, userId, portfolioId: portfolioItem.portfolio.id,
        customName: portfolioItem.customName, portfolioValue: portfolioItem.portfolioValue,
        totalInvested: portfolioItem.totalInvested, totalLossGain: portfolioItem.totalLossGain,
        isActive: true, portfolio: portfolioItem.portfolio,
        userAssets: portfolioItem.assets.map((a) => ({
          id: a.id, userPortfolioId: portfolioId, assetId: a.assetId,
          allocationPercentage: a.allocationPercentage, costPerShare: a.costPerShare,
          costPrice: a.costPrice, stock: a.stock, closeValue: a.closeValue, lossGain: a.lossGain,
          asset: a.asset ? { ...a.asset, sector: "", defaultCostPerShare: a.costPerShare } : undefined,
        })),
        wallet: portfolioItem.wallet ? { id: portfolioItem.wallet.id, netAssetValue: portfolioItem.wallet.netAssetValue, totalFees: portfolioItem.wallet.totalFees, balance: portfolioItem.wallet.balance } : null,
      }
    : { id: portfolioId, userId, portfolioId: "", customName: "Portfolio", portfolioValue: 0, totalInvested: 0, totalLossGain: 0, isActive: true, portfolio: null, userAssets: [], wallet: null };

  const latestReport = latestRes.status === "fulfilled" && latestRes.value?.success ? latestRes.value.data ?? null : null;
  const initialReports = historyRes.status === "fulfilled" && historyRes.value?.data
    ? [...historyRes.value.data].sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
    : [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Link href={`/cr/clients/${userId}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to client
      </Link>

      {portfolioItem && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Invested", value: fmt(portfolioItem.totalInvested) },
            { label: "Current Value", value: fmt(portfolioItem.portfolioValue) },
            { label: "Gain / Loss", value: fmt(portfolioItem.totalLossGain), color: portfolioItem.totalLossGain >= 0 ? "text-green-600" : "text-red-500" },
            { label: "Return", value: `${portfolioItem.returnPct >= 0 ? "+" : ""}${portfolioItem.returnPct.toFixed(2)}%`, color: portfolioItem.returnPct >= 0 ? "text-green-600" : "text-red-500" },
          ].map((m) => (
            <Card key={m.label}>
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-slate-400">{m.label}</p>
                <p className={`text-lg font-bold mt-0.5 ${m.color ?? "text-slate-800 dark:text-white"}`}>{m.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PortfolioPerformanceView
        userPortfolioId={portfolioId}
        clientId={userId}
        latestReport={latestReport}
        userPortfolio={userPortfolio}
        initialReports={initialReports}
        initialPeriod="monthly"
      />
    </div>
  );
}
