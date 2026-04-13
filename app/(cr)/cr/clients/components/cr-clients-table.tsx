"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function CRClientsTable({ clients, basePath = "/cr/clients" }: { clients: any[]; basePath?: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const displayName = (u: any) =>
    u.name || [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email;

  const filtered = clients.filter((u) => {
    const q = query.toLowerCase();
    return (
      displayName(u).toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.phone ?? "").includes(query)
    );
  });

  const active = clients.filter((u) => u.status === "ACTIVE").length;
  const pending = clients.filter((u) => u.status === "PENDING").length;
  const inactive = clients.filter(
    (u) => u.status !== "ACTIVE" && u.status !== "PENDING"
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Clients</h1>
        <p className="text-sm text-slate-400 mt-1">All registered investment clients</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Clients", value: clients.length, color: "text-blue-500" },
          { label: "Active", value: active, color: "text-green-500" },
          { label: "Pending", value: pending, color: "text-amber-500" },
          { label: "Inactive", value: inactive, color: "text-slate-400" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="search"
          placeholder="Search clients…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 h-8 text-xs"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-xs text-slate-500 uppercase tracking-wide">
            <tr>
              <th className="px-3 py-2 text-left">Client</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Approved</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">
                  No clients found.
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const name = displayName(u);
                const initials = name.slice(0, 2).toUpperCase();
                return (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10 transition-colors"
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 rounded-lg shrink-0">
                          <AvatarImage src={u.imageUrl || ""} alt={name} />
                          <AvatarFallback className="rounded-lg bg-[#2B2F77] text-white text-[10px] font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100 text-xs">{name}</p>
                          <p className="text-[9px] text-muted-foreground font-mono">{u.masterWallet?.accountNumber || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-300 text-xs">{u.email}</td>
                    <td className="px-3 py-2 text-slate-500 text-xs">{u.phone || "—"}</td>
                    <td className="px-3 py-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          u.status === "ACTIVE"
                            ? "border-green-300 text-green-700 dark:text-green-400"
                            : u.status === "PENDING"
                            ? "border-amber-300 text-amber-600"
                            : "border-slate-300 text-slate-500"
                        }`}
                      >
                        {u.status || "—"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      {u.isApproved ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-slate-400" />
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-[10px] h-7 px-2"
                        onClick={() => router.push(`${basePath}/${u.id}`)}
                      >
                        <Eye className="h-3 w-3" /> View
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
