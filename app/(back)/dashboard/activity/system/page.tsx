import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { listDeposits } from "@/actions/deposits";
import { listWithdrawals } from "@/actions/withdraws";
import { listMasterWallets } from "@/actions/master-wallets";
import { getAllStaffAction, getClientsForAssignmentAction } from "@/actions/staff";
import { SystemLogsView } from "./components/system-logs-view";

export const dynamic = "force-dynamic";

export default async function SystemLogsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const [depositsRes, withdrawalsRes, walletsRes, staffRes, clientsRes] = await Promise.all([
    listDeposits({ sortBy: "createdAt", order: "desc", pageSize: 500 }),
    listWithdrawals({ sortBy: "createdAt", order: "desc", pageSize: 500 }),
    listMasterWallets(),
    getAllStaffAction(),
    getClientsForAssignmentAction(),
  ]);

  const deposits    = depositsRes.success    ? (depositsRes.data    ?? []) : [];
  const withdrawals = withdrawalsRes.success ? (withdrawalsRes.data ?? []) : [];
  const wallets     = walletsRes.success     ? (walletsRes.data     ?? []) : [];
  const staff       = staffRes.success       ? (staffRes.data       ?? []) : [];
  const clients     = clientsRes.success     ? (clientsRes.data     ?? []) : [];

  const systemStats = {
    totalClients:      clients.length,
    activeClients:     clients.filter((c: any) => c.status === "ACTIVE").length,
    totalStaff:        staff.length,
    totalWallets:      wallets.length,
    activeWallets:     wallets.filter((w: any) => w.status === "ACTIVE").length,
    totalDeposits:     deposits.length,
    pendingDeposits:   deposits.filter((d: any) => d.transactionStatus === "PENDING").length,
    approvedDeposits:  deposits.filter((d: any) => d.transactionStatus === "APPROVED").length,
    rejectedDeposits:  deposits.filter((d: any) => d.transactionStatus === "REJECTED").length,
    totalWithdrawals:  withdrawals.length,
    pendingWithdrawals: withdrawals.filter((w: any) => w.transactionStatus === "PENDING").length,
    approvedWithdrawals: withdrawals.filter((w: any) => w.transactionStatus === "APPROVED").length,
    totalAUM:          wallets.reduce((s: number, w: any) => s + (w.netAssetValue ?? 0), 0),
    totalCash:         wallets.reduce((s: number, w: any) => s + (w.balance ?? 0), 0),
    totalFees:         wallets.reduce((s: number, w: any) => s + (w.totalFees ?? 0), 0),
  };

  // Build a timeline of system events from recent transactions
  const recentEvents = [
    ...deposits.slice(0, 50).map((d: any) => ({
      id: `dep-${d.id}`,
      level: d.transactionStatus === "REJECTED" ? "warn" : "info",
      message: `Deposit ${d.transactionStatus.toLowerCase()} — $${d.amount.toLocaleString()}`,
      detail: d.depositTarget === "ALLOCATION" ? "Portfolio allocation" : "Master wallet deposit",
      timestamp: d.updatedAt || d.createdAt,
    })),
    ...withdrawals.slice(0, 50).map((w: any) => ({
      id: `wd-${w.id}`,
      level: w.transactionStatus === "REJECTED" ? "warn" : "info",
      message: `Withdrawal ${w.transactionStatus.toLowerCase()} — $${w.amount.toLocaleString()}`,
      detail: w.withdrawalType === "REDEMPTION" ? "Portfolio redemption" : "Cash withdrawal",
      timestamp: w.updatedAt || w.createdAt,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 100);

  return <SystemLogsView stats={systemStats} events={recentEvents} />;
}
