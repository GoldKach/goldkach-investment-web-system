"use client";

import { useState, useEffect, useTransition } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listSessions, getSessionStats, revokeSession, type Session, type SessionStats } from "@/actions/sessions";
import { ActiveSessionsView } from "./active-sessions-view";
import { toast } from "sonner";

export function ActiveSessionsShell({ currentUserId }: { currentUserId: string }) {
  const [sessions,  setSessions]  = useState<Session[]>([]);
  const [stats,     setStats]     = useState<SessionStats | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [sessRes, statsRes] = await Promise.all([
        listSessions({ pageSize: 200, active: false }),
        getSessionStats(),
      ]);
      setSessions(sessRes.data  ?? []);
      setStats(statsRes.data   ?? null);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRevoke(sessionId: string) {
    startTransition(async () => {
      const res = await revokeSession(sessionId);
      if (res.success) {
        toast.success("Session revoked");
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, revoked: true, isActive: false } : s));
      } else {
        toast.error(res.error ?? "Failed to revoke session");
      }
    });
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin opacity-40" />
        <p className="text-sm">Loading sessions…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-6 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Failed to load sessions</p>
          <p className="text-xs text-red-500 mt-1 opacity-80">{error}</p>
        </div>
        <Button size="sm" variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <ActiveSessionsView
      sessions={sessions}
      stats={stats}
      currentUserId={currentUserId}
      onRevoke={handleRevoke}
      onRefresh={load}
      isRevoking={isPending}
    />
  );
}
