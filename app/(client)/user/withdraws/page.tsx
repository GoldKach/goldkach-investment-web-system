import { getSession } from "@/actions/auth";
import { getMasterWalletByUser } from "@/actions/master-wallets";
import { listWithdrawals } from "@/actions/withdraws";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { WithdrawalsPageContent } from "./components/withdraw-page-content";

export const dynamic = "force-dynamic";

export default async function WithdrawalsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  const [walletRes, withdrawalsRes] = await Promise.all([
    getMasterWalletByUser(userId),
    listWithdrawals({
      userId,
      sortBy:   "createdAt",
      order:    "desc",
      pageSize: 100,
    }),
  ]);

  if (!walletRes.success || !walletRes.data?.masterWallet) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader>
            <CardTitle>Wallet Not Found</CardTitle>
            <CardDescription>
              {walletRes.error ?? "No master wallet found for your account. Please contact support."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const wallet      = walletRes.data.masterWallet;
  const allWithdrawals = withdrawalsRes.success ? (withdrawalsRes.data ?? []) : [];

  // Only show HARD_WITHDRAWALs on this page (redemptions are shown on portfolio pages)
  const withdrawals = allWithdrawals.filter((w) => w.withdrawalType === "HARD_WITHDRAWAL");

  return (
    <WithdrawalsPageContent
      withdrawals={withdrawals}
      wallet={{
        id:             wallet.id,
        accountNumber:  wallet.accountNumber,
        balance:        wallet.balance,
        netAssetValue:  wallet.netAssetValue,
        totalWithdrawn: wallet.totalWithdrawn,
      }}
      userId={userId}
    />
  );
}
