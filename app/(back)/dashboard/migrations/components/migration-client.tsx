// components/back/migrations-client.tsx
"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { previewBackfill, runBackfill, reactivateAllUsers, type MigrationPortfolioResult } from "@/actions/migrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle2, SkipForward, XCircle, Database, Play, Eye, RefreshCw, UserCheck } from "lucide-react";

const inputCls = "bg-slate-50 dark:bg-[#161b4a]/60 border-slate-200 dark:border-[#2B2F77]/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-[#3B82F6]/30 focus-visible:border-[#3B82F6]";

function StatusIcon({ status }: { status: string }) {
  if (status === "migrated")         return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === "already_up_to_date") return <SkipForward className="w-4 h-4 text-slate-400" />;
  return <XCircle className="w-4 h-4 text-rose-500" />;
}

export default function MigrationsClient() {
  const [fees, setFees]     = useState({ bankFee: "30", transactionFee: "10", feeAtBank: "10" });
  const [results, setResults] = useState<MigrationPortfolioResult[] | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [mode,    setMode]   = useState<"preview" | "run" | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reactivate all users state
  const [reactivateResult, setReactivateResult] = useState<{ usersReactivated: number; masterWalletsReactivated: number; portfolioWalletsReactivated: number } | null>(null);
  const [isReactivating, startReactivateTransition] = useTransition();

  const handleReactivateAll = () => {
    startReactivateTransition(async () => {
      const res = await reactivateAllUsers();
      if (!res.success) { toast.error(res.error ?? "Reactivation failed."); return; }
      setReactivateResult(res.data ?? null);
      toast.success(res.message ?? "All users reactivated successfully.");
    });
  };

  const handlePreview = () => {
    startTransition(async () => {
      const res = await previewBackfill({
        bankFee:       parseFloat(fees.bankFee) || 30,
        transactionFee: parseFloat(fees.transactionFee) || 10,
        feeAtBank:     parseFloat(fees.feeAtBank) || 10,
      });
      if (!res.success) { toast.error(res.error ?? "Preview failed."); return; }
      setResults(res.data?.results ?? []);
      setSummary(res.data?.summary ?? null);
      setMode("preview");
      toast.success("Preview complete — no changes made.");
    });
  };

  const handleRun = () => {
    startTransition(async () => {
      const res = await runBackfill({
        bankFee:       parseFloat(fees.bankFee) || 30,
        transactionFee: parseFloat(fees.transactionFee) || 10,
        feeAtBank:     parseFloat(fees.feeAtBank) || 10,
      });
      if (!res.success && !res.data) { toast.error(res.error ?? "Migration failed."); return; }
      setResults(res.data?.results ?? []);
      setSummary(res.data?.summary ?? null);
      setMode("run");
      if (res.partialFail) toast.warning("Migration completed with some failures — check results.");
      else toast.success("Migration completed successfully.");
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b1f]">
      <div className="bg-white dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2B2F77] dark:bg-[#3B82F6]/20 border border-[#2B2F77]/20 dark:border-[#3B82F6]/30 flex items-center justify-center">
            <Database className="w-4 h-4 text-white dark:text-[#3B82F6]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Data Migration</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Backfill existing portfolios to the new multi-wallet structure</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">

        {/* Reactivate All Users */}
        <div className="bg-white dark:bg-[#0f1135] border border-emerald-500/30 rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Reactivate All Users</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Reactivates all deactivated or inactive users and their wallets. No user will be deactivated due to zero balance — this is permanent.
              </p>
            </div>
          </div>

          {reactivateResult && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Users Reactivated",            value: reactivateResult.usersReactivated },
                { label: "Master Wallets Reactivated",   value: reactivateResult.masterWalletsReactivated },
                { label: "Portfolio Wallets Reactivated", value: reactivateResult.portfolioWalletsReactivated },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="text-2xl font-bold text-emerald-500 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={handleReactivateAll}
            disabled={isReactivating}
            className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2"
          >
            {isReactivating
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Reactivating…</>
              : <><UserCheck className="w-4 h-4" /> Reactivate All Users Now</>
            }
          </Button>
        </div>

        {/* Warning banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Run the preview first</p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
              Preview shows exactly what will change without writing to the database. Only run the migration once you have reviewed the preview results.
              This operation is idempotent — safe to run multiple times.
            </p>
          </div>
        </div>

        {/* Config */}
        <div className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl p-5">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Default Fee Structure</p>
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { key: "bankFee" as const,       label: "Bank Fee" },
              { key: "transactionFee" as const, label: "Transaction Fee" },
              { key: "feeAtBank" as const,      label: "Fee at Bank" },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">{label}</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={fees[key]}
                  onChange={(e) => setFees((p) => ({ ...p, [key]: e.target.value }))}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button onClick={handlePreview} disabled={isPending} variant="outline"
              className="h-9 border-[#2B2F77]/40 dark:border-[#3B82F6]/40 text-[#2B2F77] dark:text-[#3B82F6] hover:bg-[#2B2F77]/10 dark:hover:bg-[#3B82F6]/10">
              {isPending && mode !== "run" ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
              {isPending && mode !== "run" ? "Previewing…" : "Preview (dry run)"}
            </Button>
            <Button onClick={handleRun} disabled={isPending || !results}
              className="h-9 bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold">
              {isPending && mode === "run" ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              {isPending && mode === "run" ? "Running…" : "Run Migration"}
            </Button>
          </div>
          {!results && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Run preview first before the migration button becomes available.</p>}
        </div>

        {/* Summary */}
        {summary && (
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total",        value: summary.total,              color: "text-[#3B82F6]" },
              { label: "Migrated",     value: summary.migrated,           color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Up to Date",   value: summary.already_up_to_date, color: "text-slate-500 dark:text-slate-400" },
              { label: "Failed",       value: summary.failed,             color: "text-rose-600 dark:text-rose-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                <span className={`text-2xl font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Results table */}
        {results && (
          <div className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-100 dark:border-[#2B2F77]/20 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {mode === "preview" ? "Preview Results (no changes made)" : "Migration Results"}
              </p>
              <span className="text-xs text-slate-400 dark:text-slate-500">{results.length} portfolios</span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30 hover:bg-slate-50 dark:hover:bg-[#0a0d24]">
                  {["", "User", "Portfolio", "Actions / Notes"].map((h, i) => (
                    <TableHead key={i} className={`text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3 ${i === 0 ? "px-6 w-10" : ""}`}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r, i) => (
                  <TableRow key={r.userPortfolioId} className={`border-b border-slate-100 dark:border-[#2B2F77]/20 ${i === results.length - 1 ? "border-b-0" : ""}`}>
                    <TableCell className="px-6 py-3"><StatusIcon status={r.status} /></TableCell>
                    <TableCell className="py-3"><span className="text-xs text-slate-600 dark:text-slate-300">{r.userEmail}</span></TableCell>
                    <TableCell className="py-3"><span className="text-sm font-medium text-slate-800 dark:text-white">{r.portfolioName}</span></TableCell>
                    <TableCell className="py-3">
                      {r.status === "failed"
                        ? <span className="text-xs text-rose-500">{r.error}</span>
                        : r.actions.length === 0
                          ? <span className="text-xs text-slate-400 dark:text-slate-500">Already up to date</span>
                          : <span className="text-xs text-slate-500 dark:text-slate-400">{r.actions.join(" · ")}</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}