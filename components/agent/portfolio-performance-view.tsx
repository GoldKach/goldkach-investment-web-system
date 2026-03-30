"use client";

import { useState, useTransition } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { PeriodFilter } from "@/components/agent/period-filter";
import { ErrorSection } from "@/components/agent/error-section";
import { listPerformanceReports } from "@/actions/portfolioPerformanceReports";
import type {
  PortfolioPerformanceReport,
  UserPortfolio,
} from "@/actions/portfolioPerformanceReports";

type Period = "daily" | "weekly" | "monthly";

interface PortfolioPerformanceViewProps {
  userPortfolioId: string;
  clientId: string;
  latestReport: PortfolioPerformanceReport | null;
  userPortfolio: UserPortfolio;
  initialReports: PortfolioPerformanceReport[];
  initialPeriod: Period;
}

function fmt(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function MetricCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 p-4">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-lg font-bold ${highlight ? "text-[#2B2F77] dark:text-[#3B82F6]" : "text-slate-800 dark:text-white"}`}>
        {value}
      </p>
    </div>
  );
}

export function PortfolioPerformanceView({
  userPortfolioId,
  latestReport,
  userPortfolio,
  initialReports,
  initialPeriod,
}: PortfolioPerformanceViewProps) {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [reports, setReports] = useState(initialReports);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handlePeriodChange = (p: Period) => {
    setPeriod(p);
    setFilterError(null);
    startTransition(async () => {
      const res = await listPerformanceReports({ userPortfolioId, period: p });
      if (res.success && res.data) {
        setReports([...res.data].sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()));
      } else {
        setFilterError(res.error || "Failed to load reports for this period.");
      }
    });
  };

  const assets = userPortfolio.userAssets ?? [];
  const subPortfolios = latestReport?.subPortfolioSnapshots ?? [];

  return (
    <div className="space-y-8">
      {/* Portfolio name */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          {userPortfolio.customName}
        </h2>
        <p className="text-sm text-slate-400">{userPortfolio.portfolio?.name}</p>
      </div>

      {/* Latest metrics */}
      {latestReport ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <MetricCard label="NAV" value={fmt(latestReport.netAssetValue)} highlight />
          <MetricCard label="Close Value" value={fmt(latestReport.totalCloseValue)} />
          <MetricCard label="Cost Price" value={fmt(latestReport.totalCostPrice)} />
          <MetricCard
            label="Gain / Loss"
            value={fmt(latestReport.totalLossGain)}
          />
          <MetricCard
            label="Return"
            value={`${latestReport.totalPercentage >= 0 ? "+" : ""}${latestReport.totalPercentage.toFixed(2)}%`}
          />
          <MetricCard label="Total Fees" value={fmt(latestReport.totalFees)} />
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">No performance report available yet.</p>
      )}

      {/* Asset Positions */}
      {assets.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Asset Positions</h3>
          <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-slate-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Symbol</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Class</th>
                  <th className="px-4 py-3 text-right">Alloc %</th>
                  <th className="px-4 py-3 text-right">Cost/Share</th>
                  <th className="px-4 py-3 text-right">Shares</th>
                  <th className="px-4 py-3 text-right">Close Value</th>
                  <th className="px-4 py-3 text-right">Gain/Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
                {assets.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{a.asset?.symbol ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{a.asset?.description ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{a.asset?.assetClass ?? "—"}</td>
                    <td className="px-4 py-3 text-right">{a.allocationPercentage.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right">{fmt(a.costPerShare)}</td>
                    <td className="px-4 py-3 text-right">{a.stock}</td>
                    <td className="px-4 py-3 text-right">{fmt(a.closeValue)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${a.lossGain >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {fmt(a.lossGain)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-portfolio history */}
      {subPortfolios.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Sub-Portfolio History</h3>
          <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-slate-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Label</th>
                  <th className="px-4 py-3 text-right">Invested</th>
                  <th className="px-4 py-3 text-right">Cost Price</th>
                  <th className="px-4 py-3 text-right">Close Value</th>
                  <th className="px-4 py-3 text-right">Gain/Loss</th>
                  <th className="px-4 py-3 text-right">Fees</th>
                  <th className="px-4 py-3 text-right">Cash at Bank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
                {subPortfolios.map((s, i) => (
                  <tr key={s.id ?? i} className="hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10">
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{s.label}</td>
                    <td className="px-4 py-3 text-right">{fmt(s.amountInvested)}</td>
                    <td className="px-4 py-3 text-right">{fmt(s.totalCostPrice)}</td>
                    <td className="px-4 py-3 text-right">{fmt(s.totalCloseValue)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${s.totalLossGain >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {fmt(s.totalLossGain)}
                    </td>
                    <td className="px-4 py-3 text-right">{fmt(s.totalFees)}</td>
                    <td className="px-4 py-3 text-right">{fmt(s.cashAtBank)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Historical reports */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Performance History</h3>
          <PeriodFilter value={period} onChange={handlePeriodChange} />
        </div>

        {filterError && <ErrorSection message={filterError} className="mb-3" />}

        {isPending ? (
          <p className="text-sm text-slate-400 italic">Loading…</p>
        ) : reports.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No reports for this period.</p>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-slate-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Close Value</th>
                  <th className="px-4 py-3 text-right">NAV</th>
                  <th className="px-4 py-3 text-right">Gain/Loss</th>
                  <th className="px-4 py-3 text-right">Return %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10">
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {new Date(r.reportDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">{fmt(r.totalCloseValue)}</td>
                    <td className="px-4 py-3 text-right">{fmt(r.netAssetValue)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${r.totalLossGain >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {fmt(r.totalLossGain)}
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${r.totalPercentage >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {r.totalPercentage >= 0 ? "+" : ""}{r.totalPercentage.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
