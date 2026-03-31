import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { listDeposits } from "@/actions/deposits";
import { listWithdrawals } from "@/actions/withdraws";
import { AuditTrailView } from "./components/audit-trail-view";

export const dynamic = "force-dynamic";

export default async function AuditTrailPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const [depositsRes, withdrawalsRes] = await Promise.all([
    listDeposits({ sortBy: "createdAt", order: "desc", pageSize: 200, include: ["user"] }),
    listWithdrawals({ sortBy: "createdAt", order: "desc", pageSize: 200, include: ["user", "masterWallet"] }),
  ]);

  const deposits    = depositsRes.success    ? (depositsRes.data    ?? []) : [];
  const withdrawals = withdrawalsRes.success ? (withdrawalsRes.data ?? []) : [];

  // Build audit entries from staff actions on transactions
  const auditEntries: any[] = [];

  for (const d of deposits) {
    if (d.createdByName) {
      auditEntries.push({
        id: `dep-create-${d.id}`,
        action: "CREATED",
        entity: d.depositTarget === "ALLOCATION" ? "Allocation" : "Deposit",
        entityId: d.id,
        actor: d.createdByName,
        actorRole: d.createdByRole || "STAFF",
        subject: [d.user?.firstName, d.user?.lastName].filter(Boolean).join(" ") || d.user?.email || "—",
        amount: d.amount,
        timestamp: d.createdAt,
        notes: d.description || null,
      });
    }
    if (d.approvedByName && d.approvedAt) {
      auditEntries.push({
        id: `dep-approve-${d.id}`,
        action: "APPROVED",
        entity: d.depositTarget === "ALLOCATION" ? "Allocation" : "Deposit",
        entityId: d.id,
        actor: d.approvedByName,
        actorRole: "STAFF",
        subject: [d.user?.firstName, d.user?.lastName].filter(Boolean).join(" ") || d.user?.email || "—",
        amount: d.amount,
        timestamp: d.approvedAt,
        notes: null,
      });
    }
    if (d.rejectedByName && d.rejectedAt) {
      auditEntries.push({
        id: `dep-reject-${d.id}`,
        action: "REJECTED",
        entity: d.depositTarget === "ALLOCATION" ? "Allocation" : "Deposit",
        entityId: d.id,
        actor: d.rejectedByName,
        actorRole: "STAFF",
        subject: [d.user?.firstName, d.user?.lastName].filter(Boolean).join(" ") || d.user?.email || "—",
        amount: d.amount,
        timestamp: d.rejectedAt,
        notes: d.rejectReason || null,
      });
    }
  }

  for (const w of withdrawals) {
    if (w.createdByName) {
      auditEntries.push({
        id: `wd-create-${w.id}`,
        action: "CREATED",
        entity: w.withdrawalType === "REDEMPTION" ? "Redemption" : "Withdrawal",
        entityId: w.id,
        actor: w.createdByName,
        actorRole: w.createdByRole || "STAFF",
        subject: [w.user?.firstName, w.user?.lastName].filter(Boolean).join(" ") || w.user?.email || "—",
        amount: w.amount,
        timestamp: w.createdAt,
        notes: w.description || null,
      });
    }
    if (w.approvedByName && w.approvedAt) {
      auditEntries.push({
        id: `wd-approve-${w.id}`,
        action: "APPROVED",
        entity: w.withdrawalType === "REDEMPTION" ? "Redemption" : "Withdrawal",
        entityId: w.id,
        actor: w.approvedByName,
        actorRole: "STAFF",
        subject: [w.user?.firstName, w.user?.lastName].filter(Boolean).join(" ") || w.user?.email || "—",
        amount: w.amount,
        timestamp: w.approvedAt,
        notes: null,
      });
    }
    if (w.rejectedByName && w.rejectedAt) {
      auditEntries.push({
        id: `wd-reject-${w.id}`,
        action: "REJECTED",
        entity: w.withdrawalType === "REDEMPTION" ? "Redemption" : "Withdrawal",
        entityId: w.id,
        actor: w.rejectedByName,
        actorRole: "STAFF",
        subject: [w.user?.firstName, w.user?.lastName].filter(Boolean).join(" ") || w.user?.email || "—",
        amount: w.amount,
        timestamp: w.rejectedAt,
        notes: w.rejectReason || null,
      });
    }
  }

  auditEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return <AuditTrailView entries={auditEntries} />;
}
