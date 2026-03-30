"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search, RefreshCw, Eye, CheckCircle, XCircle, Clock,
  Banknote, ArrowDownToLine, Building2, CreditCard, User,
  CalendarDays, Hash, FileText, TrendingDown, Wallet,
  Paperclip, X as XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { approveWithdrawal, rejectWithdrawal, type Withdrawal } from "@/actions/withdraws";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const fmt = new Intl.NumberFormat("en-UG", {
  style: "currency",
  currency: "UGX",
  maximumFractionDigits: 0,
});

const fmtDate = (d: string | null | undefined) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }) + " " + new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : "—";

function statusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    case "APPROVED":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    case "REJECTED":
      return "border-red-500/30 bg-red-500/10 text-red-400";
    default:
      return "border-border bg-muted/20 text-muted-foreground";
  }
}

function typeBadge(type: string) {
  return type === "HARD_WITHDRAWAL"
    ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
    : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400";
}

function typeLabel(type: string) {
  return type === "HARD_WITHDRAWAL" ? "Cash Out" : "Redemption";
}

function userName(w: Withdrawal) {
  return (
    [w.user?.firstName, w.user?.lastName].filter(Boolean).join(" ") ||
    w.user?.email ||
    "—"
  );
}

/* -------------------------------------------------------------------------- */
/*  Stat card                                                                   */
/* -------------------------------------------------------------------------- */

