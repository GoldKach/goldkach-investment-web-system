import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { getClientsForAssignmentAction } from "@/actions/staff";
import { getPortfolioSummary } from "@/actions/portfolio-summary";
import { fetchMyIndividualOnboarding, fetchMyCompanyOnboarding } from "@/actions/onboarding";
import { UserDetailPreview } from "@/components/user/user-detail-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, BarChart2 } from "lucide-react";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return `${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function CRClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch all data in parallel — use endpoints accessible to CR role
  const [clientsRes, summaryRes, individualRes, companyRes] = await Promise.allSettled([
    getClientsForAssignmentAction(),
    getPortfolioSummary(id),
    fetchMyIndividualOnboarding(id),
    fetchMyCompanyOnboarding(id),
  ]);

  const clients = clientsRes.status === "fulfilled" ? (clientsRes.value?.data ?? []) : [];
  const baseUser = clients.find((c: any) => c.id === id) ?? null;

  const portfolioSummary =
    summaryRes.status === "fulfilled" && summaryRes.value?.success
      ? summaryRes.value.data
      : null;

  const individualOnboarding =
    individualRes.status === "fulfilled" && individualRes.value?.success
      ? individualRes.value.data
      : null;

  const companyOnboarding =
    companyRes.status === "fulfilled" && companyRes.value?.success
      ? companyRes.value.data
      : null;

  // Build a full user object that UserDetailPreview expects
  const user = baseUser
    ? {
        ...baseUser,
        name: baseUser.name || [baseUser.firstName, baseUser.lastName].filter(Boolean).join(" "),
        wallet: portfolioSummary?.masterWallet ?? null,
        masterWallet: portfolioSummary?.masterWallet ?? null,
        deposits: [],
        withdrawals: [],
        userPortfolios: portfolioSummary?.portfolios ?? [],
        // Attach onboarding data — UserDetailPreview reads entityOnboarding
        entityOnboarding: individualOnboarding ?? companyOnboarding ?? null,
        individualOnboarding: individualOnboarding ?? null,
        companyOnboarding: companyOnboarding ?? null,
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
        <UserDetailPreview user={user as any} />
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
