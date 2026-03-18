// components/back/sub-portfolios-client.tsx
"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Eye, Search, X, Layers, BarChart3, DollarSign, Percent, TrendingUp, TrendingDown } from "lucide-react";
import { listSubPortfolios, SubPortfolio } from "@/actions/subportfolio";

const fmt$ = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
const fmtPct = (v: number) => `${Number(v).toFixed(2)}%`;

function GenerationBadge({ gen }: { gen: number }) {
  const labels = ["X", "X1", "X2", "X3", "X4", "X5"];
  const label = labels[gen] ?? `X${gen}`;
  const colors = [
    "bg-[#2B2F77]/10 dark:bg-[#3B82F6]/15 text-[#2B2F77] dark:text-[#3B82F6] border-[#2B2F77]/20 dark:border-[#3B82F6]/20",
    "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  ];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border font-mono ${colors[gen] ?? colors[4]}`}>
      {label}
    </span>
  );
}

function ViewDialog({ sub, open, onClose }: { sub: SubPortfolio | null; open: boolean; onClose: () => void }) {
  if (!sub) return null;
  const isPos = sub.totalLossGain >= 0;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50 max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-gradient-to-r from-[#2B2F77] via-[#3B82F6] to-[#2B2F77]" />
        <DialogHeader className="pt-2">
          <DialogTitle className="text-slate-900 dark:text-white flex items-center gap-2">
            <GenerationBadge gen={sub.generation} />
            <span className="text-sm font-semibold">{sub.label}</span>
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
            {sub.userPortfolio?.customName ?? "Portfolio"} · Snapshot {new Date(sub.snapshotDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Amount Invested",  value: fmt$(sub.amountInvested),  icon: DollarSign },
              { label: "Total Cost Price", value: fmt$(sub.totalCostPrice),  icon: DollarSign },
              { label: "Close Value",      value: fmt$(sub.totalCloseValue), icon: TrendingUp },
              { label: "Total Fees",       value: fmt$(sub.totalFees),       icon: Percent    },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-slate-50 dark:bg-[#161b4a]/60 border border-slate-100 dark:border-[#2B2F77]/30 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className={`rounded-xl p-3 border ${isPos ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}>
            <div className="flex items-center gap-2">
              {isPos ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-rose-500" />}
              <span className="text-xs text-slate-500 dark:text-slate-400">Gain / Loss</span>
            </div>
            <p className={`text-lg font-bold mt-1 ${isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {isPos ? "+" : ""}{fmt$(sub.totalLossGain)}
            </p>
          </div>
          {sub.assets && sub.assets.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Assets in slice</p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {sub.assets.map((a) => (
                  <div key={a.id} className="flex items-center justify-between bg-slate-50 dark:bg-[#161b4a]/60 border border-slate-100 dark:border-[#2B2F77]/30 rounded-lg px-3 py-2">
                    <span className="text-xs font-bold font-mono text-[#2B2F77] dark:text-[#3B82F6] w-12">{a.asset?.symbol}</span>
                    <span className="text-xs text-slate-500 flex-1 text-center">{fmtPct(a.allocationPercentage)}</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{fmt$(a.closeValue)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SubPortfoliosClient() {
  const [userPortfolioId, setUserPortfolioId] = useState("");
  const [items, setItems]   = useState<SubPortfolio[]>([]);
  const [query, setQuery]   = useState("");
  const [selected, setSelected] = useState<SubPortfolio | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    if (!userPortfolioId.trim()) { toast.error("Enter a UserPortfolio ID."); return; }
    startTransition(async () => {
      const res = await listSubPortfolios(userPortfolioId.trim());
      if (!res.success) { toast.error(res.error ?? "Failed to load."); return; }
      setItems(res.data ?? []);
      setHasSearched(true);
    });
  };

  const filtered = query.trim()
    ? items.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        String(i.generation).includes(query)
      )
    : items;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b1f]">
      <div className="bg-white dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2B2F77] dark:bg-[#3B82F6]/20 border border-[#2B2F77]/20 dark:border-[#3B82F6]/30 flex items-center justify-center">
            <Layers className="w-4 h-4 text-white dark:text-[#3B82F6]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Sub-Portfolios</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Investment slices (X, X1, X2…) per portfolio</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        {/* Portfolio ID lookup */}
        <div className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl p-4 flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">UserPortfolio ID</label>
            <Input
              placeholder="Paste a UserPortfolio ID…"
              value={userPortfolioId}
              onChange={(e) => setUserPortfolioId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-slate-50 dark:bg-[#161b4a]/60 border-slate-200 dark:border-[#2B2F77]/50 text-slate-900 dark:text-white focus-visible:border-[#3B82F6]"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isPending}
            className="bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white h-10 px-5"
          >
            {isPending ? "Loading…" : "Load Slices"}
          </Button>
        </div>

        {hasSearched && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Slices",    value: items.length,                                                   color: "text-[#3B82F6]" },
                { label: "Total Invested",  value: fmt$(items.reduce((s, i) => s + i.amountInvested, 0)),          color: "text-[#2B2F77] dark:text-[#3B82F6]" },
                { label: "Total Gain/Loss", value: fmt$(items.reduce((s, i) => s + i.totalLossGain, 0)),           color: items.reduce((s, i) => s + i.totalLossGain, 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                  <span className={`text-base font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter slices…"
                className="w-full h-10 pl-9 pr-9 rounded-xl border border-slate-200 dark:border-[#2B2F77]/40 bg-white dark:bg-[#0f1135] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors" />
              {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-3.5 h-3.5" /></button>}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30 hover:bg-slate-50 dark:hover:bg-[#0a0d24]">
                    {["Slice", "Label", "Invested", "Cost Price", "Close Value", "Gain/Loss", "Fees", "Actions"].map((h, i) => (
                      <TableHead key={h} className={`text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3.5 ${i === 0 ? "px-6" : ""} ${i >= 2 ? "text-right" : ""} ${i === 7 ? "pr-6" : ""}`}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-16 text-slate-400 dark:text-slate-500">No slices found.</TableCell></TableRow>
                  ) : filtered.map((s, i) => {
                    const isPos = s.totalLossGain >= 0;
                    return (
                      <TableRow key={s.id} className={`border-b border-slate-100 dark:border-[#2B2F77]/20 hover:bg-slate-50 dark:hover:bg-[#161b4a]/40 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                        <TableCell className="px-6 py-4"><GenerationBadge gen={s.generation} /></TableCell>
                        <TableCell className="py-4"><span className="text-sm font-medium text-slate-700 dark:text-slate-200">{s.label}</span></TableCell>
                        <TableCell className="py-4 text-right"><span className="text-sm font-medium text-slate-700 dark:text-slate-200">{fmt$(s.amountInvested)}</span></TableCell>
                        <TableCell className="py-4 text-right"><span className="text-sm text-slate-600 dark:text-slate-300">{fmt$(s.totalCostPrice)}</span></TableCell>
                        <TableCell className="py-4 text-right"><span className="text-sm font-semibold text-slate-900 dark:text-white">{fmt$(s.totalCloseValue)}</span></TableCell>
                        <TableCell className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {isPos ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                            <span className={`text-sm font-medium ${isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{isPos ? "+" : ""}{fmt$(s.totalLossGain)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-right"><span className="text-sm text-slate-500 dark:text-slate-400">{fmt$(s.totalFees)}</span></TableCell>
                        <TableCell className="py-4 pr-6">
                          <Button size="sm" variant="ghost" onClick={() => { setSelected(s); setViewOpen(true); }}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      <ViewDialog sub={selected} open={viewOpen} onClose={() => setViewOpen(false)} />
    </div>
  );
}