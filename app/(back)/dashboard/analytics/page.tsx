import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { listMasterWallets } from "@/actions/master-wallets";
import { listDeposits } from "@/actions/deposits";
import { listWithdrawals } from "@/actions/withdraws";
import { getClientsForAssignmentAction } from "@/actions/staff";
import { getAllStaffAction } from "@/actions/staff";
import { AnalyticsDashboard } from "./components/analytics-dashboard";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const [walletsRes, depositsRes, withdrawalsRes, clientsRes, staffRes] = await Promise.all([
    listMasterWallets(),
    listDeposits({ sortBy: "createdAt", order: "desc", pageSize: 500, include: ["user"] }),
    listWithdrawals({ sortBy: "createdAt", order: "desc", pageSize: 500, include: ["user", "masterWallet"] }),
    getClientsForAssignmentAction(),
    getAllStaffAction(),
  ]);

  return (
    <AnalyticsDashboard
      wallets={walletsRes.success ? (walletsRes.data as any[]) : []}
      deposits={depositsRes.success ? (depositsRes.data as any[]) : []}
      withdrawals={withdrawalsRes.success ? (withdrawalsRes.data as any[]) : []}
      clients={clientsRes.success ? (clientsRes.data as any[]) : []}
      staff={staffRes.success ? (staffRes.data as any[]) : []}
    />
  );
}
