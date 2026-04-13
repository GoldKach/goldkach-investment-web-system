import { getSession, getAllUsers } from "@/actions/auth";
import { listWithdrawals } from "@/actions/withdraws";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { WithdrawalsContent } from "./components/withdrawals-content";

export default async function WithdrawalsPage() {
  const session = await getSession();

  if (!session?.user) redirect("/login");

  // Get fresh role from DB
  const r = await getAllUsers();
  const users = r?.data;
  const user = users?.find((u: any) => u.id === session.user?.id) ?? session.user;
  const role = user?.role ?? (session.user as any)?.role;

  const adminRoles = ["ADMIN", "SUPER_ADMIN", "MANAGER"];
  if (!adminRoles.includes(role)) {
    if (role === "AGENT") redirect("/agent");
    if (role === "CLIENT_RELATIONS") redirect("/cr");
    if (role === "ACCOUNT_MANAGER") redirect("/accountant");
    if (role === "USER") redirect("/user");
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
      adminName={(user as any)?.name || (user as any)?.email || session.user.email || "Admin"}
    />
  );
}
