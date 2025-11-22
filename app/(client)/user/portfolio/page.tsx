
import { getSession } from "@/actions/auth";
import { listUserPortfolios } from "@/actions/user-portfolios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioList } from "@/components/user/portfolio-content";
import { redirect } from "next/navigation";

export default async function PortfolioPage() {
  // Get session and handle authentication
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch portfolios
  const portfolios = await listUserPortfolios();

  // Handle errors
  if (portfolios.error || !portfolios.data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Portfolios</CardTitle>
            <CardDescription>
              {portfolios.error || "Unable to load portfolio data. Please try again later."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Filter portfolios for current user
  const userPortfolios = portfolios.data.filter(
    (portfolio) => portfolio.userId === userId
  );

  return (
    <div className="min-h-screen bg-background">
      <PortfolioList userPortfolios={userPortfolios} />
    </div>
  );
}