import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { listMasterWallets } from "@/actions/master-wallets";
import { listDeposits } from "@/actions/deposits";
import { listWithdrawals } from "@/actions/withdraws";
import { AdminDashboard } from "@/components/back/super-admin-dashboard";

export const dynamic = "force-dynamic";

export default async function CRHomePage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const [walletsRes, depositsRes, withdrawalsRes] = await Promise.all([
    listMasterWallets({ include: "user" } as any),
    listDeposits({ sortBy: "createdAt", order: "desc", pageSize: 100, include: ["user"] }),
    listWithdrawals({ sortBy: "createdAt", order: "desc", pageSize: 100, include: ["user", "masterWallet"] }),
  ]);

  return (
    <AdminDashboard
      wallets={walletsRes.success ? (walletsRes.data as any[]) : []}
      deposits={depositsRes.success ? (depositsRes.data as any[]) : []}
      withdrawals={withdrawalsRes.success ? (withdrawalsRes.data as any[]) : []}
      adminName={session.user.name || session.user.email || "CR Staff"}
    />
  );
}
