"use client";

import { useState } from "react";
import { Search, Info, AlertTriangle, Server, Database, Users, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Math.round(n)}`;
};
const fmtDate = (d: string) => new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function SystemLogsView({ stats, events }: { stats: any; events: any[] }) {
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const filtered = events.filter((e) => {
    const q = query.toLowerCase();
    const matchQ = !q || e.message.toLowerCase().includes(q) || e.detail.toLowerCase().includes(q);
    const matchLevel = levelFilter === "all" || e.level === levelFilter;
    return matchQ && matchLevel;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">System Logs</h1>
        <p className="text-sm text-slate-400 mt-1">Platform health, statistics and event log</p>
      </div>

      {/* System Health Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total AUM",     value: fmtShort(stats.totalAUM),   color: "text-blue-500",   border: "border-l-blue-500",   icon: Wallet },
          { label: "Platform Cash", value: fmtShort(stats.totalCash),  color: "text-green-500",  border: "border-l-green-500",  icon: Database },
          { label: "Total Clients", value: stats.totalClients,         color: "text-violet-500", border: "border-l-violet-500", icon: Users },
          { label: "Total Fees",    value: fmtShort(stats.totalFees),  color: "text-amber-500",  border: "border-l-amber-500",  icon: Server },
        ].map((s) => (
          <Card key={s.label} className={`border-l-4 ${s.border}`}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
                <s.icon className={`h-5 w-5 ${s.color} opacity-60`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "Active Clients",       value: `${stats.activeClients} / ${stats.totalClients}` },
          { label: "Active Wallets",        value: `${stats.activeWallets} / ${stats.totalWallets}` },
          { label: "Staff Members",         value: stats.totalStaff },
          { label: "Pending Deposits",      value: stats.pendingDeposits,    highlight: stats.pendingDeposits > 0 },
          { label: "Approved Deposits",     value: stats.approvedDeposits },
          { label: "Rejected Deposits",     value: stats.rejectedDeposits,   highlight: stats.rejectedDeposits > 0 },
          { label: "Pending Withdrawals",   value: stats.pendingWithdrawals, highlight: stats.pendingWithdrawals > 0 },
          { label: "Approved Withdrawals",  value: stats.approvedWithdrawals },
          { label: "Total Transactions",    value: stats.totalDeposits + stats.totalWithdrawals },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-3 pb-3 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className={`text-sm font-bold ${s.highlight ? "text-amber-500" : "text-foreground"}`}>{s.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Event Log */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search events…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
        </div>
        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground">
          <option value="all">All Levels</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
        </select>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Server className="h-4 w-4" /> Event Log</CardTitle>
          <CardDescription>{filtered.length} events</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <p className="px-4 py-10 text-center text-muted-foreground text-sm">No events found.</p>
            ) : (
              filtered.map((e) => (
                <div key={e.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/10">
                  <div className="mt-0.5 shrink-0">
                    {e.level === "warn"
                      ? <AlertTriangle className="h-4 w-4 text-amber-500" />
                      : <Info className="h-4 w-4 text-blue-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{e.message}</p>
                    <p className="text-xs text-muted-foreground">{e.detail}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] ${e.level === "warn" ? "border-amber-400/40 text-amber-500" : "border-blue-400/40 text-blue-500"}`}>
                      {e.level.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{fmtDate(e.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
