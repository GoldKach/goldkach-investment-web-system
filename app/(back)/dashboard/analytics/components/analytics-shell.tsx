"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listMasterWallets } from "@/actions/master-wallets";
import { listDeposits } from "@/actions/deposits";
import { listWithdrawals } from "@/actions/withdraws";
import { getClientsForAssignmentAction, getAllStaffAction } from "@/actions/staff";
import { AnalyticsDashboard } from "./analytics-dashboard";

export function AnalyticsShell() {
  const [data, setData] = useState<{
    wallets: any[];
    deposits: any[];
    withdrawals: any[];
    clients: any[];
    staff: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [walletsRes, depositsRes, withdrawalsRes, clientsRes, staffRes] = await Promise.all([
        listMasterWallets(),
        listDeposits({ sortBy: "createdAt", order: "desc", pageSize: 500, include: ["user"] }),
        listWithdrawals({ sortBy: "createdAt", order: "desc", pageSize: 500, include: ["user", "masterWallet"] }),
        getClientsForAssignmentAction(),
        getAllStaffAction(),
      ]);

      setData({
        wallets: walletsRes.success ? (walletsRes.data as any[]) : [],
        deposits: depositsRes.success ? (depositsRes.data as any[]) : [],
        withdrawals: withdrawalsRes.success ? (withdrawalsRes.data as any[]) : [],
        clients: clientsRes.success ? (clientsRes.data as any[]) : [],
        staff: staffRes.success ? (staffRes.data as any[]) : [],
      });
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error loading analytics data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin opacity-40" />
        <p className="text-sm">Loading analytics…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-6 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Failed to load analytics</p>
          <p className="text-xs text-red-500 mt-1 opacity-80">{error}</p>
        </div>
        <Button size="sm" variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <AnalyticsDashboard
      wallets={data.wallets}
      deposits={data.deposits}
      withdrawals={data.withdrawals}
      clients={data.clients}
      staff={data.staff}
    />
  );
}
