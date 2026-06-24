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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Banknote, Clock, CheckCircle, XCircle, AlertTriangle,
  Building2, ArrowDownRight, ChevronDown, ChevronUp,
  Wallet, ArrowRightLeft, RefreshCw, TrendingDown,
} from "lucide-react";
import { createHardWithdrawal, createRedemption, type Withdrawal } from "@/actions/withdraws";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2,
});

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function statusStyle(s: string) {
  if (s === "PENDING")  return { cls: "border-amber-500/30 bg-amber-500/10 text-amber-400",        icon: Clock };
  if (s === "APPROVED") return { cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",  icon: CheckCircle };
  if (s === "REJECTED") return { cls: "border-red-500/30 bg-red-500/10 text-red-400",              icon: XCircle };
  return { cls: "border-border bg-muted/20 text-muted-foreground", icon: Clock };
}

/* -------------------------------------------------------------------------- */
/*  Types                                                                       */
/* -------------------------------------------------------------------------- */

interface WalletInfo {
  id:             string;
  accountNumber:  string;
  balance:        number;
  netAssetValue:  number;
  totalWithdrawn: number;
}

interface Portfolio {
  userPortfolioId: string;
  customName:      string;
  portfolioValue:  number;
  totalInvested:   number;
  portfolioName?:  string | null;
}

interface Props {
  withdrawals: Withdrawal[];
  redemptions: Withdrawal[];
  portfolios:  Portfolio[];
  wallet:      WalletInfo;
  userId:      string;
}

/* -------------------------------------------------------------------------- */
/*  Expandable withdrawal row                                                   */
/* -------------------------------------------------------------------------- */

function WithdrawalRow({
  w,
  expanded,
  onToggle,
}: {
  w:        Withdrawal;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { cls, icon: Icon } = statusStyle(w.transactionStatus);
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-0">
        <button
          className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-muted/10 transition-colors"
          onClick={onToggle}
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
            <span className="text-xs text-muted-foreground hidden sm:block">{fmtDate(w.createdAt)}</span>
            {expanded
              ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
              : <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </div>
        </button>

        {expanded && (
          <>
            <Separator className="bg-border" />
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { label: "Bank",         value: w.bankName        ?? "—" },
                  { label: "Branch",       value: w.bankBranch      ?? "—" },
                  { label: "Account Name", value: w.bankAccountName ?? "—" },
                  { label: "Account No",   value: w.accountNo       ?? "—" },
                  { label: "Reference",    value: w.referenceNo     ?? "—" },
                  { label: "Method",       value: w.method          ?? "Bank Transfer" },
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
              <StatusNote w={w} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Expandable redemption row                                                   */
/* -------------------------------------------------------------------------- */

function RedemptionRow({
  w,
  expanded,
  onToggle,
}: {
  w:        Withdrawal;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { cls, icon: Icon } = statusStyle(w.transactionStatus);
  const portfolioName = w.userPortfolio?.customName ?? "Portfolio";

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-0">
        <button
          className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-muted/10 transition-colors"
          onClick={onToggle}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-lg bg-violet-500/10 p-2 shrink-0">
              <RefreshCw className="h-4 w-4 text-violet-400" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">{fmt.format(w.amount)}</p>
              <p className="text-xs text-muted-foreground truncate">{portfolioName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Badge variant="outline" className={`text-xs ${cls}`}>
              <Icon className="h-2.5 w-2.5 mr-1" />
              {w.transactionStatus}
            </Badge>
            <span className="text-xs text-muted-foreground hidden sm:block">{fmtDate(w.createdAt)}</span>
            {expanded
              ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
              : <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </div>
        </button>

        {expanded && (
          <>
            <Separator className="bg-border" />
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: "Portfolio",  value: portfolioName },
                  { label: "Reference",  value: w.referenceNo ?? "—" },
                  { label: "Amount",     value: fmt.format(w.amount) },
                  { label: "Date",       value: fmtDate(w.createdAt) },
                ].map((item) => (
                  <div key={item.label} className="rounded border border-border bg-muted/40 p-2">
                    <p className="text-muted-foreground mb-0.5">{item.label}</p>
                    <p className="font-medium truncate">{item.value}</p>
                  </div>
                ))}
              </div>
              {w.description && (
                <p className="text-xs text-muted-foreground italic border border-border rounded p-2 bg-muted/20">
                  {w.description}
                </p>
              )}
              <StatusNote w={w} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared status note                                                           */
/* -------------------------------------------------------------------------- */

function StatusNote({ w }: { w: Withdrawal }) {
  if (w.transactionStatus === "APPROVED" && w.approvedAt) {
    return (
      <div className="rounded border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs">
        <p className="text-emerald-400 font-medium">
          Approved {fmtDate(w.approvedAt)}
          {w.approvedByName ? ` by ${w.approvedByName}` : ""}
        </p>
        {w.transactionId && (
          <p className="text-muted-foreground mt-0.5">
            Txn: <span className="font-mono">{w.transactionId}</span>
          </p>
        )}
      </div>
    );
  }
  if (w.transactionStatus === "REJECTED") {
    return (
      <div className="rounded border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs">
        <p className="text-red-400 font-medium">
          Rejected{w.rejectedAt ? ` ${fmtDate(w.rejectedAt)}` : ""}
          {w.rejectedByName ? ` by ${w.rejectedByName}` : ""}
        </p>
        {w.rejectReason && (
          <p className="text-muted-foreground mt-0.5">Reason: {w.rejectReason}</p>
        )}
      </div>
    );
  }
  return (
    <div className="rounded border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-400">
      Awaiting admin review. You will be notified once processed.
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                              */
/* -------------------------------------------------------------------------- */

export function WithdrawalsPageContent({
  withdrawals, redemptions, portfolios, wallet, userId,
}: Props) {
  const router = useRouter();

  /* ── dialog open states ── */
  const [cashOutOpen,  setCashOutOpen]  = useState(false);
  const [redeemOpen,   setRedeemOpen]   = useState(false);

  /* ── expanded rows ── */
  const [expandedWd,  setExpandedWd]  = useState<string | null>(null);
  const [expandedRdm, setExpandedRdm] = useState<string | null>(null);

  /* ── transitions ── */
  const [isPendingCashOut,  startCashOut]  = useTransition();
  const [isPendingRedeem,   startRedeem]   = useTransition();

  /* ──────────────────── Cash-out form state ──────────────────── */
  const [amount,          setAmount]          = useState("");
  const [referenceNo,     setReferenceNo]     = useState("");
  const [bankName,        setBankName]        = useState("");
  const [bankBranch,      setBankBranch]      = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [accountNo,       setAccountNo]       = useState("");
  const [description,     setDescription]     = useState("");

  /* ──────────────────── Redemption form state ──────────────────── */
  const [rdmPortfolioId, setRdmPortfolioId] = useState("");
  const [rdmAmount,      setRdmAmount]      = useState("");
  const [rdmDescription, setRdmDescription] = useState("");

  /* ── derived stats ── */
  const pendingWd  = withdrawals.filter((w) => w.transactionStatus === "PENDING");
  const approvedWd = withdrawals.filter((w) => w.transactionStatus === "APPROVED");
  const rejectedWd = withdrawals.filter((w) => w.transactionStatus === "REJECTED");
  const pendingWdTotal = pendingWd.reduce((s, w) => s + w.amount, 0);

  const pendingRdm  = redemptions.filter((r) => r.transactionStatus === "PENDING");
  const approvedRdm = redemptions.filter((r) => r.transactionStatus === "APPROVED");
  const rejectedRdm = redemptions.filter((r) => r.transactionStatus === "REJECTED");

  /* ── cash-out form validation ── */
  const amtNum    = Number(amount);
  const overLimit = amtNum > wallet.balance;
  const cashOutInvalid =
    !amount || amtNum <= 0 || overLimit ||
    !bankName.trim() || !bankBranch.trim() ||
    !bankAccountName.trim() || !accountNo.trim();

  /* ── redemption form validation ── */
  const selectedPortfolio = portfolios.find((p) => p.userPortfolioId === rdmPortfolioId);
  const rdmAmtNum         = Number(rdmAmount);
  const rdmOverLimit      = rdmAmtNum > (selectedPortfolio?.portfolioValue ?? 0);
  const redeemInvalid     = !rdmPortfolioId || !rdmAmount || rdmAmtNum <= 0 || rdmOverLimit;

  /* ── reset helpers ── */
  function resetCashOut() {
    setAmount(""); setReferenceNo(""); setBankName(""); setBankBranch("");
    setBankAccountName(""); setAccountNo(""); setDescription("");
  }
  function resetRedeem() {
    setRdmPortfolioId(""); setRdmAmount(""); setRdmDescription("");
  }

  /* ── submit handlers ── */
  function handleCashOutSubmit() {
    if (cashOutInvalid) return;
    startCashOut(async () => {
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
        setCashOutOpen(false);
        resetCashOut();
        router.refresh();
      }
    });
  }

  function handleRedeemSubmit() {
    if (redeemInvalid) return;
    startRedeem(async () => {
      const result = await createRedemption({
        userId,
        userPortfolioId: rdmPortfolioId,
        amount:          rdmAmtNum,
        description:     rdmDescription.trim() || null,
      });
      if (!result.success) {
        toast.error(result.error ?? "Failed to submit redemption request");
      } else {
        toast.success("Redemption request submitted. Awaiting admin approval.");
        setRedeemOpen(false);
        resetRedeem();
        router.refresh();
      }
    });
  }

  return (
    <div className="p-6 space-y-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Withdrawals</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Redeem portfolio returns or cash out to your bank account.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => { resetRedeem(); setRedeemOpen(true); }}
            disabled={portfolios.length === 0}
            className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 shrink-0"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Redeem Portfolio
          </Button>
          <Button
            onClick={() => { resetCashOut(); setCashOutOpen(true); }}
            disabled={wallet.balance <= 0}
            className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
          >
            <ArrowDownRight className="h-4 w-4 mr-2" />
            Cash Out
          </Button>
        </div>
      </div>

      {/* ── Wallet summary ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Available to Cash Out",
            value: fmt.format(wallet.balance),
            sub:   "Master wallet cash balance",
            icon:  Wallet,
            cls:   "text-emerald-400", bg: "bg-emerald-500/10", border: "border-l-emerald-500",
          },
          {
            label: "Portfolio Value",
            value: fmt.format(wallet.netAssetValue),
            sub:   "Market value of investments",
            icon:  ArrowRightLeft,
            cls:   "text-blue-400", bg: "bg-blue-500/10", border: "border-l-blue-500",
          },
          {
            label: "Pending Cash Out",
            value: fmt.format(pendingWdTotal),
            sub:   `${pendingWd.length} awaiting approval`,
            icon:  Clock,
            cls:   "text-amber-400", bg: "bg-amber-500/10", border: "border-l-amber-500",
          },
          {
            label: "Pending Redemptions",
            value: String(pendingRdm.length),
            sub:   `${pendingRdm.length} awaiting approval`,
            icon:  RefreshCw,
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

      {/* ── How it works ── */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-blue-400">How withdrawals work</p>
              <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                <li><strong>Redeem:</strong> Convert portfolio holdings back to cash in your master wallet</li>
                <li><strong>Cash Out:</strong> Transfer available cash from your master wallet to your bank account</li>
                <li>Both require admin approval before processing</li>
                <li>You can only redeem up to your portfolio&apos;s current market value</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════ PORTFOLIO REDEMPTIONS SECTION ══════════════ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Portfolio Redemptions</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Requests to convert portfolio holdings to cash in your master wallet
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />{pendingRdm.length} pending
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />{approvedRdm.length} approved
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-400" />{rejectedRdm.length} rejected
            </span>
          </div>
        </div>

        {redemptions.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="rounded-full bg-violet-500/10 p-4">
                <RefreshCw className="h-8 w-8 text-violet-400" />
              </div>
              <p className="text-sm text-muted-foreground">No redemption requests yet</p>
              {portfolios.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { resetRedeem(); setRedeemOpen(true); }}
                  className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                >
                  Request a Redemption
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {redemptions.map((r) => (
              <RedemptionRow
                key={r.id}
                w={r}
                expanded={expandedRdm === r.id}
                onToggle={() => setExpandedRdm(expandedRdm === r.id ? null : r.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ══════════════ CASH-OUT SECTION ══════════════ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Cash-Out History</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Bank transfer requests from your master wallet
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />{pendingWd.length} pending
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />{approvedWd.length} approved
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-400" />{rejectedWd.length} rejected
            </span>
          </div>
        </div>

        {withdrawals.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="rounded-full bg-muted/40 p-4">
                <Banknote className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No cash-out requests yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { resetCashOut(); setCashOutOpen(true); }}
                disabled={wallet.balance <= 0}
              >
                Request Cash Out
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {withdrawals.map((w) => (
              <WithdrawalRow
                key={w.id}
                w={w}
                expanded={expandedWd === w.id}
                onToggle={() => setExpandedWd(expandedWd === w.id ? null : w.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ══════════════ REDEEM DIALOG ══════════════ */}
      <Dialog open={redeemOpen} onOpenChange={(v) => { if (!isPendingRedeem) setRedeemOpen(v); }}>
        <DialogContent className="sm:max-w-md border-border bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-violet-400" />
              Redeem from Portfolio
            </DialogTitle>
            <DialogDescription>
              Convert portfolio holdings back to cash. Admin will set the asset prices when approving.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-1">
            {/* Portfolio selector */}
            <div className="space-y-1.5">
              <Label htmlFor="rdm-portfolio">
                Portfolio <span className="text-red-400">*</span>
              </Label>
              <Select
                value={rdmPortfolioId}
                onValueChange={(v) => { setRdmPortfolioId(v); setRdmAmount(""); }}
                disabled={isPendingRedeem}
              >
                <SelectTrigger id="rdm-portfolio" className="border-border bg-background">
                  <SelectValue placeholder="Select a portfolio" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {portfolios.map((p) => (
                    <SelectItem key={p.userPortfolioId} value={p.userPortfolioId}>
                      <span className="flex flex-col text-left">
                        <span>{p.customName}</span>
                        <span className="text-xs text-muted-foreground">
                          Value: {fmt.format(p.portfolioValue)}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Portfolio summary strip */}
            {selectedPortfolio && (
              <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-3 space-y-1">
                <p className="text-xs text-muted-foreground">Selected Portfolio</p>
                <p className="font-semibold text-foreground">{selectedPortfolio.customName}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>Market Value</span>
                  <span className="font-semibold text-violet-400">{fmt.format(selectedPortfolio.portfolioValue)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Initial Investment</span>
                  <span className="font-mono">{fmt.format(selectedPortfolio.totalInvested ?? 0)}</span>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Max redeemable: <span className="font-semibold text-violet-400">{fmt.format(selectedPortfolio.portfolioValue)}</span>
                </p>
              </div>
            )}

            {/* Amount */}
            <div className="space-y-1.5">
              <Label htmlFor="rdm-amount">
                Redemption Amount (USD) <span className="text-red-400">*</span>
              </Label>
              <Input
                id="rdm-amount"
                type="number"
                min={1}
                max={selectedPortfolio?.portfolioValue}
                placeholder={
                  selectedPortfolio
                    ? `Max ${fmt.format(selectedPortfolio.portfolioValue)}`
                    : "Select a portfolio first"
                }
                value={rdmAmount}
                onChange={(e) => setRdmAmount(e.target.value)}
                disabled={isPendingRedeem || !rdmPortfolioId}
                className="border-border bg-background"
              />
              {rdmOverLimit && selectedPortfolio && (
                <p className="text-xs text-red-400">
                  Cannot exceed portfolio value of {fmt.format(selectedPortfolio.portfolioValue)}.
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="rdm-desc">
                Notes <span className="text-muted-foreground text-xs font-normal">(optional)</span>
              </Label>
              <Textarea
                id="rdm-desc"
                placeholder="Any notes for the admin"
                value={rdmDescription}
                onChange={(e) => setRdmDescription(e.target.value)}
                disabled={isPendingRedeem}
                className="border-border bg-background min-h-[72px] resize-none"
              />
            </div>

            {/* Notice */}
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2.5 text-xs text-violet-400">
              <p className="font-medium mb-1 flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5" />
                How redemption works
              </p>
              <ul className="space-y-0.5 text-muted-foreground list-disc list-inside">
                <li>Stocks are sold proportionally across your portfolio assets</li>
                <li>Admin sets the sell price per asset when approving</li>
                <li>Redeemed cash is credited to your master wallet balance</li>
                <li>Your portfolio investment value decreases by the redeemed amount</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRedeemOpen(false)}
                disabled={isPendingRedeem}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white"
                disabled={redeemInvalid || isPendingRedeem}
                onClick={handleRedeemSubmit}
              >
                {isPendingRedeem ? "Submitting…" : "Submit Redemption"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══════════════ CASH-OUT DIALOG ══════════════ */}
      <Dialog open={cashOutOpen} onOpenChange={(v) => { if (!isPendingCashOut) setCashOutOpen(v); }}>
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
              <p className="text-xs text-muted-foreground">Available to Cash Out</p>
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
                disabled={isPendingCashOut}
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
                disabled={isPendingCashOut}
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
                    disabled={isPendingCashOut}
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
                    disabled={isPendingCashOut}
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
                  disabled={isPendingCashOut}
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
                  disabled={isPendingCashOut}
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
                  disabled={isPendingCashOut}
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
                onClick={() => setCashOutOpen(false)}
                disabled={isPendingCashOut}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={cashOutInvalid || isPendingCashOut}
                onClick={handleCashOutSubmit}
              >
                {isPendingCashOut ? "Submitting…" : "Submit Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
