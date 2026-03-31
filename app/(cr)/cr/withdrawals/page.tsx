import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { listWithdrawals } from "@/actions/withdraws";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WithdrawalsContent } from "@/app/(back)/dashboard/withdrawals/components/withdrawals-content";

export const dynamic = "force-dynamic";

export default async function CRWithdrawalsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const result = await listWithdrawals({
    sortBy: "createdAt",
    order: "desc",
    include: ["user", "masterWallet", "portfolioWallet", "userPortfolio"],
  });

  if (!result.success || !result.data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Withdrawals</CardTitle>
            <CardDescription>{result.error ?? "Unable to load withdrawal data."}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <WithdrawalsContent
      withdrawals={result.data}
      adminId={session.user.id}
      adminName={session.user.name || session.user.email || "CR Staff"}
    />
  );
}
