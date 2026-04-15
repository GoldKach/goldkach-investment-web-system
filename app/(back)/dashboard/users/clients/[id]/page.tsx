import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/actions/auth";
import { getPortfolioSummary } from "@/actions/portfolio-summary";
import { listPerformanceReports } from "@/actions/portfolioPerformanceReports";
import { listUserPortfolios } from "@/actions/user-portfolios";
import { getDepositFeeSummary } from "@/actions/deposits";
import { ClientDetail } from "./components/client-detail";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  async function ClientWithData() {
    try {
      const [userResponse, portfolioResponse, portfoliosResponse] = await Promise.all([
        getUserById(id),
        getPortfolioSummary(id),
        listUserPortfolios({ userId: id, include: { portfolio: true, userAssets: true } }),
      ]);

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

      return (
        <ClientDetail
          user={user}
          portfolioSummary={portfolioResponse.success ? portfolioResponse.data : null}
          reports={reports}
          portfolios={portfolios}
          depositFeeSummary={depositFeeSummary}
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
