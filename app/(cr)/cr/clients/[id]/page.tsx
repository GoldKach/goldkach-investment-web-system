import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { getClientsForAssignmentAction } from "@/actions/staff";
import { getPortfolioSummary, type PortfolioSummary } from "@/actions/portfolio-summary";
import { getOnboardingByUserId } from "@/actions/onboarding-admin";
import { getUserById } from "@/actions/auth";
import { listUserPortfolios } from "@/actions/user-portfolios";
import { getMasterWalletByUser } from "@/actions/master-wallets";
import { UserDetailPreview } from "@/components/user/user-detail-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, BarChart2 } from "lucide-react";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return `${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Build a PortfolioSummary-compatible object from listUserPortfolios + masterWallet */
function buildPortfolioSummaryFromPortfolios(
  portfolios: any[],
  masterWallet: any | null,
  user: any
): PortfolioSummary {
  const mapped = portfolios.map((p: any) => {
    const assets = (p.userAssets ?? []).map((a: any) => ({
      id: a.id,
      assetId: a.assetId,
      allocationPercentage: a.allocationPercentage ?? 0,
      costPerShare: a.costPerShare ?? 0,
      costPrice: a.costPrice ?? 0,
      stock: a.stock ?? 0,
      closeValue: a.closeValue ?? 0,
      lossGain: a.lossGain ?? 0,
      asset: a.asset ?? { id: a.assetId, symbol: "—", description: "—", assetClass: "—", closePrice: 0 },
    }));

    return {
      id: p.id,
      customName: p.customName,
      portfolio: p.portfolio ?? { id: p.portfolioId, name: "—", riskTolerance: "—", timeHorizon: "—" },
      wallet: p.wallet ?? null,
      totalInvested: p.totalInvested ?? 0,
      portfolioValue: p.portfolioValue ?? 0,
      totalLossGain: p.totalLossGain ?? 0,
      returnPct: p.totalInvested > 0
        ? ((p.portfolioValue - p.totalInvested) / p.totalInvested) * 100
        : 0,
      assets,
      subPortfolios: p.subPortfolios ?? [],
      topupHistory: [],
      latestReport: null,
    };
  });

  const totalInvested = mapped.reduce((s: number, p: any) => s + p.totalInvested, 0);
  const totalValue = mapped.reduce((s: number, p: any) => s + p.portfolioValue, 0);
  const totalGainLoss = mapped.reduce((s: number, p: any) => s + p.totalLossGain, 0);
  const totalFees = mapped.reduce((s: number, p: any) => s + (p.wallet?.totalFees ?? 0), 0);

  return {
    user: {
      id: user?.id ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
    },
    masterWallet: masterWallet ?? null,
    aggregate: {
      totalInvested,
      totalValue,
      totalGainLoss,
      totalFees,
      portfolioCount: mapped.length,
      returnPct: totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0,
    },
    portfolios: mapped,
  };
}

