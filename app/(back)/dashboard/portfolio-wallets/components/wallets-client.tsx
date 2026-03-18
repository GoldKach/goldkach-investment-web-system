// components/back/portfolio-wallets-client.tsx
"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { updatePortfolioWallet, type PortfolioWallet } from "@/actions/portfolio-wallets";
import { syncMasterWallet, updateMasterWallet, type MasterWallet } from "@/actions/master-wallets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Eye, Search, X, Wallet, RefreshCw, Lock, Unlock, DollarSign, TrendingUp, Users } from "lucide-react";

const fmt$ = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    FROZEN: "bg-amber-500/10  text-amber-600  dark:text-amber-400  border-amber-500/20",
    CLOSED: "bg-slate-500/10  text-slate-600  dark:text-slate-400  border-slate-500/20",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${map[status] ?? map.ACTIVE}`}>{status}</span>;
}

/* ── Portfolio Wallets ──────────────────────────────────────────────────── */

export function PortfolioWalletsClient({ initialWallets }: { initialWallets: PortfolioWallet[] }) {
  const [wallets,  setWallets]  = useState<PortfolioWallet[]>(initialWallets);
  const [query,    setQuery]    = useState("");
  const [selected, setSelected] = useState<PortfolioWallet | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [freezeOpen, setFreezeOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = query.trim()
    ? wallets.filter((w) =>
        w.accountNumber.toLowerCase().includes(query.toLowerCase()) ||
        (w.userPortfolio?.customName ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (w.userPortfolio?.portfolio?.name ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : wallets;

  const handleToggleFreeze = () => {
    if (!selected) return;
    const newStatus = selected.status === "FROZEN" ? "ACTIVE" : "FROZEN";
    startTransition(async () => {
      const res = await updatePortfolioWallet(selected.id, { status: newStatus as any });
      if (!res.success) { toast.error(res.error ?? "Failed."); return; }
      toast.success(`Wallet ${newStatus === "FROZEN" ? "frozen" : "unfrozen"}.`);
      setWallets((prev) => prev.map((w) => w.id === selected.id ? { ...w, status: newStatus as any } : w));
      setFreezeOpen(false);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b1f]">
      <div className="bg-white dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2B2F77] dark:bg-[#3B82F6]/20 border border-[#2B2F77]/20 dark:border-[#3B82F6]/30 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white dark:text-[#3B82F6]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Portfolio Wallets</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{wallets.length} wallet{wallets.length !== 1 ? "s" : ""} · per-portfolio balances</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Wallets", value: wallets.length,                                           color: "text-[#3B82F6]" },
            { label: "Active",        value: wallets.filter((w) => w.status === "ACTIVE").length,      color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Total NAV",     value: fmt$(wallets.reduce((s, w) => s + w.netAssetValue, 0)),   color: "text-[#2B2F77] dark:text-[#3B82F6]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
              <span className={`text-lg font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by account number or portfolio name…"
            className="w-full h-10 pl-9 pr-9 rounded-xl border border-slate-200 dark:border-[#2B2F77]/40 bg-white dark:bg-[#0f1135] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors" />
          {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-3.5 h-3.5" /></button>}
        </div>

        <div className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30 hover:bg-slate-50 dark:hover:bg-[#0a0d24]">
                {["Account", "Portfolio", "Balance", "NAV", "Total Fees", "Status", "Actions"].map((h, i) => (
                  <TableHead key={h} className={`text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3.5 ${i === 0 ? "px-6" : ""} ${i >= 2 && i < 5 ? "text-right" : ""} ${i === 6 ? "pr-6 text-right" : ""}`}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-16 text-slate-400 dark:text-slate-500">No wallets found.</TableCell></TableRow>
              ) : filtered.map((w, i) => (
                <TableRow key={w.id} className={`border-b border-slate-100 dark:border-[#2B2F77]/20 hover:bg-slate-50 dark:hover:bg-[#161b4a]/40 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-mono font-bold text-[#2B2F77] dark:text-[#3B82F6]">{w.accountNumber}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{w.userPortfolio?.customName ?? "—"}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{w.userPortfolio?.portfolio?.name ?? ""}</p>
                  </TableCell>
                  <TableCell className="py-4 text-right"><span className="text-sm font-medium text-slate-700 dark:text-slate-200">{fmt$(w.balance)}</span></TableCell>
                  <TableCell className="py-4 text-right"><span className="text-sm font-bold text-slate-900 dark:text-white">{fmt$(w.netAssetValue)}</span></TableCell>
                  <TableCell className="py-4 text-right"><span className="text-sm text-slate-500 dark:text-slate-400">{fmt$(w.totalFees)}</span></TableCell>
                  <TableCell className="py-4"><StatusBadge status={w.status} /></TableCell>
                  <TableCell className="py-4 pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => { setSelected(w); setViewOpen(true); }}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10" title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setSelected(w); setFreezeOpen(true); }}
                        className={`h-8 w-8 p-0 ${w.status === "FROZEN" ? "text-emerald-500 hover:bg-emerald-500/10" : "text-amber-500 hover:bg-amber-500/10"}`}
                        title={w.status === "FROZEN" ? "Unfreeze" : "Freeze"}>
                        {w.status === "FROZEN" ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {wallets.length > 0 && <p className="text-xs text-slate-400 dark:text-slate-500 text-right">{query ? `${filtered.length} of ${wallets.length}` : wallets.length} wallet{wallets.length !== 1 ? "s" : ""}</p>}
      </div>

      {/* Freeze confirm */}
      <AlertDialog open={freezeOpen} onOpenChange={setFreezeOpen}>
        <AlertDialogContent className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50">
          <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-amber-500" />
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-white">
              {selected?.status === "FROZEN" ? "Unfreeze Wallet" : "Freeze Wallet"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
              {selected?.status === "FROZEN"
                ? `Restore wallet ${selected?.accountNumber} to ACTIVE?`
                : `Freeze wallet ${selected?.accountNumber}? No deposits or withdrawals will be processed while frozen.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} className="border-slate-200 dark:border-[#2B2F77]/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161b4a]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleFreeze} disabled={isPending} className="bg-amber-500 hover:bg-amber-600 text-white">
              {isPending ? "Updating…" : selected?.status === "FROZEN" ? "Unfreeze" : "Freeze"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ── Master Wallets ─────────────────────────────────────────────────────── */

export function MasterWalletsClient({ initialWallets }: { initialWallets: MasterWallet[] }) {
  const [wallets,  setWallets]  = useState<MasterWallet[]>(initialWallets);
  const [query,    setQuery]    = useState("");
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const filtered = query.trim()
    ? wallets.filter((w) =>
        w.accountNumber.toLowerCase().includes(query.toLowerCase()) ||
        (w.user?.email ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (`${w.user?.firstName} ${w.user?.lastName}`).toLowerCase().includes(query.toLowerCase())
      )
    : wallets;

  const handleSync = async (userId: string, walletId: string) => {
    setSyncingId(walletId);
    const res = await syncMasterWallet(userId);
    setSyncingId(null);
    if (!res.success) { toast.error(res.error ?? "Sync failed."); return; }
    toast.success("Master wallet synced.");
    if (res.data) setWallets((prev) => prev.map((w) => w.id === walletId ? res.data as MasterWallet : w));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b1f]">
      <div className="bg-white dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2B2F77] dark:bg-[#3B82F6]/20 border border-[#2B2F77]/20 dark:border-[#3B82F6]/30 flex items-center justify-center">
            <Users className="w-4 h-4 text-white dark:text-[#3B82F6]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Master Wallets</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{wallets.length} client master wallet{wallets.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Clients",   value: wallets.length,                                             color: "text-[#3B82F6]" },
            { label: "Total Deposited", value: fmt$(wallets.reduce((s, w) => s + w.totalDeposited, 0)),    color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Total NAV",       value: fmt$(wallets.reduce((s, w) => s + w.netAssetValue, 0)),     color: "text-[#2B2F77] dark:text-[#3B82F6]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
              <span className={`text-lg font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by account, email or client name…"
            className="w-full h-10 pl-9 pr-9 rounded-xl border border-slate-200 dark:border-[#2B2F77]/40 bg-white dark:bg-[#0f1135] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors" />
          {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-3.5 h-3.5" /></button>}
        </div>

        <div className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30 hover:bg-slate-50 dark:hover:bg-[#0a0d24]">
                {["Account", "Client", "Deposited", "Withdrawn", "Total Fees", "NAV", "Status", "Actions"].map((h, i) => (
                  <TableHead key={h} className={`text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3.5 ${i === 0 ? "px-6" : ""} ${i >= 2 && i < 6 ? "text-right" : ""} ${i === 7 ? "pr-6 text-right" : ""}`}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-16 text-slate-400 dark:text-slate-500">No wallets found.</TableCell></TableRow>
              ) : filtered.map((w, i) => (
                <TableRow key={w.id} className={`border-b border-slate-100 dark:border-[#2B2F77]/20 hover:bg-slate-50 dark:hover:bg-[#161b4a]/40 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                  <TableCell className="px-6 py-4"><span className="text-sm font-mono font-bold text-[#2B2F77] dark:text-[#3B82F6]">{w.accountNumber}</span></TableCell>
                  <TableCell className="py-4">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{w.user?.firstName} {w.user?.lastName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{w.user?.email}</p>
                  </TableCell>
                  <TableCell className="py-4 text-right"><span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{fmt$(w.totalDeposited)}</span></TableCell>
                  <TableCell className="py-4 text-right"><span className="text-sm text-rose-500 dark:text-rose-400">{fmt$(w.totalWithdrawn)}</span></TableCell>
                  <TableCell className="py-4 text-right"><span className="text-sm text-slate-500 dark:text-slate-400">{fmt$(w.totalFees)}</span></TableCell>
                  <TableCell className="py-4 text-right"><span className="text-sm font-bold text-slate-900 dark:text-white">{fmt$(w.netAssetValue)}</span></TableCell>
                  <TableCell className="py-4"><StatusBadge status={w.status} /></TableCell>
                  <TableCell className="py-4 pr-6">
                    <Button size="sm" variant="ghost"
                      onClick={() => handleSync(w.userId, w.id)}
                      disabled={syncingId === w.id}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10" title="Sync NAV">
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingId === w.id ? "animate-spin" : ""}`} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {wallets.length > 0 && <p className="text-xs text-slate-400 dark:text-slate-500 text-right">{query ? `${filtered.length} of ${wallets.length}` : wallets.length} wallet{wallets.length !== 1 ? "s" : ""}</p>}
      </div>
    </div>
  );
}

export default PortfolioWalletsClient;