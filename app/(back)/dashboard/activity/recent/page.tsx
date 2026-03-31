import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { listDeposits } from "@/actions/deposits";
import { listWithdrawals } from "@/actions/withdraws";
import { getAllStaffAction } from "@/actions/staff";
import { RecentActivityView } from "./components/recent-activity-view";

export const dynamic = "force-dynamic";

export default async function RecentActivityPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const [depositsRes, withdrawalsRes, staffRes] = await Promise.all([
    listDeposits({ sortBy: "createdAt", order: "desc", pageSize: 100, include: ["user"] }),
    listWithdrawals({ sortBy: "createdAt", order: "desc", pageSize: 100, include: ["user", "masterWallet"] }),
    getAllStaffAction(),
  ]);

  const deposits    = depositsRes.success    ? (depositsRes.data    ?? []) : [];
  const withdrawals = withdrawalsRes.success ? (withdrawalsRes.data ?? []) : [];
  const staff       = staffRes.success       ? (staffRes.data       ?? []) : [];

  // Merge into a unified activity feed
  const activities = [
    ...deposits.map((d: any) => ({
      id: d.id,
      type: d.depositTarget === "ALLOCATION" ? "allocation" : "deposit",
      amount: d.amount,
      status: d.transactionStatus,
      user: d.user,
      createdBy: d.createdByName,
      approvedBy: d.approvedByName,
      rejectedBy: d.rejectedByName,
      method: d.method,
      description: d.description,
      createdAt: d.createdAt,
      approvedAt: d.approvedAt,
      rejectedAt: d.rejectedAt,
    })),
    ...withdrawals.map((w: any) => ({
      id: w.id,
      type: w.withdrawalType === "REDEMPTION" ? "redemption" : "withdrawal",
      amount: w.amount,
      status: w.transactionStatus,
      user: w.user,
      createdBy: w.createdByName,
      approvedBy: w.approvedByName,
      rejectedBy: w.rejectedByName,
      method: w.method,
      description: w.description,
      createdAt: w.createdAt,
      approvedAt: w.approvedAt,
      rejectedAt: w.rejectedAt,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return <RecentActivityView activities={activities} staff={staff} />;
}
