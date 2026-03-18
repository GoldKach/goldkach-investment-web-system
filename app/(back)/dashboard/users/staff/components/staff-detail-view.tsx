"use client";

import { useState, useTransition, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  assignClientToAgentAction,
  unassignClientFromAgentAction,
  getClientsForAssignmentAction,
  type StaffMember,
  type AgentClientAssignment,
  type ClientUser,
} from "@/actions/staff";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft, UserPlus, UserMinus, Mail, Phone, Building2,
  Briefcase, Calendar, ShieldCheck, Loader2, Users, Wallet,
  TrendingUp, FileText, ChevronRight, BadgeCheck, Hash,
  Search, X, ChevronDown, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(first: string, last: string) {
  return `${(first[0] ?? "").toUpperCase()}${(last[0] ?? "").toUpperCase()}`;
}

function fmtCurrency(val?: number) {
  if (val === undefined || val === null) return "—";
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(val);
}

/** GK20260301 — prefix + YYYY + MM + DD */
function generateClientId(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `GK${yyyy}${mm}${dd}`;
}

const ROLE_COLORS: Record<string, string> = {
  AGENT: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  CLIENT_RELATIONS: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  ACCOUNT_MANAGER: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  STAFF: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  ADMIN: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  MANAGER: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

const AGENT_ROLES = ["AGENT", "ACCOUNT_MANAGER", "CLIENT_RELATIONS"];

// ─── Searchable User Select ───────────────────────────────────────────────────

interface UserSelectProps {
  users: ClientUser[];
  value: ClientUser | null;
  onChange: (user: ClientUser | null) => void;
  isLoading: boolean;
  placeholder?: string;
}

function UserSelect({ users, value, onChange, isLoading, placeholder = "Search clients..." }: UserSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
    );
  }, [users, query]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  function handleSelect(user: ClientUser) {
    onChange(user);
    setOpen(false);
    setQuery("");
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors",
          "bg-muted/50 border-border hover:bg-muted focus:outline-none",
          open && "border-primary ring-1 ring-primary/30"
        )}
      >
        {value ? (
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarImage src={value.imageUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials(value.firstName, value.lastName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground truncate font-medium">
              {value.firstName} {value.lastName}
            </span>
            <span className="text-muted-foreground truncate text-xs hidden sm:block">
              — {value.email}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">{isLoading ? "Loading clients..." : placeholder}</span>
        )}
        <div className="flex items-center gap-1 shrink-0">
          {value && (
            <div
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => e.key === "Enter" && handleClear(e as any)}
              className="rounded p-0.5 hover:bg-muted-foreground/20 transition-colors"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          )}
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
          )}
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full rounded-lg bg-muted/50 border border-border pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Users className="h-6 w-6 opacity-30 mb-1" />
                <p className="text-xs">
                  {query ? "No clients match your search." : "No unassigned clients found."}
                </p>
              </div>
            ) : (
              filtered.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelect(user)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors",
                    value?.id === user.id && "bg-primary/5"
                  )}
                >
                  <Avatar className="h-8 w-8 shrink-0 border border-border">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {initials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    {user.phone && (
                      <p className="text-xs text-muted-foreground">{user.phone}</p>
                    )}
                  </div>
                  {value?.id === user.id && (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>

          {filtered.length > 0 && (
            <div className="px-3 py-1.5 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground">
                {filtered.length} client{filtered.length !== 1 ? "s" : ""} found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Assign Client Dialog ─────────────────────────────────────────────────────

interface AssignClientDialogProps {
  open: boolean;
  staffId: string;
  onClose: () => void;
  onSuccess: (assignment: AgentClientAssignment) => void;
}

function AssignClientDialog({ open, staffId, onClose, onSuccess }: AssignClientDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [users, setUsers] = useState<ClientUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ClientUser | null>(null);
  const clientId = generateClientId();

useEffect(() => {
  if (!open) return;
  setIsLoadingUsers(true);
  getClientsForAssignmentAction()
    .then((res) => {
      if (res.success) {
        // Filter to only USER role on the frontend
        const clients = (res.data ?? []).filter((u) => u.role === "USER");
        setUsers(clients);
      } else {
        toast.error(res.error ?? "Failed to load clients.");
      }
    })
    .finally(() => setIsLoadingUsers(false));
}, [open]);

  function handleClose() {
    setSelectedUser(null);
    onClose();
  }

  function handleAssign() {
    if (!selectedUser) {
      toast.error("Please select a client.");
      return;
    }
    startTransition(async () => {
      const result = await assignClientToAgentAction(staffId, selectedUser.id);
      if (!result.success) {
        toast.error(result.error ?? "Failed to assign client.");
        return;
      }
      toast.success(`${selectedUser.firstName} ${selectedUser.lastName} assigned successfully.`);
      onSuccess(result.data!);
      handleClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-primary" />
            </div>
            Assign Client
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select a client to assign to this agent. If they already have an agent they will be
            automatically reassigned.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Auto Client ID */}
          {/* <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 flex items-center justify-between">
            {/* <div>
              <p className="text-xs text-muted-foreground font-medium">Auto-generated Client ID</p>
              <p className="text-base font-bold text-primary tracking-wider mt-0.5">{clientId}</p>
            </div> */}
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Hash className="h-4 w-4 text-primary" />
            </div>
          {/* </div> */}

          {/* Searchable user select */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Select Client <span className="text-destructive">*</span>
            </label>
            <UserSelect
              users={users}
              value={selectedUser}
              onChange={setSelectedUser}
              isLoading={isLoadingUsers}
            />
          </div>

          {/* Selected user preview */}
          {selectedUser && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border shrink-0">
                <AvatarImage src={selectedUser.imageUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {initials(selectedUser.firstName, selectedUser.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{selectedUser.email}</p>
                {selectedUser.phone && (
                  <p className="text-xs text-muted-foreground">{selectedUser.phone}</p>
                )}
              </div>
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 ml-auto" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={isPending || !selectedUser || isLoadingUsers}
            className="gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Assign Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Unassign Confirm Dialog ──────────────────────────────────────────────────

interface UnassignDialogProps {
  open: boolean;
  assignment: AgentClientAssignment | null;
  staffId: string;
  onClose: () => void;
  onSuccess: (clientId: string) => void;
}

function UnassignDialog({ open, assignment, staffId, onClose, onSuccess }: UnassignDialogProps) {
  const [isPending, startTransition] = useTransition();
  const client = assignment?.client;

  function handleConfirm() {
    if (!assignment) return;
    startTransition(async () => {
      const result = await unassignClientFromAgentAction(staffId, assignment.clientId);
      if (!result.success) {
        toast.error(result.error ?? "Failed to unassign client.");
        return;
      }
      toast.success(`${client?.firstName} ${client?.lastName} unassigned.`);
      onSuccess(assignment.clientId);
      onClose();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <UserMinus className="h-4 w-4 text-destructive" />
            </div>
            Unassign Client
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Remove{" "}
            <span className="font-semibold text-foreground">
              {client?.firstName} {client?.lastName}
            </span>{" "}
            from this agent? They will have no assigned agent until reassigned.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-muted/50 border-border hover:bg-muted text-foreground"
            disabled={isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90 gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Unassign
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Client Card ──────────────────────────────────────────────────────────────

interface ClientCardProps {
  assignment: AgentClientAssignment;
  onUnassign: (a: AgentClientAssignment) => void;
}

function ClientCard({ assignment, onUnassign }: ClientCardProps) {
  const { client } = assignment;
  const wallet = client.masterWallet as any;

  return (
    <div className="rounded-xl border border-border bg-card/50 p-4 hover:bg-card transition-colors group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10 border border-border shrink-0">
            <AvatarImage src={client.imageUrl} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {initials(client.firstName, client.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-foreground text-sm truncate">
              {client.firstName} {client.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">{client.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              client.isApproved
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            )}
          >
            {client.isApproved ? "Approved" : "Pending"}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onUnassign(assignment)}
            title="Unassign client"
          >
            <UserMinus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-muted/50 px-3 py-2 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Wallet className="h-3 w-3" /> Balance
          </p>
          <p className="text-xs font-semibold text-foreground mt-0.5">
            {fmtCurrency(wallet?.balance)}
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 px-3 py-2 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <TrendingUp className="h-3 w-3" /> Portfolios
          </p>
          <p className="text-xs font-semibold text-foreground mt-0.5">
            {client.userPortfolios?.length ?? 0}
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 px-3 py-2 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <FileText className="h-3 w-3" /> Deposits
          </p>
          <p className="text-xs font-semibold text-foreground mt-0.5">
            {client.deposits?.length ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Assigned {formatDistanceToNow(new Date(assignment.assignedAt), { addSuffix: true })}
        </p>
        <Link
          href={`/dashboard/users/${client.id}`}
          className="text-xs text-primary hover:underline flex items-center gap-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          View profile <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

// ─── Main Detail View ─────────────────────────────────────────────────────────

interface StaffDetailViewProps {
  staff: StaffMember;
  clients: AgentClientAssignment[];
}

export default function StaffDetailView({ staff, clients: initialClients }: StaffDetailViewProps) {
  const [clients, setClients] = useState<AgentClientAssignment[]>(initialClients);
  const [assignOpen, setAssignOpen] = useState(false);
  const [unassignTarget, setUnassignTarget] = useState<AgentClientAssignment | null>(null);

  const profile = staff.staffProfile;
  const isAgentRole = AGENT_ROLES.includes(staff.role);

  function handleAssigned(assignment: AgentClientAssignment) {
    setClients((prev) => {
      const exists = prev.find((c) => c.clientId === assignment.clientId);
      if (exists) return prev.map((c) => (c.clientId === assignment.clientId ? assignment : c));
      return [assignment, ...prev];
    });
  }

  function handleUnassigned(clientId: string) {
    setClients((prev) => prev.filter((c) => c.clientId !== clientId));
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back */}
      <Link
        href="/dashboard/users/staff"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Staff
      </Link>

      {/* Profile Header */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <div className="px-6 pb-6 -mt-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex items-end gap-4">
              <Avatar className="h-20 w-20 border-4 border-card shadow-xl">
                <AvatarImage src={staff.imageUrl} />
                <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                  {initials(staff.firstName, staff.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">
                    {staff.firstName} {staff.lastName}
                  </h2>
                  {staff.isApproved && <BadgeCheck className="h-5 w-5 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">{profile?.position ?? "—"}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="outline" className={cn("text-xs border", ROLE_COLORS[staff.role] ?? "")}>
                    {staff.role.replace(/_/g, " ")}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs border",
                      profile?.isActive
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    )}
                  >
                    {profile?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
            {isAgentRole && (
              <Button
                onClick={() => setAssignOpen(true)}
                disabled={!profile?.isActive}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Assign Client
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Info */}
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary/70 shrink-0" />
                <span className="truncate">{staff.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary/70 shrink-0" />
                <span>{staff.phone}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Employment</h3>
            <div className="space-y-2.5">
              {[
                { icon: Hash, label: "Employee ID", value: profile?.employeeId },
                { icon: Building2, label: "Department", value: profile?.department },
                { icon: Briefcase, label: "Position", value: profile?.position },
                {
                  icon: Calendar,
                  label: "Joined",
                  value: profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })
                    : undefined,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm text-foreground font-medium truncate">{value ?? "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {profile?.bio && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Bio</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Right: Clients */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Assigned Clients
                <span className="text-sm font-normal text-muted-foreground">({clients.length})</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Clients currently managed by this staff member.
              </p>
            </div>
            <ShieldCheck className="h-5 w-5 text-muted-foreground/30" />
          </div>

          {clients.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/30 h-48 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Users className="h-8 w-8 opacity-20" />
              <p className="text-sm">No clients assigned yet.</p>
              {isAgentRole && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAssignOpen(true)}
                  className="mt-2 gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Assign First Client
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clients.map((assignment) => (
                <ClientCard
                  key={assignment.id}
                  assignment={assignment}
                  onUnassign={setUnassignTarget}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <AssignClientDialog
        open={assignOpen}
        staffId={staff.id}
        onClose={() => setAssignOpen(false)}
        onSuccess={handleAssigned}
      />
      <UnassignDialog
        open={!!unassignTarget}
        assignment={unassignTarget}
        staffId={staff.id}
        onClose={() => setUnassignTarget(null)}
        onSuccess={handleUnassigned}
      />
    </div>
  );
}