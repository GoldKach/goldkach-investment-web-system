"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/agent/empty-state";
import type { AgentClientAssignment } from "@/actions/staff";

interface ClientListProps {
  assignments: AgentClientAssignment[];
}

export function ClientList({ assignments }: ClientListProps) {
  const [query, setQuery] = useState("");

  const filtered = assignments.filter((a) => {
    const q = query.toLowerCase();
    const name = `${a.client.firstName} ${a.client.lastName}`.toLowerCase();
    return name.includes(q) || a.client.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="search"
          placeholder="Search by name or email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          message={
            query
              ? `No clients match "${query}"`
              : "No clients are currently assigned to you."
          }
        />
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Approved</th>
                <th className="px-4 py-3 text-center">Portfolios</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
              {filtered.map((a) => {
                const name = `${a.client.firstName} ${a.client.lastName}`;
                return (
                  <tr
                    key={a.id}
                    className="hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 dark:text-slate-100">{name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{a.client.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {a.client.phone || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          a.client.status === "ACTIVE"
                            ? "border-green-300 text-green-700 dark:text-green-400"
                            : "border-slate-300 text-slate-500"
                        }`}
                      >
                        {a.client.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {a.client.isApproved ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-slate-400" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#2B2F77]/10 dark:bg-[#3B82F6]/15 text-[#2B2F77] dark:text-[#3B82F6] text-xs font-semibold">
                        {Array.isArray(a.client.userPortfolios) ? a.client.userPortfolios.length : 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/agent/clients/${a.client.id}`}>
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                          <Eye className="h-3.5 w-3.5" />
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
