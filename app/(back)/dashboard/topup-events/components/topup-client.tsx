// components/back/topup-events-client.tsx
"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { listTopupEvents, getTopupTimeline, type TopupEvent, type TopupTimelineEntry } from "@/actions/topup-events";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Eye, Search, X, TrendingUp, TrendingDown, Zap, Filter } from "lucide-react";

const fmt$ = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
const fmtDate = (s: string) => new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
      status === "MERGED"
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
    }`}>
      {status}
    </span>
  );
}

function ViewDialog({ event, open, onClose }: { event: TopupEvent | null; open: boolean; onClose: () => void }) {
  if (!event) return null;
  const gainLoss = event.newTotalLossGain;
  const isPos    = gainLoss >= 0;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50 max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-gradient-to-r from-[#2B2F77] via-[#3B82F6] to-[#2B2F77]" />
        <DialogHeader className="pt-2">
          <DialogTitle className="text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 border border-[#2B2F77]/20 dark:border-[#3B82F6]/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-[#2B2F77] dark:text-[#3B82F6]" />
            </div>
            Top-up Event
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
            {event.userPortfolio?.customName ?? "Portfolio"} · <StatusBadge status={event.status} />
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Top-up Amount",     value: fmt$(event.topupAmount)       },
              { label: "Previous Total",    value: fmt$(event.previousTotal)     },
              { label: "New Total Invested", value: fmt$(event.newTotalInvested) },
              { label: "New Close Value",   value: fmt$(event.newTotalCloseValue)},
              { label: "New Fees",          value: fmt$(event.newTotalFees)      },
              { label: "New NAV",           value: fmt$(event.newNetAssetValue)  },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 dark:bg-[#161b4a]/60 border border-slate-100 dark:border-[#2B2F77]/30 rounded-xl p-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">{label}</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className={`rounded-xl p-3 border ${isPos ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}>
            <div className="flex items-center gap-1.5">
              {isPos ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-rose-500" />}
              <span className="text-xs text-slate-500 dark:text-slate-400">Gain / Loss after top-up</span>
            </div>
            <p className={`text-lg font-bold mt-1 ${isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {isPos ? "+" : ""}{fmt$(gainLoss)}
            </p>
          </div>
          {event.mergedSubPortfolios && event.mergedSubPortfolios.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Merged Slices</p>
              {event.mergedSubPortfolios.map((s) => (
                <div key={s.id} className="flex items-center justify-between bg-slate-50 dark:bg-[#161b4a]/60 border border-slate-100 dark:border-[#2B2F77]/30 rounded-lg px-3 py-2 mb-1.5">
                  <span className="text-xs font-bold text-[#2B2F77] dark:text-[#3B82F6] font-mono">X{s.generation > 0 ? s.generation : ""}</span>
                  <span className="text-xs text-slate-500 flex-1 px-3">{s.label}</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{fmt$(s.amountInvested)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

type Props = { initialEvents: TopupEvent[]; initialMeta: any };

export default function TopupEventsClient({ initialEvents, initialMeta }: Props) {
  const [events,   setEvents]   = useState<TopupEvent[]>(initialEvents);
  const [query,    setQuery]    = useState("");
  const [filter,   setFilter]   = useState<"" | "PENDING" | "MERGED">("");
  const [selected, setSelected] = useState<TopupEvent | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const filtered = events.filter((e) => {
    const matchesFilter = filter ? e.status === filter : true;
    const matchesQuery  = query.trim()
      ? (e.userPortfolio?.customName ?? "").toLowerCase().includes(query.toLowerCase()) ||
        e.id.toLowerCase().includes(query.toLowerCase())
      : true;
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b1f]">
      <div className="bg-white dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2B2F77] dark:bg-[#3B82F6]/20 border border-[#2B2F77]/20 dark:border-[#3B82F6]/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white dark:text-[#3B82F6]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Top-up Events</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{events.length} event{events.length !== 1 ? "s" : ""} · full top-up audit trail</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Events", value: events.length,                                           color: "text-[#3B82F6]" },
            { label: "Merged",       value: events.filter((e) => e.status === "MERGED").length,      color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Pending",      value: events.filter((e) => e.status === "PENDING").length,     color: "text-amber-600 dark:text-amber-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
              <span className={`text-2xl font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by portfolio name or event ID…"
              className="w-full h-10 pl-9 pr-9 rounded-xl border border-slate-200 dark:border-[#2B2F77]/40 bg-white dark:bg-[#0f1135] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors" />
            {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-3.5 h-3.5" /></button>}
          </div>
          <div className="flex gap-2">
            {(["", "MERGED", "PENDING"] as const).map((s) => (
              <Button key={s} size="sm" variant="outline" onClick={() => setFilter(s)}
                className={`h-10 px-4 text-xs font-medium rounded-xl transition-colors ${
                  filter === s
                    ? "bg-[#2B2F77] dark:bg-[#3B82F6] text-white border-transparent"
                    : "border-slate-200 dark:border-[#2B2F77]/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2B2F77]/20"
                }`}>
                {s === "" ? "All" : s}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30 hover:bg-slate-50 dark:hover:bg-[#0a0d24]">
                {["Portfolio", "Status", "Top-up Amount", "Prev Total", "New Invested", "New NAV", "Gain/Loss", "Date", ""].map((h, i) => (
                  <TableHead key={i} className={`text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3.5 ${i === 0 ? "px-6" : ""} ${i >= 2 && i < 7 ? "text-right" : ""} ${i === 8 ? "pr-6 text-right" : ""}`}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center py-16 text-slate-400 dark:text-slate-500">No events found.</TableCell></TableRow>
              ) : filtered.map((e, i) => {
                const isPos = e.newTotalLossGain >= 0;
                return (
                  <TableRow key={e.id} className={`border-b border-slate-100 dark:border-[#2B2F77]/20 hover:bg-slate-50 dark:hover:bg-[#161b4a]/40 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                    <TableCell className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{e.userPortfolio?.customName ?? "—"}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{e.userPortfolio?.portfolio?.name ?? ""}</p>
                    </TableCell>
                    <TableCell className="py-4"><StatusBadge status={e.status} /></TableCell>
                    <TableCell className="py-4 text-right"><span className="text-sm font-bold text-[#2B2F77] dark:text-[#3B82F6]">{fmt$(e.topupAmount)}</span></TableCell>
                    <TableCell className="py-4 text-right"><span className="text-sm text-slate-600 dark:text-slate-300">{fmt$(e.previousTotal)}</span></TableCell>
                    <TableCell className="py-4 text-right"><span className="text-sm font-medium text-slate-700 dark:text-slate-200">{fmt$(e.newTotalInvested)}</span></TableCell>
                    <TableCell className="py-4 text-right"><span className="text-sm font-semibold text-slate-900 dark:text-white">{fmt$(e.newNetAssetValue)}</span></TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isPos ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                        <span className={`text-sm font-medium ${isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{isPos ? "+" : ""}{fmt$(e.newTotalLossGain)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4"><span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{e.mergedAt ? fmtDate(e.mergedAt) : "—"}</span></TableCell>
                    <TableCell className="py-4 pr-6">
                      <Button size="sm" variant="ghost" onClick={() => { setSelected(e); setViewOpen(true); }}
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

        {events.length > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-right">
            {query || filter ? `Showing ${filtered.length} of ${events.length}` : `Showing ${events.length}`} event{events.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
      <ViewDialog event={selected} open={viewOpen} onClose={() => setViewOpen(false)} />
    </div>
  );
}