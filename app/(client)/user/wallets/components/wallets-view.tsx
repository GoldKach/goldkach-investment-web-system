"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Wallet, ArrowDownCircle, RefreshCw, TrendingUp, TrendingDown,
  CreditCard, Building2, ChevronDown, ChevronUp, Loader2, Info,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { createHardWithdrawal, createRedemption } from "@/actions/withdraws";
import { createAllocation } from "@/actions/deposits";
import type { MasterWalletDetail } from "@/actions/master-wallets";
import type { PortfolioSummary } from "@/actions/portfolio-summary";

const fmt = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface Props {
  userId: string;
  walletDetail: MasterWalletDetail | null;
  portfolioSummary: PortfolioSummary | null;
}

type ModalType = "withdraw" | "redeem" | "allocate" | null;

export function WalletsView({ userId, walletDetail, portfolioSummary }: Props) {
  const master = walletDetail?.masterWallet ?? null;
  const portfolioWallets = walletDetail?.portfolioWallets ?? [];
  const portfolios = portfolioSummary?.portfolios ?? [];

  const [modal, setModal] = useState<ModalType>(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState("");
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [description, setDescription] = useState("");
  const [expandedWallet, setExpandedWallet] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const resetForm = () => {
    setAmount(""); setBankName(""); setBankAccountName("");
    setBankBranch(""); setDescription(""); setSelectedPortfolioId("");
  };

  const openModal = (type: ModalType, portfolioId?: string) => {
    resetForm();
    if (portfolioId) setSelectedPortfolioId(portfolioId);
    setModal(type);
  };

  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount."); return; }
    if (!bankName || !bankAccountName || !bankBranch) {
      toast.error("All bank details are required."); return;
    }
    startTransition(async () => {
      const res = await createHardWithdrawal({
        userId,
        amount: amt,
        bankName,
        bankAccountName,
        bankBranch,
        description: description || null,
      });
      if (res.success) {
        toast.success("Withdrawal request submitted. Awaiting admin approval.");
        setModal(null); resetForm();
      } else {
        toast.error(res.error || "Failed to submit withdrawal.");
      }
    });
  };

  const handleRedeem = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount."); return; }
    if (!selectedPortfolioId) { toast.error("Select a portfolio."); return; }
    startTransition(async () => {
      const res = await createRedemption({
        userId,
        userPortfolioId: selectedPortfolioId,
        amount: amt,
        description: description || null,
      });
      if (res.success) {
        toast.success("Redemption request submitted. Awaiting admin approval.");
        setModal(null); resetForm();
      } else {
        toast.error(res.error || "Failed to submit redemption.");
      }
    });
  };

  const handleAllocate = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount."); return; }
    if (!selectedPortfolioId) { toast.error("Select a portfolio."); return; }
    if (master && amt > master.balance) {
      toast.error(`Insufficient balance. Available: ${fmt(master.balance)}`); return;
    }
    startTransition(async () => {
      const res = await createAllocation({
        userId,
        userPortfolioId: selectedPortfolioId,
        amount: amt,
        description: description || null,
      });
      if (res.success) {
        toast.success("Allocation request submitted. Awaiting admin approval.");
        setModal(null); resetForm();
      } else {
        toast.error(res.error || "Failed to submit allocation.");
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Wallets</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View your wallets, withdraw to bank, or reallocate between portfolios
        </p>
      </div>

      {/* Master Wallet */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-2.5">
                <Building2 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-base">Master Wallet</CardTitle>
                <CardDescription className="text-xs">
                  {master?.accountNumber ?? "—"}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={master?.status === "ACTIVE"
                ? "border-green-400/40 text-green-500 bg-green-500/10"
                : "border-slate-400/40 text-slate-500"}
            >
              {master?.status ?? "—"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Available Balance", value: fmt(master?.balance ?? 0), color: "text-green-500" },
              { label: "Net Asset Value",   value: fmt(master?.netAssetValue ?? 0), color: "text-blue-500" },
              { label: "Total Deposited",   value: fmt(master?.totalDeposited ?? 0), color: "text-foreground" },
              { label: "Total Fees",        value: fmt(master?.totalFees ?? 0), color: "text-amber-500" },
            ].map((m) => (
              <div key={m.label} className="rounded-lg bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className={`text-lg font-bold mt-0.5 ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => openModal("withdraw")}
              disabled={!master || master.balance <= 0}
            >
              <ArrowDownCircle className="h-4 w-4" /> Withdraw to Bank
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => openModal("allocate")}
              disabled={!master || master.balance <= 0 || portfolios.length === 0}
            >
              <TrendingUp className="h-4 w-4" /> Allocate to Portfolio
            </Button>
          </div>

          {master && master.balance <= 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              No available balance. Make a deposit to fund your master wallet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Wallets */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Portfolio Wallets</h2>

        {portfolioWallets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No portfolio wallets found.</p>
        ) : (
          portfolioWallets.map((pw) => {
            const portfolio = portfolios.find((p) => p.wallet?.id === pw.id);
            const isExpanded = expandedWallet === pw.id;
            const isPositive = (portfolio?.totalLossGain ?? 0) >= 0;

            return (
              <Card key={pw.id} className="border-l-4 border-l-violet-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-violet-500/10 p-2.5">
                        <Wallet className="h-4 w-4 text-violet-500" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">
                          {pw.userPortfolio?.customName ?? "Portfolio Wallet"}
                        </CardTitle>
                        <CardDescription className="text-xs">{pw.accountNumber}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={pw.status === "ACTIVE"
                          ? "border-green-400/40 text-green-500 bg-green-500/10 text-xs"
                          : "text-xs"}
                      >
                        {pw.status}
                      </Badge>
                      <Button
                        size="sm" variant="ghost"
                        onClick={() => setExpandedWallet(isExpanded ? null : pw.id)}
                        className="h-7 px-2"
                      >
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="rounded-lg bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">NAV</p>
                      <p className="text-base font-bold text-blue-500">{fmt(pw.netAssetValue)}</p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Balance</p>
                      <p className="text-base font-bold">{fmt(pw.balance)}</p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Total Fees</p>
                      <p className="text-base font-bold text-amber-500">{fmt(pw.totalFees)}</p>
                    </div>
                  </div>

                  {portfolio && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Invested: <span className="font-semibold text-foreground">{fmt(portfolio.totalInvested)}</span></span>
                      <span>·</span>
                      <span>Return:
                        <span className={`font-semibold ml-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
                          {isPositive ? "+" : ""}{portfolio.returnPct.toFixed(2)}%
                        </span>
                      </span>
                      <span>·</span>
                      <span>Gain/Loss:
                        <span className={`font-semibold ml-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
                          {fmt(portfolio.totalLossGain)}
                        </span>
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border flex flex-wrap gap-2">
                      <Button
                        size="sm" variant="outline" className="gap-2"
                        onClick={() => openModal("redeem", pw.userPortfolio?.id)}
                        disabled={pw.netAssetValue <= 0}
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Redeem to Master Wallet
                      </Button>
                    </div>

                  {isExpanded && null}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Aggregate */}
      {walletDetail?.aggregateTotals && (
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                { label: "Total Balance",    value: fmt(walletDetail.aggregateTotals.totalBalance) },
                { label: "Total NAV",        value: fmt(walletDetail.aggregateTotals.totalNAV) },
                { label: "Total Fees",       value: fmt(walletDetail.aggregateTotals.totalFees) },
                { label: "Portfolio Count",  value: walletDetail.aggregateTotals.portfolioCount.toString() },
              ].map((s) => (
                <div key={s.label} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Withdraw to Bank Modal */}
      <Dialog open={modal === "withdraw"} onOpenChange={(o) => !isPending && !o && setModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-orange-500" /> Withdraw to Bank
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-muted/30 p-3 text-sm">
              Available: <span className="font-bold text-green-500">{fmt(master?.balance ?? 0)}</span>
            </div>
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="0.01" />
            </div>
            <div className="space-y-1.5">
              <Label>Bank Name</Label>
              <Input placeholder="e.g. Stanbic Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Account Name</Label>
              <Input placeholder="Account holder name" value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Branch</Label>
              <Input placeholder="Branch name" value={bankBranch} onChange={(e) => setBankBranch(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Description (optional)</Label>
              <Input placeholder="Reason for withdrawal" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <p className="text-xs text-muted-foreground">
              Withdrawal requests require admin approval before funds are transferred.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)} disabled={isPending}>Cancel</Button>
            <Button onClick={handleWithdraw} disabled={isPending} className="gap-2">
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate to Portfolio Modal */}
      <Dialog open={modal === "allocate"} onOpenChange={(o) => !isPending && !o && setModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" /> Allocate to Portfolio
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-muted/30 p-3 text-sm">
              Available: <span className="font-bold text-green-500">{fmt(master?.balance ?? 0)}</span>
            </div>
            <div className="space-y-1.5">
              <Label>Select Portfolio</Label>
              <select
                value={selectedPortfolioId}
                onChange={(e) => setSelectedPortfolioId(e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground"
              >
                <option value="">Choose a portfolio…</option>
                {portfolios.map((p) => (
                  <option key={p.id} value={p.id}>{p.customName} — {p.portfolio.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="0.01" />
            </div>
            <div className="space-y-1.5">
              <Label>Description (optional)</Label>
              <Input placeholder="Notes" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <p className="text-xs text-muted-foreground">
              Allocation requests require admin approval. Funds will be deducted from your master wallet balance.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)} disabled={isPending}>Cancel</Button>
            <Button onClick={handleAllocate} disabled={isPending} className="gap-2">
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Redeem to Master Wallet Modal */}
      <Dialog open={modal === "redeem"} onOpenChange={(o) => !isPending && !o && setModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-violet-500" /> Redeem to Master Wallet
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {selectedPortfolioId && (
              <div className="rounded-lg bg-muted/30 p-3 text-sm">
                Portfolio NAV: <span className="font-bold text-blue-500">
                  {fmt(portfolioWallets.find((pw) => pw.userPortfolio?.id === selectedPortfolioId)?.netAssetValue ?? 0)}
                </span>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Amount to Redeem</Label>
              <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="0.01" />
            </div>
            <div className="space-y-1.5">
              <Label>Description (optional)</Label>
              <Input placeholder="Reason for redemption" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <p className="text-xs text-muted-foreground">
              Redemption moves funds from your portfolio wallet back to your master wallet. Requires admin approval.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)} disabled={isPending}>Cancel</Button>
            <Button onClick={handleRedeem} disabled={isPending} className="gap-2">
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
