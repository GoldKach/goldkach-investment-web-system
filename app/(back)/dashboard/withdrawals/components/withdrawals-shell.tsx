"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listWithdrawals } from "@/actions/withdraws";
import { WithdrawalsContent } from "./withdrawals-content";

export function WithdrawalsShell({
  adminId,
  adminName,
}: {
  adminId: string;
  adminName: string;
}) {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await listWithdrawals({
        sortBy: "createdAt",
        order: "desc",
        pageSize: 500,
        include: ["user", "masterWallet", "portfolioWallet", "userPortfolio"],
      });
      if (res.success && res.data) {
        setWithdrawals(res.data);
      } else {
        setError(res.error ?? "Failed to load withdrawals.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error loading withdrawals.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin opacity-40" />
        <p className="text-sm">Loading withdrawals…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Failed to load withdrawals</p>
          <p className="text-xs text-red-500 mt-1 opacity-80">{error}</p>
        </div>
        <Button size="sm" variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return <WithdrawalsContent withdrawals={withdrawals} adminId={adminId} adminName={adminName} onRefresh={load} />;
}
