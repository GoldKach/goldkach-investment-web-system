"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listDeposits } from "@/actions/deposits";
import { AdminDepositsContent } from "./admin-deposits-content";

export function DepositsShell({
  adminId,
  adminName,
}: {
  adminId: string;
  adminName: string;
}) {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await listDeposits({ sortBy: "createdAt", order: "desc", pageSize: 500 });
      if (res.success && res.data) {
        setDeposits(res.data);
      } else {
        setError(res.error ?? "Failed to load deposits.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error loading deposits.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin opacity-40" />
        <p className="text-sm">Loading deposits…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Failed to load deposits</p>
          <p className="text-xs text-red-500 mt-1 opacity-80">{error}</p>
        </div>
        <Button size="sm" variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return <AdminDepositsContent deposits={deposits} adminId={adminId} adminName={adminName} />;
}
