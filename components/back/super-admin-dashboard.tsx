"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, Users, DollarSign, Wallet,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle,
  AlertTriangle, Banknote, PieChartIcon, Building2,
  ArrowRightLeft, RefreshCw, ChevronRight,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                       */
/* -------------------------------------------------------------------------- */

interface Wallet {
  id: string;
  balance: number;
  netAssetValue: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalFees: number;
  status: string;
  accountNumber: string;
  user?: { id: string; firstName?: string; lastName?: string; email?: string; status?: string } | null;
}

interface Tx {
  id: string;
  amount: number;
  transactionStatus: string;
  createdAt: string;
  user?: { firstName?: string; lastName?: string; email?: string } | null;
  [key: string]: any;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2,
});

const fmtShort = (n: number) => {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `$${(n / 1_000).toFixed(0)}K`;
  return fmt.format(n);
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function userName(u?: Tx["user"]) {
  return [u?.firstName, u?.lastName].filter(Boolean).join(" ") || u?.email || "Unknown";
}

function statusBadge(s: string) {
  if (s === "PENDING")  return "border-amber-500/30 bg-amber-500/10 text-amber-400";
  if (s === "APPROVED") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  if (s === "REJECTED") return "border-red-500/30 bg-red-500/10 text-red-400";
  return "border-border bg-muted/20 text-muted-foreground";
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                              */
/* -------------------------------------------------------------------------- */

function KpiCard({
  title, value, sub, icon: Icon, accent, border,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent: string;
  border: string;
}) {
  return (
    <Card className={`border-border bg-card border-l-4 ${border}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-1">{title}</p>
            <p className={`text-2xl font-bold leading-tight ${accent}`}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className={`rounded-xl p-2.5 shrink-0 ${accent.includes("blue") ? "bg-blue-500/10" : accent.includes("emerald") ? "bg-emerald-500/10" : accent.includes("amber") ? "bg-amber-500/10" : accent.includes("red") ? "bg-red-500/10" : accent.includes("violet") ? "bg-violet-500/10" : accent.includes("cyan") ? "bg-cyan-500/10" : "bg-muted/30"}`}>
            <Icon className={`h-5 w-5 ${accent}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionCard({
  label, count, amount, href, color,
}: {
  label: string; count: number; amount: number; href: string; color: string;
}) {
  return (
    <Link href={href}>
      <div className={`rounded-lg border p-4 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors cursor-pointer ${color}`}>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{fmt.format(amount)} total value</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xl font-bold">{count}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                              */
/* -------------------------------------------------------------------------- */

export function AdminDashboard({
  wallets,
  deposits,
  withdrawals,
  adminName,
}: {
  wallets:      Wallet[];
  deposits:     Tx[];
  withdrawals:  Tx[];
  adminName:    string;
}) {
  /* ---- Platform-wide aggregates ---- */
  const stats = useMemo(() => {
    const totalAUM         = wallets.reduce((s, w) => s + w.netAssetValue, 0);
    const totalCash        = wallets.reduce((s, w) => s + w.balance, 0);
    const totalDeposited   = wallets.reduce((s, w) => s + w.totalDeposited, 0);
    const totalWithdrawn   = wallets.reduce((s, w) => s + w.totalWithdrawn, 0);
    const totalFees        = wallets.reduce((s, w) => s + w.totalFees, 0);
    const netFlow          = totalDeposited - totalWithdrawn;

    const activeClients    = wallets.filter((w) => w.status === "ACTIVE").length;
    const totalClients     = wallets.length;

    // Pending approvals
    const pendingDeposits       = deposits.filter((d) => d.transactionStatus === "PENDING" && d.depositTarget !== "ALLOCATION");
    const pendingAllocations    = deposits.filter((d) => d.transactionStatus === "PENDING" && d.depositTarget === "ALLOCATION");
    const pendingHardWithdrawals = withdrawals.filter(
      (w) => w.transactionStatus === "PENDING" && w.withdrawalType === "HARD_WITHDRAWAL",
    );

    const approvedDeposits    = deposits.filter((d) => d.transactionStatus === "APPROVED");
    const approvedWithdrawals = withdrawals.filter((w) => w.transactionStatus === "APPROVED");

    const totalDepositAmount  = approvedDeposits.reduce((s, d) => s + d.amount, 0);
    const totalWithdrawAmount = approvedWithdrawals.reduce((s, w) => s + w.amount, 0);

    const pendingActions = pendingDeposits.length + pendingAllocations.length + pendingHardWithdrawals.length;

    return {
      totalAUM, totalCash, totalDeposited, totalWithdrawn, totalFees, netFlow,
      activeClients, totalClients,
      pendingDeposits, pendingAllocations, pendingHardWithdrawals, pendingActions,
      totalDepositAmount, totalWithdrawAmount,
    };
  }, [wallets, deposits, withdrawals]);

  /* ---- Recent activity (last 8 of each, merged & sorted) ---- */
  const recentActivity = useMemo(() => {
    const deps = deposits.slice(0, 8).map((d) => ({ ...d, _kind: "deposit" as const }));
    const wds  = withdrawals.slice(0, 8).map((w) => ({ ...w, _kind: "withdrawal" as const }));
    return [...deps, ...wds]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [deposits, withdrawals]);

  /* ---- Monthly chart data from deposits (group by month) ---- */
  const monthlyChart = useMemo(() => {
    const map: Record<string, { month: string; deposits: number; withdrawals: number; netFlow: number }> = {};
    const monthKey = (d: string) =>
      new Date(d).toLocaleDateString("en-GB", { month: "short", year: "2-digit" });

    for (const d of deposits) {
      if (d.transactionStatus !== "APPROVED") continue;
      const k = monthKey(d.createdAt);
      if (!map[k]) map[k] = { month: k, deposits: 0, withdrawals: 0, netFlow: 0 };
      map[k].deposits += d.amount;
    }
    for (const w of withdrawals) {
      if (w.transactionStatus !== "APPROVED" || w.withdrawalType !== "HARD_WITHDRAWAL") continue;
      const k = monthKey(w.createdAt);
      if (!map[k]) map[k] = { month: k, deposits: 0, withdrawals: 0, netFlow: 0 };
      map[k].withdrawals += w.amount;
    }
    for (const v of Object.values(map)) v.netFlow = v.deposits - v.withdrawals;

    return Object.values(map).slice(-6);
  }, [deposits, withdrawals]);

  /* ---- Wallet distribution for bar chart ---- */
  const walletChart = useMemo(() =>
    wallets
      .filter((w) => w.netAssetValue > 0)
      .sort((a, b) => b.netAssetValue - a.netAssetValue)
      .slice(0, 8)
      .map((w) => ({
        name: [w.user?.firstName, w.user?.lastName].filter(Boolean).join(" ") || w.accountNumber,
        nav:  Math.round(w.netAssetValue),
        cash: Math.round(w.balance),
      })),
    [wallets],
  );

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Platform Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back, <span className="text-foreground font-medium">{adminName}</span>. Here's the live platform summary.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="gap-2 shrink-0">
          <Link href="/dashboard">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Link>
        </Button>
      </div>

      {/* ── Top KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total AUM"
          value={fmtShort(stats.totalAUM)}
          sub="Portfolio NAV across all clients"
          icon={PieChartIcon}
          accent="text-blue-400"
          border="border-l-blue-500"
        />
        <KpiCard
          title="Platform Cash"
          value={fmtShort(stats.totalCash)}
          sub="Available in master wallets"
          icon={Wallet}
          accent="text-emerald-400"
          border="border-l-emerald-500"
        />
        <KpiCard
          title="Active Clients"
          value={stats.activeClients.toString()}
          sub={`${stats.totalClients} total accounts`}
          icon={Users}
          accent="text-violet-400"
          border="border-l-violet-500"
        />
        <KpiCard
          title="Pending Actions"
          value={stats.pendingActions.toString()}
          sub="Require admin approval"
          icon={stats.pendingActions > 0 ? AlertTriangle : CheckCircle}
          accent={stats.pendingActions > 0 ? "text-amber-400" : "text-emerald-400"}
          border={stats.pendingActions > 0 ? "border-l-amber-500" : "border-l-emerald-500"}
        />
      </div>

      {/* ── Financial summary row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Deposited",   value: fmtShort(stats.totalDeposited),   icon: ArrowUpRight,   cls: "text-emerald-400" },
          { label: "Total Withdrawn",   value: fmtShort(stats.totalWithdrawn),   icon: ArrowDownRight, cls: "text-red-400"     },
          { label: "Net Flow",          value: fmtShort(stats.netFlow),          icon: ArrowRightLeft, cls: stats.netFlow >= 0 ? "text-emerald-400" : "text-red-400" },
          { label: "Total Fees",        value: fmtShort(stats.totalFees),        icon: Banknote,       cls: "text-amber-400"   },
        ].map((item) => (
          <Card key={item.label} className="border-border bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-muted/30 p-2 shrink-0">
                <item.icon className={`h-4 w-4 ${item.cls}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">{item.label}</p>
                <p className={`text-sm font-bold ${item.cls}`}>{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Pending approvals (action required) ── */}
      {stats.pendingActions > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              Action Required
              <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 ml-1">
                {stats.pendingActions}
              </Badge>
            </CardTitle>
            <CardDescription>These transactions are waiting for admin approval.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.pendingDeposits.length > 0 && (
              <ActionCard
                label="Pending External Deposits"
                count={stats.pendingDeposits.length}
                amount={stats.pendingDeposits.reduce((s, d) => s + d.amount, 0)}
                href="/dashboard/deposits"
                color="border-emerald-500/20"
              />
            )}
            {stats.pendingAllocations.length > 0 && (
              <ActionCard
                label="Pending Portfolio Allocations"
                count={stats.pendingAllocations.length}
                amount={stats.pendingAllocations.reduce((s, d) => s + d.amount, 0)}
                href="/dashboard/deposits"
                color="border-blue-500/20"
              />
            )}
            {stats.pendingHardWithdrawals.length > 0 && (
              <ActionCard
                label="Pending Cash-Out Withdrawals"
                count={stats.pendingHardWithdrawals.length}
                amount={stats.pendingHardWithdrawals.reduce((s, w) => s + w.amount, 0)}
                href="/dashboard/withdrawals"
                color="border-orange-500/20"
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly flow chart */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Monthly Cash Flow</CardTitle>
            <CardDescription className="text-xs">Approved deposits vs cash-out withdrawals</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyChart.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
                No approved transaction data yet
              </div>
            ) : (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyChart} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dep" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
                      </linearGradient>
                      <linearGradient id="wd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tickFormatter={(v) => fmtShort(v).replace("USh ", "")} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }}
                      formatter={(v: any) => [fmt.format(v)]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Area type="monotone" dataKey="deposits"    name="Deposits"    stroke="#10b981" fill="url(#dep)" strokeWidth={2} />
                    <Area type="monotone" dataKey="withdrawals" name="Withdrawals" stroke="#ef4444" fill="url(#wd)"  strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top wallets bar chart */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Top Client Wallets</CardTitle>
            <CardDescription className="text-xs">Portfolio NAV vs cash balance by client</CardDescription>
          </CardHeader>
          <CardContent>
            {walletChart.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
                No wallet data yet
              </div>
            ) : (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={walletChart} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tickFormatter={(v) => fmtShort(v).replace("USh ", "")} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }}
                      formatter={(v: any) => [fmt.format(v)]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="nav"  name="Portfolio NAV" fill="#0089ff" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cash" name="Cash Balance"  fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Activity ── */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest deposits and withdrawals across the platform</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="text-xs gap-1">
              <Link href="/dashboard/deposits">Deposits <ChevronRight className="h-3 w-3" /></Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="text-xs gap-1">
              <Link href="/dashboard/withdrawals">Withdrawals <ChevronRight className="h-3 w-3" /></Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentActivity.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              No recent activity
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">Client</th>
                    <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">Type</th>
                    <th className="text-right px-4 py-2.5 text-xs text-muted-foreground font-medium">Amount</th>
                    <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium hidden sm:table-cell">Date</th>
                    <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((tx) => {
                    const isDeposit  = tx._kind === "deposit";
                    const typeLabel  = isDeposit
                      ? ((tx as any).depositTarget === "ALLOCATION" ? "Allocation" : "Deposit")
                      : ((tx as any).withdrawalType === "REDEMPTION" ? "Redemption" : "Cash Out");
                    const typeColor  = isDeposit
                      ? ((tx as any).depositTarget === "ALLOCATION" ? "border-blue-500/30 bg-blue-500/10 text-blue-400" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400")
                      : ((tx as any).withdrawalType === "REDEMPTION" ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400" : "border-orange-500/30 bg-orange-500/10 text-orange-400");

                    return (
                      <tr key={tx._kind + tx.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                        <td className="px-4 py-3">
                          <p className="font-medium leading-tight">{userName(tx.user)}</p>
                          <p className="text-xs text-muted-foreground">{tx.user?.email || "—"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={`text-xs ${typeColor}`}>{typeLabel}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">{fmt.format(tx.amount)}</td>
                        <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted-foreground">
                          {fmtDate(tx.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={`text-xs ${statusBadge(tx.transactionStatus)}`}>
                            {tx.transactionStatus === "PENDING"  && <Clock        className="h-2.5 w-2.5 mr-1" />}
                            {tx.transactionStatus === "APPROVED" && <CheckCircle  className="h-2.5 w-2.5 mr-1" />}
                            {tx.transactionStatus === "REJECTED" && <XCircle      className="h-2.5 w-2.5 mr-1" />}
                            {tx.transactionStatus}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Quick navigation ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Clients",       href: "/dashboard/users/clients",   icon: Users,          color: "text-violet-400", bg: "bg-violet-500/10" },
          { label: "Deposits",      href: "/dashboard/deposits",        icon: ArrowUpRight,   color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Withdrawals",   href: "/dashboard/withdrawals",     icon: ArrowDownRight, color: "text-orange-400", bg: "bg-orange-500/10" },
          { label: "Master Wallets",href: "/dashboard/master-wallets",  icon: Building2,      color: "text-blue-400",   bg: "bg-blue-500/10" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="border-border bg-card hover:bg-muted/20 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`rounded-lg p-2 ${item.bg}`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
