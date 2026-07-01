"use client";

import { useState } from "react";
import { RefreshCw, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { generateTodayReport } from "@/actions/portfolioPerformanceReports";
import type {
  PortfolioPerformanceReport,
  UserPortfolio,
} from "@/actions/portfolioPerformanceReports";

interface PortfolioPerformanceViewProps {
  userPortfolioId: string;
  clientId: string;
  latestReport: PortfolioPerformanceReport | null;
  userPortfolio: UserPortfolio;
  initialReports?: PortfolioPerformanceReport[];
  initialPeriod?: string;
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
  const [isRecapturing, setIsRecapturing] = useState(false);
  const [recaptureStatus, setRecaptureStatus] = useState<"idle" | "success" | "error">("idle");

  const handleRecaptureToday = async () => {
    setIsRecapturing(true);
    setRecaptureStatus("idle");
    const res = await generateTodayReport(userPortfolioId);
    if (res.success) {
      setRecaptureStatus("success");
      toast.success("Today's report generated with current live prices.");
    } else {
      setRecaptureStatus("error");
      toast.error(`Failed: ${res.error}`);
    }
    setIsRecapturing(false);
  };

  const assets = userPortfolio.userAssets ?? [];

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
                  <th className="px-4 py-3 text-left">Asset Class</th>
                  <th className="px-4 py-3 text-right">Stocks</th>
                  <th className="px-4 py-3 text-right">Allocation</th>
                  <th className="px-4 py-3 text-right">Cost Per Share</th>
                  <th className="px-4 py-3 text-right">Cost Price</th>
                  <th className="px-4 py-3 text-right">Close Price</th>
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
                    <td className="px-4 py-3 text-right">{Number(a.stock).toFixed(3)}</td>
                    <td className="px-4 py-3 text-right">{a.allocationPercentage.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right">{fmt(a.costPerShare)}</td>
                    <td className="px-4 py-3 text-right">{fmt(a.costPrice)}</td>
                    <td className="px-4 py-3 text-right">{a.asset?.closePrice != null ? fmt(Number(a.asset.closePrice)) : "—"}</td>
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

    </div>
  );
}
