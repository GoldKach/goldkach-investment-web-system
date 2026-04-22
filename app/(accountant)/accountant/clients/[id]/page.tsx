import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getSession } from "@/actions/auth";
import { getUserById } from "@/actions/auth";
import { getPortfolioSummary, type PortfolioSummary } from "@/actions/portfolio-summary";
import { listUserPortfolios } from "@/actions/user-portfolios";
import { listPerformanceReports } from "@/actions/portfolioPerformanceReports";
import { getMasterWalletByUser } from "@/actions/master-wallets";
import { getOnboardingByUserId } from "@/actions/onboarding-admin";
import { UserDetailPreview } from "@/components/user/user-detail-view";
import { AccountantReportsSection } from "./components/accountant-reports-section";

export const dynamic = "force-dynamic";

function buildFallback(portfolios: any[], masterWallet: any, user: any): PortfolioSummary {
  const mapped = portfolios.map((p: any) => ({
    id: p.id,
    customName: p.customName,
    portfolio: p.portfolio ?? { id: p.portfolioId, name: "—", riskTolerance: "—", timeHorizon: "—" },
    wallet: p.wallet ?? null,
    totalInvested: p.totalInvested ?? 0,
    portfolioValue: p.portfolioValue ?? 0,
    totalLossGain: p.totalLossGain ?? 0,
    returnPct: p.totalInvested > 0 ? ((p.portfolioValue - p.totalInvested) / p.totalInvested) * 100 : 0,
    assets: (p.userAssets ?? []).map((a: any) => ({
      id: a.id, assetId: a.assetId,
      allocationPercentage: a.allocationPercentage ?? 0,
      costPerShare: a.costPerShare ?? 0,
      costPrice: a.costPrice ?? 0,
      stock: a.stock ?? 0,
      closeValue: a.closeValue ?? 0,
      lossGain: a.lossGain ?? 0,
      asset: a.asset ?? { id: a.assetId, symbol: "—", description: "—", assetClass: "—", closePrice: 0 },
    })),
    subPortfolios: p.subPortfolios ?? [],
    topupHistory: [],
    latestReport: null,
  }));
  const totalInvested = mapped.reduce((s, p) => s + p.totalInvested, 0);
  const totalValue    = mapped.reduce((s, p) => s + p.portfolioValue, 0);
  const totalGainLoss = mapped.reduce((s, p) => s + p.totalLossGain, 0);
  const totalFees     = mapped.reduce((s, p) => s + (p.wallet?.totalFees ?? 0), 0);
  return {
    user: { id: user?.id ?? "", firstName: user?.firstName ?? "", lastName: user?.lastName ?? "", email: user?.email ?? "" },
    masterWallet: masterWallet ?? null,
    aggregate: {
      totalInvested, totalValue, totalGainLoss, totalFees,
      portfolioCount: mapped.length,
      returnPct: totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0,
    },
    portfolios: mapped,
  };
}

export default async function AccountantClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const [userRes, summaryRes, portfoliosRes, onboardingRes] = await Promise.allSettled([
    getUserById(id),
    getPortfolioSummary(id),
    listUserPortfolios({ userId: id, include: { portfolio: true, userAssets: true, wallet: true, subPortfolios: true } }),
    getOnboardingByUserId(id),
  ]);

  const user = userRes.status === "fulfilled" ? userRes.value?.data ?? null : null;
  const portfoliosList = portfoliosRes.status === "fulfilled" && portfoliosRes.value?.success
    ? portfoliosRes.value.data ?? []
    : [];

  let portfolioSummary: PortfolioSummary | null =
    summaryRes.status === "fulfilled" && summaryRes.value?.success
      ? (summaryRes.value.data ?? null)
      : null;

  if (!portfolioSummary && portfoliosList.length > 0) {
    const walletRes = await getMasterWalletByUser(id);
    const masterWallet = walletRes.success
      ? (walletRes.data as any)?.masterWallet ?? walletRes.data ?? null
      : null;
    portfolioSummary = buildFallback(portfoliosList, masterWallet, user);
  }

  // Fetch performance reports for each portfolio
  const reports: Record<string, any[]> = {};
  for (const portfolio of portfoliosList) {
    const res = await listPerformanceReports({ userPortfolioId: portfolio.id, period: "daily" });
    if (res.success && res.data) {
      reports[portfolio.id] = [...res.data].sort(
        (a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
      );
    }
  }

  const onboardingData =
    onboardingRes.status === "fulfilled" && onboardingRes.value?.success
      ? onboardingRes.value.data
      : null;

  // Build user object for UserDetailPreview
  const individual = (user as any)?.individualOnboarding;
  const company    = (user as any)?.companyOnboarding;
  const entityOnboarding =
    onboardingData?.data ||
    (individual ? { ...individual, entityType: "individual", sourceOfWealth: individual.sourceOfIncome } : null) ||
    (company    ? { ...company,    entityType: "company",    sourceOfWealth: company.sourceOfIncome    } : null) ||
    null;

  const enrichedUser = user
    ? {
        ...user,
        wallet: portfolioSummary?.masterWallet ?? user.masterWallet ?? null,
        masterWallet: portfolioSummary?.masterWallet ?? user.masterWallet ?? null,
        entityOnboarding,
      }
    : null;

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
    : "Client";

  return (
    <div className="space-y-6 p-6">
      <Link
        href="/accountant/clients"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to clients
      </Link>

      {enrichedUser ? (
        <>
          <UserDetailPreview user={enrichedUser as any} portfolioSummary={portfolioSummary} />

          {/* Performance Reports */}
          <AccountantReportsSection
            portfolios={portfoliosList as any[]}
            reports={reports}
            client={user}
            masterWallet={portfolioSummary?.masterWallet ?? null}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <p>Client not found.</p>
        </div>
      )}
    </div>
  );
}
