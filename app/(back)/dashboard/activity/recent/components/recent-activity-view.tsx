"use client";

import { useState } from "react";
import { Search, ArrowUpCircle, ArrowDownCircle, RefreshCw, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  deposit:    { label: "Deposit",    color: "border-green-400/40 text-green-500 bg-green-500/10",   icon: ArrowUpCircle },
  allocation: { label: "Allocation", color: "border-blue-400/40 text-blue-500 bg-blue-500/10",     icon: RefreshCw },
  withdrawal: { label: "Cash Out",   color: "border-orange-400/40 text-orange-500 bg-orange-500/10", icon: ArrowDownCircle },
  redemption: { label: "Redemption", color: "border-cyan-400/40 text-cyan-500 bg-cyan-500/10",     icon: ArrowDownCircle },
};

const STATUS_CONFIG: Record<string, { color: string; icon: any }> = {
  APPROVED: { color: "border-green-400/40 text-green-500 bg-green-500/10",   icon: CheckCircle },
  PENDING:  { color: "border-amber-400/40 text-amber-500 bg-amber-500/10",   icon: Clock },
  REJECTED: { color: "border-red-400/40 text-red-500 bg-red-500/10",         icon: XCircle },
};

const fmt = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d: string) => new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const userName = (u?: any) => [u?.firstName, u?.lastName].filter(Boolean).join(" ") || u?.email || "Unknown";

export function RecentActivityView({ activities, staff }: { activities: any[]; staff: any[] }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = activities.filter((a) => {
    const q = query.toLowerCase();
    const name = userName(a.user).toLowerCase();
    const matchQ = !q || name.includes(q) || a.type.includes(q) || (a.description ?? "").toLowerCase().includes(q);
    const matchType = typeFilter === "all" || a.type === typeFilter;
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchQ && matchType && matchStatus;
  });

  const totals = {
    total: activities.length,
    approved: activities.filter((a) => a.status === "APPROVED").length,
    pending: activities.filter((a) => a.status === "PENDING").length,
    rejected: activities.filter((a) => a.status === "REJECTED").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Recent Activity</h1>
        <p className="text-sm text-slate-400 mt-1">All platform transactions and events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Events",  value: totals.total,    color: "text-blue-500",  border: "border-l-blue-500" },
          { label: "Approved",      value: totals.approved, color: "text-green-500", border: "border-l-green-500" },
          { label: "Pending",       value: totals.pending,  color: "text-amber-500", border: "border-l-amber-500" },
          { label: "Rejected",      value: totals.rejected, color: "text-red-500",   border: "border-l-red-500" },
        ].map((s) => (
          <Card key={s.label} className={`border-l-4 ${s.border}`}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search by user or description…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground">
          <option value="all">All Types</option>
          <option value="deposit">Deposits</option>
          <option value="allocation">Allocations</option>
          <option value="withdrawal">Cash Outs</option>
          <option value="redemption">Redemptions</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground">
          <option value="all">All Statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Activity Feed</CardTitle>
          <CardDescription>{filtered.length} events</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs text-muted-foreground uppercase tracking-wide border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Processed By</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No activity found.</td></tr>
                ) : (
                  filtered.map((a) => {
                    const tc = TYPE_CONFIG[a.type] ?? TYPE_CONFIG.deposit;
                    const sc = STATUS_CONFIG[a.status] ?? STATUS_CONFIG.PENDING;
                    const TypeIcon = tc.icon;
                    const StatusIcon = sc.icon;
                    const processedBy = a.approvedBy || a.rejectedBy || a.createdBy || "—";
                    return (
                      <tr key={a.type + a.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                        <td className="px-4 py-3">
                          <p className="font-medium">{userName(a.user)}</p>
                          <p className="text-xs text-muted-foreground">{a.user?.email || "—"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={`text-xs gap-1 ${tc.color}`}>
                            <TypeIcon className="h-3 w-3" />{tc.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">{fmt(a.amount)}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={`text-xs gap-1 ${sc.color}`}>
                            <StatusIcon className="h-3 w-3" />{a.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{processedBy}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(a.createdAt)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
