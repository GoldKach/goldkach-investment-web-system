import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { getUserById, getSession } from "@/actions/auth";
import { getPortfolioSummary, type PortfolioSummary } from "@/actions/portfolio-summary";
import { listPerformanceReports } from "@/actions/portfolioPerformanceReports";
import { listUserPortfolios } from "@/actions/user-portfolios";
import { getDepositFeeSummary } from "@/actions/deposits";
import { getMasterWalletByUser } from "@/actions/master-wallets";
import { getOnboardingByUserId } from "@/actions/onboarding-admin";
import { ClientDetail } from "./components/client-detail";

/** Build a PortfolioSummary-compatible object from listUserPortfolios + masterWallet */
function buildPortfolioSummaryFallback(
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
      returnPct: p.totalInvested > 0 ? ((p.portfolioValue - p.totalInvested) / p.totalInvested) * 100 : 0,
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

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  async function ClientWithData() {
    try {
      const [sessionResponse, userResponse, portfolioResponse, portfoliosResponse] = await Promise.all([
        getSession(),
        getUserById(id),
        getPortfolioSummary(id),
        listUserPortfolios({ userId: id, include: { portfolio: true, userAssets: true, wallet: true, subPortfolios: true } }),
      ]);

      const session = sessionResponse;
      const currentUser = session?.user;
      const currentUserRole = currentUser?.role as string | undefined;
      const currentUserId = currentUser?.id as string | undefined;

      let mainAccountBalance: number | null = null;
      if (currentUserId && (currentUserRole === "SUPER_ADMIN" || currentUserRole === "CLIENT_RELATIONS")) {
        const walletRes = await getMasterWalletByUser(currentUserId);
        if (walletRes.success && walletRes.data?.masterWallet) {
          mainAccountBalance = walletRes.data.masterWallet.balance;
        }
      }

      const user = userResponse.data;

      if (!user) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-2xl font-bold">Client Not Found</h1>
            <p className="text-muted-foreground">The client you're looking for doesn't exist.</p>
            <Link href="/dashboard/users/clients">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Clients
              </Button>
            </Link>
          </div>
        );
      }

      const portfolios = portfoliosResponse.success && portfoliosResponse.data ? portfoliosResponse.data : [];

      // Use getPortfolioSummary result; fall back to building from listUserPortfolios if it failed
      let portfolioSummary: PortfolioSummary | null =
        portfolioResponse.success && portfolioResponse.data ? portfolioResponse.data : null;

      if (!portfolioSummary && portfolios.length > 0) {
        const walletRes = await getMasterWalletByUser(id);
        const masterWallet = walletRes.success
          ? (walletRes.data as any)?.masterWallet ?? walletRes.data ?? null
          : null;
        portfolioSummary = buildPortfolioSummaryFallback(portfolios, masterWallet, user);
      }
      let reports: Record<string, any[]> = {};
      
      for (const portfolio of portfolios) {
        const res = await listPerformanceReports({ userPortfolioId: portfolio.id, period: "daily" });
        if (res.success && res.data) {
          reports[portfolio.id] = [...res.data].sort(
            (a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
          );
        }
      }

      let depositFeeSummary = null;
      const feeSummaryRes = await getDepositFeeSummary(id);
      if (feeSummaryRes.success) {
        depositFeeSummary = feeSummaryRes.data ?? null;
      }

      const allowedRoles = ["SUPER_ADMIN", "CLIENT_RELATIONS", "ADMIN", "MANAGER", "STAFF"];
      let onboardingData: { type: "individual"; data: any } | { type: "company"; data: any } | null = null;
      if (currentUserRole && allowedRoles.includes(currentUserRole.toUpperCase())) {
        const onboardingRes = await getOnboardingByUserId(user.id);
        if (onboardingRes.success && onboardingRes.data) {
          onboardingData = onboardingRes.data;
        }
      }

      return (
        <ClientDetail
          user={user}
          portfolioSummary={portfolioSummary}
          reports={reports}
          portfolios={portfolios}
          depositFeeSummary={depositFeeSummary}
          currentUserRole={currentUserRole}
          mainAccountBalance={mainAccountBalance}
          onboardingData={onboardingData}
        />
      );
    } catch (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-2xl font-bold">Error Loading Client</h1>
          <p className="text-muted-foreground">Failed to load client details.</p>
          <Link href="/dashboard/users/clients">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Clients
            </Button>
          </Link>
        </div>
      );
    }
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      <div className="flex items-center gap-4 p-4">
        <Link href="/dashboard/users/clients">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Client Details</h1>
      </div>
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        }
      >
        <ClientWithData />
      </Suspense>
    </div>
  );
}
