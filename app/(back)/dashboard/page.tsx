import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { listMasterWallets } from "@/actions/master-wallets";
import { listDeposits } from "@/actions/deposits";
import { listWithdrawals } from "@/actions/withdraws";
import { AdminDashboard } from "@/components/back/super-admin-dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  // Fetch all platform data in parallel
  const [walletsRes, depositsRes, withdrawalsRes] = await Promise.all([
    listMasterWallets({ include: "user" } as any),
    listDeposits({
      sortBy:   "createdAt",
      order:    "desc",
      pageSize: 100,
      include:  ["user"],
    }),
    listWithdrawals({
      sortBy:   "createdAt",
      order:    "desc",
      pageSize: 100,
      include:  ["user", "masterWallet"],
    }),
  ]);

  const wallets     = walletsRes.success     ? (walletsRes.data     as any[]) : [];
  const deposits    = depositsRes.success    ? (depositsRes.data    as any[]) : [];
  const withdrawals = withdrawalsRes.success ? (withdrawalsRes.data as any[]) : [];

  return (
    <AdminDashboard
      wallets={wallets}
      deposits={deposits}
      withdrawals={withdrawals}
      adminName={session.user.name || session.user.email || "Admin"}
    />
  );
}
