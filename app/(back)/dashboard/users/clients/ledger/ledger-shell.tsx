"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getClientsForAssignmentAction } from "@/actions/staff";
import { AllClientsLedger, type LedgerClient } from "./all-clients-ledger";

export function LedgerShell() {
  const [clients, setClients] = useState<LedgerClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getClientsForAssignmentAction();
      if (res.success) {
        const mapped: LedgerClient[] = (res.data ?? [])
          .filter((u: any) => !u.role || u.role === "USER")
          .map((u: any) => ({
            id: u.id,
            name: u.name || [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email,
            email: u.email,
            firstName: u.firstName ?? null,
            lastName: u.lastName ?? null,
            imageUrl: u.imageUrl ?? null,
            status: u.status ?? null,
          }));
        setClients(mapped);
      } else {
        setError(res.error ?? "Failed to load clients.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error loading clients.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin opacity-40" />
        <p className="text-sm">Loading clients…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-6 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Failed to load clients</p>
          <p className="text-xs text-red-500 mt-1 opacity-80">{error}</p>
        </div>
        <Button size="sm" variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return <AllClientsLedger clients={clients} />;
}
