"use client";

import { useMemo, useState, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users, Wallet, TrendingUp, TrendingDown, DollarSign,
  ArrowUpRight, ArrowDownRight, PieChartIcon, Briefcase,
  CheckCircle, Clock, XCircle, UserCheck, Printer, Download,
  Building2, Percent, RefreshCw, Activity,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtShort = (n: number) => {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)         return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Math.round(n).toLocaleString()}`;
};

const fmtNum = (n: number) => n.toLocaleString();

const monthKey = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { month: "short", year: "2-digit" });

const BRAND  = "#1B3A6B";
const COLORS = ["#0089ff", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"];

/* -------------------------------------------------------------------------- */
/*  KPI Card                                                                    */
/* -------------------------------------------------------------------------- */

function KpiCard({ title, value, sub, icon: Icon, color, border, badge }: {
  title: string; value: string; sub?: string; badge?: string;
  icon: React.ElementType; color: string; border: string;
}) {
  return (
    <Card className={`border-l-4 ${border}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-1 truncate">{title}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
            {badge && <Badge variant="outline" className="mt-1.5 text-[10px] px-1.5">{badge}</Badge>}
          </div>
          <div className="rounded-xl p-2 shrink-0 bg-muted/40">
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section header (shows on print too)                                         */
/* -------------------------------------------------------------------------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">{title}</h2>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Props                                                                       */
/* -------------------------------------------------------------------------- */

