"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Monitor, Smartphone, Tablet, MapPin, Wifi,
  Clock, CheckCircle, XCircle, AlertTriangle, LogOut, Loader2, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { listUserSessions, revokeSession, revokeAllUserSessions, type Session } from "@/actions/sessions";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1)   return "just now";
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function DeviceIcon({ type }: { type: string | null }) {
  if (type === "Mobile")  return <Smartphone className="h-3.5 w-3.5 shrink-0" />;
  if (type === "Tablet")  return <Tablet className="h-3.5 w-3.5 shrink-0" />;
  return <Monitor className="h-3.5 w-3.5 shrink-0" />;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                   */
/* -------------------------------------------------------------------------- */

export function UserLoginHistory({ userId }: { userId: string }) {
  const [sessions,  setSessions]  = useState<Session[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [isPending, startTransition] = useTransition();

  async function load() {
    setLoading(true);
    try {
      const res = await listUserSessions(userId);
      setSessions(res.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function handleRevoke(id: string) {
    startTransition(async () => {
      const res = await revokeSession(id);
      if (res.success) {
        toast.success("Session revoked");
        setSessions(prev => prev.map(s => s.id === id ? { ...s, revoked: true, isActive: false } : s));
      } else {
        toast.error(res.error ?? "Failed to revoke");
      }
    });
  }

  async function handleRevokeAll() {
    startTransition(async () => {
      const res = await revokeAllUserSessions(userId);
      if (res.success) {
        toast.success(`${res.count ?? 0} session(s) revoked`);
        setSessions(prev => prev.map(s => ({ ...s, revoked: true, isActive: false })));
      } else {
        toast.error(res.error ?? "Failed");
      }
    });
  }

  useEffect(() => { load(); }, [userId]);

  const activeCount = sessions.filter(s => s.isActive).length;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Wifi className="h-4 w-4 text-blue-500" />
              Login History
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Recent login sessions — IP addresses, devices, and locations
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1.5 text-red-500 border-red-500/30 hover:bg-red-500/10"
                disabled={isPending}
                onClick={handleRevokeAll}
              >
                <LogOut className="h-3 w-3" /> Revoke All ({activeCount})
              </Button>
            )}
            <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={load} disabled={loading}>
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">Loading sessions…</span>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
            <Wifi className="h-6 w-6 opacity-20" />
            <p className="text-sm">No login sessions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[640px]">
              <thead className="bg-muted/30 border-y border-border">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Device / Browser</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">IP Address</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Location</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Logged In</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Expires</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {sessions.map((s, i) => (
                  <tr key={s.id} className={`hover:bg-muted/20 transition-colors ${i % 2 === 0 ? "" : "bg-muted/5"}`}>
                    {/* Device */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <DeviceIcon type={s.deviceType} />
                        <div>
                          <p className="font-medium">{s.browser ?? "Unknown"}</p>
                          <p className="text-[10px] text-muted-foreground">{s.os ?? "—"}{s.deviceType ? ` · ${s.deviceType}` : ""}</p>
                        </div>
                      </div>
                    </td>

                    {/* IP */}
                    <td className="px-4 py-2.5 font-mono">{s.ipAddress ?? "—"}</td>

                    {/* Location */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>{s.location ?? "Unknown"}</span>
                      </div>
                    </td>

                    {/* Logged In */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span title={fmtDate(s.createdAt)}>{timeAgo(s.createdAt)}</span>
                      </div>
                    </td>

                    {/* Expires */}
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {s.isExpired ? <span className="text-red-400">Expired</span> : <span>{timeAgo(s.expiresAt)} left</span>}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-2.5">
                      {s.revoked ? (
                        <Badge variant="outline" className="text-[10px] border-red-400/30 bg-red-400/10 text-red-400 gap-1">
                          <XCircle className="h-2.5 w-2.5" /> Revoked
                        </Badge>
                      ) : s.isExpired ? (
                        <Badge variant="outline" className="text-[10px] border-amber-400/30 bg-amber-400/10 text-amber-400 gap-1">
                          <AlertTriangle className="h-2.5 w-2.5" /> Expired
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] border-emerald-400/30 bg-emerald-400/10 text-emerald-400 gap-1">
                          <CheckCircle className="h-2.5 w-2.5" /> Active
                        </Badge>
                      )}
                    </td>

                    {/* Revoke */}
                    <td className="px-4 py-2.5">
                      {s.isActive && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-[10px] text-red-500 hover:bg-red-500/10 gap-1"
                          disabled={isPending}
                          onClick={() => handleRevoke(s.id)}
                        >
                          <LogOut className="h-2.5 w-2.5" /> Revoke
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
