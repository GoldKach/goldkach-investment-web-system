// components/back/user-portfolios-client.tsx
"use client";

import React, { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import {
  createUserPortfolio,
  deleteUserPortfolio,
  recomputeUserPortfolio,
  type UserPortfolioDTO,
  type AssetAllocation,
} from "@/actions/user-portfolios";
import type { PortfolioDTO } from "@/actions/portfolios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  Eye,
  Trash2,
  Search,
  X,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Users,
  DollarSign,
  Percent,
  Check,
  ChevronsUpDown,
  AlertCircle,
  RefreshCw,
  Wallet,
  Loader2,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMasterWalletByUser } from "@/actions/master-wallets";

/* -------------------------------------------------------------------------- */
/*  Brand tokens                                                                */
/* -------------------------------------------------------------------------- */

const inputCls =
  "bg-slate-50 dark:bg-[#161b4a]/60 border-slate-200 dark:border-[#2B2F77]/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-[#3B82F6]/30 focus-visible:border-[#3B82F6]";

/* -------------------------------------------------------------------------- */
/*  Types                                                                       */
/* -------------------------------------------------------------------------- */

type User = {
  id: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
};

type Props = {
  initialUserPortfolios: UserPortfolioDTO[];
  allPortfolios:         PortfolioDTO[];
  allUsers:              User[];
};

type AllocationRow = {
  assetId:                     string;
  symbol:                      string;
  description:                 string;
  defaultAllocationPercentage: number;
  defaultCostPerShare:         number;
  closePrice:                  number;
  allocationPercentage:        number;
  costPerShare:                number;
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const fmt$ = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

const fmtPct = (v: number) => `${Number(v).toFixed(2)}%`;

const fmtDate = (s?: string) =>
  s ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(s)) : "—";

function userName(u?: { name?: string | null; firstName?: string | null; lastName?: string | null; email?: string | null } | null) {
  if (!u) return "—";
  if (u.name) return u.name;
  if (u.firstName || u.lastName) return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  return u.email ?? "—";
}

/* -------------------------------------------------------------------------- */
/*  Create dialog                                                               */
/* -------------------------------------------------------------------------- */

