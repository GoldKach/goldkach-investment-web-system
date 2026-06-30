"use client";

import { useState, useTransition } from "react";
import { TrendingUp, TrendingDown, RefreshCw, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PeriodFilter } from "@/components/agent/period-filter";
import { ErrorSection } from "@/components/agent/error-section";
import { listPerformanceReports, regeneratePerformanceReport, generateTodayReport } from "@/actions/portfolioPerformanceReports";
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
  masterWalletTotalFees?: number;
  masterWalletTotalDeposited?: number;
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
  masterWalletTotalFees = 0,
  masterWalletTotalDeposited = 0,
}: PortfolioPerformanceViewProps) {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [reports, setReports] = useState(initialReports);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isRecapturing, setIsRecapturing] = useState(false);
  const [recaptureStatus, setRecaptureStatus] = useState<"idle" | "success" | "error">("idle");
  // Per-row regen: keyed by reportDate ISO string
  const [rowRegenStatus, setRowRegenStatus] = useState<Record<string, "idle" | "generating" | "success" | "error">>({});

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

  const refreshReports = async () => {
    const res = await listPerformanceReports({ userPortfolioId, period });
    if (res.success && res.data) {
      setReports([...res.data].sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()));
    }
  };

  const handleRecaptureToday = async () => {
    setIsRecapturing(true);
    setRecaptureStatus("idle");
    // Use generate-today: snapshots current live prices then generates report
    const res = await generateTodayReport(userPortfolioId);
    if (res.success) {
      setRecaptureStatus("success");
      toast.success("Today's report generated with current live prices.");
      await refreshReports();
    } else {
      setRecaptureStatus("error");
      toast.error(`Failed: ${res.error}`);
    }
    setIsRecapturing(false);
  };

  const handleRowRegen = async (reportDate: string) => {
    setRowRegenStatus((prev) => ({ ...prev, [reportDate]: "generating" }));
    const res = await regeneratePerformanceReport({ userPortfolioId, reportDate });
    if (res.success) {
      setRowRegenStatus((prev) => ({ ...prev, [reportDate]: "success" }));
      toast.success(`Report for ${new Date(reportDate).toLocaleDateString()} regenerated.`);
      await refreshReports();
    } else {
      setRowRegenStatus((prev) => ({ ...prev, [reportDate]: "error" }));
      toast.error(`Regen failed: ${res.error}`);
    }
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

      {/* Latest metrics — sourced from portfolio summary (same as agent card & super admin) */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-slate-400">Current snapshot</p>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRecaptureToday}
          disabled={isRecapturing}
          className="gap-1.5 text-xs h-7"
          title="Snapshot current live prices and generate today's report now"
        >
          {isRecapturing
            ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…</>
            : recaptureStatus === "success"
            ? <><CheckCircle className="h-3.5 w-3.5 text-green-500" /> Generated</>
            : recaptureStatus === "error"
            ? <><XCircle className="h-3.5 w-3.5 text-red-500" /> Retry</>
            : <><RefreshCw className="h-3.5 w-3.5" /> Generate Today's Report</>}
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Portfolio Value" value={fmt(userPortfolio.portfolioValue)} highlight />
        <MetricCard label="Initial Investment" value={fmt(masterWalletTotalDeposited - masterWalletTotalFees)} />
        <MetricCard
          label="Gain / Loss"
          value={fmt(userPortfolio.totalLossGain)}
        />
        <MetricCard label="Total Fees" value={fmt(masterWalletTotalFees)} />
      </div>

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
                    <td className="px-4 py-3 text-right">{Number(a.stock).toFixed(2)}</td>
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
                  <th className="px-4 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
                {reports.map((r) => {
                  const rStatus = rowRegenStatus[r.reportDate] ?? "idle";
                  return (
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
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm" variant="ghost"
                          onClick={() => handleRowRegen(r.reportDate)}
                          disabled={rStatus === "generating"}
                          title="Regenerate this report with historical prices"
                          className="h-6 px-2 text-[10px] gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        >
                          {rStatus === "generating" ? <Loader2 className="h-3 w-3 animate-spin" />
                            : rStatus === "success" ? <CheckCircle className="h-3 w-3 text-green-500" />
                            : rStatus === "error" ? <XCircle className="h-3 w-3 text-red-500" />
                            : <RefreshCw className="h-3 w-3" />}
                          Regen
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
