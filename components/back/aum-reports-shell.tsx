"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, AlertCircle, RefreshCw, History, Calendar, Download, X, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountantReports } from "@/components/back/aum-reports";
import { getClientsForAssignmentAction, type ClientUser } from "@/actions/staff";
import { buildClientPortfolios } from "@/lib/aum-compute";
import type { AumSnapshot } from "@/lib/aum-compute";

const fmt = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ── Historical snapshot viewer ────────────────────────────────────────────────

function HistoricalAumView({ snapshot, onClose }: { snapshot: AumSnapshot; onClose: () => void }) {
  const { date, generatedAt, summary, rows, cashClients } = snapshot;

  const exportCSV = () => {
    const headers = [
      "Investor Name", "Symbol", "Description", "Stocks", "Cost/Share",
      "Cost Price", "Close Price", "Close Value", "Gain/Loss",
      "Bank Cost", "Txn Cost", "Cash at Bank", "Cash Available", "Total Cash at Bank",
    ];
    const escape = (v: any) => {
      const s = String(v ?? "");
      return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csvData = [
      [`AUM HISTORICAL REPORT — ${date}`],
      [`Generated at: ${new Date(generatedAt).toLocaleString()}`],
      [],
      headers.map(escape),
      ...rows.map((r) => [
        r.investorName, r.symbol, r.description, r.stocks, r.costPerShare,
        r.costPrice, r.closePrice, r.closeValue, r.unrealizedGainLoss,
        r.bankCost, r.transactionCost, r.cashAtBank, r.cashAvailable, r.totalCashAtBank,
      ].map(escape)),
    ];
    const csv = csvData.map((r) => r.join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AUM-Snapshot-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 border rounded-xl border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/10 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              Historical Snapshot — {new Date(date + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Captured at {new Date(generatedAt).toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} on {date}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={exportCSV} className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose} className="gap-1.5 text-xs">
            <X className="h-3.5 w-3.5" /> Close
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-white dark:bg-card p-4">
          <p className="text-xs text-muted-foreground">Total AUM</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">{fmt(summary.totalAUM)}</p>
          <p className="text-xs text-muted-foreground">Total portfolio value</p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Gains</p>
          <p className={`text-lg font-bold mt-1 ${summary.totalGains >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {summary.totalGains >= 0 ? "+" : ""}{fmt(summary.totalGains)}
          </p>
          <p className="text-xs text-muted-foreground">Unrealised gain / loss</p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-card p-4">
          <p className="text-xs text-muted-foreground">Cash (Unallocated)</p>
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">{fmt(summary.totalCash)}</p>
          <p className="text-xs text-muted-foreground">{summary.cashClientsCount} clients with uninvested funds</p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Cash at Bank</p>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-300 mt-1">{fmt(summary.totalCashAtBank)}</p>
          <p className="text-xs text-muted-foreground">Cash + deposit fees</p>
        </div>
      </div>

      {/* AUM Table */}
      <div>
        <h3 className="text-sm font-semibold mb-3">AUM Report Table</h3>
        <div className="overflow-x-auto rounded-lg border bg-white dark:bg-card">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#2B2F77] text-white">
                {["Investor Name", "Symbol", "Description", "Stocks", "Cost/Share", "Cost Price", "Close Price", "Close Value", "Gain/Loss", "Bank Cost", "Txn Cost", "Cash at Bank", "Cash Available", "Total Cash at Bank"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-card" : "bg-slate-50 dark:bg-slate-900/20"}>
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{r.investorName}</td>
                  <td className="px-3 py-2 font-mono text-blue-600">{r.symbol}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.description}</td>
                  <td className="px-3 py-2 text-right">{r.stocks.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">{fmt(r.costPerShare)}</td>
                  <td className="px-3 py-2 text-right">{fmt(r.costPrice)}</td>
                  <td className="px-3 py-2 text-right">{fmt(r.closePrice)}</td>
                  <td className="px-3 py-2 text-right font-medium">{fmt(r.closeValue)}</td>
                  <td className={`px-3 py-2 text-right font-medium ${r.unrealizedGainLoss >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {r.unrealizedGainLoss >= 0 ? "+" : ""}{fmt(r.unrealizedGainLoss)}
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{r.bankCost > 0 ? fmt(r.bankCost) : ""}</td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{r.transactionCost > 0 ? fmt(r.transactionCost) : ""}</td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{r.cashAtBank > 0 ? fmt(r.cashAtBank) : ""}</td>
                  <td className="px-3 py-2 text-right text-emerald-600">{r.cashAvailable > 0 ? fmt(r.cashAvailable) : ""}</td>
                  <td className="px-3 py-2 text-right font-medium text-amber-600">{r.totalCashAtBank > 0 ? fmt(r.totalCashAtBank) : ""}</td>
                </tr>
              ))}
              {/* Grand total row */}
              <tr className="border-t-2 border-[#2B2F77] font-bold bg-slate-50 dark:bg-slate-900/40">
                <td className="px-3 py-2.5" colSpan={7}>Grand Total</td>
                <td className="px-3 py-2.5 text-right">{fmt(summary.totalAUM)}</td>
                <td className={`px-3 py-2.5 text-right ${summary.totalGains >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {summary.totalGains >= 0 ? "+" : ""}{fmt(summary.totalGains)}
                </td>
                <td colSpan={2} className="px-3 py-2.5"></td>
                <td className="px-3 py-2.5 text-right text-muted-foreground">
                  {fmt(rows.reduce((s, r) => s + r.cashAtBank, 0))}
                </td>
                <td className="px-3 py-2.5 text-right text-emerald-600">{fmt(summary.totalCash)}</td>
                <td className="px-3 py-2.5 text-right text-amber-600">{fmt(summary.totalCashAtBank)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash Clients */}
      {cashClients.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-amber-600" />
            Cash Clients — Unallocated Deposits ({cashClients.length} clients)
          </h3>
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-card">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-amber-600 text-white">
                  {["#", "Investor Name", "GK Account", "Total Deposited", "Withdrawn", "Redeemed", "Cash Balance", "Cash at Bank", "Total Cash at Bank"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cashClients.map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-card" : "bg-amber-50/40 dark:bg-amber-950/10"}>
                    <td className="px-3 py-2 text-center text-muted-foreground">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{r.name}</td>
                    <td className="px-3 py-2 font-mono text-blue-600">{r.accountNumber || "—"}</td>
                    <td className="px-3 py-2 text-right">{fmt(r.totalDeposited)}</td>
                    <td className="px-3 py-2 text-right">{fmt(r.totalWithdrawn)}</td>
                    <td className="px-3 py-2 text-right">{fmt(r.totalRedemptions)}</td>
                    <td className="px-3 py-2 text-right font-semibold text-amber-700 dark:text-amber-400">{fmt(r.pureDepositCash)}</td>
                    <td className="px-3 py-2 text-right text-muted-foreground">{fmt(r.cashAtBank)}</td>
                    <td className="px-3 py-2 text-right font-bold text-amber-600">{fmt(r.totalCashAtBank)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-amber-600 font-bold bg-amber-50 dark:bg-amber-950/20">
                  <td className="px-3 py-2.5" colSpan={3}>TOTAL</td>
                  <td className="px-3 py-2.5 text-right">{fmt(cashClients.reduce((s, r) => s + r.totalDeposited, 0))}</td>
                  <td className="px-3 py-2.5 text-right">{fmt(cashClients.reduce((s, r) => s + r.totalWithdrawn, 0))}</td>
                  <td className="px-3 py-2.5 text-right">{fmt(cashClients.reduce((s, r) => s + r.totalRedemptions, 0))}</td>
                  <td className="px-3 py-2.5 text-right text-amber-700">{fmt(cashClients.reduce((s, r) => s + r.pureDepositCash, 0))}</td>
                  <td className="px-3 py-2.5 text-right text-muted-foreground">{fmt(cashClients.reduce((s, r) => s + r.cashAtBank, 0))}</td>
                  <td className="px-3 py-2.5 text-right text-amber-600">{fmt(cashClients.reduce((s, r) => s + r.totalCashAtBank, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 italic">
            Cash Balance = Deposits to master wallet excluding allocated amounts. Redeemed amounts excluded.
            Total Cash at Bank = Cash Balance + deposit fees held at bank.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main shell ────────────────────────────────────────────────────────────────

export function AccountantReportsShell() {
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Historical snapshot state
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [historyDate, setHistoryDate] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historicalSnapshot, setHistoricalSnapshot] = useState<AumSnapshot | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getClientsForAssignmentAction();
      if (res.success) {
        setClients((res.data ?? []).filter((c: any) => !c.role || c.role === "USER"));
      } else {
        setError(res.error ?? "Failed to load clients.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error loading clients.");
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailableDates() {
    try {
      const res = await fetch("/api/reports/aum-history");
      if (res.ok) {
        const data = await res.json();
        setAvailableDates(data.dates ?? []);
      }
    } catch {
      // non-critical
    }
  }

  useEffect(() => {
    load();
    loadAvailableDates();
  }, []);

  async function loadHistoricalSnapshot() {
    if (!historyDate) return;
    setHistoryLoading(true);
    setHistoryError(null);
    setHistoricalSnapshot(null);
    try {
      const res = await fetch(`/api/reports/aum-history?date=${historyDate}`);
      if (!res.ok) {
        const data = await res.json();
        setHistoryError(data.error ?? "Snapshot not found for this date.");
        return;
      }
      const snapshot: AumSnapshot = await res.json();
      setHistoricalSnapshot(snapshot);
    } catch (err: any) {
      setHistoryError(err?.message ?? "Failed to load snapshot.");
    } finally {
      setHistoryLoading(false);
    }
  }

  const clientPortfolios = useMemo(() => buildClientPortfolios(clients), [clients]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin opacity-40" />
        <p className="text-sm">Loading client data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-6 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Failed to load client data</p>
          <p className="text-xs text-red-500 dark:text-red-500 mt-1 opacity-80">{error}</p>
        </div>
        <Button size="sm" variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-12 text-center text-sm text-muted-foreground">
        No clients found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Historical report loader ──────────────────────────────────────── */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-amber-600" />
          <h3 className="text-sm font-semibold">Historical AUM Reports</h3>
          {availableDates.length > 0 && (
            <span className="text-xs text-muted-foreground">({availableDates.length} snapshots available)</span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {availableDates.length > 0 ? (
            <select
              value={historyDate}
              onChange={(e) => { setHistoryDate(e.target.value); setHistoricalSnapshot(null); setHistoryError(null); }}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Select a date…</option>
              {availableDates.map((d) => (
                <option key={d} value={d}>
                  {new Date(d + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </option>
              ))}
            </select>
          ) : (
            <Input
              type="date"
              value={historyDate}
              onChange={(e) => { setHistoryDate(e.target.value); setHistoricalSnapshot(null); setHistoryError(null); }}
              className="h-9 w-auto"
              max={new Date().toISOString().split("T")[0]}
            />
          )}
          <Button
            size="sm"
            onClick={loadHistoricalSnapshot}
            disabled={!historyDate || historyLoading}
            className="gap-1.5"
          >
            {historyLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Calendar className="h-3.5 w-3.5" />}
            Load Report
          </Button>
          {historicalSnapshot && (
            <Button size="sm" variant="ghost" onClick={() => setHistoricalSnapshot(null)} className="gap-1.5 text-xs">
              <X className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>

        {historyError && (
          <p className="text-xs text-red-500 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" /> {historyError}
          </p>
        )}

        {availableDates.length === 0 && !historyDate && (
          <p className="text-xs text-muted-foreground">
            No snapshots stored yet. The daily cron runs at 10:00 PM and stores a snapshot automatically.
            You can also trigger it manually via <code className="text-xs bg-muted px-1 py-0.5 rounded">POST /api/cron/generate-aum-snapshot</code>.
          </p>
        )}
      </div>

      {/* ── Historical snapshot view ──────────────────────────────────────── */}
      {historicalSnapshot && (
        <HistoricalAumView
          snapshot={historicalSnapshot}
          onClose={() => { setHistoricalSnapshot(null); setHistoryDate(""); }}
        />
      )}

      {/* ── Live AUM report ───────────────────────────────────────────────── */}
      <AccountantReports
        clientPortfolios={clientPortfolios}
        isLoadingClients={false}
        totalClients={clients.length}
      />
    </div>
  );
}