function CreateDialog({
  open,
  allPortfolios,
  allUsers,
  onClose,
  onCreated,
}: {
  open:          boolean;
  allPortfolios: PortfolioDTO[];
  allUsers:      User[];
  onClose:       () => void;
  onCreated:     (up: UserPortfolioDTO) => void;
}) {
  const [userId,          setUserId]          = useState("");
  const [portfolioId,     setPortfolioId]     = useState("");
  const [customName,      setCustomName]      = useState("");
  const [amountInvested,  setAmountInvested]  = useState("");
  const [bankFee,         setBankFee]         = useState("30");
  const [transactionFee,  setTransactionFee]  = useState("10");
  const [feeAtBank,       setFeeAtBank]       = useState("10");
  const [allocations,     setAllocations]     = useState<AllocationRow[]>([]);
  const [userOpen,        setUserOpen]        = useState(false);
  const [portfolioOpen,   setPortfolioOpen]   = useState(false);
  const [isPending, startTransition] = useTransition();

  // Master wallet balance for the selected user
  const [masterBalance,     setMasterBalance]     = useState<number | null>(null);
  const [loadingBalance,    setLoadingBalance]    = useState(false);

  // Reset on open
  useEffect(() => {
    if (open) {
      setUserId(""); setPortfolioId(""); setCustomName("");
      setAmountInvested(""); setAllocations([]);
      setBankFee("30"); setTransactionFee("10"); setFeeAtBank("10");
      setMasterBalance(null);
    }
  }, [open]);

  // Fetch master wallet balance whenever the selected user changes
  useEffect(() => {
    if (!userId) { setMasterBalance(null); return; }
    setLoadingBalance(true);
    getMasterWalletByUser(userId)
      .then((res) => {
        if (res.success && res.data) {
          setMasterBalance(Number(res.data.masterWallet?.balance ?? 0));
        } else {
          setMasterBalance(0);
        }
      })
      .catch(() => setMasterBalance(0))
      .finally(() => setLoadingBalance(false));
  }, [userId]);

  // Populate allocations when portfolio selected
  useEffect(() => {
    if (!portfolioId) { setAllocations([]); return; }
    const p = allPortfolios.find((p) => p.id === portfolioId);
    const assets = p?.assets ?? [];
    if (assets.length === 0) {
      toast.error("This portfolio has no assets. Add assets to it first.");
      setAllocations([]);
      return;
    }
    setAllocations(
      assets.map((pa) => ({
        assetId:                     pa.assetId,
        symbol:                      pa.asset.symbol,
        description:                 pa.asset.description,
        defaultAllocationPercentage: pa.defaultAllocationPercentage,
        defaultCostPerShare:         pa.defaultCostPerShare,
        closePrice:                  pa.asset.closePrice,
        allocationPercentage:        pa.defaultAllocationPercentage,
        costPerShare:                pa.defaultCostPerShare,
      }))
    );
    // Auto-fill custom name from portfolio name
    const pName = p?.name ?? "";
    setCustomName(pName);
  }, [portfolioId, allPortfolios]);

  const totalAlloc = allocations.reduce((s, a) => s + a.allocationPercentage, 0);

  const handleAlloc = (assetId: string, field: "allocationPercentage" | "costPerShare", val: string) => {
    setAllocations((prev) =>
      prev.map((a) => a.assetId === assetId ? { ...a, [field]: parseFloat(val) || 0 } : a)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !portfolioId) { toast.error("Select user and portfolio."); return; }
    if (!customName.trim()) { toast.error("Portfolio name is required."); return; }
    const amount = parseFloat(amountInvested);
    if (!amount || amount <= 0) { toast.error("Enter a valid amount invested."); return; }
    if (masterBalance !== null && amount > masterBalance) {
      toast.error(`Amount exceeds available master wallet balance (${fmt$(masterBalance)}).`);
      return;
    }
    if (masterBalance !== null && masterBalance <= 0) {
      toast.error("This user has no funds in their master wallet. Please deposit first.");
      return;
    }
    if (allocations.length === 0) { toast.error("Portfolio has no assets."); return; }

    startTransition(async () => {
      const res = await createUserPortfolio({
        userId,
        portfolioId,
        customName:      customName.trim(),
        amountInvested:  amount,
        bankFee:         parseFloat(bankFee)        || 30,
        transactionFee:  parseFloat(transactionFee) || 10,
        feeAtBank:       parseFloat(feeAtBank)      || 10,
        assetAllocations: allocations.map((a) => ({
          assetId:              a.assetId,
          allocationPercentage: a.allocationPercentage,
          costPerShare:         a.costPerShare,
        })),
      });
      if (!res.success || !res.data) { toast.error(res.error ?? "Failed to create."); return; }
      toast.success("Portfolio assigned successfully.");
      onCreated(res.data);
      onClose();
    });
  };

  const selectedUser      = allUsers.find((u) => u.id === userId);
  const selectedPortfolio = allPortfolios.find((p) => p.id === portfolioId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50">
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-gradient-to-r from-[#2B2F77] via-[#3B82F6] to-[#2B2F77]" />

        <DialogHeader className="pt-2">
          <DialogTitle className="text-slate-900 dark:text-white text-lg">
            Assign Portfolio to User
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Select a user and portfolio, set a custom name, amount invested, and adjust per-asset allocations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-1">

          {/* User + Portfolio pickers */}
          <div className="grid grid-cols-2 gap-4">
            {/* User picker */}
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                User <span className="text-rose-500">*</span>
              </Label>
              <Popover open={userOpen} onOpenChange={setUserOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox"
                    className={`w-full justify-between h-9 text-sm ${inputCls}`}>
                    {selectedUser ? userName(selectedUser) : "Select user…"}
                    <ChevronsUpDown className="ml-2 w-3.5 h-3.5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 bg-white dark:bg-[#0f1135] border-slate-200 dark:border-[#2B2F77]/50">
                  <Command className="bg-transparent">
                    <CommandInput placeholder="Search users…" className="text-sm" />
                    <CommandEmpty className="text-xs text-slate-400 py-4 text-center">No user found.</CommandEmpty>
                    <CommandGroup className="max-h-56 overflow-y-auto">
                      {allUsers.map((u) => (
                        <CommandItem key={u.id} value={`${userName(u)} ${u.email}`}
                          onSelect={() => { setUserId(u.id); setUserOpen(false); }}
                          className="text-slate-900 dark:text-white cursor-pointer">
                          <Check className={cn("mr-2 w-3.5 h-3.5", userId === u.id ? "opacity-100 text-[#3B82F6]" : "opacity-0")} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{userName(u)}</p>
                            <p className="text-xs text-slate-400 truncate">{u.email}</p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Portfolio picker */}
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                Portfolio Template <span className="text-rose-500">*</span>
              </Label>
              <Popover open={portfolioOpen} onOpenChange={setPortfolioOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox"
                    className={`w-full justify-between h-9 text-sm ${inputCls}`}>
                    {selectedPortfolio ? selectedPortfolio.name : "Select portfolio…"}
                    <ChevronsUpDown className="ml-2 w-3.5 h-3.5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 bg-white dark:bg-[#0f1135] border-slate-200 dark:border-[#2B2F77]/50">
                  <Command className="bg-transparent">
                    <CommandInput placeholder="Search portfolios…" className="text-sm" />
                    <CommandEmpty className="text-xs text-slate-400 py-4 text-center">No portfolio found.</CommandEmpty>
                    <CommandGroup className="max-h-56 overflow-y-auto">
                      {allPortfolios.map((p) => (
                        <CommandItem key={p.id} value={p.name}
                          onSelect={() => { setPortfolioId(p.id); setPortfolioOpen(false); }}
                          className="text-slate-900 dark:text-white cursor-pointer">
                          <Check className={cn("mr-2 w-3.5 h-3.5", portfolioId === p.id ? "opacity-100 text-[#3B82F6]" : "opacity-0")} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{p.name}</p>
                            {p.description && <p className="text-xs text-slate-400 truncate">{p.description}</p>}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Custom name + amount invested */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                Portfolio Name (for this client) <span className="text-rose-500">*</span>
              </Label>
              <Input
                placeholder="e.g., John's Growth Portfolio"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className={inputCls}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500">
                The same template can be enrolled multiple times under different names
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                Amount to Allocate (USD) <span className="text-rose-500">*</span>
              </Label>

              {/* Balance banner */}
              {userId && (
                loadingBalance ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Checking available balance…
                  </div>
                ) : masterBalance !== null && masterBalance <= 0 ? (
                  <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2">
                    <Ban className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">No funds available</p>
                      <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                        Please deposit to this account first before allocating to a portfolio.
                      </p>
                    </div>
                  </div>
                ) : masterBalance !== null ? (
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
                    <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      Available master wallet balance: <span className="font-bold">{fmt$(masterBalance)}</span>
                    </p>
                  </div>
                ) : null
              )}

              <Input
                type="number"
                step="0.01"
                min="0"
                max={masterBalance !== null && masterBalance > 0 ? masterBalance : undefined}
                placeholder={
                  masterBalance !== null && masterBalance > 0
                    ? `Max ${fmt$(masterBalance)}`
                    : "e.g., 5000.00"
                }
                value={amountInvested}
                onChange={(e) => setAmountInvested(e.target.value)}
                disabled={masterBalance !== null && masterBalance <= 0}
                className={inputCls}
              />

              {/* Over-balance warning */}
              {masterBalance !== null && masterBalance > 0 && amountInvested && parseFloat(amountInvested) > masterBalance && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Exceeds available balance of {fmt$(masterBalance)}
                </p>
              )}

              <p className="text-xs text-slate-400 dark:text-slate-500">
                Must not exceed the client's master wallet cash balance
              </p>
            </div>
          </div>

          {/* Fee / Deduction rates */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                Fee Rates (%)
              </Label>
              <span className="text-xs text-slate-400 dark:text-slate-500">— stored on this portfolio's wallet</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                  Bank Fee %
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="30"
                  value={bankFee}
                  onChange={(e) => setBankFee(e.target.value)}
                  className={inputCls}
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">Default: 30%</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                  Transaction Fee %
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="10"
                  value={transactionFee}
                  onChange={(e) => setTransactionFee(e.target.value)}
                  className={inputCls}
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">Default: 10%</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                  Fee at Bank %
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="10"
                  value={feeAtBank}
                  onChange={(e) => setFeeAtBank(e.target.value)}
                  className={inputCls}
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">Default: 10%</p>
              </div>
            </div>
          </div>

          {/* No assets warning */}
          {portfolioId && allocations.length === 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">No assets in this portfolio</p>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                  Add assets via Portfolio Asset Management before assigning to users.
                </p>
              </div>
            </div>
          )}

          {/* Asset allocations */}
          {allocations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
                  Asset Allocations
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Total:</span>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-full border ${
                    Math.abs(totalAlloc - 100) < 0.01
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  }`}>
                    {fmtPct(totalAlloc)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {allocations.map((a) => (
                  <div key={a.assetId} className="bg-slate-50 dark:bg-[#161b4a]/40 border border-slate-200 dark:border-[#2B2F77]/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 border border-[#2B2F77]/20 dark:border-[#3B82F6]/20 flex items-center justify-center shrink-0">
                          <span className="text-[9px] font-black text-[#2B2F77] dark:text-[#3B82F6] font-mono leading-none">
                            {a.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold font-mono text-slate-900 dark:text-white">{a.symbol}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[200px]">{a.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-400 dark:text-slate-500">Close Price</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{fmt$(a.closePrice)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-slate-500 dark:text-slate-400">Allocation %</Label>
                          <span className="text-xs text-slate-400 dark:text-slate-500">Default: {a.defaultAllocationPercentage}%</span>
                        </div>
                        <Input
                          type="number" step="0.01" min="0" max="100"
                          value={a.allocationPercentage}
                          onChange={(e) => handleAlloc(a.assetId, "allocationPercentage", e.target.value)}
                          className={`h-8 text-sm ${inputCls}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-slate-500 dark:text-slate-400">Cost/Share</Label>
                          <span className="text-xs text-slate-400 dark:text-slate-500">Default: {fmt$(a.defaultCostPerShare)}</span>
                        </div>
                        <Input
                          type="number" step="0.01" min="0"
                          value={a.costPerShare}
                          onChange={(e) => handleAlloc(a.assetId, "costPerShare", e.target.value)}
                          className={`h-8 text-sm ${inputCls}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {Math.abs(totalAlloc - 100) > 0.01 && totalAlloc > 0 && (
                <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-3 py-2 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Total allocation is {fmtPct(totalAlloc)}. Consider adjusting to 100%.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={
                isPending ||
                !userId ||
                !portfolioId ||
                allocations.length === 0 ||
                loadingBalance ||
                (masterBalance !== null && masterBalance <= 0) ||
                (masterBalance !== null && amountInvested !== "" && parseFloat(amountInvested) > masterBalance)
              }
              className="flex-1 bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold h-9"
            >
              {isPending ? "Assigning…" : "Assign Portfolio"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}
              className="h-9 border-slate-200 dark:border-[#2B2F77]/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161b4a]/60">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  View dialog                                                                 */
/* -------------------------------------------------------------------------- */

function ViewDialog({
  up,
  open,
  onClose,
  onDelete,
  onRecompute,
}: {
  up:          UserPortfolioDTO | null;
  open:        boolean;
  onClose:     () => void;
  onDelete:    () => void;
  onRecompute: (id: string) => void;
}) {
  if (!up) return null;
  const assets     = up.userAssets ?? [];
  const totalGain  = assets.reduce((s, a) => s + (a.lossGain ?? 0), 0);
  const isPos      = totalGain >= 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50">
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-gradient-to-r from-[#2B2F77] via-[#3B82F6] to-[#2B2F77]" />

        <DialogHeader className="pt-2">
          <DialogTitle className="text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 border border-[#2B2F77]/20 dark:border-[#3B82F6]/20 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4 text-[#2B2F77] dark:text-[#3B82F6]" />
            </div>
            {up.customName}
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            {userName(up.user)} · {up.portfolio?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Portfolio Value",  value: fmt$(up.portfolioValue ?? 0), icon: DollarSign },
              { label: "Total Invested",   value: fmt$(up.totalInvested  ?? 0), icon: Wallet     },
              { label: "Total Gain/Loss",  value: `${isPos ? "+" : ""}${fmt$(totalGain)}`, icon: isPos ? TrendingUp : TrendingDown, color: isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400" },
              { label: "Assets",           value: `${assets.length}`,           icon: Briefcase  },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-slate-50 dark:bg-[#161b4a]/60 border border-slate-100 dark:border-[#2B2F77]/30 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${color ?? "text-[#3B82F6]"}`} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                </div>
                <p className={`text-sm font-bold ${color ?? "text-slate-900 dark:text-white"}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Wallet info */}
          {up.wallet && (
            <div className="bg-[#2B2F77]/5 dark:bg-[#3B82F6]/5 border border-[#2B2F77]/15 dark:border-[#3B82F6]/15 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Portfolio Wallet</p>
                <p className="text-sm font-bold font-mono text-[#2B2F77] dark:text-[#3B82F6]">{up.wallet.accountNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">NAV</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{fmt$(up.wallet.netAssetValue ?? 0)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Total Fees</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{fmt$(up.wallet.totalFees ?? 0)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Status</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  up.wallet.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                }`}>{up.wallet.status}</span>
              </div>
            </div>
          )}

          {/* Asset table */}
          {assets.length > 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/40 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30 hover:bg-slate-50 dark:hover:bg-[#0a0d24]">
                    {["Asset", "Alloc %", "Cost/Share", "Shares", "Close Price", "Value", "Gain/Loss"].map((h, i) => (
                      <TableHead key={h} className={`text-xs font-semibold text-slate-500 dark:text-slate-400 py-2.5 ${i === 0 ? "px-4" : ""} ${i >= 1 ? "text-right" : ""}`}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((a, i) => {
                    const isAssetPos = (a.lossGain ?? 0) >= 0;
                    return (
                      <TableRow key={a.id} className={`border-b border-slate-100 dark:border-[#2B2F77]/20 hover:bg-slate-50 dark:hover:bg-[#161b4a]/40 ${i === assets.length - 1 ? "border-b-0" : ""}`}>
                        <TableCell className="px-4 py-2.5">
                          <p className="text-xs font-bold font-mono text-[#2B2F77] dark:text-[#3B82F6]">{a.asset?.symbol}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[120px]">{a.asset?.description}</p>
                        </TableCell>
                        <TableCell className="py-2.5 text-right"><span className="text-xs font-medium text-slate-700 dark:text-slate-200">{fmtPct(a.allocationPercentage)}</span></TableCell>
                        <TableCell className="py-2.5 text-right"><span className="text-xs text-slate-600 dark:text-slate-300">{fmt$(a.costPerShare)}</span></TableCell>
                        <TableCell className="py-2.5 text-right"><span className="text-xs text-slate-600 dark:text-slate-300">{(a.stock ?? 0).toFixed(4)}</span></TableCell>
                        <TableCell className="py-2.5 text-right"><span className="text-xs text-slate-600 dark:text-slate-300">{fmt$(a.asset?.closePrice ?? 0)}</span></TableCell>
                        <TableCell className="py-2.5 text-right"><span className="text-xs font-semibold text-slate-900 dark:text-white">{fmt$(a.closeValue ?? 0)}</span></TableCell>
                        <TableCell className="py-2.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {isAssetPos ? <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" /> : <TrendingDown className="w-3 h-3 text-rose-500 shrink-0" />}
                            <span className={`text-xs font-medium ${isAssetPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                              {isAssetPos ? "+" : ""}{fmt$(a.lossGain ?? 0)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { label: "Created", value: fmtDate(up.createdAt) },
              { label: "Updated", value: fmtDate(up.updatedAt) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 dark:bg-[#161b4a]/60 rounded-xl p-3 border border-slate-100 dark:border-[#2B2F77]/30">
                <span className="text-slate-400 dark:text-slate-500">{label}</span>
                <p className="font-medium text-slate-700 dark:text-slate-200 mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              onClick={() => onRecompute(up.id)}
              variant="outline"
              className="flex-1 h-9 border-[#2B2F77]/30 dark:border-[#3B82F6]/30 text-[#2B2F77] dark:text-[#3B82F6] hover:bg-[#2B2F77]/10 dark:hover:bg-[#3B82F6]/10 text-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Recompute Positions
            </Button>
            <Button
              onClick={onDelete}
              variant="outline"
              className="h-9 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Delete dialog                                                               */
/* -------------------------------------------------------------------------- */

function DeleteDialog({
  up,
  open,
  onClose,
  onDeleted,
}: {
  up:        UserPortfolioDTO | null;
  open:      boolean;
  onClose:   () => void;
  onDeleted: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!up) return;
    startTransition(async () => {
      const res = await deleteUserPortfolio(up.id);
      if (!res.success) { toast.error(res.error ?? "Failed to delete."); return; }
      toast.success("Portfolio removed.");
      onDeleted(up.id);
      onClose();
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50">
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-rose-500" />
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-900 dark:text-white">Delete User Portfolio</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
            Remove <span className="font-semibold text-slate-700 dark:text-slate-200">{up?.customName}</span> from{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{userName(up?.user)}</span>?
            {(up?.userAssets?.length ?? 0) > 0 && (
              <> All {up!.userAssets!.length} asset positions, the portfolio wallet, and sub-portfolio slices will be permanently deleted.</>
            )}
            {" "}This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}
            className="border-slate-200 dark:border-[#2B2F77]/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161b4a]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-rose-600 hover:bg-rose-700 text-white">
            {isPending ? "Deleting…" : "Delete Portfolio"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                              */
/* -------------------------------------------------------------------------- */

export default function UserPortfoliosClient({ initialUserPortfolios, allPortfolios, allUsers }: Props) {
  const [items,      setItems]      = useState<UserPortfolioDTO[]>(initialUserPortfolios);
  const [query,      setQuery]      = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen,   setViewOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected,   setSelected]   = useState<UserPortfolioDTO | null>(null);
  const [isPending,  startTransition] = useTransition();

  const openView   = (up: UserPortfolioDTO) => { setSelected(up); setViewOpen(true); };
  const openDelete = (up: UserPortfolioDTO) => { setSelected(up); setDeleteOpen(true); };

  const handleCreated  = (up: UserPortfolioDTO) => setItems((prev) => [up, ...prev]);
  const handleDeleted  = (id: string)           => setItems((prev) => prev.filter((p) => p.id !== id));

  const handleRecompute = (id: string) => {
    startTransition(async () => {
      const res = await recomputeUserPortfolio(id);
      if (!res.success) { toast.error(res.error ?? "Recompute failed."); return; }
      toast.success("Positions recomputed.");
      if (res.data) setItems((prev) => prev.map((p) => p.id === id ? res.data as UserPortfolioDTO : p));
    });
  };

  const filtered = query.trim()
    ? items.filter((up) =>
        (up.customName ?? "").toLowerCase().includes(query.toLowerCase()) ||
        userName(up.user).toLowerCase().includes(query.toLowerCase()) ||
        (up.user?.email ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (up.portfolio?.name ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : items;

  const totalNAV = items.reduce((s, up) => s + (up.wallet?.netAssetValue ?? up.portfolioValue ?? 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b1f]">

      {/* Header */}
      <div className="bg-white dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2B2F77] dark:bg-[#3B82F6]/20 border border-[#2B2F77]/20 dark:border-[#3B82F6]/30 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white dark:text-[#3B82F6]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Portfolio Allocation</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {items.length} portfolio assignment{items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold h-9 shadow-lg shadow-[#2B2F77]/20 dark:shadow-[#3B82F6]/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Assign Portfolio
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Assignments", value: items.length,                                          color: "text-[#3B82F6]" },
            { label: "Unique Clients",    value: new Set(items.map((i) => i.userId)).size,              color: "text-[#2B2F77] dark:text-[#3B82F6]" },
            { label: "Active Portfolios", value: items.filter((i) => i.isActive !== false).length,     color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Total NAV",         value: fmt$(totalNAV),                                        color: "text-slate-900 dark:text-white", small: true },
          ].map(({ label, value, color, small }) => (
            <div key={label} className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
              <span className={`font-bold ${color} ${small ? "text-base" : "text-2xl"}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by client name, email or portfolio…"
            className="w-full h-10 pl-9 pr-9 rounded-xl border border-slate-200 dark:border-[#2B2F77]/40 bg-white dark:bg-[#0f1135] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors" />
          {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-3.5 h-3.5" /></button>}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 border border-[#2B2F77]/20 dark:border-[#3B82F6]/20 flex items-center justify-center mb-4">
                <Briefcase className="w-7 h-7 text-[#2B2F77] dark:text-[#3B82F6]" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                {query ? "No results found" : "No portfolios assigned yet"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-xs">
                {query ? "Try a different search term." : "Assign a portfolio to a user to get started."}
              </p>
              {!query && (
                <Button onClick={() => setCreateOpen(true)}
                  className="bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white h-9 text-sm">
                  <Plus className="w-4 h-4 mr-1.5" />Assign Portfolio
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30 hover:bg-slate-50 dark:hover:bg-[#0a0d24]">
                  {[
                    { h: "Client",          cls: "px-6" },
                    { h: "Custom Name",     cls: "" },
                    { h: "Portfolio",       cls: "" },
                    { h: "Assets",          cls: "text-center" },
                    { h: "Portfolio Value", cls: "text-right" },
                    { h: "Gain/Loss",       cls: "text-right" },
                    { h: "NAV",             cls: "text-right" },
                    { h: "Actions",         cls: "text-right pr-6" },
                  ].map(({ h, cls }) => (
                    <TableHead key={h} className={`text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3.5 ${cls}`}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((up, i) => {
                  const totalGain = (up.userAssets ?? []).reduce((s, a) => s + (a.lossGain ?? 0), 0);
                  const isPos     = totalGain >= 0;
                  return (
                    <TableRow key={up.id}
                      className={`border-b border-slate-100 dark:border-[#2B2F77]/20 hover:bg-slate-50 dark:hover:bg-[#161b4a]/40 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                      <TableCell className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{userName(up.user)}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[140px]">{up.user?.email}</p>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{up.customName}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 text-[#2B2F77] dark:text-[#3B82F6] border border-[#2B2F77]/20 dark:border-[#3B82F6]/20">
                          {up.portfolio?.name ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-[#161b4a]/60 rounded-full px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                          {up.userAssets?.length ?? 0}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{fmt$(up.portfolioValue ?? 0)}</span>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isPos ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                          <span className={`text-sm font-medium ${isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                            {isPos ? "+" : ""}{fmt$(totalGain)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {fmt$(up.wallet?.netAssetValue ?? up.portfolioValue ?? 0)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openView(up)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10" title="View">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleRecompute(up.id)}
                            disabled={isPending}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-[#2B2F77] dark:hover:text-[#3B82F6] hover:bg-[#2B2F77]/10 dark:hover:bg-[#3B82F6]/10" title="Recompute">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openDelete(up)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {items.length > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-right">
            {query ? `${filtered.length} of ${items.length}` : items.length} assignment{items.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Dialogs */}
      <CreateDialog
        open={createOpen}
        allPortfolios={allPortfolios}
        allUsers={allUsers}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />
      <ViewDialog
        up={selected}
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        onDelete={() => { setViewOpen(false); setDeleteOpen(true); }}
        onRecompute={(id) => { setViewOpen(false); handleRecompute(id); }}
      />
      <DeleteDialog
        up={selected}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={handleDeleted}
      />
    </div>
  );
}