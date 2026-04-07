// app/reports/page.tsx (Server Component)
import { fetchMe, getAllUsers, getSession } from "@/actions/auth"
import { listPerformanceReports, PortfolioPerformanceReport } from "@/actions/portfolioPerformanceReports";
import { listUserPortfolios, UserPortfolioDTO } from "@/actions/user-portfolios"
import { getPortfolioSummary } from "@/actions/portfolio-summary"
import ReportsClient from "@/components/front-end/reports-client"


export default async function ReportsPage() {
  const session = await getSession();
  const userId = session?.user.id;
  const me = await fetchMe()
  const user = me?.data ?? session?.user

  // Initialize with proper defaults
  let initialReports: PortfolioPerformanceReport[] = [];
  let initialError: string | null = null;
  let portfolioId: string | null = null;
  let initialPortfolios: UserPortfolioDTO[] = [];

  try {
    // Fetch all user portfolios (include portfolio for name)
    const portfoliosResult = await listUserPortfolios({ userId, include: { portfolio: true } });

    if (!portfoliosResult.success || !portfoliosResult.data || portfoliosResult.data.length === 0) {
      initialError = "No portfolios found. Please create a portfolio first.";
    } else {
      initialPortfolios = portfoliosResult.data;
      const portfolio = portfoliosResult.data[0];
      portfolioId = portfolio.id;

      // Fetch portfolio performance reports for the first portfolio
      const reportsResult = await listPerformanceReports({
        userPortfolioId: portfolio.id,
        period: "daily"
      });

      if (reportsResult.success && reportsResult.data) {
        initialReports = reportsResult.data;
        console.log(`✅ Loaded ${reportsResult.data.length} portfolio reports`);
      } else {
        initialError = reportsResult.error || "Failed to load portfolio reports";
        console.error("❌ Failed to load reports:", reportsResult.error);
      }
    }
  } catch (error: any) {
    console.error("❌ Error in ReportsPage:", error);
    initialError = error.message || "An unexpected error occurred";
  }

  // Fetch full user details with wallet information
  const r = await getAllUsers();
  const users = r.data;

  const activeUserArray = users?.filter((x: any) => x.id === userId) || [];
  const activeUser = activeUserArray.length > 0 ? activeUserArray[0] : user;

  // Fetch portfolio summary to get asset holdings for PDF
  const summaryRes = await getPortfolioSummary(userId);
  const portfolioSummary = summaryRes.success ? summaryRes.data : null;

  console.log("Active User with Wallet:", activeUser);

  return (
    <ReportsClient
      user={activeUser}
      initialReports={initialReports}
      initialPortfolioId={portfolioId}
      initialPortfolios={initialPortfolios}
      initialError={initialError}
      portfolioSummary={portfolioSummary}
    />
  )
}