"use client";

import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, Wallet, TrendingUp, TrendingDown, DollarSign,
  ArrowUpRight, ArrowDownRight, PieChartIcon, Briefcase,
  CheckCircle, Clock, XCircle, UserCheck,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const fmtShort = (n: number) => {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Math.round(n).toLocaleString()}`;
};

const monthKey = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { month: "short", year: "2-digit" });

const COLORS = ["#0089ff", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"];

function KpiCard({ title, value, sub, icon: Icon, color, border }: {
  title: string; value: string; sub?: string;
  icon: React.ElementType; color: string; border: string;
}) {
  return (
    <Card className={`border-l-4 ${border}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className={`rounded-xl p-2.5 shrink-0 bg-current/10 opacity-80`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                        */
/* -------------------------------------------------------------------------- */

interface Props {
  wallets: any[];
  deposits: any[];
  withdrawals: any[];
  clients: any[];
  staff: any[];
}

export function AnalyticsDashboard({ wallets, deposits, withdrawals, clients, staff }: Props) {

  /* ── Platform KPIs ── */
  const kpis = useMemo(() => {
    const totalAUM       = wallets.reduce((s, w) => s + (w.netAssetValue ?? 0), 0);
    const totalCash      = wallets.reduce((s, w) => s + (w.balance ?? 0), 0);
    const totalDeposited = wallets.reduce((s, w) => s + (w.totalDeposited ?? 0), 0);
    const totalWithdrawn = wallets.reduce((s, w) => s + (w.totalWithdrawn ?? 0), 0);
    const totalFees      = wallets.reduce((s, w) => s + (w.totalFees ?? 0), 0);

    const approvedDeposits    = deposits.filter((d) => d.transactionStatus === "APPROVED");
    const approvedWithdrawals = withdrawals.filter((w) => w.transactionStatus === "APPROVED");
    const pendingDeposits     = deposits.filter((d) => d.transactionStatus === "PENDING");
    const pendingWithdrawals  = withdrawals.filter((w) => w.transactionStatus === "PENDING");

    const activeClients   = clients.filter((c) => c.status === "ACTIVE").length;
    const approvedClients = clients.filter((c) => c.isApproved).length;
    const agents          = staff.filter((s) => s.role === "AGENT").length;

    return {
      totalAUM, totalCash, totalDeposited, totalWithdrawn, totalFees,
      approvedDeposits, approvedWithdrawals, pendingDeposits, pendingWithdrawals,
      activeClients, approvedClients, agents,
      totalClients: clients.length,
      totalStaff: staff.length,
    };
  }, [wallets, deposits, withdrawals, clients, staff]);

  /* ── Monthly cash flow ── */
  const monthlyFlow = useMemo(() => {
    const map: Record<string, { month: string; deposits: number; withdrawals: number; net: number }> = {};
    for (const d of deposits) {
      if (d.transactionStatus !== "APPROVED") continue;
      const k = monthKey(d.createdAt);
      if (!map[k]) map[k] = { month: k, deposits: 0, withdrawals: 0, net: 0 };
      map[k].deposits += d.amount;
    }
    for (const w of withdrawals) {
      if (w.transactionStatus !== "APPROVED") continue;
      const k = monthKey(w.createdAt);
      if (!map[k]) map[k] = { month: k, deposits: 0, withdrawals: 0, net: 0 };
      map[k].withdrawals += w.amount;
    }
    for (const v of Object.values(map)) v.net = v.deposits - v.withdrawals;
    return Object.values(map).slice(-12);
  }, [deposits, withdrawals]);

  /* ── Monthly client growth ── */
  const clientGrowth = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of clients) {
      if (!c.createdAt) continue;
      const k = monthKey(c.createdAt);
      map[k] = (map[k] ?? 0) + 1;
    }
    let cumulative = 0;
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => { cumulative += count; return { month, new: count, total: cumulative }; })
      .slice(-12);
  }, [clients]);

  /* ── Deposit method breakdown ── */
  const depositMethods = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of deposits) {
      if (d.transactionStatus !== "APPROVED") continue;
      const method = d.method || "OTHER";
      map[method] = (map[method] ?? 0) + d.amount;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [deposits]);

  /* ── Transaction status breakdown ── */
  const txStatus = useMemo(() => {
    const dep = { pending: 0, approved: 0, rejected: 0 };
    const wd  = { pending: 0, approved: 0, rejected: 0 };
    for (const d of deposits) {
      if (d.transactionStatus === "PENDING")  dep.pending++;
      if (d.transactionStatus === "APPROVED") dep.approved++;
      if (d.transactionStatus === "REJECTED") dep.rejected++;
    }
    for (const w of withdrawals) {
      if (w.transactionStatus === "PENDING")  wd.pending++;
      if (w.transactionStatus === "APPROVED") wd.approved++;
      if (w.transactionStatus === "REJECTED") wd.rejected++;
    }
    return [
      { name: "Dep. Approved", value: dep.approved, color: "#10b981" },
      { name: "Dep. Pending",  value: dep.pending,  color: "#f59e0b" },
      { name: "Dep. Rejected", value: dep.rejected, color: "#ef4444" },
      { name: "Wd. Approved",  value: wd.approved,  color: "#0089ff" },
      { name: "Wd. Pending",   value: wd.pending,   color: "#f97316" },
      { name: "Wd. Rejected",  value: wd.rejected,  color: "#8b5cf6" },
    ].filter((x) => x.value > 0);
  }, [deposits, withdrawals]);

  /* ── Top clients by NAV ── */
  const topClients = useMemo(() =>
    wallets
      .filter((w) => w.netAssetValue > 0 && w.user)
      .sort((a, b) => b.netAssetValue - a.netAssetValue)
      .slice(0, 10)
      .map((w) => ({
        name: [w.user?.firstName, w.user?.lastName].filter(Boolean).join(" ") || w.accountNumber,
        nav:  Math.round(w.netAssetValue),
        cash: Math.round(w.balance),
        fees: Math.round(w.totalFees),
      })),
    [wallets],
  );

  /* ── Staff role breakdown ── */
  const staffRoles = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of staff) map[s.role] = (map[s.role] ?? 0) + 1;
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [staff]);

  /* ── Client approval status ── */
  const clientStatus = useMemo(() => [
    { name: "Approved",    value: clients.filter((c) => c.isApproved).length,  color: "#10b981" },
    { name: "Pending",     value: clients.filter((c) => !c.isApproved).length, color: "#f59e0b" },
  ].filter((x) => x.value > 0), [clients]);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Platform Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">System-wide metrics, trends and performance</p>
      </div>

      {/* ── KPI Row 1: Financial ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total AUM" value={fmtShort(kpis.totalAUM)} sub="Portfolio NAV" icon={PieChartIcon} color="text-blue-500" border="border-l-blue-500" />
        <KpiCard title="Platform Cash" value={fmtShort(kpis.totalCash)} sub="Master wallet balances" icon={Wallet} color="text-emerald-500" border="border-l-emerald-500" />
        <KpiCard title="Total Deposited" value={fmtShort(kpis.totalDeposited)} sub="All time" icon={ArrowUpRight} color="text-green-500" border="border-l-green-500" />
        <KpiCard title="Total Withdrawn" value={fmtShort(kpis.totalWithdrawn)} sub="All time" icon={ArrowDownRight} color="text-red-500" border="border-l-red-500" />
      </div>

      {/* ── KPI Row 2: Clients & Ops ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Clients" value={kpis.totalClients.toString()} sub={`${kpis.activeClients} active`} icon={Users} color="text-violet-500" border="border-l-violet-500" />
        <KpiCard title="Approved Clients" value={kpis.approvedClients.toString()} sub="KYC approved" icon={UserCheck} color="text-teal-500" border="border-l-teal-500" />
        <KpiCard title="Pending Deposits" value={kpis.pendingDeposits.length.toString()} sub="Awaiting approval" icon={Clock} color="text-amber-500" border="border-l-amber-500" />
        <KpiCard title="Total Fees" value={fmtShort(kpis.totalFees)} sub="Platform fees collected" icon={DollarSign} color="text-orange-500" border="border-l-orange-500" />
      </div>

      {/* ── Monthly Cash Flow ── */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Cash Flow</CardTitle>
          <CardDescription>Approved deposits vs withdrawals over the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyFlow} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gDep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gWd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0089ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0089ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => fmtShort(v)} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => [fmtShort(v)]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="deposits"    name="Deposits"    stroke="#10b981" fill="url(#gDep)" strokeWidth={2} />
                <Area type="monotone" dataKey="withdrawals" name="Withdrawals" stroke="#ef4444" fill="url(#gWd)"  strokeWidth={2} />
                <Area type="monotone" dataKey="net"         name="Net Flow"    stroke="#0089ff" fill="url(#gNet)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ── Client Growth + Transaction Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Client Growth</CardTitle>
            <CardDescription>New registrations and cumulative total per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={clientGrowth} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="new"   name="New Clients"   stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="total" name="Total Clients" stroke="#0089ff" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Status Breakdown</CardTitle>
            <CardDescription>Deposits and withdrawals by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={txStatus} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {txStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [v, "count"]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Top Clients by NAV ── */}
      <Card>
        <CardHeader>
          <CardTitle>Top Clients by Portfolio NAV</CardTitle>
          <CardDescription>Highest value portfolios on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topClients} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
                <YAxis tickFormatter={(v) => fmtShort(v)} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => [fmtShort(v)]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="nav"  name="Portfolio NAV" fill="#0089ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cash" name="Cash Balance"  fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fees" name="Total Fees"    fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ── Deposit Methods + Client Approval + Staff Roles ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Deposit Methods</CardTitle>
            <CardDescription className="text-xs">By approved deposit volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={depositMethods} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name }) => name} labelLine={false}>
                    {depositMethods.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [fmtShort(v)]} contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Client Approval Status</CardTitle>
            <CardDescription className="text-xs">KYC onboarding progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={clientStatus} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {clientStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Staff by Role</CardTitle>
            <CardDescription className="text-xs">Team composition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={staffRoles} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="value" name="Count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Summary table ── */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              { label: "Total Clients",       value: kpis.totalClients },
              { label: "Active Clients",       value: kpis.activeClients },
              { label: "KYC Approved",         value: kpis.approvedClients },
              { label: "Total Staff",          value: kpis.totalStaff },
              { label: "Total Deposits",       value: deposits.length },
              { label: "Approved Deposits",    value: kpis.approvedDeposits.length },
              { label: "Pending Deposits",     value: kpis.pendingDeposits.length },
              { label: "Total Withdrawals",    value: withdrawals.length },
              { label: "Approved Withdrawals", value: kpis.approvedWithdrawals.length },
              { label: "Pending Withdrawals",  value: kpis.pendingWithdrawals.length },
              { label: "Master Wallets",       value: wallets.length },
              { label: "Agents",               value: kpis.agents },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-[#2B2F77]/20 last:border-0">
                <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                <span className="font-semibold text-slate-800 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
