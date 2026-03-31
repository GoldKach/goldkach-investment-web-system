"use client";

import { useState } from "react";
import { Search, Users, Activity, Shield, Clock, CheckCircle, Monitor } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Session {
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl: string;
  status: string;
  lastSeen: string;
  createdAt: string;
  isCurrentUser: boolean;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function isRecentlyActive(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 24 * 60 * 60 * 1000; // within 24h
}

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN:      "border-red-400/40 text-red-500 bg-red-500/10",
  ADMIN:            "border-orange-400/40 text-orange-500 bg-orange-500/10",
  AGENT:            "border-blue-400/40 text-blue-500 bg-blue-500/10",
  CLIENT_RELATIONS: "border-violet-400/40 text-violet-500 bg-violet-500/10",
  MANAGER:          "border-amber-400/40 text-amber-500 bg-amber-500/10",
  STAFF:            "border-slate-400/40 text-slate-500 bg-slate-500/10",
  USER:             "border-green-400/40 text-green-500 bg-green-500/10",
};

export function ActiveSessionsView({
  sessions,
  currentUserId,
}: {
  sessions: Session[];
  currentUserId: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = sessions.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q)
    );
  });

  const recentlyActive = sessions.filter((s) => isRecentlyActive(s.lastSeen));
  const byRole = sessions.reduce<Record<string, number>>((acc, s) => {
    acc[s.role] = (acc[s.role] ?? 0) + 1;
    return acc;
  }, {});

  const staffCount  = sessions.filter((s) => s.role !== "USER").length;
  const clientCount = sessions.filter((s) => s.role === "USER").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Active Sessions</h1>
        <p className="text-sm text-slate-400 mt-1">
          All active accounts on the platform — sorted by most recently active
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Active</p>
                <p className="text-2xl font-bold text-blue-500">{sessions.length}</p>
              </div>
              <Activity className="h-5 w-5 text-blue-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active (24h)</p>
                <p className="text-2xl font-bold text-green-500">{recentlyActive.length}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Staff</p>
                <p className="text-2xl font-bold text-violet-500">{staffCount}</p>
              </div>
              <Shield className="h-5 w-5 text-violet-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-teal-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Clients</p>
                <p className="text-2xl font-bold text-teal-500">{clientCount}</p>
              </div>
              <Users className="h-5 w-5 text-teal-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role breakdown */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(byRole).map(([role, count]) => (
          <Badge key={role} variant="outline" className={`text-xs px-3 py-1 ${ROLE_COLORS[role] ?? ""}`}>
            {role}: {count}
          </Badge>
        ))}
      </div>

      {/* Search + Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle>Active Accounts</CardTitle>
              <CardDescription>Sorted by most recently active</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, email or role…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-xs text-slate-500 uppercase tracking-wide border-b border-slate-200 dark:border-[#2B2F77]/30">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Last Active</th>
                  <th className="px-4 py-3 text-left">Member Since</th>
                  <th className="px-4 py-3 text-left">Session</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                      No sessions found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    const initials = s.name.slice(0, 2).toUpperCase();
                    const recent = isRecentlyActive(s.lastSeen);
                    return (
                      <tr
                        key={s.id}
                        className={`hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10 transition-colors ${
                          s.isCurrentUser ? "bg-blue-500/5" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-9 w-9 rounded-lg shrink-0">
                                <AvatarImage src={s.imageUrl} alt={s.name} className="rounded-lg object-cover" />
                                <AvatarFallback className="rounded-lg bg-[#2B2F77] text-white text-xs font-bold">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                              {recent && (
                                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-[#0a0d24]" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 dark:text-slate-100">
                                {s.name}
                                {s.isCurrentUser && (
                                  <span className="ml-2 text-[10px] text-blue-500 font-normal">(you)</span>
                                )}
                              </p>
                              <p className="text-xs text-slate-400">{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={`text-xs ${ROLE_COLORS[s.role] ?? ""}`}>
                            {s.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className="text-xs border-green-300 text-green-700 dark:text-green-400"
                          >
                            {s.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span className={`text-xs ${recent ? "text-green-600 font-medium" : "text-slate-500"}`}>
                              {timeAgo(s.lastSeen)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {new Date(s.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Monitor className="h-3.5 w-3.5" />
                            <span>Web</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-slate-400 text-center">
        Sessions are derived from active accounts. "Last Active" reflects the most recent account update timestamp.
        A green dot indicates activity within the last 24 hours.
      </p>
    </div>
  );
}
