"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Loader2, AlertCircle, RefreshCw, Search, User as UserIcon,
  Building2, CheckCircle, Clock, XCircle, Eye,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAllUsers, updateUserById } from "@/actions/auth";

// ─── helpers ──────────────────────────────────────────────────────────────────

function clientDisplayName(u: any) {
  return (
    u.individualOnboarding?.fullName ||
    u.companyOnboarding?.companyName ||
    u.name ||
    [u.firstName, u.lastName].filter(Boolean).join(" ") ||
    u.email ||
    "Unknown"
  );
}

function onboardingStatus(u: any): "approved" | "pending" | "rejected" | "none" {
  const ob = u.individualOnboarding ?? u.companyOnboarding;
  if (!ob) return "none";
  if (ob.isApproved === true || u.isApproved === true) return "approved";
  if (u.status === "DEACTIVATED" || u.status === "SUSPENDED") return "rejected";
  return "pending";
}

const RISK_COLORS: Record<string, string> = {
  Aggressive: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Moderate:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Conservative: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

function StatusBadge({ status }: { status: ReturnType<typeof onboardingStatus> }) {
  if (status === "approved")
    return (
      <Badge className="gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
        <CheckCircle className="h-3 w-3" /> Approved
      </Badge>
    );
  if (status === "pending")
    return (
      <Badge className="gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-0">
        <Clock className="h-3 w-3" /> Pending
      </Badge>
    );
  if (status === "rejected")
    return (
      <Badge className="gap-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0">
        <XCircle className="h-3 w-3" /> Rejected
      </Badge>
    );
  return <Badge variant="outline" className="text-slate-400 text-xs">No onboarding</Badge>;
}

// ─── single client card ────────────────────────────────────────────────────────

function ClientCard({
  user,
  onApprove,
  onReject,
}: {
  user: any;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const ob = user.individualOnboarding ?? user.companyOnboarding;
  const isCompany = !!user.companyOnboarding;
  const name = clientDisplayName(user);
  const status = onboardingStatus(user);
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const risk = ob?.riskTolerance;
  const submittedDate = ob?.createdAt
    ? new Intl.DateTimeFormat("en-UG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(ob.createdAt))
    : null;

  return (
    <Card className="overflow-hidden">
      {/* ── Header row ── */}
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <Avatar className="h-11 w-11 rounded-xl border border-[#193388]/20 shrink-0">
            <AvatarFallback className="rounded-xl bg-[#193388]/10 text-[#193388] dark:bg-[#193388]/30 dark:text-blue-300 text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Name + badges */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">{name}</span>
              <StatusBadge status={status} />
              <Badge variant="outline" className="gap-1 text-xs capitalize shrink-0">
                {isCompany ? <Building2 className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                {isCompany ? "Company" : "Individual"}
              </Badge>
            </div>

            {/* Contact */}
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
              {user.email && <span>{user.email}</span>}
              {user.phone && <span>{user.phone}</span>}
              {submittedDate && <span>Submitted: {submittedDate}</span>}
            </div>

            {/* Onboarding summary pills */}
            {ob && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {ob.fullName && ob.fullName !== name && (
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 rounded px-2 py-0.5">
                    {ob.fullName}
                  </span>
                )}
                {(ob.title) && (
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 rounded px-2 py-0.5">
                    {ob.title}
                  </span>
                )}
                {risk && (
                  <span className={`text-xs rounded px-2 py-0.5 font-medium ${RISK_COLORS[risk] ?? "bg-slate-100 text-slate-600"}`}>
                    {risk} risk
                  </span>
                )}
                {ob.employmentStatus && (
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 rounded px-2 py-0.5 capitalize">
                    {ob.employmentStatus}
                  </span>
                )}
                {ob.expectedInvestment && (
                  <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded px-2 py-0.5">
                    {ob.expectedInvestment}
                  </span>
                )}
                {ob.nationality && (
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 rounded px-2 py-0.5">
                    {ob.nationality}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Link href={`/onboarding-officer/clients/${user.id}`}>
              <Button variant="outline" size="sm" className="h-8 px-2 gap-1 text-xs">
                <Eye className="h-3.5 w-3.5" /> View
              </Button>
            </Link>
            {status === "pending" && (
              <>
                <Button
                  size="sm"
                  className="h-8 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => onApprove(user.id)}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2 text-xs border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                  onClick={() => onReject(user.id)}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>

        {/* ── Expanded onboarding detail ── */}
        {expanded && ob && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
            {[
              { label: "Full Name",         value: ob.fullName },
              { label: "Title",             value: ob.title },
              { label: "Date of Birth",     value: ob.dateOfBirth ? new Date(ob.dateOfBirth).toLocaleDateString("en-UG", { dateStyle: "medium" }) : null },
              { label: "TIN",               value: ob.tin },
              { label: "Nationality",       value: ob.nationality },
              { label: "Country of Residence", value: ob.countryOfResidence },
              { label: "Home Address",      value: ob.homeAddress },
              { label: "Employment",        value: ob.employmentStatus },
              { label: "Occupation",        value: ob.occupation },
              { label: "Employer",          value: ob.companyName },
              { label: "Source of Income",  value: ob.sourceOfIncome },
              { label: "Expected Investment", value: ob.expectedInvestment },
              { label: "Primary Goal",      value: ob.primaryGoal },
              { label: "Time Horizon",      value: ob.timeHorizon },
              { label: "Risk Tolerance",    value: ob.riskTolerance },
              { label: "Risk Profile",      value: ob.riskProfile },
              { label: "Investment Experience", value: ob.investmentExperience },
              { label: "Is PEP",            value: ob.isPEP === "yes" ? "Yes" : ob.isPEP === "no" ? "No" : null },
              { label: "Agreed to Terms",   value: ob.agreeToTerms ? "Yes" : null },
              { label: "Consent Confirmed", value: ob.consentConfirmed ? "Yes" : null },
              // Company-specific
              { label: "Registration No.",  value: ob.registrationNumber },
              { label: "Business Type",     value: ob.businessType },
            ]
              .filter(({ value }) => value)
              .map(({ label, value }) => (
                <div key={label} className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500 font-medium">{label}</p>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">{value}</p>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── main shell ───────────────────────────────────────────────────────────────

export function OOAllClientsShell() {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // approval dialog
  const [actionTarget, setActionTarget] = useState<{ id: string; action: "approve" | "reject" } | null>(null);
  const [isPending, startTransition] = useTransition();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllUsers();
      if (res?.data) {
        setAllUsers((res.data ?? []).filter((u: any) => u.role === "USER"));
      } else {
        setError(res?.error ?? "Failed to load clients.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allUsers.filter((u) => {
      const name = clientDisplayName(u).toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      const phone = (u.phone ?? "").toLowerCase();
      const matchesSearch = !q || name.includes(q) || email.includes(q) || phone.includes(q);
      const status = onboardingStatus(u);
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allUsers, search, statusFilter]);

  const stats = useMemo(() => ({
    total:    allUsers.length,
    pending:  allUsers.filter((u) => onboardingStatus(u) === "pending").length,
    approved: allUsers.filter((u) => onboardingStatus(u) === "approved").length,
    rejected: allUsers.filter((u) => onboardingStatus(u) === "rejected").length,
  }), [allUsers]);

  function confirmAction() {
    if (!actionTarget) return;
    const { id, action } = actionTarget;
    startTransition(async () => {
      try {
        await updateUserById(id, {
          status: action === "approve" ? "ACTIVE" : "DEACTIVATED",
          ...(action === "approve" && { isApproved: true }),
        });
        setAllUsers((prev) =>
          prev.map((u) =>
            u.id !== id ? u : {
              ...u,
              isApproved: action === "approve" ? true : u.isApproved,
              status: action === "approve" ? "ACTIVE" : "DEACTIVATED",
            }
          )
        );
        toast.success(action === "approve" ? "Application approved." : "Application rejected.");
      } catch (e: any) {
        toast.error(e?.message ?? "Action failed.");
      } finally {
        setActionTarget(null);
      }
    });
  }

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
        <p className="text-sm font-semibold text-red-700 dark:text-red-400">{error}</p>
        <Button size="sm" variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {[
          { label: "Total Clients",  value: stats.total,    color: "text-slate-700 dark:text-slate-200" },
          { label: "Pending",        value: stats.pending,  color: "text-amber-600 dark:text-amber-400" },
          { label: "Approved",       value: stats.approved, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Rejected",       value: stats.rejected, color: "text-red-600 dark:text-red-400" },
        ].map(({ label, value, color }) => (
          <Card key={label} className="p-4">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </Card>
        ))}
      </div>

      {/* Search + filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Clients</CardTitle>
          <CardDescription>Click a row to expand onboarding details, or View to open the full profile</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-1">
              {(["all", "pending", "approved", "rejected"] as const).map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={statusFilter === s ? "default" : "outline"}
                  className="capitalize text-xs h-9"
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                  {s !== "all" && (
                    <span className="ml-1 opacity-60">
                      ({s === "pending" ? stats.pending : s === "approved" ? stats.approved : stats.rejected})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Client cards */}
          <div className="space-y-3">
            {filtered.map((u) => (
              <ClientCard
                key={u.id}
                user={u}
                onApprove={(id) => setActionTarget({ id, action: "approve" })}
                onReject={(id) => setActionTarget({ id, action: "reject" })}
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <UserIcon className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No clients found</p>
                <p className="text-xs mt-1">Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approval dialog */}
      <AlertDialog open={!!actionTarget} onOpenChange={() => !isPending && setActionTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionTarget?.action === "approve" ? "Approve Application" : "Reject Application"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionTarget?.action === "approve"
                ? "Approve this client's onboarding application and activate their account?"
                : "Reject this client's application? You can change this later if needed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={confirmAction}
              className={
                actionTarget?.action === "approve"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {actionTarget?.action === "approve" ? "Yes, Approve" : "Yes, Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
