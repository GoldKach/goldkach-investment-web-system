"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Wallet, Users, ArrowUpRight, ArrowDownRight, Download, FileText } from "lucide-react";

type Period = "day" | "week" | "month" | "quarter" | "year";

const fmt = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Math.round(n)}`;
};

function getPeriodStart(period: Period): Date {
  const now = new Date();
  if (period === "day")     return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "week")    { const d = new Date(now); d.setDate(d.getDate() - 7); return d; }
  if (period === "month")   return new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === "quarter") return new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
  return new Date(now.getFullYear(), 0, 1);
}

function groupByLabel(items: any[], period: Period): Record<string, number> {
  const map: Record<string, number> = {};
  for (const item of items) {
    const d = new Date(item.createdAt);
    let key: string;
    if (period === "day") {
      key = `${String(d.getHours()).padStart(2, "0")}:00`;
    } else if (period === "week") {
      key = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" });
    } else if (period === "month" || period === "quarter") {
      key = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    } else {
      key = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    }
    map[key] = (map[key] ?? 0) + (item.amount ?? 0);
  }
  return map;
}

interface Props {
  clientSummaries: Array<{ client: any; summary: any }>;
  wallets: any[];
  deposits: any[];
  withdrawals: any[];
  totalClients: number;
}

const PERIODS: { label: string; value: Period }[] = [
  { label: "Today",   value: "day" },
  { label: "Week",    value: "week" },
  { label: "Month",   value: "month" },
  { label: "Quarter", value: "quarter" },
  { label: "Year",    value: "year" },
];

export function AccountantDashboard({ clientSummaries, wallets, deposits, withdrawals, totalClients }: Props) {
  const [period, setPeriod] = useState<Period>("month");
  const [showDeposits, setShowDeposits] = useState(false);
  const [showWithdrawals, setShowWithdrawals] = useState(false);

  const periodStart = useMemo(() => getPeriodStart(period), [period]);

  const approvedDeposits = useMemo(
    () => deposits.filter((d) => d.transactionStatus === "APPROVED" && new Date(d.createdAt) >= periodStart),
    [deposits, periodStart]
  );
  const approvedWithdrawals = useMemo(
    () => withdrawals.filter((w) => w.transactionStatus === "APPROVED" && new Date(w.createdAt) >= periodStart),
    [withdrawals, periodStart]
  );

  const totalDeposited  = approvedDeposits.reduce((s, d) => s + d.amount, 0);
  const totalWithdrawn  = approvedWithdrawals.reduce((s, w) => s + w.amount, 0);
  const netFlow         = totalDeposited - totalWithdrawn;

  const chartData = useMemo(() => {
    const depMap = groupByLabel(approvedDeposits, period);
    const wdMap  = groupByLabel(approvedWithdrawals, period);
    const keys   = Array.from(new Set([...Object.keys(depMap), ...Object.keys(wdMap)])).sort();
    return keys.map((k) => ({
      label:       k,
      deposits:    depMap[k] ?? 0,
      withdrawals: wdMap[k]  ?? 0,
    }));
  }, [approvedDeposits, approvedWithdrawals, period]);

  const totalAUM  = wallets.reduce((s, w) => s + (w.netAssetValue ?? 0), 0);
  const totalCash = wallets.reduce((s, w) => s + (w.balance ?? 0), 0);
  const totalFees = wallets.reduce((s, w) => s + (w.totalFees ?? 0), 0);

  const allPortfolios = useMemo(() => {
    const list: any[] = [];
    for (const { client, summary } of clientSummaries) {
      for (const p of summary?.portfolios ?? []) {
        list.push({
          ...p,
          clientName: [client.firstName, client.lastName].filter(Boolean).join(" ") || client.email,
        });
      }
    }
    return list.sort((a, b) => (b.wallet?.netAssetValue ?? 0) - (a.wallet?.netAssetValue ?? 0));
  }, [clientSummaries]);

  const portfolioTotals = useMemo(() => ({
    invested:  allPortfolios.reduce((s, p) => s + p.totalInvested, 0),
    nav:       allPortfolios.reduce((s, p) => s + (p.wallet?.netAssetValue ?? 0), 0),
    gainLoss:  allPortfolios.reduce((s, p) => s + p.totalLossGain, 0),
    fees:      allPortfolios.reduce((s, p) => s + (p.wallet?.totalFees ?? 0), 0),
  }), [allPortfolios]);

  const exportPortfolioCSV = () => {
    const headers = [
      "Client", "Portfolio Name", "Fund Name", "Risk Tolerance", "Time Horizon",
      "Invested ($)", "Cost Price ($)", "Total Fees ($)", "Total Costs ($)", "NAV ($)", "Gain/Loss ($)", "Return (%)",
      "Wallet Account No",
    ];
    const rows = allPortfolios.map((p) => {
      const costPrice = p.totalInvested - (p.wallet?.totalFees ?? 0);
      const totalCosts = costPrice + (p.wallet?.totalFees ?? 0);
      return [
        p.clientName,
        p.customName,
        p.portfolio?.name ?? "",
        p.portfolio?.riskTolerance ?? "",
        p.portfolio?.timeHorizon ?? "",
        p.totalInvested.toFixed(2),
        costPrice.toFixed(2),
        (p.wallet?.totalFees ?? 0).toFixed(2),
        totalCosts.toFixed(2),
        (p.wallet?.netAssetValue ?? 0).toFixed(2),
        p.totalLossGain.toFixed(2),
        p.returnPct.toFixed(2),
        p.wallet?.accountNumber ?? "",
      ];
    });
    const totalCostPrice = portfolioTotals.invested - portfolioTotals.fees;
    const totalAllCosts = totalCostPrice + portfolioTotals.fees;
    rows.push([
      "TOTALS", "", "", "", "",
      portfolioTotals.invested.toFixed(2),
      totalCostPrice.toFixed(2),
      portfolioTotals.fees.toFixed(2),
      totalAllCosts.toFixed(2),
      portfolioTotals.nav.toFixed(2),
      portfolioTotals.gainLoss.toFixed(2),
      "", "",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-summary-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportDepositsCSV = () => {
    const headers = ["Date", "Client", "Amount ($)", "Method", "Status", "Reference No.", "Approved By", "Approved At"];
    const rows = deposits.map((d) => [
      new Date(d.createdAt).toLocaleDateString(),
      [d.user?.firstName, d.user?.lastName].filter(Boolean).join(" ") || d.user?.email || "N/A",
      d.amount.toFixed(2),
      d.method || "N/A",
      d.transactionStatus,
      d.referenceNo || "N/A",
      d.approvedByName || "N/A",
      d.approvedAt ? new Date(d.approvedAt).toLocaleDateString() : "N/A",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deposits-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportWithdrawalsCSV = () => {
    const headers = ["Date", "Client", "Amount ($)", "Type", "Status", "Reference No.", "Approved By", "Approved At"];
    const rows = withdrawals.map((w) => [
      new Date(w.createdAt).toLocaleDateString(),
      [w.user?.firstName, w.user?.lastName].filter(Boolean).join(" ") || w.user?.email || "N/A",
      w.amount.toFixed(2),
      w.withdrawalType,
      w.transactionStatus,
      w.referenceNo || "N/A",
      w.approvedByName || "N/A",
      w.approvedAt ? new Date(w.approvedAt).toLocaleDateString() : "N/A",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `withdrawals-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Portfolio Summary</h1>
        <p className="text-sm text-slate-400 mt-1">Read-only financial overview across all client portfolios</p>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total AUM",     value: fmtShort(totalAUM),   color: "text-blue-500",   border: "border-l-blue-500",   Icon: Wallet },
          { label: "Platform Cash", value: fmtShort(totalCash),  color: "text-green-500",  border: "border-l-green-500",  Icon: ArrowUpRight },
          { label: "Total Clients", value: String(totalClients), color: "text-violet-500", border: "border-l-violet-500", Icon: Users },
          { label: "Total Fees",    value: fmtShort(totalFees),  color: "text-amber-500",  border: "border-l-amber-500",  Icon: ArrowDownRight },
          { label: "Management Fee", value: fmtShort(totalAUM * 0.005),  color: "text-orange-500",  border: "border-l-orange-500",  Icon: FileText, note: "0.5% Quarterly" },
        ].map((k) => (
          <Card key={k.label} className={`border-l-4 ${k.border}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                  <p className={`text-2xl font-bold mt-0.5 ${k.color}`}>{k.value}</p>
                  {k.note && <p className="text-xs text-muted-foreground mt-0.5">{k.note}</p>}
                </div>
                <k.Icon className={`h-5 w-5 ${k.color} opacity-60`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Period selector + transaction totals */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base">Deposits &amp; Withdrawals</CardTitle>
              <CardDescription>Approved transactions for selected period</CardDescription>
            </div>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-[#1e2d5a] overflow-hidden">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPeriod(p.value)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    period === p.value
                      ? "bg-[#2B2F77] dark:bg-[#3B82F6] text-white"
                      : "bg-white dark:bg-[#0a0d24] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2B2F77]/20"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
              <p className="text-xs text-green-600 dark:text-green-400 mb-1">Total Deposited</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{fmtShort(totalDeposited)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{approvedDeposits.length} transactions</p>
            </div>
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-xs text-red-600 dark:text-red-400 mb-1">Total Withdrawn</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{fmtShort(totalWithdrawn)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{approvedWithdrawals.length} transactions</p>
            </div>
            <div className={`rounded-lg border p-4 ${netFlow >= 0 ? "bg-blue-500/10 border-blue-500/20" : "bg-orange-500/10 border-orange-500/20"}`}>
              <p className={`text-xs mb-1 ${netFlow >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"}`}>Net Flow</p>
              <p className={`text-xl font-bold ${netFlow >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"}`}>
                {fmtShort(Math.abs(netFlow))}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{netFlow >= 0 ? "Net inflow" : "Net outflow"}</p>
            </div>
          </div>

          {chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No approved transactions in this period.</p>
          ) : (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => fmtShort(v)} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: any) => [fmt(v)]} contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="deposits"    name="Deposits"    fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="withdrawals" name="Withdrawals" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deposits Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base">Deposits</CardTitle>
              <CardDescription>{deposits.length} deposits total</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowDeposits(!showDeposits)}>
                {showDeposits ? "Hide" : "View"} Deposits
              </Button>
              <Button size="sm" variant="outline" className="gap-2" onClick={exportDepositsCSV}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        {showDeposits && (
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-xs text-muted-foreground uppercase tracking-wide border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Client</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-left">Method</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.slice(0, 50).map((d, i) => (
                    <tr key={d.id ?? i} className="border-b border-border last:border-0 hover:bg-muted/10">
                      <td className="px-4 py-3">{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{[d.user?.firstName, d.user?.lastName].filter(Boolean).join(" ") || d.user?.email || "N/A"}</td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">{fmt(d.amount)}</td>
                      <td className="px-4 py-3">{d.method || "N/A"}</td>
                      <td className="px-4 py-3">
                        <Badge variant={d.transactionStatus === "APPROVED" ? "default" : "secondary"} className={d.transactionStatus === "APPROVED" ? "bg-green-500" : ""}>{d.transactionStatus}</Badge>
                      </td>
                      <td className="px-4 py-3">{d.referenceNo || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Withdrawals Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base">Withdrawals</CardTitle>
              <CardDescription>{withdrawals.length} withdrawals total</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowWithdrawals(!showWithdrawals)}>
                {showWithdrawals ? "Hide" : "View"} Withdrawals
              </Button>
              <Button size="sm" variant="outline" className="gap-2" onClick={exportWithdrawalsCSV}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        {showWithdrawals && (
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-xs text-muted-foreground uppercase tracking-wide border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Client</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.slice(0, 50).map((w, i) => (
                    <tr key={w.id ?? i} className="border-b border-border last:border-0 hover:bg-muted/10">
                      <td className="px-4 py-3">{new Date(w.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{[w.user?.firstName, w.user?.lastName].filter(Boolean).join(" ") || w.user?.email || "N/A"}</td>
                      <td className="px-4 py-3 text-right font-medium text-red-600">{fmt(w.amount)}</td>
                      <td className="px-4 py-3">{w.withdrawalType}</td>
                      <td className="px-4 py-3">
                        <Badge variant={w.transactionStatus === "APPROVED" ? "default" : "secondary"} className={w.transactionStatus === "APPROVED" ? "bg-green-500" : ""}>{w.transactionStatus}</Badge>
                      </td>
                      <td className="px-4 py-3">{w.referenceNo || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Portfolio Summary Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base">Client Portfolio Summary</CardTitle>
              <CardDescription>{allPortfolios.length} portfolios across {clientSummaries.length} clients</CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={exportPortfolioCSV}
              disabled={allPortfolios.length === 0}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs text-muted-foreground uppercase tracking-wide border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Portfolio</th>
                  <th className="px-4 py-3 text-left">Risk</th>
                  <th className="px-4 py-3 text-right">Invested</th>
                  <th className="px-4 py-3 text-right">Cost Price</th>
                  <th className="px-4 py-3 text-right">NAV</th>
                  <th className="px-4 py-3 text-right">Gain/Loss</th>
                  <th className="px-4 py-3 text-right">Return %</th>
                </tr>
              </thead>
              <tbody>
                {allPortfolios.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                      No portfolio data available.
                    </td>
                  </tr>
                ) : (
                  allPortfolios.map((p, i) => {
                    const isPos = p.totalLossGain >= 0;
                    return (
                      <tr key={p.id ?? i} className="border-b border-border last:border-0 hover:bg-muted/10">
                        <td className="px-4 py-3 text-sm font-medium">{p.clientName}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{p.customName}</p>
                          <p className="text-xs text-muted-foreground">{p.portfolio?.name}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs">{p.portfolio?.riskTolerance || "—"}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">{fmt(p.totalInvested)}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{fmt(p.totalInvested - (p.wallet?.totalFees ?? 0))}</td>
                        <td className="px-4 py-3 text-right font-semibold text-blue-500">{fmt(p.wallet?.netAssetValue ?? 0)}</td>
                        <td className={`px-4 py-3 text-right font-semibold ${isPos ? "text-green-600" : "text-red-500"}`}>
                          <span className="flex items-center justify-end gap-1">
                            {isPos ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                            {fmt(p.totalLossGain)}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-right font-semibold ${isPos ? "text-green-600" : "text-red-500"}`}>
                          {p.returnPct >= 0 ? "+" : ""}{p.returnPct.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {allPortfolios.length > 0 && (
                <tfoot className="bg-muted/20 border-t-2 border-border font-semibold text-sm">
                  <tr>
                    <td className="px-4 py-3" colSpan={3}>Totals</td>
                    <td className="px-4 py-3 text-right">{fmt(portfolioTotals.invested)}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{fmt(portfolioTotals.invested - portfolioTotals.fees)}</td>
                    <td className="px-4 py-3 text-right text-blue-500">{fmt(portfolioTotals.nav)}</td>
                    <td className={`px-4 py-3 text-right ${portfolioTotals.gainLoss >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {fmt(portfolioTotals.gainLoss)}
                    </td>
                    <td className="px-4 py-3 text-right">—</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
