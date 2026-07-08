"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllUsers } from "@/actions/auth";
import PendingApprovals from "@/components/back/pending-approval";

function isPending(u: any) {
  return (
    u.isApproved === false ||
    u.individualOnboarding?.isApproved === false ||
    u.companyOnboarding?.isApproved === false
  );
}

export function OOPendingApprovalsShell() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllUsers();
      if (res?.data) {
        setUsers((res.data ?? []).filter(isPending));
      } else {
        setError(res?.error ?? "Failed to load approval requests.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin opacity-40" />
        <p className="text-sm">Loading pending approvals…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-6 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Failed to load approvals</p>
          <p className="text-xs text-red-500 mt-1 opacity-80">{error}</p>
        </div>
        <Button size="sm" variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <PendingApprovals
      users={users}
      clientBasePath="/onboarding-officer/clients"
    />
  );
}
