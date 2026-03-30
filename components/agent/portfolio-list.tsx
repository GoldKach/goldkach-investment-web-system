import Link from "next/link";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

export function PortfolioList({ portfolios, clientId }: PortfolioListProps) {
  if (portfolios.length === 0) {
    return <EmptyState message="No portfolios found for this client." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {portfolios.map((p) => {
        const isPositive = p.totalLossGain >= 0;
        return (
          <Link
            key={p.id}
            href={`/agent/clients/${clientId}/portfolios/${p.id}`}
            className="block rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 bg-white dark:bg-[#0a0d24] p-5 hover:border-[#2B2F77]/50 dark:hover:border-[#3B82F6]/40 hover:shadow-md transition-all"
          >
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
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-slate-500">
                {p.portfolio.riskTolerance}
              </Badge>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-slate-500">
                {p.portfolio.timeHorizon}
              </Badge>
            </div>

            {/* Financials */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-400 mb-0.5">Invested</p>
                <p className="font-semibold text-slate-700 dark:text-slate-200">{fmt(p.totalInvested)}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-0.5">Current Value</p>
                <p className="font-semibold text-slate-700 dark:text-slate-200">{fmt(p.portfolioValue)}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-0.5">Gain / Loss</p>
                <p className={`font-semibold ${isPositive ? "text-green-600" : "text-red-500"}`}>
                  {fmt(p.totalLossGain)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 mb-0.5">NAV</p>
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  {fmt(p.wallet?.netAssetValue ?? 0)}
                </p>
              </div>
            </div>

            {/* Wallet footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#2B2F77]/20 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1">
                <Wallet className="h-3 w-3" />
                <span>{p.wallet?.accountNumber || "—"}</span>
              </div>
              <span>Fees: {fmt(p.wallet?.totalFees ?? 0)}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
