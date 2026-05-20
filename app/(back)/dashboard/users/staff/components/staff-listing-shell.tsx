"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllStaffAction } from "@/actions/staff";
import StaffListing from "./staff-listing";

export function StaffListingShell() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllStaffAction();
      if (res.data) {
        setStaff(res.data);
      } else {
        setError(res.error ?? "Failed to load staff.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error loading staff.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="space-y-4 p-12">
        <div className="h-8 w-48 rounded-lg bg-muted/50 animate-pulse" />
        <div className="rounded-xl border border-border overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0">
              <div className="h-9 w-9 rounded-full bg-muted/50 animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-32 rounded bg-muted/50 animate-pulse" />
                <div className="h-3 w-20 rounded bg-muted/30 animate-pulse" />
              </div>
              <div className="h-5 w-16 rounded-full bg-muted/50 animate-pulse" />
              <div className="h-5 w-24 rounded bg-muted/30 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-6 flex flex-col items-center gap-4 text-center m-4">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Failed to load staff</p>
          <p className="text-xs text-red-500 mt-1 opacity-80">{error}</p>
        </div>
        <Button size="sm" variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return <StaffListing staff={staff} />;
}
