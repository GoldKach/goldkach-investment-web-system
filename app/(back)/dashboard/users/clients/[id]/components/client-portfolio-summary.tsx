"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  CreditCard,
  Layers,
  BarChart2,
  PieChartIcon,
  RefreshCw,
  Banknote,
  ArrowLeftRight,
  PlusCircle,
} from "lucide-react";
import { refreshPortfolioSummary, getPortfolioSummary } from "@/actions/portfolio-summary";
import type {
  PortfolioSummary,
  PortfolioSummaryItem,
  SubPortfolioSummary,
  TopupHistoryEntry,
} from "@/actions/portfolio-summary";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const ASSET_COLORS = [
  "#0089ff",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#84cc16",
  "#ec4899",
  "#14b8a6",
];

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

const fmtDate = (d: string | null | undefined) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

/* -------------------------------------------------------------------------- */
/*  Small display atoms                                                         */
/* -------------------------------------------------------------------------- */

function PctBadge({ value }: { value: number }) {
  const pos = value >= 0;
  return (
    <Badge
      variant="outline"
      className={
        pos
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-red-500/20 bg-red-500/10 text-red-400"
      }
    >
      {pos ? (
        <TrendingUp className="h-3 w-3 mr-1" />
      ) : (
        <TrendingDown className="h-3 w-3 mr-1" />
      )}
      {fmtPct(value)}
    </Badge>
  );
}

