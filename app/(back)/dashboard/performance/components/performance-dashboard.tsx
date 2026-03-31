"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart2, Award, Layers } from "lucide-react";
import { PeriodFilter } from "@/components/agent/period-filter";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const fmt = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Math.round(n)}`;
};

const COLORS = ["#0089ff", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#14b8a6"];

type Period = "daily" | "weekly" | "monthly";

/* -------------------------------------------------------------------------- */
/*  Main                                                                        */
/* -------------------------------------------------------------------------- */

interface Props {
  assets: any[];
  portfolioSummaries: Array<{ client: any; summary: any }>;
}

export function PerformanceDashboard({ assets, portfolioSummaries }: Props) {
  const [period, setPeriod] = useState<Period>("monthly");

  /* ── All portfolios flat list ── */
  const allPortfolios = useMemo(() => {
    const list: any[] = [];
    for (const { client, summary } of portfolioSummaries) {
      if (!summary?.portfolios) continue;
      for (const p of summary.portfolios) {
        list.push({
          ...p,
          clientName: [client.firstName, client.lastName].filter(Boolean).join(" ") || client.email,
          clientId: client.id,
        });
      }
    }
    return list;
  }, [portfolioSummaries]);

  /* ── Top performing portfolios by return % ── */
  const topByReturn = useMemo(() =>
    [...allPortfolios]
      .filter((p) => p.totalInvested > 0)
      .sort((a, b) => b.returnPct - a.returnPct)
      .slice(0, 10)
      .map((p) => ({
        name: `${p.customName} (${p.clientName})`,
        shortName: p.customName,
        client: p.clientName,
        returnPct: +p.returnPct.toFixed(2),
        nav: p.wallet?.netAssetValue ?? 0,
        invested: p.totalInvested,
        gainLoss: p.totalLossGain,
      })),
    [allPortfolios],
  );

  /* ── Top portfolios by NAV ── */
  const topByNAV = useMemo(() =>
    [...allPortfolios]
      .sort((a, b) => (b.wallet?.netAssetValue ?? 0) - (a.wallet?.netAssetValue ?? 0))
      .slice(0, 10)
      .map((p) => ({
        name: p.customName,
        client: p.clientName,
        nav: Math.round(p.wallet?.netAssetValue ?? 0),
        invested: Math.round(p.totalInvested),
        gainLoss: Math.round(p.totalLossGain),
        returnPct: +p.returnPct.toFixed(2),
      })),
    [allPortfolios],
  );

  /* ── Asset class breakdown across all portfolios ── */
  const assetClassBreakdown = useMemo(() => {
    const map: Record<string, { value: number; count: number }> = {};
    for (const p of allPortfolios) {
      for (const a of p.assets ?? []) {
        const cls = a.asset?.assetClass || "OTHER";
        if (!map[cls]) map[cls] = { value: 0, count: 0 };
        map[cls].value += a.closeValue ?? 0;
        map[cls].count += 1;
      }
    }
    return Object.entries(map)
      .map(([name, { value, count }]) => ({ name, value: Math.round(value), count }))
      .sort((a, b) => b.value - a.value);
  }, [allPortfolios]);

  /* ── Asset price table (current close prices) ── */
  const assetPrices = useMemo(() =>
    [...assets]
      .sort((a, b) => b.closePrice - a.closePrice)
      .slice(0, 20),
    [assets],
  );

  /* ── Portfolio performance over time (from latestReport dates) ── */
  const performanceTrend = useMemo(() => {
    // Group latest reports by month to show platform-wide NAV trend
    const map: Record<string, { month: string; totalNAV: number; totalCost: number; count: number }> = {};
    for (const p of allPortfolios) {
      if (!p.latestReport) continue;
      const d = new Date(p.latestReport.reportDate);
      const key = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
      if (!map[key]) map[key] = { month: key, totalNAV: 0, totalCost: 0, count: 0 };
      map[key].totalNAV  += p.latestReport.netAssetValue ?? 0;
      map[key].totalCost += p.latestReport.totalCostPrice ?? 0;
      map[key].count     += 1;
    }
    return Object.values(map).slice(-12);
  }, [allPortfolios]);

  /* ── Risk tolerance distribution ── */
  const riskDist = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of allPortfolios) {
      const r = p.portfolio?.riskTolerance || "UNKNOWN";
      map[r] = (map[r] ?? 0) + 1;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [allPortfolios]);

  /* ── Platform totals ── */
  const totals = useMemo(() => ({
    totalNAV:      allPortfolios.reduce((s, p) => s + (p.wallet?.netAssetValue ?? 0), 0),
    totalInvested: allPortfolios.reduce((s, p) => s + p.totalInvested, 0),
    totalGainLoss: allPortfolios.reduce((s, p) => s + p.totalLossGain, 0),
    totalFees:     allPortfolios.reduce((s, p) => s + (p.wallet?.totalFees ?? 0), 0),
    portfolioCount: allPortfolios.length,
    positiveCount:  allPortfolios.filter((p) => p.totalLossGain > 0).length,
  }), [allPortfolios]);

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Performance</h1>
          <p className="text-sm text-slate-400 mt-1">
            Portfolio performance, asset prices and platform-wide metrics
          </p>
        </div>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      {/* ── Platform KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total NAV",       value: fmtShort(totals.totalNAV),      color: "text-blue-500" },
          { label: "Total Invested",  value: fmtShort(totals.totalInvested), color: "text-slate-600 dark:text-slate-300" },
          { label: "Total Gain/Loss", value: fmtShort(totals.totalGainLoss), color: totals.totalGainLoss >= 0 ? "text-green-600" : "text-red-500" },
          { label: "Total Fees",      value: fmtShort(totals.totalFees),     color: "text-amber-500" },
          { label: "Portfolios",      value: totals.portfolioCount.toString(), color: "text-violet-500" },
          { label: "Profitable",      value: `${totals.positiveCount}/${totals.portfolioCount}`, color: "text-teal-500" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-slate-400">{k.label}</p>
              <p className={`text-lg font-bold mt-0.5 ${k.color}`}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Platform NAV Trend ── */}
      <Card>
        <CardHeader>
          <CardTitle>Platform NAV Trend</CardTitle>
          <CardDescription>Aggregated portfolio NAV vs cost price over time</CardDescription>
        </CardHeader>
        <CardContent>
          {performanceTrend.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-sm text-slate-400">
              No performance report data available yet
            </div>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceTrend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gNAV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0089ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0089ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={fmtShort} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [fmtShort(v)]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="totalNAV"  name="Total NAV"   stroke="#0089ff" fill="url(#gNAV)"  strokeWidth={2} />
                  <Area type="monotone" dataKey="totalCost" name="Total Cost"  stroke="#10b981" fill="url(#gCost)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Top Portfolios by Return + by NAV ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base">Top Portfolios by Return %</CardTitle>
            </div>
            <CardDescription>Best performing portfolios across all clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topByReturn} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                  <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="shortName" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip
                    formatter={(v: any, name: string) => [name === "returnPct" ? `${v}%` : fmtShort(v), name]}
                    contentStyle={{ borderRadius: 8, fontSize: 11 }}
                  />
                  <Bar dataKey="returnPct" name="Return %" radius={[0, 4, 4, 0]}>
                    {topByReturn.map((entry, i) => (
                      <Cell key={i} fill={entry.returnPct >= 0 ? "#10b981" : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-base">Top Portfolios by NAV</CardTitle>
            </div>
            <CardDescription>Highest value portfolios on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topByNAV} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" interval={0} />
                  <YAxis tickFormatter={fmtShort} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: any) => [fmtShort(v)]} contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="nav"      name="NAV"      fill="#0089ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="invested" name="Invested" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Asset Class Breakdown + Risk Distribution ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-violet-500" />
              <CardTitle className="text-base">Asset Class Breakdown</CardTitle>
            </div>
            <CardDescription>Total close value by asset class across all portfolios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetClassBreakdown} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={fmtShort} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: any) => [fmtShort(v)]} contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="value" name="Close Value" radius={[4, 4, 0, 0]}>
                    {assetClassBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Tolerance Distribution</CardTitle>
            <CardDescription>Portfolio count by risk profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={riskDist} cx="50%" cy="50%" outerRadius={90}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <Radar name="Portfolios" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Asset Prices Table ── */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Prices</CardTitle>
          <CardDescription>Current close prices for all tracked assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-xs text-slate-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Symbol</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Sector</th>
                  <th className="px-4 py-3 text-left">Class</th>
                  <th className="px-4 py-3 text-right">Close Price</th>
                  <th className="px-4 py-3 text-right">Default Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
                {assetPrices.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No assets found.</td></tr>
                ) : (
                  assetPrices.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{a.symbol}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{a.description}</td>
                      <td className="px-4 py-3 text-slate-500">{a.sector}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">{a.assetClass || "—"}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-blue-600 dark:text-blue-400">
                        {fmt(a.closePrice)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">
                        {fmt(a.defaultCostPerShare)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Top Portfolios Detail Table ── */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Portfolios</CardTitle>
          <CardDescription>Ranked by return percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-xs text-slate-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Portfolio</th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-right">Invested</th>
                  <th className="px-4 py-3 text-right">NAV</th>
                  <th className="px-4 py-3 text-right">Gain/Loss</th>
                  <th className="px-4 py-3 text-right">Return %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
                {topByReturn.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{p.shortName}</td>
                    <td className="px-4 py-3 text-slate-500">{p.client}</td>
                    <td className="px-4 py-3 text-right">{fmtShort(p.invested)}</td>
                    <td className="px-4 py-3 text-right font-semibold">{fmtShort(p.nav)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${p.gainLoss >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {fmtShort(p.gainLoss)}
                    </td>
                    <td className={`px-4 py-3 text-right font-bold ${p.returnPct >= 0 ? "text-green-600" : "text-red-500"}`}>
                      <div className="flex items-center justify-end gap-1">
                        {p.returnPct >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {p.returnPct >= 0 ? "+" : ""}{p.returnPct}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
