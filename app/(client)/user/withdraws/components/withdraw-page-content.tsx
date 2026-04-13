"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Banknote, Clock, CheckCircle, XCircle, AlertTriangle,
  Building2, ArrowDownRight, ChevronDown, ChevronUp,
  Wallet, ArrowRightLeft,
} from "lucide-react";
import { createHardWithdrawal, type Withdrawal } from "@/actions/withdraws";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2,
});

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function statusStyle(s: string) {
  if (s === "PENDING")  return { cls: "border-amber-500/30 bg-amber-500/10 text-amber-400",   icon: Clock };
  if (s === "APPROVED") return { cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400", icon: CheckCircle };
  if (s === "REJECTED") return { cls: "border-red-500/30 bg-red-500/10 text-red-400",          icon: XCircle };
  return { cls: "border-border bg-muted/20 text-muted-foreground", icon: Clock };
}

/* -------------------------------------------------------------------------- */
/*  Props                                                                       */
/* -------------------------------------------------------------------------- */

interface WalletInfo {
  id:             string;
  accountNumber:  string;
  balance:        number;
  netAssetValue:  number;
  totalWithdrawn: number;
}

interface Props {
  withdrawals: Withdrawal[];
  wallet:      WalletInfo;
  userId:      string;
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                              */
/* -------------------------------------------------------------------------- */

export function WithdrawalsPageContent({ withdrawals, wallet, userId }: Props) {
  const router                      = useRouter();
  const [open, setOpen]             = useState(false);
  const [expanded, setExpanded]     = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  /* ---- form state ---- */
  const [amount,          setAmount]          = useState("");
  const [referenceNo,     setReferenceNo]     = useState("");
  const [bankName,        setBankName]        = useState("");
  const [bankBranch,      setBankBranch]      = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [accountNo,       setAccountNo]       = useState("");
  const [description,     setDescription]     = useState("");

  /* ---- stats ---- */
  const pending  = withdrawals.filter((w) => w.transactionStatus === "PENDING");
  const approved = withdrawals.filter((w) => w.transactionStatus === "APPROVED");
  const rejected = withdrawals.filter((w) => w.transactionStatus === "REJECTED");
  const totalRequested = withdrawals.reduce((s, w) => s + w.amount, 0);
  const pendingTotal   = pending.reduce((s, w) => s + w.amount, 0);

  const amtNum     = Number(amount);
  const overLimit  = amtNum > wallet.balance;
  const formInvalid =
    !amount || amtNum <= 0 || overLimit ||
    !bankName.trim() || !bankBranch.trim() ||
    !bankAccountName.trim() || !accountNo.trim();

  function resetForm() {
    setAmount(""); setReferenceNo(""); setBankName(""); setBankBranch("");
    setBankAccountName(""); setAccountNo(""); setDescription("");
  }

  function handleSubmit() {
    if (formInvalid) return;
    startTransition(async () => {
      const result = await createHardWithdrawal({
        userId,
        amount:          amtNum,
        referenceNo:     referenceNo.trim() || `WDR-${Date.now()}`,
        bankName:        bankName.trim(),
        bankAccountName: bankAccountName.trim(),
        bankBranch:      bankBranch.trim(),
        accountNo:       accountNo.trim(),
        description:     description.trim() || null,
        method:          "Bank Transfer",
      });
      if (!result.success) {
        toast.error(result.error ?? "Failed to submit withdrawal request");
      } else {
        toast.success("Cash-out request submitted. Awaiting admin approval.");
        setOpen(false);
        resetForm();
        router.refresh();
      }
    });
  }

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Cash-Out Withdrawals</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Withdraw cash from your master wallet to your bank account. Requires admin approval.
          </p>
        </div>
        <Button
          onClick={() => { resetForm(); setOpen(true); }}
          disabled={wallet.balance <= 0}
          className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
        >
          <ArrowDownRight className="h-4 w-4 mr-2" />
          Request Cash Out
        </Button>
      </div>

      {/* ── Wallet summary ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Available to Withdraw",
            value: fmt.format(wallet.balance),
            sub:   "Master wallet cash balance",
            icon:  Wallet,
            cls:   "text-emerald-400", bg: "bg-emerald-500/10", border: "border-l-emerald-500",
          },
          {
            label: "Portfolio NAV",
            value: fmt.format(wallet.netAssetValue),
            sub:   "Invested in portfolios",
            icon:  ArrowRightLeft,
            cls:   "text-blue-400", bg: "bg-blue-500/10", border: "border-l-blue-500",
          },
          {
            label: "Pending Requests",
            value: fmt.format(pendingTotal),
            sub:   `${pending.length} awaiting approval`,
            icon:  Clock,
            cls:   "text-amber-400", bg: "bg-amber-500/10", border: "border-l-amber-500",
          },
          {
            label: "Total Requested",
            value: fmt.format(totalRequested),
            sub:   `${withdrawals.length} requests`,
            icon:  Banknote,
            cls:   "text-violet-400", bg: "bg-violet-500/10", border: "border-l-violet-500",
          },
        ].map((item) => (
          <Card key={item.label} className={`border-border bg-card border-l-4 ${item.border}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                  <p className={`text-lg font-bold leading-tight ${item.cls}`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                </div>
                <div className={`rounded-lg p-2 shrink-0 ${item.bg}`}>
                  <item.icon className={`h-4 w-4 ${item.cls}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── How it works notice ── */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-blue-400">How cash-out withdrawals work</p>
              <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                <li>Submit a request with your bank details</li>
                <li>An admin reviews and approves the request</li>
                <li>Once approved, funds are transferred to your bank account (2–5 business days)</li>
                <li>To withdraw portfolio returns first, use the <strong>Redeem</strong> option on each portfolio</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── History ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Request History</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />{pending.length} pending
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />{approved.length} approved
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-400" />{rejected.length} rejected
            </span>
          </div>
        </div>

        {withdrawals.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="rounded-full bg-muted/40 p-4">
                <Banknote className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No cash-out requests yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { resetForm(); setOpen(true); }}
                disabled={wallet.balance <= 0}
              >
                Make your first request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {withdrawals.map((w) => {
              const { cls, icon: Icon } = statusStyle(w.transactionStatus);
              const isExpanded = expanded === w.id;

              return (
                <Card key={w.id} className="border-border bg-card">
                  <CardContent className="p-0">
                    {/* Main row */}
                    <button
                      className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-muted/10 transition-colors"
                      onClick={() => setExpanded(isExpanded ? null : w.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="rounded-lg bg-muted/30 p-2 shrink-0">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm">{fmt.format(w.amount)}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {w.bankName ?? "—"}
                            {w.bankBranch ? ` · ${w.bankBranch}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant="outline" className={`text-xs ${cls}`}>
                          <Icon className="h-2.5 w-2.5 mr-1" />
                          {w.transactionStatus}
                        </Badge>
                        <span className="text-xs text-muted-foreground hidden sm:block">
                          {fmtDate(w.createdAt)}
                        </span>
                        {isExpanded
                          ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        }
                      </div>
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <>
                        <Separator className="bg-border" />
                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                            {[
                              { label: "Bank",          value: w.bankName          ?? "—" },
                              { label: "Branch",        value: w.bankBranch        ?? "—" },
                              { label: "Account Name",  value: w.bankAccountName   ?? "—" },
                              { label: "Account No",    value: w.accountNo         ?? "—" },
                              { label: "Reference",     value: w.referenceNo       ?? "—" },
                              { label: "Method",        value: w.method            ?? "Bank Transfer" },
                            ].map((item) => (
                              <div key={item.label} className="rounded border border-border bg-muted/40 p-2">
                                <p className="text-muted-foreground mb-0.5">{item.label}</p>
                                <p className="font-medium font-mono truncate">{item.value}</p>
                              </div>
                            ))}
                          </div>

                          {w.description && (
                            <p className="text-xs text-muted-foreground italic border border-border rounded p-2 bg-muted/20">
                              {w.description}
                            </p>
                          )}

                          {/* Approval / rejection info */}
                          {w.transactionStatus === "APPROVED" && w.approvedAt && (
                            <div className="rounded border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs">
                              <p className="text-emerald-400 font-medium">
                                Approved {fmtDate(w.approvedAt)}
                                {w.approvedByName ? ` by ${w.approvedByName}` : ""}
                              </p>
                              {w.transactionId && (
                                <p className="text-muted-foreground mt-0.5">
                                  Bank Txn: <span className="font-mono">{w.transactionId}</span>
                                </p>
                              )}
                            </div>
                          )}

                          {w.transactionStatus === "REJECTED" && (
                            <div className="rounded border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs">
                              <p className="text-red-400 font-medium">
                                Rejected{w.rejectedAt ? ` ${fmtDate(w.rejectedAt)}` : ""}
                                {w.rejectedByName ? ` by ${w.rejectedByName}` : ""}
                              </p>
                              {w.rejectReason && (
                                <p className="text-muted-foreground mt-0.5">Reason: {w.rejectReason}</p>
                              )}
                            </div>
                          )}

                          {w.transactionStatus === "PENDING" && (
                            <div className="rounded border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-400">
                              Awaiting admin review. You will be notified once processed.
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Request dialog ── */}
      <Dialog open={open} onOpenChange={(v) => { if (!isPending) setOpen(v); }}>
        <DialogContent className="sm:max-w-lg border-border bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4 text-blue-400" />
              Request Cash Out
            </DialogTitle>
            <DialogDescription>
              Enter your bank details and amount. An admin will review and process the request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-1">
            {/* Balance strip */}
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
              <p className="text-xs text-muted-foreground">Available to Withdraw</p>
              <p className="text-xl font-bold text-emerald-400">{fmt.format(wallet.balance)}</p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">{wallet.accountNumber}</p>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <Label htmlFor="wd-amount">
                Amount (USD) <span className="text-red-400">*</span>
              </Label>
              <Input
                id="wd-amount"
                type="number"
                min={1}
                max={wallet.balance}
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isPending}
                className="border-border bg-background"
              />
              {overLimit && (
                <p className="text-xs text-red-400">
                  Cannot exceed available balance of {fmt.format(wallet.balance)}.
                </p>
              )}
            </div>

            {/* Optional reference */}
            <div className="space-y-1.5">
              <Label htmlFor="wd-ref">
                Your Reference <span className="text-muted-foreground text-xs font-normal">(optional)</span>
              </Label>
              <Input
                id="wd-ref"
                placeholder="e.g. INV-2024-001 — leave blank to auto-generate"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                disabled={isPending}
                className="border-border bg-background"
              />
            </div>

            <Separator className="bg-border" />

            {/* Bank details */}
            <div className="space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Bank Details
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="wd-bank">Bank Name <span className="text-red-400">*</span></Label>
                  <Input
                    id="wd-bank"
                    placeholder="e.g., Stanbic Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    disabled={isPending}
                    className="border-border bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="wd-branch">Branch <span className="text-red-400">*</span></Label>
                  <Input
                    id="wd-branch"
                    placeholder="e.g., Main Branch"
                    value={bankBranch}
                    onChange={(e) => setBankBranch(e.target.value)}
                    disabled={isPending}
                    className="border-border bg-background"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wd-acname">Account Holder Name <span className="text-red-400">*</span></Label>
                <Input
                  id="wd-acname"
                  placeholder="Name as on bank account"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  disabled={isPending}
                  className="border-border bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wd-acno">Bank Account Number <span className="text-red-400">*</span></Label>
                <Input
                  id="wd-acno"
                  placeholder="Your bank account number"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  disabled={isPending}
                  className="border-border bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wd-desc">Notes (optional)</Label>
                <Textarea
                  id="wd-desc"
                  placeholder="Any additional notes for the admin"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isPending}
                  className="border-border bg-background min-h-[72px] resize-none"
                />
              </div>
            </div>

            {/* Notice */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-xs text-amber-400">
              <p className="font-medium mb-1">Before submitting</p>
              <ul className="space-y-0.5 text-muted-foreground list-disc list-inside">
                <li>Ensure all bank details are accurate — they cannot be changed after submission</li>
                <li>Processing takes 2–5 business days after admin approval</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={formInvalid || isPending}
                onClick={handleSubmit}
              >
                {isPending ? "Submitting…" : "Submit Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
