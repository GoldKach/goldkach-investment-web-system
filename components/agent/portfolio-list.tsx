"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Wallet, FileText, BarChart2, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/agent/empty-state";
import type { PortfolioSummaryItem } from "@/actions/portfolio-summary";

interface PortfolioListProps {
  portfolios: PortfolioSummaryItem[];
  clientId: string;
}

function fmt(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function pct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function PortfolioList({ portfolios, clientId }: PortfolioListProps) {
  const [expandedSnapshots, setExpandedSnapshots] = useState<Set<string>>(new Set());

  const toggleSnapshots = (id: string) => {
    setExpandedSnapshots((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  if (portfolios.length === 0) {
    return <EmptyState message="No portfolios found for this client." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {portfolios.map((p) => {
        const isPositive = p.totalLossGain >= 0;
        const showSnapshots = expandedSnapshots.has(p.id);
        const subPortfolios = p.subPortfolios ?? [];
        const latestReport = p.latestReport;

        return (
          <div
            key={p.id}
            className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 bg-white dark:bg-[#0a0d24] p-5 hover:border-[#2B2F77]/50 dark:hover:border-[#3B82F6]/40 hover:shadow-md transition-all"
          >
            {/* Card body — navigates to portfolio */}
            <Link href={`/agent/clients/${clientId}/portfolios/${p.id}`} className="block">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">{p.customName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.portfolio.name}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-500"}`}>
                  {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {pct(p.returnPct)}
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-1.5 mb-4 flex-wrap">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-slate-500">{p.portfolio.riskTolerance}</Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-slate-500">{p.portfolio.timeHorizon}</Badge>
              </div>

              {/* Financials */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-slate-400 mb-0.5">Invested</p><p className="font-semibold text-slate-700 dark:text-slate-200">{fmt(p.totalInvested)}</p></div>
                <div><p className="text-slate-400 mb-0.5">Current Value</p><p className="font-semibold text-slate-700 dark:text-slate-200">{fmt(p.portfolioValue)}</p></div>
                <div><p className="text-slate-400 mb-0.5">Gain / Loss</p><p className={`font-semibold ${isPositive ? "text-green-600" : "text-red-500"}`}>{fmt(p.totalLossGain)}</p></div>
                <div><p className="text-slate-400 mb-0.5">NAV</p><p className="font-semibold text-slate-700 dark:text-slate-200">{fmt(p.wallet?.netAssetValue ?? 0)}</p></div>
              </div>

              {/* Latest report badge */}
              {latestReport && (
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Layers className="h-3 w-3" />
                  <span>Latest snapshot: {fmtDate(latestReport.reportDate)}</span>
                  <span className={`font-semibold ml-1 ${latestReport.totalLossGain >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {latestReport.totalPercentage >= 0 ? "+" : ""}{latestReport.totalPercentage.toFixed(2)}%
                  </span>
                </div>
              )}

              {/* Wallet footer */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#2B2F77]/20 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1"><Wallet className="h-3 w-3" /><span>{p.wallet?.accountNumber || "—"}</span></div>
                <span>Fees: {fmt(p.wallet?.totalFees ?? 0)}</span>
              </div>
            </Link>

            {/* Snapshots toggle */}
            {subPortfolios.length > 0 && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => toggleSnapshots(p.id)}
                  className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    {subPortfolios.length} sub-portfolio snapshot{subPortfolios.length !== 1 ? "s" : ""}
                  </span>
                  {showSnapshots ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {showSnapshots && (
                  <div className="mt-2 rounded-lg border border-slate-100 dark:border-[#2B2F77]/20 overflow-hidden">
                    <table className="w-full text-[10px]">
                      <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-slate-400 uppercase tracking-wide">
                        <tr>
                          <th className="px-2 py-1.5 text-left">Label</th>
                          <th className="px-2 py-1.5 text-right">Invested</th>
                          <th className="px-2 py-1.5 text-right">Close Value</th>
                          <th className="px-2 py-1.5 text-right">Gain/Loss</th>
                          <th className="px-2 py-1.5 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
                        {subPortfolios.map((s, i) => {
                          const pos = s.totalLossGain >= 0;
                          return (
                            <tr key={s.id ?? i} className="hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10">
                              <td className="px-2 py-1.5 font-medium text-slate-700 dark:text-slate-200">{s.label}</td>
                              <td className="px-2 py-1.5 text-right">{fmt(s.amountInvested)}</td>
                              <td className="px-2 py-1.5 text-right">{fmt(s.totalCloseValue)}</td>
                              <td className={`px-2 py-1.5 text-right font-semibold ${pos ? "text-green-600" : "text-red-500"}`}>{fmt(s.totalLossGain)}</td>
                              <td className="px-2 py-1.5 text-right text-slate-400">{fmtDate(s.snapshotDate)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href={`/agent/clients/${clientId}/portfolios/${p.id}`}>
                <Button size="sm" variant="outline" className="w-full gap-2 text-xs">
                  <BarChart2 className="h-3.5 w-3.5" /> View Portfolio
                </Button>
              </Link>
              <Link href={`/agent/clients/${clientId}/portfolios/${p.id}/reports`}>
                <Button size="sm" variant="outline" className="w-full gap-2 text-xs border-[#2B2F77]/30 text-[#2B2F77] dark:text-[#3B82F6] hover:bg-[#2B2F77]/10">
                  <FileText className="h-3.5 w-3.5" /> View Reports & PDF
                </Button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