interface Props {
  wallets: any[];
  deposits: any[];
  withdrawals: any[];
  clients: any[];
  staff: any[];
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                              */
/* -------------------------------------------------------------------------- */

export function AnalyticsDashboard({ wallets, deposits, withdrawals, clients, staff }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  // ── Date range filter ──────────────────────────────────────────────────────
  const [fromDate, setFromDate] = useState("");
  const [toDate,   setToDate]   = useState("");

  const inRange = (dateStr: string) => {
    const t = new Date(dateStr).getTime();
    if (fromDate && t < new Date(fromDate + "T00:00:00Z").getTime()) return false;
    if (toDate   && t > new Date(toDate   + "T23:59:59Z").getTime()) return false;
    return true;
  };

  const filteredDeposits    = useMemo(() => deposits.filter(d => inRange(d.createdAt)),    [deposits, fromDate, toDate]);
  const filteredWithdrawals = useMemo(() => withdrawals.filter(w => inRange(w.createdAt)), [withdrawals, fromDate, toDate]);
  const filteredClients     = useMemo(() => clients.filter(c => c.createdAt && inRange(c.createdAt)), [clients, fromDate, toDate]);

  // ── Platform KPIs ──────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const totalAUM       = wallets.reduce((s, w) => s + (w.netAssetValue  ?? 0), 0);
    const totalCash      = wallets.reduce((s, w) => s + (w.balance        ?? 0), 0);
    const totalDeposited = wallets.reduce((s, w) => s + (w.totalDeposited ?? 0), 0);
    const totalWithdrawn = wallets.reduce((s, w) => s + (w.totalWithdrawn ?? 0), 0);
    const totalFees      = wallets.reduce((s, w) => s + (w.totalFees      ?? 0), 0);

    const apprDep  = filteredDeposits.filter(d => d.transactionStatus === "APPROVED");
    const apprWd   = filteredWithdrawals.filter(w => w.transactionStatus === "APPROVED");
    const pendDep  = filteredDeposits.filter(d => d.transactionStatus === "PENDING");
    const pendWd   = filteredWithdrawals.filter(w => w.transactionStatus === "PENDING");
    const rejDep   = filteredDeposits.filter(d => d.transactionStatus === "REJECTED");
    const rejWd    = filteredWithdrawals.filter(w => w.transactionStatus === "REJECTED");

    const totalDepAmt  = apprDep.reduce((s, d) => s + d.amount, 0);
    const totalWdAmt   = apprWd.reduce((s, w) => s + w.amount, 0);
    const netInflow    = totalDepAmt - totalWdAmt;
    const avgDepAmt    = apprDep.length > 0 ? totalDepAmt / apprDep.length : 0;
    const avgClientAUM = wallets.length > 0 ? totalAUM / wallets.length : 0;
    const approvalRate = filteredDeposits.length > 0 ? (apprDep.length / filteredDeposits.length) * 100 : 0;

    // Deposit type split (period-filtered)
    const masterDeposits     = filteredDeposits.filter(d => d.depositTarget === "MASTER" || !d.depositTarget);
    const allocationDeposits = filteredDeposits.filter(d => d.depositTarget === "ALLOCATION");
    const masterDepAmt       = masterDeposits.filter(d => d.transactionStatus === "APPROVED").reduce((s, d) => s + d.amount, 0);
    const allocationDepAmt   = allocationDeposits.filter(d => d.transactionStatus === "APPROVED").reduce((s, d) => s + d.amount, 0);

    // Withdrawal type split
    const hardWd  = filteredWithdrawals.filter(w => w.withdrawalType === "HARD_WITHDRAWAL" || !w.withdrawalType);
    const redeemWd= filteredWithdrawals.filter(w => w.withdrawalType === "REDEMPTION");
    const hardWdAmt   = hardWd.filter(w => w.transactionStatus === "APPROVED").reduce((s, w) => s + w.amount, 0);
    const redeemWdAmt = redeemWd.filter(w => w.transactionStatus === "APPROVED").reduce((s, w) => s + w.amount, 0);

    const pendDepAmt = pendDep.reduce((s, d) => s + d.amount, 0);
    const pendWdAmt  = pendWd.reduce((s, w) => s + w.amount, 0);

    const activeClients   = clients.filter(c => c.status === "ACTIVE").length;
    const approvedClients = clients.filter(c => c.isApproved).length;
    const pendingKYC      = clients.filter(c => !c.isApproved).length;
    const agents          = staff.filter(s => s.role === "AGENT").length;

    return {
      totalAUM, totalCash, totalDeposited, totalWithdrawn, totalFees,
      apprDep, apprWd, pendDep, pendWd, rejDep, rejWd,
      totalDepAmt, totalWdAmt, netInflow, avgDepAmt, avgClientAUM,
      approvalRate, masterDepAmt, allocationDepAmt, hardWdAmt, redeemWdAmt,
      pendDepAmt, pendWdAmt,
      activeClients, approvedClients, pendingKYC,
      totalClients: clients.length, totalStaff: staff.length, agents,
    };
  }, [wallets, filteredDeposits, filteredWithdrawals, clients, staff]);

  // ── Monthly cash flow ──────────────────────────────────────────────────────
  const monthlyFlow = useMemo(() => {
    const map: Record<string, { month: string; deposits: number; withdrawals: number; net: number; fees: number }> = {};
    for (const d of filteredDeposits) {
      if (d.transactionStatus !== "APPROVED") continue;
      const k = monthKey(d.createdAt);
      if (!map[k]) map[k] = { month: k, deposits: 0, withdrawals: 0, net: 0, fees: 0 };
      map[k].deposits += d.amount;
      map[k].fees += d.totalFees ?? 0;
    }
    for (const w of filteredWithdrawals) {
      if (w.transactionStatus !== "APPROVED") continue;
      const k = monthKey(w.createdAt);
      if (!map[k]) map[k] = { month: k, deposits: 0, withdrawals: 0, net: 0, fees: 0 };
      map[k].withdrawals += w.amount;
    }
    for (const v of Object.values(map)) v.net = v.deposits - v.withdrawals;
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);
  }, [filteredDeposits, filteredWithdrawals]);

  // ── Monthly client growth ──────────────────────────────────────────────────
  const clientGrowth = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of clients) {
      if (!c.createdAt) continue;
      const k = monthKey(c.createdAt);
      map[k] = (map[k] ?? 0) + 1;
    }
    let cum = 0;
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => { cum += count; return { month, new: count, total: cum }; })
      .slice(-12);
  }, [clients]);

  // ── Transaction status ─────────────────────────────────────────────────────
  const txStatus = useMemo(() => [
    { name: "Dep. Approved", value: kpis.apprDep.length, color: "#10b981" },
    { name: "Dep. Pending",  value: kpis.pendDep.length, color: "#f59e0b" },
    { name: "Dep. Rejected", value: kpis.rejDep.length,  color: "#ef4444" },
    { name: "Wd. Approved",  value: kpis.apprWd.length,  color: "#0089ff" },
    { name: "Wd. Pending",   value: kpis.pendWd.length,  color: "#f97316" },
    { name: "Wd. Rejected",  value: kpis.rejWd.length,   color: "#8b5cf6" },
  ].filter(x => x.value > 0), [kpis]);

  // ── Top 10 clients by NAV ──────────────────────────────────────────────────
  const topClients = useMemo(() =>
    wallets
      .filter(w => w.netAssetValue > 0 && w.user)
      .sort((a, b) => b.netAssetValue - a.netAssetValue)
      .slice(0, 10)
      .map(w => ({
        name: [w.user?.firstName, w.user?.lastName].filter(Boolean).join(" ") || w.accountNumber,
        nav:  Math.round(w.netAssetValue),
        cash: Math.round(w.balance),
        fees: Math.round(w.totalFees),
        dep:  Math.round(w.totalDeposited),
      })),
    [wallets],
  );

  // ── Deposit methods ────────────────────────────────────────────────────────
  const depositMethods = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of filteredDeposits) {
      if (d.transactionStatus !== "APPROVED") continue;
      const m = d.method || "Other";
      map[m] = (map[m] ?? 0) + d.amount;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredDeposits]);

  // ── Deposit type split ─────────────────────────────────────────────────────
  const depositTypes = useMemo(() => [
    { name: "External (Master)", value: kpis.masterDepAmt,     color: "#10b981" },
    { name: "Portfolio Top-up",  value: kpis.allocationDepAmt, color: "#0089ff" },
  ].filter(x => x.value > 0), [kpis]);

  // ── Withdrawal type split ──────────────────────────────────────────────────
  const withdrawalTypes = useMemo(() => [
    { name: "Bank Withdrawal", value: kpis.hardWdAmt,   color: "#ef4444" },
    { name: "Redemption",      value: kpis.redeemWdAmt, color: "#8b5cf6" },
  ].filter(x => x.value > 0), [kpis]);

  // ── Client status ──────────────────────────────────────────────────────────
  const clientStatus = useMemo(() => [
    { name: "KYC Approved", value: kpis.approvedClients, color: "#10b981" },
    { name: "Pending KYC",  value: kpis.pendingKYC,      color: "#f59e0b" },
  ].filter(x => x.value > 0), [kpis]);

  // ── Staff roles ────────────────────────────────────────────────────────────
  const staffRoles = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of staff) map[s.role] = (map[s.role] ?? 0) + 1;
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [staff]);

  // ── Monthly summary table data ─────────────────────────────────────────────
  const monthlySummary = useMemo(() => {
    const map: Record<string, {
      month: string; deposits: number; withdrawals: number; net: number;
      fees: number; depCount: number; wdCount: number; newClients: number;
    }> = {};
    for (const d of filteredDeposits) {
      if (d.transactionStatus !== "APPROVED") continue;
      const k = monthKey(d.createdAt);
      if (!map[k]) map[k] = { month: k, deposits: 0, withdrawals: 0, net: 0, fees: 0, depCount: 0, wdCount: 0, newClients: 0 };
      map[k].deposits += d.amount;
      map[k].fees     += d.totalFees ?? 0;
      map[k].depCount++;
    }
    for (const w of filteredWithdrawals) {
      if (w.transactionStatus !== "APPROVED") continue;
      const k = monthKey(w.createdAt);
      if (!map[k]) map[k] = { month: k, deposits: 0, withdrawals: 0, net: 0, fees: 0, depCount: 0, wdCount: 0, newClients: 0 };
      map[k].withdrawals += w.amount;
      map[k].wdCount++;
    }
    for (const c of clients) {
      if (!c.createdAt) continue;
      const k = monthKey(c.createdAt);
      if (!map[k]) map[k] = { month: k, deposits: 0, withdrawals: 0, net: 0, fees: 0, depCount: 0, wdCount: 0, newClients: 0 };
      map[k].newClients++;
    }
    for (const v of Object.values(map)) v.net = v.deposits - v.withdrawals;
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);
  }, [filteredDeposits, filteredWithdrawals, clients]);

  // ── Print / export ─────────────────────────────────────────────────────────
  const handlePrint = () => window.print();

  const generatedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const dateLabel = fromDate || toDate
    ? `${fromDate || "All time"} → ${toDate || "Now"}`
    : "All time";

  return (
    <>
      {/* ── Print-only styles ──────────────────────────────────────────────── */}
      <style>{`
        @media print {
          @page { size: A4; margin: 14mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-break-before { break-before: page; }
          nav, aside, header.site-header { display: none !important; }
        }
        @media screen { .print-only { display: none; } }
      `}</style>

      <div ref={printRef} className="p-6 space-y-8">

        {/* ── Print-only branded header ──────────────────────────────────── */}
        <div className="print-only mb-6" style={{ borderBottom: "3px solid #1B3A6B", paddingBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1B3A6B" }}>GOLDKACH INVESTMENT</div>
              <div style={{ fontSize: 10, color: "#666" }}>Unlocking Global Investments</div>
            </div>
            <div style={{ textAlign: "right", fontSize: 10, color: "#666" }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Platform Analytics Report</div>
              <div>Period: {dateLabel}</div>
              <div>Generated: {generatedDate}</div>
            </div>
          </div>
        </div>

        {/* ── Page title + actions ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Platform Analytics</h1>
            <p className="text-sm text-slate-400 mt-0.5">System-wide metrics, trends and performance</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="h-3.5 w-3.5" />
              Print / PDF
            </Button>
          </div>
        </div>

        {/* ── Date range filter ──────────────────────────────────────────── */}
        <div className="no-print flex flex-wrap items-end gap-4 p-4 rounded-xl border border-border bg-muted/20">
          <div className="space-y-1">
            <Label className="text-xs">From</Label>
            <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="h-8 text-xs w-36" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">To</Label>
            <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="h-8 text-xs w-36" />
          </div>
          {(fromDate || toDate) && (
            <Button size="sm" variant="ghost" className="h-8 text-xs gap-1" onClick={() => { setFromDate(""); setToDate(""); }}>
              <XCircle className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
          <span className="text-xs text-muted-foreground self-end pb-1">
            Period: <strong>{dateLabel}</strong>
          </span>
        </div>

        {/* ── Section 1: Financial KPIs ──────────────────────────────────── */}
        <Section title="Financial Overview">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard title="Total AUM" value={fmtShort(kpis.totalAUM)} sub="Portfolio NAV (all wallets)" icon={PieChartIcon} color="text-blue-500" border="border-l-blue-500" />
            <KpiCard title="Platform Cash" value={fmtShort(kpis.totalCash)} sub="Available in master wallets" icon={Wallet} color="text-emerald-500" border="border-l-emerald-500" />
            <KpiCard title="Total Deposited" value={fmtShort(kpis.totalDeposited)} sub="All-time external deposits" icon={ArrowUpRight} color="text-green-500" border="border-l-green-500" />
            <KpiCard title="Total Withdrawn" value={fmtShort(kpis.totalWithdrawn)} sub="All-time hard withdrawals" icon={ArrowDownRight} color="text-red-500" border="border-l-red-500" />
          </div>
        </Section>

        {/* ── Section 2: Period KPIs ─────────────────────────────────────── */}
        <Section title={`Period Metrics — ${dateLabel}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard title="Net Inflow" value={fmtShort(Math.abs(kpis.netInflow))} sub={kpis.netInflow >= 0 ? "Net positive" : "Net negative"} badge={kpis.netInflow >= 0 ? "▲ Inflow" : "▼ Outflow"} icon={kpis.netInflow >= 0 ? TrendingUp : TrendingDown} color={kpis.netInflow >= 0 ? "text-emerald-500" : "text-red-500"} border={kpis.netInflow >= 0 ? "border-l-emerald-500" : "border-l-red-500"} />
            <KpiCard title="Avg Deposit Size" value={fmtShort(kpis.avgDepAmt)} sub={`${kpis.apprDep.length} approved deposits`} icon={Activity} color="text-sky-500" border="border-l-sky-500" />
            <KpiCard title="Pending Deposits" value={`${kpis.pendDep.length}`} sub={fmtShort(kpis.pendDepAmt) + " awaiting"} icon={Clock} color="text-amber-500" border="border-l-amber-500" />
            <KpiCard title="Pending Withdrawals" value={`${kpis.pendWd.length}`} sub={fmtShort(kpis.pendWdAmt) + " awaiting"} icon={Clock} color="text-orange-500" border="border-l-orange-500" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
            <KpiCard title="Deposit Approval Rate" value={`${kpis.approvalRate.toFixed(1)}%`} sub={`${kpis.apprDep.length} / ${kpis.apprDep.length + kpis.pendDep.length + kpis.rejDep.length}`} icon={CheckCircle} color="text-teal-500" border="border-l-teal-500" />
            <KpiCard title="Avg Client AUM" value={fmtShort(kpis.avgClientAUM)} sub={`Across ${wallets.length} wallets`} icon={Briefcase} color="text-violet-500" border="border-l-violet-500" />
            <KpiCard title="Platform Fees" value={fmtShort(kpis.totalFees)} sub="Collected all-time" icon={DollarSign} color="text-orange-500" border="border-l-orange-500" />
            <KpiCard title="Agents" value={`${kpis.agents}`} sub={`of ${kpis.totalStaff} staff`} icon={Users} color="text-pink-500" border="border-l-pink-500" />
          </div>
        </Section>

        {/* ── Section 3: Client KPIs ─────────────────────────────────────── */}
        <Section title="Client Overview">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard title="Total Clients" value={fmtNum(kpis.totalClients)} sub={`${kpis.activeClients} active`} icon={Users} color="text-violet-500" border="border-l-violet-500" />
            <KpiCard title="KYC Approved" value={fmtNum(kpis.approvedClients)} sub={`${((kpis.approvedClients / Math.max(kpis.totalClients, 1)) * 100).toFixed(0)}% of total`} icon={UserCheck} color="text-teal-500" border="border-l-teal-500" />
            <KpiCard title="Pending KYC" value={fmtNum(kpis.pendingKYC)} sub="Awaiting approval" icon={Clock} color="text-yellow-500" border="border-l-yellow-500" />
            <KpiCard title="New This Period" value={fmtNum(filteredClients.length)} sub="Within date filter" icon={ArrowUpRight} color="text-blue-500" border="border-l-blue-500" />
          </div>
        </Section>

        {/* ── Monthly Cash Flow Chart ────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Cash Flow</CardTitle>
            <CardDescription>Approved deposits vs withdrawals — net inflow per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyFlow} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gDep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gWd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0089ff" stopOpacity={0.3} /><stop offset="95%" stopColor="#0089ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => fmtShort(v)} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [fmtUSD(v)]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="deposits"    name="Deposits"    stroke="#10b981" fill="url(#gDep)" strokeWidth={2} />
                  <Area type="monotone" dataKey="withdrawals" name="Withdrawals" stroke="#ef4444" fill="url(#gWd)"  strokeWidth={2} />
                  <Area type="monotone" dataKey="net"         name="Net Inflow"  stroke="#0089ff" fill="url(#gNet)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ── Client Growth + Transaction Status ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Client Growth</CardTitle>
              <CardDescription>New registrations and cumulative total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
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
              <CardTitle className="text-base">Transaction Status</CardTitle>
              <CardDescription>Deposits and withdrawals by approval status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={txStatus} cx="50%" cy="50%" outerRadius={85} dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={true}>
                      {txStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => [v, "transactions"]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Deposit & Withdrawal Type Split ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 print-break-before">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deposit Type Split</CardTitle>
              <CardDescription>External deposits vs portfolio top-ups (approved)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={depositTypes} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={v => fmtShort(v)} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v: any) => [fmtUSD(v)]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
                      {depositTypes.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {depositTypes.map(d => (
                  <div key={d.name} className="text-xs rounded-lg border border-border p-2.5">
                    <div className="text-muted-foreground">{d.name}</div>
                    <div className="font-bold text-sm mt-0.5" style={{ color: d.color }}>{fmtShort(d.value)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Withdrawal Type Split</CardTitle>
              <CardDescription>Bank withdrawals vs portfolio redemptions (approved)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={withdrawalTypes} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={v => fmtShort(v)} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v: any) => [fmtUSD(v)]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
                      {withdrawalTypes.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {withdrawalTypes.map(d => (
                  <div key={d.name} className="text-xs rounded-lg border border-border p-2.5">
                    <div className="text-muted-foreground">{d.name}</div>
                    <div className="font-bold text-sm mt-0.5" style={{ color: d.color }}>{fmtShort(d.value)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Top Clients by NAV ────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 10 Clients by Portfolio NAV</CardTitle>
            <CardDescription>Highest value portfolios on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topClients} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" interval={0} />
                  <YAxis tickFormatter={v => fmtShort(v)} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: any) => [fmtUSD(v)]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="nav"  name="Portfolio NAV"  fill="#0089ff" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="cash" name="Cash Balance"   fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="dep"  name="Total Deposited" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Top clients table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">#</th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">Client</th>
                    <th className="text-right py-2 px-2 text-muted-foreground font-medium">Portfolio NAV</th>
                    <th className="text-right py-2 px-2 text-muted-foreground font-medium">Cash</th>
                    <th className="text-right py-2 px-2 text-muted-foreground font-medium">Total Deposited</th>
                    <th className="text-right py-2 px-2 text-muted-foreground font-medium">Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {topClients.map((c, i) => (
                    <tr key={c.name} className="border-b border-border/40 hover:bg-muted/20">
                      <td className="py-2 px-2 text-muted-foreground">{i + 1}</td>
                      <td className="py-2 px-2 font-medium">{c.name}</td>
                      <td className="py-2 px-2 text-right font-bold text-blue-500">{fmtShort(c.nav)}</td>
                      <td className="py-2 px-2 text-right text-emerald-500">{fmtShort(c.cash)}</td>
                      <td className="py-2 px-2 text-right text-muted-foreground">{fmtShort(c.dep)}</td>
                      <td className="py-2 px-2 text-right text-amber-500">{fmtShort(c.fees)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ── Monthly Financial Summary Table ───────────────────────────── */}
        <Card className="print-break-before">
          <CardHeader>
            <CardTitle className="text-base">Monthly Financial Summary</CardTitle>
            <CardDescription>Approved transactions broken down by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/40 border-y border-border">
                    <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground">Month</th>
                    <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">Deposits</th>
                    <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">Withdrawals</th>
                    <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">Net Inflow</th>
                    <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">Fees</th>
                    <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">Dep. #</th>
                    <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">Wd. #</th>
                    <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">New Clients</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlySummary.map((row, i) => (
                    <tr key={row.month} className={`border-b border-border/40 ${i % 2 === 0 ? "bg-muted/10" : ""}`}>
                      <td className="py-2 px-3 font-medium">{row.month}</td>
                      <td className="py-2 px-3 text-right text-emerald-500 font-medium">{fmtShort(row.deposits)}</td>
                      <td className="py-2 px-3 text-right text-red-500 font-medium">{fmtShort(row.withdrawals)}</td>
                      <td className={`py-2 px-3 text-right font-bold ${row.net >= 0 ? "text-blue-500" : "text-red-500"}`}>
                        {row.net >= 0 ? "+" : ""}{fmtShort(row.net)}
                      </td>
                      <td className="py-2 px-3 text-right text-amber-500">{fmtShort(row.fees)}</td>
                      <td className="py-2 px-3 text-right text-muted-foreground">{row.depCount}</td>
                      <td className="py-2 px-3 text-right text-muted-foreground">{row.wdCount}</td>
                      <td className="py-2 px-3 text-right text-violet-500">{row.newClients}</td>
                    </tr>
                  ))}
                  {/* Totals row */}
                  {monthlySummary.length > 1 && (
                    <tr className="border-t-2 border-border font-bold bg-muted/30">
                      <td className="py-2.5 px-3">TOTAL</td>
                      <td className="py-2.5 px-3 text-right text-emerald-500">{fmtShort(monthlySummary.reduce((s, r) => s + r.deposits, 0))}</td>
                      <td className="py-2.5 px-3 text-right text-red-500">{fmtShort(monthlySummary.reduce((s, r) => s + r.withdrawals, 0))}</td>
                      <td className={`py-2.5 px-3 text-right ${monthlySummary.reduce((s, r) => s + r.net, 0) >= 0 ? "text-blue-500" : "text-red-500"}`}>
                        {monthlySummary.reduce((s, r) => s + r.net, 0) >= 0 ? "+" : ""}{fmtShort(monthlySummary.reduce((s, r) => s + r.net, 0))}
                      </td>
                      <td className="py-2.5 px-3 text-right text-amber-500">{fmtShort(monthlySummary.reduce((s, r) => s + r.fees, 0))}</td>
                      <td className="py-2.5 px-3 text-right">{monthlySummary.reduce((s, r) => s + r.depCount, 0)}</td>
                      <td className="py-2.5 px-3 text-right">{monthlySummary.reduce((s, r) => s + r.wdCount, 0)}</td>
                      <td className="py-2.5 px-3 text-right text-violet-500">{monthlySummary.reduce((s, r) => s + r.newClients, 0)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {monthlySummary.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">No data in the selected period.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Deposit Methods + Client Status + Staff Roles ─────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Deposit Methods</CardTitle>
              <CardDescription className="text-xs">By approved volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={depositMethods} cx="50%" cy="50%" outerRadius={65} dataKey="value">
                      {depositMethods.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => [fmtUSD(v)]} contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {depositMethods.map((m, i) => (
                  <div key={m.name} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-muted-foreground">{m.name}</span>
                    </div>
                    <span className="font-medium">{fmtShort(m.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Client KYC Status</CardTitle>
              <CardDescription className="text-xs">Onboarding progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={clientStatus} cx="50%" cy="50%" outerRadius={65} dataKey="value"
                      label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                      {clientStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {clientStatus.map(s => (
                  <div key={s.name} className="flex justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                      <span className="text-muted-foreground">{s.name}</span>
                    </div>
                    <span className="font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Staff by Role</CardTitle>
              <CardDescription className="text-xs">Team composition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={staffRoles} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={95} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="value" name="Count" fill="#8b5cf6" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Full Platform Summary ──────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Platform Summary</CardTitle>
            <CardDescription>All-time platform statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
              {[
                { label: "Total AUM",              value: fmtShort(kpis.totalAUM) },
                { label: "Platform Cash",           value: fmtShort(kpis.totalCash) },
                { label: "All-time Deposited",      value: fmtShort(kpis.totalDeposited) },
                { label: "All-time Withdrawn",      value: fmtShort(kpis.totalWithdrawn) },
                { label: "Platform Fees",           value: fmtShort(kpis.totalFees) },
                { label: "Avg Client AUM",          value: fmtShort(kpis.avgClientAUM) },
                { label: "Total Clients",           value: fmtNum(kpis.totalClients) },
                { label: "Active Clients",          value: fmtNum(kpis.activeClients) },
                { label: "KYC Approved",            value: fmtNum(kpis.approvedClients) },
                { label: "Pending KYC",             value: fmtNum(kpis.pendingKYC) },
                { label: "Total Staff",             value: fmtNum(kpis.totalStaff) },
                { label: "Agents",                  value: fmtNum(kpis.agents) },
                { label: "Total Deposits",          value: fmtNum(deposits.length) },
                { label: "Approved Deposits",       value: fmtNum(kpis.apprDep.length) },
                { label: "Total Withdrawals",       value: fmtNum(withdrawals.length) },
                { label: "Approved Withdrawals",    value: fmtNum(kpis.apprWd.length) },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2.5 px-3 border-b border-r border-border/40 last:border-b-0 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                  <span className="font-semibold text-slate-800 dark:text-white ml-2">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Print footer ───────────────────────────────────────────────── */}
        <div className="print-only mt-8 pt-4 text-xs text-center" style={{ borderTop: "1px solid #e5e7eb", color: "#9ca3af" }}>
          GoldKach Investment Ltd — Plot 17 Hannington Road, Crested Towers, Kampala, Uganda<br />
          Confidential — For internal use only — {generatedDate}
        </div>

      </div>
    </>
  );
}