function KpiCard({
  title,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-0.5">
            <p className="text-xs text-muted-foreground truncate">{title}</p>
            <p className="text-lg font-bold text-foreground leading-tight">
              {value}
            </p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={`rounded-lg p-2 shrink-0 ${accent}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Asset allocation pie chart + legend                                         */
/* -------------------------------------------------------------------------- */

type SummaryAsset = PortfolioSummaryItem["assets"][number];

function AssetAllocationTab({ assets }: { assets: SummaryAsset[] }) {
  if (!assets.length)
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No assets assigned
      </p>
    );

  const pieData = assets.map((a) => ({
    name: a.asset.symbol,
    value: a.allocationPercentage,
  }));

  return (
    <div className="space-y-4">
      {/* Pie */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((_, i) => (
                <Cell
                  key={i}
                  fill={ASSET_COLORS[i % ASSET_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(v: any) => [`${Number(v).toFixed(1)}%`]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Asset rows */}
      <div className="space-y-2">
        {assets.map((a, i) => {
          const pos = a.lossGain >= 0;
          return (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: ASSET_COLORS[i % ASSET_COLORS.length] }}
                />
                <span className="text-sm font-medium">{a.asset.symbol}</span>
                <span className="text-xs text-muted-foreground truncate hidden sm:block">
                  {a.asset.description}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span className="text-muted-foreground">
                  {a.allocationPercentage.toFixed(1)}%
                </span>
                <span className="hidden sm:block">
                  {fmt.format(a.closeValue)}
                </span>
                <span className={pos ? "text-emerald-400" : "text-red-400"}>
                  {pos ? (
                    <ArrowUpRight className="inline h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="inline h-3 w-3" />
                  )}
                  {fmt.format(Math.abs(a.lossGain))}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Asset detail table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="py-2 px-3 text-left text-muted-foreground font-medium">
                Asset
              </th>
              <th className="py-2 px-3 text-right text-muted-foreground font-medium">
                Class
              </th>
              <th className="py-2 px-3 text-right text-muted-foreground font-medium">
                Shares
              </th>
              <th className="py-2 px-3 text-right text-muted-foreground font-medium">
                Cost/Share
              </th>
              <th className="py-2 px-3 text-right text-muted-foreground font-medium">
                Cost Price
              </th>
              <th className="py-2 px-3 text-right text-muted-foreground font-medium">
                Close Value
              </th>
              <th className="py-2 px-3 text-right text-muted-foreground font-medium">
                Gain/Loss
              </th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => {
              const pos = a.lossGain >= 0;
              return (
                <tr
                  key={a.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20"
                >
                  <td className="py-2 px-3">
                    <div>
                      <span className="font-medium">{a.asset.symbol}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right text-muted-foreground">
                    {a.asset.assetClass}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {a.stock.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {fmt.format(a.costPerShare)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {fmt.format(a.costPrice)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {fmt.format(a.closeValue)}
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-medium ${pos ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {pos ? "+" : ""}
                    {fmt.format(a.lossGain)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Topup history bar chart + list                                              */
/* -------------------------------------------------------------------------- */

function TopupHistoryTab({ history }: { history: TopupHistoryEntry[] }) {
  if (!history.length)
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No topup history
      </p>
    );

  const chartData = history.map((t) => ({
    name: fmtDate(t.createdAt).replace(/\s\d{4}$/, ""),
    topup: t.topupAmount,
    nav: t.newNAV,
    gainLoss: t.gainLoss,
  }));

  return (
    <div className="space-y-4">
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(v: any) => [fmt.format(v)]}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar
              dataKey="topup"
              name="Topup Amount"
              fill="#0089ff"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="nav"
              name="NAV After"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        {history.map((t, i) => {
          const pos = t.gainLoss >= 0;
          return (
            <div
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-mono">#{i + 1}</span>
                <span className="font-semibold">
                  {fmt.format(t.topupAmount)}
                </span>
                <span className="text-muted-foreground hidden sm:block">
                  → NAV {fmt.format(t.newNAV)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-medium ${pos ? "text-emerald-400" : "text-red-400"}`}
                >
                  {pos ? "+" : ""}
                  {fmt.format(t.gainLoss)}
                </span>
                <span className="text-muted-foreground">
                  Fees: {fmt.format(t.totalFees)}
                </span>
                <Badge
                  variant="outline"
                  className={
                    t.status === "MERGED"
                      ? "border-emerald-500/20 text-emerald-400 text-xs"
                      : "border-amber-500/20 text-amber-400 text-xs"
                  }
                >
                  {t.status}
                </Badge>
                <span className="text-muted-foreground">
                  {fmtDate(t.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-portfolios tab                                                          */
/* -------------------------------------------------------------------------- */

function SubPortfoliosTab({ subs }: { subs: SubPortfolioSummary[] }) {
  if (!subs.length)
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No sub-portfolios
      </p>
    );

  const redemptions = subs.filter((s) => s.label.endsWith("- Redemption"));
  const topups      = subs.filter((s) => !s.label.endsWith("- Redemption"));

  function SubList({ items, kind }: { items: SubPortfolioSummary[]; kind: "redemption" | "topup" }) {
    return (
      <div className="space-y-2">
        {items.map((s) => {
          const pos = s.totalLossGain >= 0;
          const isRedemption = kind === "redemption";
          return (
            <div
              key={s.id}
              className={`rounded-lg border p-3 space-y-3 ${
                isRedemption
                  ? "border-orange-500/20 bg-orange-500/5"
                  : "border-blue-500/20 bg-blue-500/5"
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`rounded p-1 ${isRedemption ? "bg-orange-500/10" : "bg-blue-500/10"}`}>
                    {isRedemption
                      ? <ArrowLeftRight className="h-3.5 w-3.5 text-orange-400" />
                      : <PlusCircle     className="h-3.5 w-3.5 text-blue-400" />
                    }
                  </div>
                  <span className="text-sm font-medium truncate">{s.label}</span>
                  <Badge
                    variant="outline"
                    className="text-xs border-border text-muted-foreground shrink-0"
                  >
                    Gen {s.generation}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {fmtDate(s.snapshotDate)}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="rounded bg-muted/40 p-2">
                  <p className="text-muted-foreground mb-0.5">
                    {isRedemption ? "Redeemed" : "Invested"}
                  </p>
                  <p className="font-semibold">{fmt.format(s.amountInvested)}</p>
                </div>
                <div className="rounded bg-muted/40 p-2">
                  <p className="text-muted-foreground mb-0.5">Close Value</p>
                  <p className="font-semibold">{fmt.format(s.totalCloseValue)}</p>
                </div>
                <div
                  className={`rounded p-2 ${pos ? "bg-emerald-500/5" : "bg-red-500/5"}`}
                >
                  <p className="text-muted-foreground mb-0.5">Gain / Loss</p>
                  <p className={`font-semibold ${pos ? "text-emerald-400" : "text-red-400"}`}>
                    {pos ? "+" : ""}
                    {fmt.format(s.totalLossGain)}
                  </p>
                </div>
                <div className="rounded bg-muted/40 p-2">
                  <p className="text-muted-foreground mb-0.5">Cash at Bank</p>
                  <p className="font-semibold">{fmt.format(s.cashAtBank)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* If both types exist, show them in separate sections */
  if (redemptions.length > 0 && topups.length > 0) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-3.5 w-3.5 text-orange-400" />
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
              Redemption Snapshots ({redemptions.length})
            </p>
          </div>
          <SubList items={redemptions} kind="redemption" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-3.5 w-3.5 text-blue-400" />
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
              Top-up Snapshots ({topups.length})
            </p>
          </div>
          <SubList items={topups} kind="topup" />
        </div>
      </div>
    );
  }

  /* Only one type — flat list */
  return (
    <SubList
      items={subs}
      kind={redemptions.length > 0 ? "redemption" : "topup"}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Latest report tab                                                           */
/* -------------------------------------------------------------------------- */

function LatestReportTab({
  report,
}: {
  report: NonNullable<PortfolioSummaryItem["latestReport"]>;
}) {
  const pos = report.totalLossGain >= 0;
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Report Date: {fmtDate(report.reportDate)}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Close Value",
            value: fmt.format(report.totalCloseValue),
            cls: "",
          },
          {
            label: "Net Asset Value",
            value: fmt.format(report.netAssetValue),
            cls: "text-blue-400",
          },
          {
            label: "Total Fees",
            value: fmt.format(report.totalFees),
            cls: "text-amber-400",
          },
          {
            label: "Gain / Loss",
            value: `${pos ? "+" : ""}${fmt.format(report.totalLossGain)}`,
            cls: pos ? "text-emerald-400" : "text-red-400",
          },
          {
            label: "Return %",
            value: fmtPct(report.totalPercentage),
            cls:
              report.totalPercentage >= 0
                ? "text-emerald-400"
                : "text-red-400",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-border bg-muted/40 p-3"
          >
            <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
            <p className={`text-sm font-bold ${item.cls}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Individual portfolio card                                                   */
/* -------------------------------------------------------------------------- */

function PortfolioCard({ p }: { p: PortfolioSummaryItem }) {
  const pos = p.totalLossGain >= 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          {/* Left: name + template + badges */}
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-base leading-tight">
              {p.customName}
            </CardTitle>
            <CardDescription className="text-xs">
              {p.portfolio.name}
            </CardDescription>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Badge
                variant="outline"
                className="text-xs border-blue-500/20 bg-blue-500/10 text-blue-400"
              >
                <Clock className="h-2.5 w-2.5 mr-1" />
                {p.portfolio.timeHorizon}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs border-amber-500/20 bg-amber-500/10 text-amber-400"
              >
                <Activity className="h-2.5 w-2.5 mr-1" />
                {p.portfolio.riskTolerance}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${
                  p.wallet.status === "ACTIVE"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-500/20 bg-slate-500/10 text-slate-400"
                }`}
              >
                {p.wallet.status}
              </Badge>
            </div>
          </div>

          {/* Right: current value + return% */}
          <div className="text-right shrink-0">
            <p className="text-xl font-bold">
              {fmt.format(p.portfolioValue)}
            </p>
            <PctBadge value={p.returnPct} />
          </div>
        </div>
      </CardHeader>

      <Separator className="bg-border" />

      <CardContent className="pt-4 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Total Invested", value: fmt.format(p.totalInvested), cls: "" },
            { label: "Current Value", value: fmt.format(p.portfolioValue), cls: "" },
            {
              label: "Gain / Loss",
              value: `${pos ? "+" : ""}${fmt.format(p.totalLossGain)}`,
              cls: pos ? "text-emerald-400" : "text-red-400",
              border: pos
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-red-500/20 bg-red-500/5",
            },
            { label: "NAV", value: fmt.format(p.wallet.netAssetValue), cls: "text-blue-400" },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-lg border p-3 ${item.border ?? "border-border bg-muted/40"}`}
            >
              <p className="text-xs text-muted-foreground mb-0.5">
                {item.label}
              </p>
              <p className={`text-sm font-bold ${item.cls}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Wallet summary stripe */}
        <div className="rounded-lg border border-border bg-muted/20 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CreditCard className="h-3.5 w-3.5" />
              <span className="font-medium">
                Portfolio Wallet · {p.wallet.accountNumber}
              </span>
            </div>
            <Badge
              variant="outline"
              className={`text-xs ${
                p.wallet.status === "ACTIVE"
                  ? "border-emerald-500/20 text-emerald-400"
                  : "border-slate-500/20 text-slate-400"
              }`}
            >
              {p.wallet.status}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground">Balance</p>
              <p className="font-semibold">{fmt.format(p.wallet.balance)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">NAV</p>
              <p className="font-semibold text-blue-400">
                {fmt.format(p.wallet.netAssetValue)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Fees</p>
              <p className="font-semibold text-amber-400">
                {fmt.format(p.wallet.totalFees)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="assets">
          <TabsList className="bg-muted/40 border border-border h-auto flex-wrap">
            <TabsTrigger value="assets" className="text-xs gap-1 py-1.5">
              <PieChartIcon className="h-3 w-3" />
              Assets ({p.assets.length})
            </TabsTrigger>
            <TabsTrigger value="topups" className="text-xs gap-1 py-1.5">
              <BarChart2 className="h-3 w-3" />
              Topups ({p.topupHistory.length})
            </TabsTrigger>
            <TabsTrigger value="subs" className="text-xs gap-1 py-1.5">
              <Layers className="h-3 w-3" />
              Snapshots ({p.subPortfolios.length})
              {p.subPortfolios.some((s) => s.label.endsWith("- Redemption")) && (
                <span className="rounded px-1 py-0.5 text-[10px] leading-none bg-orange-500/15 text-orange-400 border border-orange-500/20 ml-0.5">
                  {p.subPortfolios.filter((s) => s.label.endsWith("- Redemption")).length} redeemed
                </span>
              )}
            </TabsTrigger>
            {p.latestReport && (
              <TabsTrigger value="report" className="text-xs gap-1 py-1.5">
                <Activity className="h-3 w-3" />
                Latest Report
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="assets" className="mt-3">
            <AssetAllocationTab assets={p.assets} />
          </TabsContent>

          <TabsContent value="topups" className="mt-3">
            <TopupHistoryTab history={p.topupHistory} />
          </TabsContent>

          <TabsContent value="subs" className="mt-3">
            <SubPortfoliosTab subs={p.subPortfolios} />
          </TabsContent>

          {p.latestReport && (
            <TabsContent value="report" className="mt-3">
              <LatestReportTab report={p.latestReport} />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main export                                                                 */
/* -------------------------------------------------------------------------- */

export function ClientPortfolioSummary({
  summary: initialSummary,
  userId,
}: {
  summary: PortfolioSummary;
  userId: string;
}) {
  const [summary, setSummary] = useState(initialSummary);
  const [isPending, startTransition] = useTransition();

  const { aggregate, masterWallet, portfolios } = summary;
  const pos = aggregate.totalGainLoss >= 0;

  function handleRefresh() {
    startTransition(async () => {
      try {
        const result = await refreshPortfolioSummary(userId);
        if (!result.success) {
          toast.error(result.error || "Failed to refresh portfolio summary");
          return;
        }
        const fresh = await getPortfolioSummary(userId);
        if (fresh.success && fresh.data) {
          setSummary(fresh.data);
          toast.success("Portfolio summary refreshed successfully");
        }
      } catch {
        toast.error("Failed to refresh portfolio summary");
      }
    });
  }

  return (
    <div className="space-y-6 p-6 pt-0">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Portfolio Overview</h2>
          <p className="text-sm text-muted-foreground">
            {aggregate.portfolioCount} portfolio
            {aggregate.portfolioCount !== 1 ? "s" : ""} assigned
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isPending}
          className="gap-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Aggregate KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          title="Total Invested"
          value={fmt.format(aggregate.totalInvested)}
          sub={`Across ${aggregate.portfolioCount} portfolios`}
          icon={DollarSign}
          accent="bg-blue-500/10 text-blue-400"
        />
        <KpiCard
          title="Current Value"
          value={fmt.format(aggregate.totalValue)}
          sub="Portfolio NAV"
          icon={Wallet}
          accent="bg-emerald-500/10 text-emerald-400"
        />
        <KpiCard
          title="Total Gain / Loss"
          value={`${pos ? "+" : ""}${fmt.format(aggregate.totalGainLoss)}`}
          sub={fmtPct(aggregate.returnPct)}
          icon={pos ? TrendingUp : TrendingDown}
          accent={
            pos
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }
        />
        <KpiCard
          title="Total Fees"
          value={fmt.format(aggregate.totalFees)}
          sub="All portfolios"
          icon={Banknote}
          accent="bg-amber-500/10 text-amber-400"
        />
      </div>

      {/* Master wallet */}
      {masterWallet && (
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Building2 className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Master Wallet</CardTitle>
                  <CardDescription className="text-xs font-mono">
                    {masterWallet.accountNumber}
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  masterWallet.status === "ACTIVE"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-500/20 bg-slate-500/10 text-slate-400"
                }
              >
                {masterWallet.status}
              </Badge>
            </div>
          </CardHeader>
          <Separator className="bg-border" />
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                {
                  label: "Net Asset Value",
                  value: fmt.format(masterWallet.netAssetValue),
                  cls: "text-blue-400",
                },
                {
                  label: "Total Deposited",
                  value: fmt.format(masterWallet.totalDeposited),
                  cls: "text-emerald-400",
                },
                {
                  label: "Total Withdrawn",
                  value: fmt.format(masterWallet.totalWithdrawn),
                  cls: "text-red-400",
                },
                {
                  label: "Total Fees",
                  value: fmt.format(masterWallet.totalFees),
                  cls: "text-amber-400",
                },
                {
                  label: "Net Flow",
                  value: fmt.format(
                    masterWallet.totalDeposited - masterWallet.totalWithdrawn
                  ),
                  cls:
                    masterWallet.totalDeposited - masterWallet.totalWithdrawn >=
                    0
                      ? "text-emerald-400"
                      : "text-red-400",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-border bg-muted/40 p-3"
                >
                  <p className="text-xs text-muted-foreground mb-0.5">
                    {item.label}
                  </p>
                  <p className={`text-sm font-bold ${item.cls}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio cards */}
      {portfolios.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="rounded-full bg-muted/40 p-5">
              <PieChartIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              No portfolios assigned to this client
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h3 className="text-base font-semibold">
            Individual Portfolios
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({portfolios.length})
            </span>
          </h3>
          {portfolios.map((p) => (
            <PortfolioCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
