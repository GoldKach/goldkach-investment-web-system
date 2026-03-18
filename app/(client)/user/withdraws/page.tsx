

// app/user/withdraws/page.tsx
import { getAllUsers, getSession } from "@/actions/auth";
import { listWithdrawals } from "@/actions/withdraws";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { WithdrawalsPageContent } from "./components/withdraw-page-content";
import { listUserPortfolios } from "@/actions/user-portfolios";

export default async function WithdrawalsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const users = await getAllUsers();
  const user = users.data?.find((u: any) => u.id === session?.user?.id);

  if (!user || !user.wallet) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Wallet Not Found</CardTitle>
            <CardDescription>
              No wallet found for your account. Please contact support.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const userId = session.user.id;

  // Fetch user portfolios to calculate total loss/gain
  const portfolios = await listUserPortfolios();
  const userPortfolios = portfolios?.data?.filter(
    (portfolio: any) => portfolio.userId === userId
  );

  // Calculate total loss/gain across all portfolios
  const totalLossGain = userPortfolios?.reduce((sum: number, up: any) => {
    const portfolioLossGain = (up.userAssets ?? []).reduce(
      (assetSum: number, asset: any) => assetSum + (asset.lossGain ?? 0),
      0
    );
    return sum + portfolioLossGain;
  }, 0) ?? 0;

  const wallet = user.wallet;

  // Available balance = netAssetValue + total portfolio gain/loss
  const availableBalance = (wallet.netAssetValue ?? 0) + totalLossGain;

  const result = await listWithdrawals({
    userId: userId,
    include: ["user", "wallet"],
  });

  if (!result.success || !result.data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Withdrawals</CardTitle>
            <CardDescription>
              {result.error || "Unable to load withdrawal data. Please try again later."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const userData = {
    id: userId,
    walletId: wallet.id,
    accountNumber: wallet.accountNumber,
    availableBalance,            // netAssetValue + lossGain
    totalBalance: wallet.balance ?? 0,
    netAssetValue: wallet.netAssetValue ?? 0,
    totalLossGain,               // exposed in case the UI wants to show it separately
  };

  return <WithdrawalsPageContent withdrawals={result.data} user={userData} />;
}