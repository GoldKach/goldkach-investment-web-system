"use client";

import { useState } from "react";
import {
  Search, Shield, Clock, Monitor, Smartphone, Tablet,
  Globe, MapPin, Wifi, LogOut, RefreshCw, Activity,
  Users, CheckCircle, XCircle, AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Session, SessionStats } from "@/actions/sessions";

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

const ROLE_COLOR: Record<string, string> = {
  SUPER_ADMIN:      "border-red-400/40 text-red-500 bg-red-500/10",
  ADMIN:            "border-orange-400/40 text-orange-500 bg-orange-500/10",
  MANAGER:          "border-amber-400/40 text-amber-500 bg-amber-500/10",
  AGENT:            "border-blue-400/40 text-blue-500 bg-blue-500/10",
  CLIENT_RELATIONS: "border-violet-400/40 text-violet-500 bg-violet-500/10",
  STAFF:            "border-slate-400/40 text-slate-500 bg-slate-500/10",
  USER:             "border-green-400/40 text-green-500 bg-green-500/10",
};

function DeviceIcon({ type }: { type: string | null }) {
  if (type === "Mobile")  return <Smartphone className="h-3.5 w-3.5" />;
  if (type === "Tablet")  return <Tablet className="h-3.5 w-3.5" />;
  return <Monitor className="h-3.5 w-3.5" />;
}

/* -------------------------------------------------------------------------- */
/*  Props                                                                       */
/* -------------------------------------------------------------------------- */

