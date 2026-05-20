"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllUsers } from "@/actions/auth";
import { getAllStaffAction } from "@/actions/staff";
import { ActiveSessionsView } from "./active-sessions-view";

export function ActiveSessionsShell({ currentUserId }: { currentUserId: string }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, staffRes] = await Promise.allSettled([
        getAllUsers(),
        getAllStaffAction(),
      ]);

      const allUsers = usersRes.status === "fulfilled" ? (usersRes.value?.data ?? []) : [];
      const allStaff = staffRes.status === "fulfilled" ? (staffRes.value?.data ?? []) : [];

      const everyone = [
        ...allUsers.map((u: any) => ({ ...u, _source: "user" })),
        ...allStaff.map((s: any) => ({ ...s, _source: "staff" })),
      ];

      const activeSessions = everyone
        .filter((u: any) => u.status === "ACTIVE")
        .map((u: any) => ({
          id: u.id,
          name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.name || u.email,
          email: u.email,
          role: u.role,
          imageUrl: u.imageUrl || "",
          status: u.status,
          lastSeen: u.updatedAt || u.createdAt,
          createdAt: u.createdAt,
          isCurrentUser: u.id === currentUserId,
        }))
        .sort((a: any, b: any) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());

      setSessions(activeSessions);
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error loading sessions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin opacity-40" />
        <p className="text-sm">Loading active sessions…</p>
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

  return <ActiveSessionsView sessions={sessions} currentUserId={currentUserId} />;
}