export default async function CRClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch all data in parallel
  const [clientsRes, userRes, summaryRes, onboardingRes] = await Promise.allSettled([
    getClientsForAssignmentAction(),
    getUserById(id),
    getPortfolioSummary(id),
    getOnboardingByUserId(id),
  ]);

  const clients = clientsRes.status === "fulfilled" ? (clientsRes.value?.data ?? []) : [];
  const baseUser = clients.find((c: any) => c.id === id) ?? null;
  const fullUser = userRes.status === "fulfilled" && userRes.value?.data ? userRes.value.data : null;

  // Try the fast portfolio-summary endpoint first
  let portfolioSummary: PortfolioSummary | null =
    summaryRes.status === "fulfilled" && summaryRes.value?.success
      ? (summaryRes.value.data ?? null)
      : null;

  // If it failed (likely a role restriction), build from listUserPortfolios + masterWallet
  if (!portfolioSummary) {
    const [portfoliosRes, walletRes] = await Promise.allSettled([
      listUserPortfolios({
        userId: id,
        include: { portfolio: true, userAssets: true, wallet: true, subPortfolios: true },
      }),
      getMasterWalletByUser(id),
    ]);

    const portfolios =
      portfoliosRes.status === "fulfilled" && portfoliosRes.value?.success
        ? portfoliosRes.value.data ?? []
        : [];

    const masterWallet =
      walletRes.status === "fulfilled" && walletRes.value?.success
        ? (walletRes.value.data as any)?.masterWallet ?? walletRes.value.data ?? null
        : null;

    if (portfolios.length > 0 || masterWallet) {
      const sourceUser = baseUser ?? fullUser;
      portfolioSummary = buildPortfolioSummaryFromPortfolios(portfolios, masterWallet, sourceUser);
    }
  }

  // Onboarding: embedded in baseUser first, then fullUser, then dedicated fetch
  const onboardingFromUser =
    baseUser?.individualOnboarding ?? baseUser?.companyOnboarding ??
    fullUser?.individualOnboarding ?? fullUser?.companyOnboarding ?? null;
  const onboardingFromAdmin =
    onboardingRes.status === "fulfilled" && onboardingRes.value?.success
      ? onboardingRes.value.data?.data ?? null
      : null;
  const entityOnboarding = onboardingFromUser ?? onboardingFromAdmin ?? null;

  // Build user object
  const sourceUser = baseUser ?? fullUser;
  const user = sourceUser
    ? {
        ...sourceUser,
        name: sourceUser.name || [sourceUser.firstName, sourceUser.lastName].filter(Boolean).join(" "),
        wallet: portfolioSummary?.masterWallet ?? sourceUser.masterWallet ?? null,
        masterWallet: portfolioSummary?.masterWallet ?? sourceUser.masterWallet ?? null,
        deposits: sourceUser.deposits ?? [],
        withdrawals: sourceUser.withdrawals ?? [],
        userPortfolios: portfolioSummary?.portfolios ?? sourceUser.userPortfolios ?? [],
        entityOnboarding,
      }
    : null;

  return (
    <div className="container px-4 mx-auto py-8 space-y-8">
      <Link
        href="/cr/clients"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to clients
      </Link>

      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        }
      >
        <UserDetailPreview user={user as any} portfolioSummary={portfolioSummary} />
      </Suspense>

      {/* Portfolio Reports */}
      {portfolioSummary && portfolioSummary.portfolios.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Portfolio Reports</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {portfolioSummary.portfolios.map((p) => {
              const isPositive = p.totalLossGain >= 0;
              return (
                <Card key={p.id} className="border-slate-200 dark:border-[#2B2F77]/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm font-semibold">{p.customName}</CardTitle>
                        <p className="text-xs text-slate-400 mt-0.5">{p.portfolio.name}</p>
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs font-semibold ${
                          isPositive ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-3.5 w-3.5" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5" />
                        )}
                        {p.returnPct >= 0 ? "+" : ""}
                        {p.returnPct.toFixed(2)}%
                      </div>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {p.portfolio.riskTolerance}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {p.portfolio.timeHorizon}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-slate-400">Invested</p>
                        <p className="font-semibold">{fmt(p.totalInvested)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Current Value</p>
                        <p className="font-semibold">{fmt(p.portfolioValue)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">NAV</p>
                        <p className="font-semibold">{fmt(p.wallet?.netAssetValue ?? 0)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Gain/Loss</p>
                        <p
                          className={`font-semibold ${
                            isPositive ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {fmt(p.totalLossGain)}
                        </p>
                      </div>
                    </div>
                    {p.latestReport && (
                      <div className="text-xs text-slate-400 border-t border-slate-100 dark:border-[#2B2F77]/20 pt-2">
                        Latest report: {new Date(p.latestReport.reportDate).toLocaleDateString()}
                      </div>
                    )}
                    <Link href={`/cr/clients/${id}/portfolios/${p.id}/reports`}>
                      <Button size="sm" variant="outline" className="w-full gap-2 mt-1">
                        <BarChart2 className="h-4 w-4" /> View Performance Reports
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