interface Props {
  sessions:    Session[];
  stats:       SessionStats | null;
  currentUserId: string;
  onRevoke:    (id: string) => void;
  onRefresh:   () => void;
  isRevoking:  boolean;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                   */
/* -------------------------------------------------------------------------- */

export function ActiveSessionsView({ sessions, stats, currentUserId, onRevoke, onRefresh, isRevoking }: Props) {
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState<"all" | "active" | "revoked" | "expired">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = sessions.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (s.user?.email     ?? "").toLowerCase().includes(q) ||
      (s.user?.firstName ?? "").toLowerCase().includes(q) ||
      (s.user?.lastName  ?? "").toLowerCase().includes(q) ||
      (s.ipAddress       ?? "").includes(q) ||
      (s.location        ?? "").toLowerCase().includes(q) ||
      (s.browser         ?? "").toLowerCase().includes(q) ||
      (s.os              ?? "").toLowerCase().includes(q) ||
      (s.deviceType      ?? "").toLowerCase().includes(q);

    const matchFilter =
      filter === "all"     ? true :
      filter === "active"  ? s.isActive :
      filter === "revoked" ? s.revoked :
      /* expired */          s.isExpired && !s.revoked;

    return matchSearch && matchFilter;
  });

  const activeCount  = sessions.filter(s => s.isActive).length;
  const revokedCount = sessions.filter(s => s.revoked).length;
  const expiredCount = sessions.filter(s => s.isExpired && !s.revoked).length;

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Active Sessions</h1>
          <p className="text-sm text-slate-400 mt-1">Login history with IP addresses, devices and locations</p>
        </div>
        <Button size="sm" variant="outline" onClick={onRefresh} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Sessions</p>
            <p className="text-2xl font-bold text-blue-500">{stats?.total ?? sessions.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">All time</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Active Now</p>
            <p className="text-2xl font-bold text-emerald-500">{stats?.active ?? activeCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Valid &amp; not revoked</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Last 24h Logins</p>
            <p className="text-2xl font-bold text-violet-500">{stats?.last24h ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">New sessions</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Last 7 Days</p>
            <p className="text-2xl font-bold text-amber-500">{stats?.last7d ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">New sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats: top countries + device split */}
      {stats && (stats.topCountries.length > 0 || stats.byDeviceType.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" /> Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.topCountries.slice(0, 6).map((c) => (
                <div key={c.country} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{c.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 rounded-full bg-blue-500/20" style={{ width: `${Math.min(c.count / (stats.topCountries[0]?.count ?? 1) * 80, 80)}px` }}>
                      <div className="h-1.5 rounded-full bg-blue-500" style={{ width: "100%" }} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground w-6 text-right">{c.count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Monitor className="h-4 w-4 text-violet-500" /> Device Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.byDeviceType.map((d) => (
                <div key={d.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <DeviceIcon type={d.type} />
                    <span>{d.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 rounded-full bg-violet-500/20" style={{ width: "80px" }}>
                      <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${Math.min(d.count / (stats.byDeviceType[0]?.count ?? 1) * 100, 100)}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-right">{d.count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters + search */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Session History</CardTitle>
              <CardDescription>All login sessions with device and location details</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {(["all", "active", "revoked", "expired"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    filter === f
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {f === "all"     ? `All (${sessions.length})` :
                   f === "active"  ? `Active (${activeCount})` :
                   f === "revoked" ? `Revoked (${revokedCount})` :
                   `Expired (${expiredCount})`}
                </button>
              ))}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search IP, location, browser…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs w-52"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[900px]">
              <thead className="bg-muted/30 border-y border-border">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">User</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">IP Address</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Location</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Device / Browser</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Logged In</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Expires</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                      No sessions found.
                    </td>
                  </tr>
                ) : filtered.map((s) => {
                  const isMe = s.user?.id === currentUserId;
                  const expanded = expandedId === s.id;

                  return (
                    <>
                      <tr
                        key={s.id}
                        className={`hover:bg-muted/20 transition-colors cursor-pointer ${isMe ? "bg-blue-500/5" : ""}`}
                        onClick={() => setExpandedId(expanded ? null : s.id)}
                      >
                        {/* User */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="relative shrink-0">
                              <Avatar className="h-7 w-7 rounded-lg">
                                <AvatarImage src={s.user?.imageUrl} className="rounded-lg object-cover" />
                                <AvatarFallback className="rounded-lg bg-[#2B2F77] text-white text-[10px] font-bold">
                                  {(s.user?.firstName?.[0] ?? "?") + (s.user?.lastName?.[0] ?? "")}
                                </AvatarFallback>
                              </Avatar>
                              {s.isActive && (
                                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 border border-white dark:border-[#0a0d24]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {s.user?.firstName} {s.user?.lastName}
                                {isMe && <span className="ml-1 text-[10px] text-blue-400">(you)</span>}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate">{s.user?.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* IP */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Wifi className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="font-mono">{s.ipAddress ?? "—"}</span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span>{s.location ?? "Unknown"}</span>
                          </div>
                        </td>

                        {/* Device / Browser */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <DeviceIcon type={s.deviceType} />
                            <div>
                              <p>{s.browser ?? "Unknown"}</p>
                              <p className="text-[10px] text-muted-foreground">{s.os ?? ""} {s.deviceType ? `· ${s.deviceType}` : ""}</p>
                            </div>
                          </div>
                        </td>

                        {/* Logged In */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3 w-3 shrink-0" />
                            <span>{timeAgo(s.createdAt)}</span>
                          </div>
                        </td>

                        {/* Expires */}
                        <td className="px-4 py-3 text-muted-foreground">
                          {s.isExpired ? (
                            <span className="text-red-400">Expired</span>
                          ) : (
                            <span>{timeAgo(s.expiresAt)} left</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          {s.revoked ? (
                            <Badge variant="outline" className="text-[10px] border-red-400/30 bg-red-400/10 text-red-400">
                              <XCircle className="h-2.5 w-2.5 mr-1" /> Revoked
                            </Badge>
                          ) : s.isExpired ? (
                            <Badge variant="outline" className="text-[10px] border-amber-400/30 bg-amber-400/10 text-amber-400">
                              <AlertTriangle className="h-2.5 w-2.5 mr-1" /> Expired
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
                              <CheckCircle className="h-2.5 w-2.5 mr-1" /> Active
                            </Badge>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3">
                          {s.isActive && !isMe && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 text-[10px] gap-1"
                              disabled={isRevoking}
                              onClick={(e) => { e.stopPropagation(); onRevoke(s.id); }}
                            >
                              <LogOut className="h-3 w-3" /> Revoke
                            </Button>
                          )}
                        </td>
                      </tr>

                      {/* Expanded row — full UA string */}
                      {expanded && (
                        <tr key={`${s.id}-exp`} className="bg-muted/10">
                          <td colSpan={8} className="px-6 py-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                              <div>
                                <p className="text-muted-foreground mb-0.5">Role</p>
                                <Badge variant="outline" className={`text-[10px] ${ROLE_COLOR[s.user?.role ?? ""] ?? ""}`}>
                                  {s.user?.role ?? "—"}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-0.5">Login Time</p>
                                <p className="font-medium">{fmtDate(s.createdAt)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-0.5">Expires At</p>
                                <p className="font-medium">{fmtDate(s.expiresAt)}</p>
                              </div>
                              {s.revokedAt && (
                                <div>
                                  <p className="text-muted-foreground mb-0.5">Revoked At</p>
                                  <p className="font-medium text-red-400">{fmtDate(s.revokedAt)}</p>
                                </div>
                              )}
                              {s.userAgent && (
                                <div className="col-span-2 md:col-span-4">
                                  <p className="text-muted-foreground mb-0.5">Raw User-Agent</p>
                                  <p className="font-mono text-[10px] text-muted-foreground break-all">{s.userAgent}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