function StatCard({
  label, value, sub, accent,
}: { label: string; value: string | number; sub?: string; accent: string }) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className={`text-2xl font-bold ${accent}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Approve dialog (for HARD_WITHDRAWAL only — needs a transaction ID)          */
/* -------------------------------------------------------------------------- */

function ApproveDialog({
  withdrawal,
  open,
  onOpenChange,
  adminId,
  adminName,
  onSuccess,
}: {
  withdrawal: Withdrawal;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  adminId: string;
  adminName: string;
  onSuccess: () => void;
}) {
  const [txId,      setTxId]      = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setProofFile(file);
    setProofPreview(null);
    if (!file) return;
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setProofPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  function clearFile() {
    setProofFile(null);
    setProofPreview(null);
  }

  function handleApprove() {
    if (!txId.trim()) {
      toast.error("Bank reference / transaction ID is required.");
      return;
    }
    startTransition(async () => {
      const result = await approveWithdrawal(
        withdrawal.id,
        txId.trim(),
        { approvedById: adminId, approvedByName: adminName, withdrawalType: "HARD_WITHDRAWAL" },
        { include: ["user", "masterWallet"] },
      );
      if (result.success) {
        toast.success("Withdrawal approved successfully.");
        onOpenChange(false);
        setTxId("");
        clearFile();
        onSuccess();

        // Send email receipt to client
        const payload = {
          ...withdrawal,
          ...(result.data ?? {}),
          transactionId:     txId.trim(),
          transactionStatus: "APPROVED" as const,
          approvedByName:    adminName,
          approvedAt:        new Date().toISOString(),
        };
        if (payload.user?.email) {
          try {
            const res = await fetch("/api/withdrawals/send-receipt", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({ withdrawal: payload }),
            });
            const data = await res.json();
            if (data.success) {
              toast.success(`Receipt emailed to ${payload.user.email}`);
            } else {
              toast.error(data.error || "Approved but email receipt failed.");
            }
          } catch {
            toast.error("Approved but email receipt could not be sent.");
          }
        }
      } else {
        toast.error(result.error ?? "Failed to approve withdrawal.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isPending) { onOpenChange(v); if (!v) clearFile(); } }}>
      <DialogContent className="max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            Approve Cash Withdrawal
          </DialogTitle>
          <DialogDescription>
            Confirm the bank transfer for{" "}
            <span className="font-semibold text-foreground">{fmt.format(withdrawal.amount)}</span>{" "}
            to <span className="font-semibold text-foreground">{userName(withdrawal)}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Bank details summary */}
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bank</span>
              <span className="font-medium">{withdrawal.bankName || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Name</span>
              <span className="font-medium">{withdrawal.bankAccountName || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Branch</span>
              <span className="font-medium">{withdrawal.bankBranch || "—"}</span>
            </div>
            {withdrawal.accountNo && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account No.</span>
                <span className="font-mono font-medium">{withdrawal.accountNo}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-foreground">{fmt.format(withdrawal.amount)}</span>
            </div>
          </div>

          {/* Bank reference / transaction ID */}
          <div className="space-y-1.5">
            <Label htmlFor="txId">
              Bank Reference / Transaction ID <span className="text-red-400">*</span>
            </Label>
            <Input
              id="txId"
              placeholder="e.g. TXN-2024-001234"
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              disabled={isPending}
              className="bg-muted/50 border-border"
            />
            <p className="text-xs text-muted-foreground">
              The bank reference confirming this transfer was executed.
            </p>
          </div>

          {/* Proof of payment — optional */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <Paperclip className="h-3.5 w-3.5" />
              Proof of Payment
              <span className="text-muted-foreground text-xs font-normal">(optional)</span>
            </Label>

            {!proofFile ? (
              <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground hover:bg-muted/30 transition-colors">
                <Paperclip className="h-4 w-4 shrink-0" />
                <span>Attach photo or PDF of payment proof</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={isPending}
                />
              </label>
            ) : (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Paperclip className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-sm font-medium truncate">{proofFile.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      ({(proofFile.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    disabled={isPending}
                    className="rounded p-1 hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Image preview */}
                {proofPreview && (
                  <img
                    src={proofPreview}
                    alt="Proof preview"
                    className="rounded-md max-h-48 w-full object-contain border border-border bg-muted/20"
                  />
                )}
                {proofFile.type === "application/pdf" && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    PDF attached — preview not available
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { onOpenChange(false); clearFile(); }} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isPending || !txId.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            {isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Confirm Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reject dialog                                                               */
/* -------------------------------------------------------------------------- */

function RejectDialog({
  withdrawal,
  open,
  onOpenChange,
  adminId,
  adminName,
  onSuccess,
}: {
  withdrawal: Withdrawal;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  adminId: string;
  adminName: string;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleReject() {
    startTransition(async () => {
      const result = await rejectWithdrawal(withdrawal.id, {
        reason: reason.trim() || undefined,
        rejectedById:   adminId,
        rejectedByName: adminName,
      });
      if (result.success) {
        toast.success("Withdrawal rejected.");
        onOpenChange(false);
        setReason("");
        onSuccess();
      } else {
        toast.error(result.error ?? "Failed to reject withdrawal.");
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-400" />
            Reject Withdrawal
          </AlertDialogTitle>
          <AlertDialogDescription>
            Reject{" "}
            <span className="font-semibold text-foreground">{fmt.format(withdrawal.amount)}</span>{" "}
            withdrawal for{" "}
            <span className="font-semibold text-foreground">{userName(withdrawal)}</span>. No funds
            will be moved.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2">
          <Label htmlFor="reason" className="text-sm">Reason (optional)</Label>
          <Input
            id="reason"
            placeholder="Enter rejection reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isPending}
            className="mt-1.5 bg-muted/50 border-border"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReject}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white gap-2"
          >
            {isPending && <RefreshCw className="h-4 w-4 animate-spin" />}
            Reject Withdrawal
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Details modal                                                               */
/* -------------------------------------------------------------------------- */

function DetailsModal({
  withdrawal,
  open,
  onOpenChange,
  adminId,
  adminName,
  onSuccess,
}: {
  withdrawal: Withdrawal | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  adminId: string;
  adminName: string;
  onSuccess: () => void;
}) {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen,  setRejectOpen]  = useState(false);

  if (!withdrawal) return null;

  const isPending  = withdrawal.transactionStatus === "PENDING";
  const isHard     = withdrawal.withdrawalType === "HARD_WITHDRAWAL";

  function handleSuccess() {
    onSuccess();
    onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg border-border bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isHard ? (
                <Banknote className="h-5 w-5 text-orange-400" />
              ) : (
                <ArrowDownToLine className="h-5 w-5 text-cyan-400" />
              )}
              {isHard ? "Cash Withdrawal" : "Portfolio Redemption"}
            </DialogTitle>
            <DialogDescription>
              Ref: <span className="font-mono text-foreground">{withdrawal.referenceNo}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1 max-h-[60vh] overflow-y-auto pr-1">
            {/* Status + type row */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={statusBadge(withdrawal.transactionStatus)}>
                {withdrawal.transactionStatus === "PENDING" && <Clock className="h-3 w-3 mr-1" />}
                {withdrawal.transactionStatus === "APPROVED" && <CheckCircle className="h-3 w-3 mr-1" />}
                {withdrawal.transactionStatus === "REJECTED" && <XCircle className="h-3 w-3 mr-1" />}
                {withdrawal.transactionStatus}
              </Badge>
              <Badge variant="outline" className={typeBadge(withdrawal.withdrawalType)}>
                {typeLabel(withdrawal.withdrawalType)}
              </Badge>
            </div>

            {/* Amount */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Withdrawal Amount</p>
              <p className="text-3xl font-bold text-foreground">{fmt.format(withdrawal.amount)}</p>
            </div>

            {/* Client info */}
            <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Client
              </p>
              <div className="text-sm space-y-0.5">
                <p className="font-semibold">{userName(withdrawal)}</p>
                <p className="text-muted-foreground text-xs">{withdrawal.user?.email || "—"}</p>
              </div>
            </div>

            {/* Bank details — only for HARD_WITHDRAWAL */}
            {isHard && (
              <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> Bank Details
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <span className="text-muted-foreground">Bank</span>
                  <span className="font-medium">{withdrawal.bankName || "—"}</span>
                  <span className="text-muted-foreground">Account Name</span>
                  <span className="font-medium">{withdrawal.bankAccountName || "—"}</span>
                  <span className="text-muted-foreground">Branch</span>
                  <span className="font-medium">{withdrawal.bankBranch || "—"}</span>
                  {withdrawal.accountNo && (
                    <>
                      <span className="text-muted-foreground">Account No.</span>
                      <span className="font-mono font-medium">{withdrawal.accountNo}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Master wallet */}
            {withdrawal.masterWallet && (
              <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5" /> Master Wallet
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <span className="text-muted-foreground">Balance</span>
                  <span className="font-medium">{fmt.format((withdrawal.masterWallet as any).balance ?? 0)}</span>
                  <span className="text-muted-foreground">NAV</span>
                  <span className="font-medium text-blue-400">{fmt.format((withdrawal.masterWallet as any).netAssetValue ?? 0)}</span>
                </div>
              </div>
            )}

            {/* Transaction IDs */}
            <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5" /> References
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <span className="text-muted-foreground">Reference No.</span>
                <span className="font-mono">{withdrawal.referenceNo || "—"}</span>
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono">{withdrawal.transactionId || "—"}</span>
              </div>
            </div>

            {/* Dates */}
            <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> Timeline
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <span className="text-muted-foreground">Created</span>
                <span>{fmtDate(withdrawal.createdAt)}</span>
                {withdrawal.approvedAt && (
                  <>
                    <span className="text-muted-foreground">Approved</span>
                    <span className="text-emerald-400">{fmtDate(withdrawal.approvedAt)}</span>
                  </>
                )}
                {withdrawal.rejectedAt && (
                  <>
                    <span className="text-muted-foreground">Rejected</span>
                    <span className="text-red-400">{fmtDate(withdrawal.rejectedAt)}</span>
                  </>
                )}
                {withdrawal.rejectReason && (
                  <>
                    <span className="text-muted-foreground">Reason</span>
                    <span className="text-red-400">{withdrawal.rejectReason}</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {withdrawal.description && (
              <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Note
                </p>
                <p className="text-sm text-muted-foreground">{withdrawal.description}</p>
              </div>
            )}
          </div>

          {/* Actions — only for PENDING HARD_WITHDRAWAL */}
          {isPending && isHard && (
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1.5"
                onClick={() => setRejectOpen(true)}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                onClick={() => setApproveOpen(true)}
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <ApproveDialog
        withdrawal={withdrawal}
        open={approveOpen}
        onOpenChange={setApproveOpen}
        adminId={adminId}
        adminName={adminName}
        onSuccess={handleSuccess}
      />
      <RejectDialog
        withdrawal={withdrawal}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        adminId={adminId}
        adminName={adminName}
        onSuccess={handleSuccess}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main content                                                                */
/* -------------------------------------------------------------------------- */

export function WithdrawalsContent({
  withdrawals,
  adminId,
  adminName,
}: {
  withdrawals: Withdrawal[];
  adminId: string;
  adminName: string;
}) {
  const router = useRouter();

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter,   setTypeFilter]   = useState("HARD_WITHDRAWAL"); // default: cash-outs needing approval
  const [selected,     setSelected]     = useState<Withdrawal | null>(null);
  const [detailsOpen,  setDetailsOpen]  = useState(false);

  /* ---- stats ---- */
  const stats = useMemo(() => {
    const hard    = withdrawals.filter((w) => w.withdrawalType === "HARD_WITHDRAWAL");
    const redeem  = withdrawals.filter((w) => w.withdrawalType === "REDEMPTION");
    const pending = hard.filter((w) => w.transactionStatus === "PENDING");
    const approved = hard.filter((w) => w.transactionStatus === "APPROVED");
    const rejected = hard.filter((w) => w.transactionStatus === "REJECTED");
    return {
      totalHard:      hard.length,
      totalRedemption: redeem.length,
      pendingHard:    pending.length,
      approvedHard:   approved.length,
      rejectedHard:   rejected.length,
      pendingAmount:  pending.reduce((s, w) => s + w.amount, 0),
      approvedAmount: approved.reduce((s, w) => s + w.amount, 0),
      totalAmount:    hard.reduce((s, w) => s + w.amount, 0),
    };
  }, [withdrawals]);

  /* ---- filtered list ---- */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return withdrawals.filter((w) => {
      const matchSearch =
        !q ||
        (w.user?.firstName?.toLowerCase().includes(q) ?? false) ||
        (w.user?.lastName?.toLowerCase().includes(q) ?? false) ||
        (w.user?.email?.toLowerCase().includes(q) ?? false) ||
        (w.referenceNo?.toLowerCase().includes(q) ?? false) ||
        (w.transactionId?.toLowerCase().includes(q) ?? false) ||
        (w.bankName?.toLowerCase().includes(q) ?? false) ||
        w.id.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || w.transactionStatus === statusFilter;
      const matchType   = typeFilter   === "all" || w.withdrawalType    === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [withdrawals, search, statusFilter, typeFilter]);

  function openDetails(w: Withdrawal) {
    setSelected(w);
    setDetailsOpen(true);
  }

  function handleRefresh() {
    router.refresh();
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Withdrawals</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage cash-out requests from master wallets. Redemptions (portfolio → master) are processed automatically.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2 shrink-0">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          label="Pending Cash-Outs"
          value={stats.pendingHard}
          sub={fmt.format(stats.pendingAmount)}
          accent="text-amber-400"
        />
        <StatCard
          label="Approved Cash-Outs"
          value={stats.approvedHard}
          sub={fmt.format(stats.approvedAmount)}
          accent="text-emerald-400"
        />
        <StatCard
          label="Rejected"
          value={stats.rejectedHard}
          sub="Cash-out requests"
          accent="text-red-400"
        />
        <StatCard
          label="Total Cash-Outs"
          value={stats.totalHard}
          sub={fmt.format(stats.totalAmount)}
          accent="text-orange-400"
        />
        <StatCard
          label="Redemptions"
          value={stats.totalRedemption}
          sub="Auto-processed"
          accent="text-cyan-400"
        />
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, reference, bank..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/50 border-border"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-44 bg-muted/50 border-border">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="HARD_WITHDRAWAL">Cash Out</SelectItem>
                <SelectItem value="REDEMPTION">Redemption</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-muted/50 border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Withdrawals{" "}
            <span className="text-muted-foreground font-normal text-sm">
              ({filtered.length})
            </span>
          </CardTitle>
          <CardDescription>Click any row to view details and take action.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <TrendingDown className="h-10 w-10 opacity-30" />
              <p className="text-sm">No withdrawals match your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Client</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Type</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Amount</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden md:table-cell">Bank</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden lg:table-cell">Reference</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden lg:table-cell">Date</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((w) => (
                    <tr
                      key={w.id}
                      onClick={() => openDetails(w)}
                      className="border-b border-border last:border-0 hover:bg-muted/20 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium leading-tight">{userName(w)}</p>
                        <p className="text-xs text-muted-foreground">{w.user?.email || "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-xs ${typeBadge(w.withdrawalType)}`}>
                          {typeLabel(w.withdrawalType)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {fmt.format(w.amount)}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                        {w.withdrawalType === "HARD_WITHDRAWAL"
                          ? (w.bankName || "—")
                          : <span className="italic">Portfolio</span>}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <code className="text-xs text-muted-foreground">{w.referenceNo || "—"}</code>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                        {fmtDate(w.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-xs ${statusBadge(w.transactionStatus)}`}>
                          {w.transactionStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={(e) => { e.stopPropagation(); openDetails(w); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details + action modal */}
      <DetailsModal
        withdrawal={selected}
        open={detailsOpen}
        onOpenChange={(v) => { setDetailsOpen(v); if (!v) setSelected(null); }}
        adminId={adminId}
        adminName={adminName}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
