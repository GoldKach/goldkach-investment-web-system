import { getSession } from "@/actions/auth";
import { listWithdrawals } from "@/actions/withdraws";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { WithdrawalsContent } from "./components/withdrawals-content";

export default async function WithdrawalsPage() {
  const session = await getSession();

  if (!session?.user) redirect("/login");

  if (
    session.user.role !== "ADMIN" &&
    session.user.role !== "SUPER_ADMIN" &&
    session.user.role !== "MANAGER"
  ) {
    redirect("/unauthorized");
  }

  const result = await listWithdrawals({
    sortBy: "createdAt",
    order: "desc",
    include: ["user", "masterWallet", "portfolioWallet", "userPortfolio"],
  });

  if (!result.success || !result.data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader>
            <CardTitle>Error Loading Withdrawals</CardTitle>
            <CardDescription>
              {result.error ?? "Unable to load withdrawal data. Please try again later."}
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      </div>
    );
  }

  return (
    <WithdrawalsContent
      withdrawals={result.data}
      adminId={session.user.id}
      adminName={session.user.name || session.user.email || "Admin"}
    />
  );
}
