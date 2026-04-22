"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { unassignClientFromAgentAction } from "@/actions/staff";
import type { AgentClientAssignment } from "@/actions/staff";

export function AccountantMyClientsTable({
  assignments,
  staffId,
}: {
  assignments: AgentClientAssignment[];
  staffId: string;
}) {
  const [query, setQuery] = useState("");
  const [unassignTarget, setUnassignTarget] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  

  const displayName = (c: any) =>
    c.client?.name ||
    [c.client?.firstName, c.client?.lastName].filter(Boolean).join(" ") ||
    c.client?.email;

  const filtered = assignments.filter((a) => {
    if (!a.isActive) return false;
    const q = query.toLowerCase();
    const name = displayName(a).toLowerCase();
    const email = (a.client?.email ?? "").toLowerCase();
    const phone = a.client?.phone ?? "";
    return name.includes(q) || email.includes(q) || phone.includes(q);
  });

  function handleUnassign() {
    if (!unassignTarget) return;
    startTransition(async () => {
      const result = await unassignClientFromAgentAction(staffId, unassignTarget);
      if (result.success) {
        toast.success("Client unassigned successfully.");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to unassign client.");
      }
      setUnassignTarget(null);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">My Clients</h1>
        <p className="text-sm text-slate-400 mt-1">Clients assigned to you</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "Total Assigned", value: assignments.length, color: "text-blue-500" },
          {
            label: "Active",
            value: assignments.filter((a) => a.isActive).length,
            color: "text-green-500",
          },
          {
            label: "Inactive",
            value: assignments.filter((a) => !a.isActive).length,
            color: "text-slate-400",
          },
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
              <th className="px-3 py-2 text-left">Assigned</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">
                  {assignments.length === 0
                    ? "No clients assigned to you yet."
                    : "No matching clients found."}
                </td>
              </tr>
            ) : (
              filtered.map((assignment) => {
                const client = assignment.client;
                const name = displayName(assignment);
                const initials = name.slice(0, 2).toUpperCase();
                const assignedDate = new Date(assignment.assignedAt).toLocaleDateString(
                  undefined,
                  { year: "numeric", month: "short", day: "numeric" }
                );

                return (
                  <tr
                    key={assignment.id}
                    className="hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10 transition-colors"
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 rounded-lg shrink-0">
                          <AvatarImage src={client?.imageUrl || ""} alt={name} />
                          <AvatarFallback className="rounded-lg bg-[#2B2F77] text-white text-[10px] font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100 text-xs">
                            {name}
                          </p>
                          <p className="text-[9px] text-muted-foreground font-mono">
                            {client?.masterWallet?.accountNumber || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-300 text-xs">
                      {client?.email}
                    </td>
                    <td className="px-3 py-2 text-slate-500 text-xs">{client?.phone || "—"}</td>
                    <td className="px-3 py-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          client?.status === "ACTIVE"
                            ? "border-green-300 text-green-700 dark:text-green-400"
                            : client?.status === "PENDING"
                              ? "border-amber-300 text-amber-700 dark:text-amber-400"
                              : "border-slate-300 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {client?.status || "Unknown"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-500">{assignedDate}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/accountant/clients/${client?.id}`)}
                          className="h-6 w-6 p-0"
                          title="View details"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUnassignTarget(client?.id)}
                          className="h-6 w-6 p-0"
                          title="Unassign client"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Unassign Dialog */}
      <AlertDialog open={!!unassignTarget} onOpenChange={(open) => !open && setUnassignTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unassign Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unassign this client? You will no longer see their account
              in your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnassign}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Unassigning..." : "Unassign"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
