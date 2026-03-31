"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, PlusCircle, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ACTION_CONFIG: Record<string, { color: string; icon: any }> = {
  CREATED:  { color: "border-blue-400/40 text-blue-500 bg-blue-500/10",   icon: PlusCircle },
  APPROVED: { color: "border-green-400/40 text-green-500 bg-green-500/10", icon: CheckCircle },
  REJECTED: { color: "border-red-400/40 text-red-500 bg-red-500/10",       icon: XCircle },
};

const fmt = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d: string) => new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function AuditTrailView({ entries }: { entries: any[] }) {
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filtered = entries.filter((e) => {
    const q = query.toLowerCase();
    const matchQ = !q || e.actor.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q) || e.entity.toLowerCase().includes(q);
    const matchAction = actionFilter === "all" || e.action === actionFilter;
    return matchQ && matchAction;
  });

  const counts = {
    total: entries.length,
    created: entries.filter((e) => e.action === "CREATED").length,
    approved: entries.filter((e) => e.action === "APPROVED").length,
    rejected: entries.filter((e) => e.action === "REJECTED").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Audit Trail</h1>
        <p className="text-sm text-slate-400 mt-1">Staff actions on platform transactions</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Actions", value: counts.total,    color: "text-blue-500",  border: "border-l-blue-500" },
          { label: "Created",       value: counts.created,  color: "text-blue-400",  border: "border-l-blue-400" },
          { label: "Approved",      value: counts.approved, color: "text-green-500", border: "border-l-green-500" },
          { label: "Rejected",      value: counts.rejected, color: "text-red-500",   border: "border-l-red-500" },
        ].map((s) => (
          <Card key={s.label} className={`border-l-4 ${s.border}`}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search by actor, subject or entity…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
        </div>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground">
          <option value="all">All Actions</option>
          <option value="CREATED">Created</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Audit Log</CardTitle>
          <CardDescription>{filtered.length} entries</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs text-muted-foreground uppercase tracking-wide border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left">Actor</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Entity</th>
                  <th className="px-4 py-3 text-left">Subject (Client)</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-left">Notes</th>
                  <th className="px-4 py-3 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No audit entries found.</td></tr>
                ) : (
                  filtered.map((e) => {
                    const ac = ACTION_CONFIG[e.action] ?? ACTION_CONFIG.CREATED;
                    const ActionIcon = ac.icon;
                    return (
                      <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                        <td className="px-4 py-3">
                          <p className="font-medium">{e.actor}</p>
                          <p className="text-xs text-muted-foreground">{e.actorRole}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={`text-xs gap-1 ${ac.color}`}>
                            <ActionIcon className="h-3 w-3" />{e.action}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{e.entity}</td>
                        <td className="px-4 py-3 font-medium">{e.subject}</td>
                        <td className="px-4 py-3 text-right font-semibold">{fmt(e.amount)}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-[160px] truncate">{e.notes || "—"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(e.timestamp)}</td>
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
