"use client";

import { useState, useTransition, useEffect } from "react";
import { Download, Loader2, Search, X, FileText, ArrowDownCircle, ArrowUpCircle, RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { listDeposits } from "@/actions/deposits";
import { listWithdrawals } from "@/actions/withdraws";

/* -------------------------------------------------------------------------- */
/*  Types                                                                       */
/* -------------------------------------------------------------------------- */

type TxType = "DEPOSIT" | "ALLOCATION" | "WITHDRAWAL" | "REDEMPTION";

interface LedgerEntry {
  id:          string;
  date:        string;
  type:        TxType;
  description: string;
  reference:   string;
  amount:      number;
  fees:        number;
  status:      string;
  portfolio?:  string | null;
  approvedBy?: string | null;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const fmtUGX = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt = (n: number) => fmtUGX.format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const TYPE_CONFIG: Record<TxType, { label: string; color: string; icon: any; sign: "+" | "-" }> = {
  DEPOSIT:    { label: "Deposit",    color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400", icon: ArrowDownCircle, sign: "+" },
  ALLOCATION: { label: "Top Up",     color: "border-blue-500/30 bg-blue-500/10 text-blue-400",          icon: TrendingUp,      sign: "-" },
  WITHDRAWAL: { label: "Withdrawal", color: "border-red-500/30 bg-red-500/10 text-red-400",             icon: ArrowUpCircle,   sign: "-" },
  REDEMPTION: { label: "Redemption", color: "border-violet-500/30 bg-violet-500/10 text-violet-400",    icon: RefreshCw,       sign: "+" },
};

const STATUS_COLOR: Record<string, string> = {
  APPROVED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  PENDING:  "border-amber-500/20 bg-amber-500/10 text-amber-400",
  REJECTED: "border-red-500/20 bg-red-500/10 text-red-400",
  MERGED:   "border-blue-500/20 bg-blue-500/10 text-blue-400",
};

function downloadLedgerPDF(
  entries: LedgerEntry[],
  clientName: string,
  fromDate: string,
  toDate: string,
  totals: { deposits: number; topups: number; withdrawals: number; redemptions: number; fees: number }
) {
  const rows = entries.map((e, i) => {
    const cfg = TYPE_CONFIG[e.type];
    const isCredit = cfg.sign === "+";
    return `
      <tr style="background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"}">
        <td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;font-size:11px;">${fmtDate(e.date)}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;">
          <span style="display:inline-block;padding:2px 7px;border-radius:9999px;font-size:10px;font-weight:600;
            background:${isCredit ? "#d1fae5" : "#fee2e2"};color:${isCredit ? "#065f46" : "#991b1b"};">
            ${cfg.label}
          </span>
        </td>
        <td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;font-size:11px;">${e.description}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;font-size:11px;font-family:monospace;">${e.reference || "—"}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;font-size:11px;text-align:right;
          color:${isCredit ? "#065f46" : "#991b1b"};font-weight:600;">
          ${cfg.sign}${fmt(e.amount)}
        </td>
        <td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;font-size:11px;text-align:right;color:#6b7280;">
          ${e.fees > 0 ? fmt(e.fees) : "—"}
        </td>
        <td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;">
          <span style="display:inline-block;padding:2px 7px;border-radius:9999px;font-size:10px;font-weight:600;
            background:${e.status === "APPROVED" || e.status === "MERGED" ? "#d1fae5" : e.status === "PENDING" ? "#fef3c7" : "#fee2e2"};
            color:${e.status === "APPROVED" || e.status === "MERGED" ? "#065f46" : e.status === "PENDING" ? "#92400e" : "#991b1b"};">
            ${e.status}
          </span>
        </td>
        <td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;font-size:11px;color:#6b7280;">${e.portfolio || "—"}</td>
      </tr>`;
  }).join("");

  const dateRange = fromDate && toDate
    ? `${fmtDate(fromDate + "T00:00:00")} — ${fmtDate(toDate + "T00:00:00")}`
    : fromDate ? `From ${fmtDate(fromDate + "T00:00:00")}` : toDate ? `To ${fmtDate(toDate + "T00:00:00")}` : "All Dates";

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <title>Transaction Ledger — ${clientName}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;font-size:12px;color:#111827;padding:24px}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:14px;border-bottom:2px solid #1e3a8a}
    .header h1{font-size:20px;font-weight:700;color:#1e3a8a}
    .header p{font-size:11px;color:#6b7280;margin-top:3px}
    .meta{text-align:right;font-size:11px;color:#6b7280}
    .meta strong{color:#111827}
    .summary{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:18px}
    .summary-card{border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;text-align:center}
    .summary-card .label{font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em}
    .summary-card .value{font-size:14px;font-weight:700;margin-top:3px}
    table{width:100%;border-collapse:collapse}
    thead tr{background:#1e3a8a;color:white}
    thead th{padding:9px 10px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
    thead th:nth-child(5),thead th:nth-child(6){text-align:right}
    tfoot tr{background:#f3f4f6;font-weight:700}
    tfoot td{padding:9px 10px;font-size:11px;border-top:2px solid #1e3a8a}
    @media print{body{padding:12px}}
  </style></head><body>
  <div class="header">
    <div>
      <h1>GoldKach Investment</h1>
      <p>Transaction Ledger — <strong>${clientName}</strong></p>
      <p>Period: ${dateRange}</p>
    </div>
    <div class="meta">
      <p>Generated: <strong>${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</strong></p>
      <p>Total Transactions: <strong>${entries.length}</strong></p>
    </div>
  </div>

  <div class="summary">
    <div class="summary-card">
      <div class="label">Deposits</div>
      <div class="value" style="color:#065f46">+${fmt(totals.deposits)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Top Ups</div>
      <div class="value" style="color:#1d4ed8">-${fmt(totals.topups)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Withdrawals</div>
      <div class="value" style="color:#991b1b">-${fmt(totals.withdrawals)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Redemptions</div>
      <div class="value" style="color:#5b21b6">+${fmt(totals.redemptions)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Total Fees</div>
      <div class="value" style="color:#92400e">${fmt(totals.fees)}</div>
    </div>
  </div>

  <table>
    <thead><tr>
      <th>Date</th><th>Type</th><th>Description</th><th>Reference</th>
      <th style="text-align:right">Amount</th><th style="text-align:right">Fees</th>
      <th>Status</th><th>Portfolio</th>
    </tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr>
      <td colspan="4">TOTALS</td>
      <td style="text-align:right">
        Net: ${fmt(totals.deposits + totals.redemptions - totals.topups - totals.withdrawals)}
      </td>
      <td style="text-align:right">${fmt(totals.fees)}</td>
      <td colspan="2"></td>
    </tr></tfoot>
  </table>
  </body></html>`;

  const win = window.open("", "_blank", "width=1200,height=850");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 600);
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                              */
/* -------------------------------------------------------------------------- */

export function TransactionLedger({
  userId,
  clientName,
}: {
  userId: string;
  clientName: string;
}) {
  const [entries, setEntries]     = useState<LedgerEntry[]>([]);
  const [fetched, setFetched]     = useState(false);
  const [fromDate, setFromDate]   = useState("");
  const [toDate, setToDate]       = useState("");
  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeFilter] = useState<TxType | "ALL">("ALL");
  const [isPending, startTransition] = useTransition();

  function handleFetch(from = fromDate, to = toDate) {
    startTransition(async () => {
      async function fetchAllDeposits() {
        const all: any[] = [];
        let page = 1;
        while (true) {
          const res = await listDeposits({ userId, page, pageSize: 100 });
          if (!res.success || !res.data?.length) break;
          all.push(...res.data);
          if (!res.meta || page >= res.meta.totalPages) break;
          page++;
        }
        return all;
      }

      async function fetchAllWithdrawals() {
        const all: any[] = [];
        let page = 1;
        while (true) {
          const res = await listWithdrawals({ userId, page, pageSize: 100 });
          if (!res.success || !res.data?.length) break;
          all.push(...res.data);
          if (!res.meta || page >= (res.meta as any).totalPages) break;
          page++;
        }
        return all;
      }

      const [allDeposits, allWithdrawals] = await Promise.all([
        fetchAllDeposits(),
        fetchAllWithdrawals(),
      ]);

      // Apply date range filter client-side
      const fromTs = from ? new Date(from + "T00:00:00.000Z").getTime() : null;
      const toTs   = to   ? new Date(to   + "T23:59:59.999Z").getTime() : null;

      const filterByDate = (items: any[]) => items.filter((item) => {
        const t = new Date(item.createdAt).getTime();
        if (fromTs && t < fromTs) return false;
        if (toTs   && t > toTs)   return false;
        return true;
      });

      setEntries(buildEntries(filterByDate(allDeposits), filterByDate(allWithdrawals)));
      setFetched(true);
    });
  }

  // Auto-load all transactions on mount
  useEffect(() => {
    handleFetch("", "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buildEntries(deposits: any[], withdrawals: any[]): LedgerEntry[] {
    const result: LedgerEntry[] = [];

    for (const d of deposits) {
      result.push({
        id:          d.id,
        date:        d.createdAt,
        type:        d.depositTarget === "ALLOCATION" ? "ALLOCATION" : "DEPOSIT",
        description: d.depositTarget === "ALLOCATION"
          ? `Top Up to ${d.userPortfolio?.customName ?? "Portfolio"}`
          : `External Deposit`,
        reference:   d.referenceNo ?? d.transactionId ?? "—",
        amount:      d.amount,
        fees:        d.totalFees ?? 0,
        status:      d.transactionStatus,
        portfolio:   d.userPortfolio?.customName ?? null,
        approvedBy:  d.approvedByName ?? null,
      });
    }

    for (const w of withdrawals) {
      result.push({
        id:          w.id,
        date:        w.createdAt,
        type:        w.withdrawalType === "REDEMPTION" ? "REDEMPTION" : "WITHDRAWAL",
        description: w.withdrawalType === "REDEMPTION"
          ? `Redemption from ${w.userPortfolio?.customName ?? "Portfolio"}`
          : `Cash Withdrawal — ${w.bankName ?? ""}`.trim().replace(/—\s*$/, ""),
        reference:   w.referenceNo ?? w.transactionId ?? "—",
        amount:      w.amount,
        fees:        0,
        status:      w.transactionStatus,
        portfolio:   w.userPortfolio?.customName ?? null,
        approvedBy:  w.approvedByName ?? null,
      });
    }

    // Sort by date descending
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Apply client-side filters
  const visible = entries.filter((e) => {
    const matchType   = typeFilter === "ALL" || e.type === typeFilter;
    const matchSearch = !search || [e.description, e.reference, e.portfolio ?? ""]
      .join(" ").toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  // Totals
  const totals = {
    deposits:    entries.filter(e => e.type === "DEPOSIT"    && e.status === "APPROVED").reduce((s, e) => s + e.amount, 0),
    topups:      entries.filter(e => e.type === "ALLOCATION" && e.status === "APPROVED").reduce((s, e) => s + e.amount, 0),
    withdrawals: entries.filter(e => e.type === "WITHDRAWAL" && e.status === "APPROVED").reduce((s, e) => s + e.amount, 0),
    redemptions: entries.filter(e => e.type === "REDEMPTION" && e.status === "APPROVED").reduce((s, e) => s + e.amount, 0),
    fees:        entries.reduce((s, e) => s + e.fees, 0),
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Transaction Ledger</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Deposits, top-ups, withdrawals and redemptions
              </CardDescription>
            </div>
          </div>
          {fetched && entries.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => downloadLedgerPDF(visible, clientName, fromDate, toDate, totals)}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date range + fetch */}
        <div className="flex flex-wrap items-end gap-3 p-4 rounded-lg border border-border bg-muted/20">
          <div className="space-y-1">
            <Label className="text-xs">From Date</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-8 text-xs w-36"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">To Date</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-8 text-xs w-36"
            />
          </div>
          {(fromDate || toDate) && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-1 text-xs"
              onClick={() => { setFromDate(""); setToDate(""); }}
            >
              <X className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => handleFetch(fromDate, toDate)}
            disabled={isPending}
            className="h-8 gap-2"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            {isPending ? "Loading…" : "Apply Filter"}
          </Button>
        </div>

        {/* Totals summary */}
        {fetched && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Deposits",    value: totals.deposits,    color: "text-emerald-400", sign: "+" },
              { label: "Top Ups",     value: totals.topups,      color: "text-blue-400",    sign: "-" },
              { label: "Withdrawals", value: totals.withdrawals, color: "text-red-400",     sign: "-" },
              { label: "Redemptions", value: totals.redemptions, color: "text-violet-400",  sign: "+" },
              { label: "Total Fees",  value: totals.fees,        color: "text-amber-400",   sign: ""  },
            ].map(({ label, value, color, sign }) => (
              <div key={label} className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-sm font-bold mt-0.5 ${color}`}>
                  {sign}{fmt(value)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        {fetched && entries.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search description, reference…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["ALL", "DEPOSIT", "ALLOCATION", "WITHDRAWAL", "REDEMPTION"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors ${
                    typeFilter === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {t === "ALL" ? "All" : t === "ALLOCATION" ? "Top Up" : t.charAt(0) + t.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-auto">
              {visible.length} of {entries.length} transactions
            </span>
          </div>
        )}

        {/* Table */}
        {fetched && (
          entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <FileText className="h-8 w-8 opacity-20" />
              <p className="text-sm">No transactions found for the selected period.</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-x-auto">
              <table className="w-full text-xs min-w-[750px]">
                <thead className="bg-muted/40 border-b border-border">
                  <tr>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Description</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Reference</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-muted-foreground uppercase tracking-wide">Fees</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Portfolio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {visible.map((e) => {
                    const cfg = TYPE_CONFIG[e.type];
                    const Icon = cfg.icon;
                    const isCredit = cfg.sign === "+";
                    return (
                      <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{fmtDate(e.date)}</td>
                        <td className="px-3 py-2.5">
                          <Badge variant="outline" className={`gap-1 text-[10px] ${cfg.color}`}>
                            <Icon className="h-2.5 w-2.5" />
                            {cfg.label}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5 text-foreground max-w-[200px]">
                          <span className="truncate block" title={e.description}>{e.description}</span>
                          {e.approvedBy && (
                            <span className="text-[10px] text-muted-foreground">by {e.approvedBy}</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-muted-foreground">{e.reference}</td>
                        <td className={`px-3 py-2.5 text-right font-bold whitespace-nowrap ${isCredit ? "text-emerald-400" : "text-red-400"}`}>
                          {cfg.sign}{fmt(e.amount)}
                        </td>
                        <td className="px-3 py-2.5 text-right text-muted-foreground">
                          {e.fees > 0 ? fmt(e.fees) : "—"}
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge variant="outline" className={`text-[10px] ${STATUS_COLOR[e.status] ?? "border-border text-muted-foreground"}`}>
                            {e.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground max-w-[140px]">
                          <span className="truncate block">{e.portfolio || "—"}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Totals footer */}
                <tfoot className="border-t-2 border-border bg-muted/30">
                  <tr>
                    <td colSpan={4} className="px-3 py-2.5 font-bold text-foreground">
                      TOTALS ({visible.length} transactions)
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold text-foreground whitespace-nowrap">
                      Net: <span className={(totals.deposits + totals.redemptions - totals.topups - totals.withdrawals) >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {fmt(totals.deposits + totals.redemptions - totals.topups - totals.withdrawals)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold text-amber-400">{fmt(totals.fees)}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
