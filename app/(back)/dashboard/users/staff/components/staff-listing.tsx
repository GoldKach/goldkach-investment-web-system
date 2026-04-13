"use client";

import { useState, useTransition, useEffect, useRef, useMemo } from "react";
import {
  createStaffAction,
  updateStaffAction,
  deactivateStaffAction,
  deleteStaffAction,
  assignClientToAgentAction,
  unassignClientFromAgentAction,
  getAgentClientsAction,
  getClientsForAssignmentAction,
  type StaffMember,
  type AgentClientAssignment,
  type AssignedClient,
  type ClientUser,
  type CreateStaffInput,
  type UpdateStaffInput,
  type StaffRole,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users, Plus, MoreHorizontal, Pencil, Trash2, Eye,
  Search, UserCheck, UserX, Briefcase, Mail, Phone,
  Loader2, ShieldCheck, Filter, Building2, Calendar,
  Hash, BadgeCheck, UserPlus, UserMinus, Wallet,
  TrendingUp, FileText, ChevronRight, CheckCircle2,
  ChevronDown, X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// ─── Constants ────────────────────────────────────────────────────────────────

const STAFF_ROLES: { value: StaffRole; label: string }[] = [
  { value: "AGENT", label: "Agent" },
  { value: "CLIENT_RELATIONS", label: "Client Relations" },
  { value: "ACCOUNT_MANAGER", label: "Account Manager" },
  { value: "STAFF", label: "Staff" },
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
];

const ROLE_COLORS: Record<string, string> = {
  AGENT: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  CLIENT_RELATIONS: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  ACCOUNT_MANAGER: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  STAFF: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  ADMIN: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  MANAGER: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  SUPER_ADMIN: "bg-red-500/15 text-red-400 border-red-500/20",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  INACTIVE: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  SUSPENDED: "bg-red-500/15 text-red-400 border-red-500/20",
};

const AGENT_ROLES = ["AGENT", "ACCOUNT_MANAGER", "CLIENT_RELATIONS"];

function initials(first: string, last?: string | null) {
  return `${(first[0] ?? "").toUpperCase()}${(last?.[0] ?? "").toUpperCase()}`;
}

function fmtCurrency(val?: number) {
  if (val === undefined || val === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(val);
}

// ─── Staff Form Dialog ────────────────────────────────────────────────────────

function StaffFormDialog({
  open, onClose, onSuccess, editTarget,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: (staff: StaffMember) => void;
  editTarget?: StaffMember | null;
}) {
  const isEditing = !!editTarget;
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<CreateStaffInput>({
    firstName: editTarget?.firstName ?? "",
    lastName: editTarget?.lastName ?? "",
    email: editTarget?.email ?? "",
    phone: editTarget?.phone ?? "",
    password: "",
    role: editTarget?.role ?? "STAFF",
    department: editTarget?.staffProfile?.department ?? "",
    position: editTarget?.staffProfile?.position ?? "",
    bio: editTarget?.staffProfile?.bio ?? "",
    employeeId: editTarget?.staffProfile?.employeeId ?? "",
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  function handleClose() { setErrors({}); onClose(); }

  function handleSubmit() {
    setErrors({});
    startTransition(async () => {
      const result = isEditing
        ? await updateStaffAction(editTarget!.id, form as UpdateStaffInput)
        : await createStaffAction(form);
      if (!result.success) {
        setErrors(result.errors ?? {});
        toast.error(result.error ?? "Something went wrong.");
        return;
      }
      toast.success(isEditing ? "Staff member updated." : "Staff member created.");
      onSuccess(result.data!);
      handleClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            {isEditing ? "Edit Staff Member" : "Add Staff Member"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing
              ? "Update staff member details and profile information."
              : "Create a new staff account. They will receive a verification email."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-sm">First Name <span className="text-destructive">*</span></Label>
            <Input value={form.firstName} onChange={set("firstName")} placeholder="John" className="bg-muted/50 border-border" />
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Last Name</Label>
            <Input value={form.lastName} onChange={set("lastName")} placeholder="Doe" className="bg-muted/50 border-border" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Email <span className="text-destructive">*</span></Label>
            <Input type="email" value={form.email} onChange={set("email")} placeholder="john.doe@goldkach.com" className="bg-muted/50 border-border" />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Phone <span className="text-destructive">*</span></Label>
            <Input value={form.phone} onChange={set("phone")} placeholder="+256700000000" className="bg-muted/50 border-border" />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>
          {!isEditing && (
            <div className="space-y-1.5">
              <Label className="text-sm">Password <span className="text-destructive">*</span></Label>
              <Input type="password" value={form.password} onChange={set("password")} placeholder="Temporary password" className="bg-muted/50 border-border" />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-sm">Employee ID</Label>
            <Input value={form.employeeId} onChange={set("employeeId")} placeholder="EMP001" className="bg-muted/50 border-border" />
            {errors.employeeId && <p className="text-xs text-destructive">{errors.employeeId}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Role <span className="text-destructive">*</span></Label>
            <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as StaffRole }))}>
              <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                {STAFF_ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Department</Label>
            <Input value={form.department} onChange={set("department")} placeholder="e.g. Sales" className="bg-muted/50 border-border" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Position</Label>
            <Input value={form.position} onChange={set("position")} placeholder="e.g. Senior Agent" className="bg-muted/50 border-border" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-sm">Bio</Label>
            <Textarea value={form.bio} onChange={set("bio")} placeholder="Short description..." rows={2} className="bg-muted/50 border-border resize-none" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending} className="gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Create Staff Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Deactivate Dialog ────────────────────────────────────────────────────────

function DeactivateDialog({
  open, staff, onClose, onSuccess,
}: {
  open: boolean;
  staff: StaffMember | null;
  onClose: () => void;
  onSuccess: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  function handleConfirm() {
    if (!staff) return;
    startTransition(async () => {
      const result = await deactivateStaffAction(staff.id);
      if (!result.success) { toast.error(result.error ?? "Failed to deactivate."); return; }
      toast.success(`${staff.firstName} ${staff.lastName} deactivated.`);
      onSuccess(staff.id);
      onClose();
    });
  }
  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <UserX className="h-4 w-4 text-destructive" />
            </div>
            Deactivate Staff Member
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will deactivate{" "}
            <span className="font-semibold text-foreground">{staff?.firstName} {staff?.lastName}</span>.
            They will no longer be able to log in. This can be reversed by an admin.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending} className="bg-destructive hover:bg-destructive/90 gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────

function DeleteDialog({
  open, staff, onClose, onSuccess,
}: {
  open: boolean;
  staff: StaffMember | null;
  onClose: () => void;
  onSuccess: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState("");

  function handleConfirm() {
    if (!staff) return;
    startTransition(async () => {
      const result = await deleteStaffAction(staff.id);
      if (!result.success) { toast.error(result.error ?? "Failed to delete."); return; }
      toast.success(`${staff.firstName} ${staff.lastName} deleted.`);
      onSuccess(staff.id);
      setConfirm("");
      onClose();
    });
  }

  const fullName = `${staff?.firstName ?? ""} ${staff?.lastName ?? ""}`.trim();
  const canDelete = confirm === fullName;

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) { setConfirm(""); onClose(); } }}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Trash2 className="h-4 w-4 text-destructive" />
            </div>
            Permanently Delete Staff Member
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <span className="block">
              This will <strong className="text-destructive">permanently delete</strong>{" "}
              <span className="font-semibold text-foreground">{fullName}</span> and all their data.
              This action cannot be undone.
            </span>
            <span className="block text-sm">
              Type <strong className="text-foreground font-mono">{fullName}</strong> to confirm:
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={fullName}
          className="bg-muted/50 border-border mt-1"
        />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} onClick={() => setConfirm("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending || !canDelete}
            className="bg-destructive hover:bg-destructive/90 gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Searchable User Select (for assign dialog) ───────────────────────────────

function UserSelect({
  users, value, onChange, isLoading, placeholder = "Search clients...",
}: {
  users: ClientUser[];
  value: ClientUser | null;
  onChange: (u: ClientUser | null) => void;
  isLoading: boolean;
  placeholder?: string;
}) {
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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false); setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full">
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
            <span className="text-foreground truncate font-medium">{value.firstName} {value.lastName}</span>
            <span className="text-muted-foreground text-xs hidden sm:block">— {value.email}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">{isLoading ? "Loading clients..." : placeholder}</span>
        )}
        <div className="flex items-center gap-1 shrink-0">
          {value && (
            <div role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); onChange(null); setQuery(""); }}
              className="rounded p-0.5 hover:bg-muted-foreground/20">
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          )}
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> :
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />}
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full rounded-lg bg-muted/50 border border-border pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Users className="h-6 w-6 opacity-30 mb-1" />
                <p className="text-xs">{query ? "No clients match." : "No clients found."}</p>
              </div>
            ) : filtered.map((user) => (
              <button key={user.id} type="button" onClick={() => { onChange(user); setOpen(false); setQuery(""); }}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors",
                  value?.id === user.id && "bg-primary/5")}>
                <Avatar className="h-8 w-8 shrink-0 border border-border">
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                {value?.id === user.id && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Client Detail Dialog ─────────────────────────────────────────────────────

function ClientDetailDialog({
  open, client, onClose, onUnassign, staffId,
}: {
  open: boolean;
  client: AssignedClient | null;
  onClose: () => void;
  onUnassign: (clientId: string) => void;
  staffId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmUnassign, setConfirmUnassign] = useState(false);

  if (!client) return null;

  const wallet = client.masterWallet as any;
  const onboarding = client.individualOnboarding ?? client.companyOnboarding ?? null;
  const isCompany = !!client.companyOnboarding;

  function handleUnassign() {
    startTransition(async () => {
      const result = await unassignClientFromAgentAction(staffId, client!.id);
      if (!result.success) { toast.error(result.error ?? "Failed to unassign."); return; }
      toast.success(`${client!.firstName} ${client!.lastName} unassigned.`);
      onUnassign(client!.id);
      setConfirmUnassign(false);
      onClose();
    });
  }

  return (
    <>
      <Dialog open={open && !confirmUnassign} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-2xl max-h-[85vh] bg-card border-border p-0 overflow-hidden">
          {/* Header */}
          <div className="relative h-16 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <div className="px-6 -mt-8 pb-4 flex items-end gap-4">
            <Avatar className="h-16 w-16 border-4 border-card shadow-lg shrink-0">
              <AvatarImage src={client.imageUrl} />
              <AvatarFallback className="bg-primary/20 text-primary text-lg font-bold">
                {initials(client.firstName, client.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-foreground truncate">
                  {client.firstName} {client.lastName}
                </h2>
                {client.isApproved && <BadgeCheck className="h-5 w-5 text-primary shrink-0" />}
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className={cn("text-xs border",
                  client.isApproved
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                )}>
                  {client.isApproved ? "KYC Approved" : "Pending Approval"}
                </Badge>
                <Badge variant="outline" className={cn("text-xs border", STATUS_COLORS[client.status] ?? STATUS_COLORS.INACTIVE)}>
                  {client.status}
                </Badge>
                {isCompany && (
                  <Badge variant="outline" className="text-xs border bg-violet-500/10 text-violet-400 border-violet-500/20">
                    Company
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmUnassign(true)}
              className="shrink-0 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <UserMinus className="h-4 w-4" />
              Unassign
            </Button>
          </div>

          <ScrollArea className="max-h-[calc(85vh-160px)]">
            <div className="px-6 pb-6 space-y-5">
              <Separator className="bg-border" />

              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{client.phone}</span>
                </div>
              </div>

              {/* Wallet summary */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Deposited", value: fmtCurrency(wallet?.totalDeposited), icon: Wallet },
                  { label: "Net Asset Value", value: fmtCurrency(wallet?.netAssetValue), icon: TrendingUp },
                  { label: "Portfolios", value: String(client.userPortfolios?.length ?? 0), icon: Briefcase },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-lg bg-muted/50 p-3 text-center">
                    <Icon className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Onboarding info */}
              {onboarding && (
                <div className="rounded-xl border border-border p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {isCompany ? "Company Onboarding" : "Individual Onboarding"}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {isCompany ? (
                      <>
                        <div>
                          <p className="text-xs text-muted-foreground">Company Name</p>
                          <p className="text-foreground font-medium">{(onboarding as any).companyName ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Company Type</p>
                          <p className="text-foreground font-medium">{(onboarding as any).companyType ?? "—"}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-xs text-muted-foreground">Full Name</p>
                          <p className="text-foreground font-medium">{(onboarding as any).fullName ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Occupation</p>
                          <p className="text-foreground font-medium">{(onboarding as any).occupation ?? "—"}</p>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">KYC Status</p>
                      <Badge variant="outline" className={cn("text-xs border mt-0.5",
                        onboarding.isApproved
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      )}>
                        {onboarding.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                      <p className="text-foreground font-medium text-xs">
                        {onboarding.createdAt
                          ? new Date(onboarding.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pending transactions */}
              {(client.deposits?.length > 0 || client.withdrawals?.length > 0) && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Pending Transactions
                  </h3>
                  <div className="flex gap-4 text-sm">
                    {client.deposits?.length > 0 && (
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">{client.deposits.length}</span> deposit{client.deposits.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {client.withdrawals?.length > 0 && (
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">{client.withdrawals.length}</span> withdrawal{client.withdrawals.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Wallet account */}
              {wallet && (
                <div className="rounded-xl border border-border p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    Master Wallet
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Account Number</p>
                      <p className="text-foreground font-mono font-medium">{wallet.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge variant="outline" className={cn("text-xs border mt-0.5",
                        wallet.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      )}>
                        {wallet.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Withdrawn</p>
                      <p className="text-foreground font-medium">{fmtCurrency(wallet.totalWithdrawn)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Fees</p>
                      <p className="text-foreground font-medium">{fmtCurrency(wallet.totalFees)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Unassign confirm */}
      <AlertDialog open={confirmUnassign} onOpenChange={(v) => !v && setConfirmUnassign(false)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <UserMinus className="h-4 w-4 text-destructive" />
              </div>
              Unassign Client
            </AlertDialogTitle>
            <AlertDialogDescription>
              Remove <span className="font-semibold text-foreground">{client.firstName} {client.lastName}</span> from this agent?
              They will have no assigned agent until reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} onClick={() => setConfirmUnassign(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnassign} disabled={isPending} className="bg-destructive hover:bg-destructive/90 gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Unassign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Staff Detail Dialog ──────────────────────────────────────────────────────

function StaffDetailDialog({
  open, staff, onClose, onUpdated,
}: {
  open: boolean;
  staff: StaffMember | null;
  onClose: () => void;
  onUpdated: (updated: StaffMember) => void;
}) {
  const [clients, setClients] = useState<AgentClientAssignment[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<AssignedClient | null>(null);
  const [clientDetailOpen, setClientDetailOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<ClientUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ClientUser | null>(null);
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!open || !staff) return;
    setLoadingClients(true);
    getAgentClientsAction(staff.id)
      .then((res) => { if (res.success) setClients(res.data ?? []); })
      .finally(() => setLoadingClients(false));
  }, [open, staff]);

  useEffect(() => {
    if (!assignOpen) return;
    setLoadingUsers(true);
    getClientsForAssignmentAction()
      .then((res) => {
        if (res.success) setAvailableUsers((res.data ?? []).filter((u) => u.role === "USER"));
      })
      .finally(() => setLoadingUsers(false));
  }, [assignOpen]);

  if (!staff) return null;

  const profile = staff.staffProfile;
  const isAgentRole = AGENT_ROLES.includes(staff.role);

  function handleAssign() {
    if (!selectedUser || !staff) return;
    startTransition(async () => {
      const result = await assignClientToAgentAction(staff.id, selectedUser.id);
      if (!result.success) { toast.error(result.error ?? "Failed to assign."); return; }
      toast.success(`${selectedUser.firstName} ${selectedUser.lastName} assigned.`);
      setClients((prev) => {
        const exists = prev.find((c) => c.clientId === result.data!.clientId);
        if (exists) return prev.map((c) => c.clientId === result.data!.clientId ? result.data! : c);
        return [result.data!, ...prev];
      });
      setSelectedUser(null);
      setAssignOpen(false);
    });
  }

  function handleUnassigned(clientId: string) {
    setClients((prev) => prev.filter((c) => c.clientId !== clientId));
    setClientDetailOpen(false);
    setSelectedClient(null);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] bg-card border-border p-0 overflow-hidden">
          {/* Profile header */}
          <div className="relative h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <div className="px-6 -mt-10 pb-4 flex items-end gap-4">
            <Avatar className="h-20 w-20 border-4 border-card shadow-xl shrink-0">
              <AvatarImage src={staff.imageUrl} />
              <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                {initials(staff.firstName, staff.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-foreground">{staff.firstName} {staff.lastName}</h2>
                {staff.isApproved && <BadgeCheck className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground">{profile?.position ?? "—"}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge variant="outline" className={cn("text-xs border", ROLE_COLORS[staff.role] ?? "")}>
                  {staff.role.replace(/_/g, " ")}
                </Badge>
                <Badge variant="outline" className={cn("text-xs border",
                  profile?.isActive
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                )}>
                  {profile?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="gap-1.5 shrink-0">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </div>

          <ScrollArea className="max-h-[calc(90vh-200px)]">
            <div className="px-6 pb-6 space-y-5">
              <Separator className="bg-border" />

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  {[
                    { icon: Mail, label: "Email", value: staff.email },
                    { icon: Phone, label: "Phone", value: staff.phone },
                    { icon: Hash, label: "Employee ID", value: profile?.employeeId },
                    { icon: Building2, label: "Department", value: profile?.department },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm text-foreground font-medium">{value ?? "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Briefcase, label: "Position", value: profile?.position },
                    { icon: Calendar, label: "Joined", value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : undefined },
                    { icon: Users, label: "Clients Managed", value: String(clients.length) },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm text-foreground font-medium">{value ?? "—"}</p>
                      </div>
                    </div>
                  ))}
                  {profile?.bio && (
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Bio</p>
                        <p className="text-sm text-foreground">{profile.bio}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Clients section */}
              {isAgentRole && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Assigned Clients
                      <span className="text-xs font-normal text-muted-foreground">({clients.length})</span>
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAssignOpen(!assignOpen)}
                      disabled={!profile?.isActive}
                      className="gap-1.5 h-7 text-xs"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Assign Client
                    </Button>
                  </div>

                  {/* Assign panel */}
                  {assignOpen && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                      <p className="text-xs font-medium text-foreground">Select a client to assign</p>
                      <UserSelect
                        users={availableUsers}
                        value={selectedUser}
                        onChange={setSelectedUser}
                        isLoading={loadingUsers}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => { setAssignOpen(false); setSelectedUser(null); }}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleAssign} disabled={!selectedUser || isPending} className="gap-1.5">
                          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                          Assign
                        </Button>
                      </div>
                    </div>
                  )}

                  {loadingClients ? (
                    <div className="flex items-center justify-center h-24 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading clients...
                    </div>
                  ) : clients.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border h-24 flex flex-col items-center justify-center text-muted-foreground gap-1">
                      <Users className="h-6 w-6 opacity-20" />
                      <p className="text-xs">No clients assigned yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {clients.map((assignment) => {
                        const c = assignment.client;
                        return (
                          <button
                            key={assignment.id}
                            type="button"
                            onClick={() => { setSelectedClient(c); setClientDetailOpen(true); }}
                            className="w-full flex items-center gap-3 rounded-xl border border-border bg-card/50 p-3 hover:bg-card hover:border-primary/30 transition-all text-left group"
                          >
                            <Avatar className="h-9 w-9 border border-border shrink-0">
                              <AvatarImage src={c.imageUrl} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                {initials(c.firstName, c.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{c.firstName} {c.lastName}</p>
                              <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="outline" className={cn("text-xs border",
                                c.isApproved
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              )}>
                                {c.isApproved ? "Approved" : "Pending"}
                              </Badge>
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Client detail dialog */}
      <ClientDetailDialog
        open={clientDetailOpen}
        client={selectedClient}
        onClose={() => { setClientDetailOpen(false); setSelectedClient(null); }}
        onUnassign={handleUnassigned}
        staffId={staff.id}
      />

      {/* Edit dialog */}
      <StaffFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={(updated) => { onUpdated(updated); setEditOpen(false); }}
        editTarget={staff}
      />
    </>
  );
}

// ─── Main Listing ─────────────────────────────────────────────────────────────

interface StaffListingProps {
  staff: StaffMember[];
  error?: string;
}

export default function StaffListing({ staff: initialStaff, error }: StaffListingProps) {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const [createOpen, setCreateOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<StaffMember | null>(null);
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<StaffMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);

  const totalStaff = staff.length;
  const activeStaff = staff.filter((s) => s.staffProfile?.isActive).length;
  const agentCount = staff.filter((s) => s.role === "AGENT").length;
  const totalClients = staff.reduce((sum, s) => sum + (s.staffProfile?._count?.assignedClients ?? 0), 0);

  const filtered = staff.filter((s) => {
    const matchSearch = !search || `${s.firstName} ${s.lastName} ${s.email} ${s.phone}`.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || s.role === roleFilter;
    return matchSearch && matchRole;
  });

  function handleCreated(newStaff: StaffMember) { setStaff((p) => [newStaff, ...p]); }
  function handleUpdated(updated: StaffMember) { setStaff((p) => p.map((s) => s.id === updated.id ? updated : s)); }
  function handleDeactivated(id: string) {
    setStaff((p) => p.map((s) => s.id === id
      ? { ...s, status: "INACTIVE", staffProfile: s.staffProfile ? { ...s.staffProfile, isActive: false } : null }
      : s
    ));
  }
  function handleDeleted(id: string) { setStaff((p) => p.filter((s) => s.id !== id)); }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
        <UserX className="h-10 w-10 opacity-30" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Staff Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage internal team members, agents, and their assigned clients.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Staff Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: totalStaff, icon: Users, color: "text-primary" },
          { label: "Active", value: activeStaff, icon: UserCheck, color: "text-emerald-400" },
          { label: "Agents", value: agentCount, icon: ShieldCheck, color: "text-blue-400" },
          { label: "Clients Managed", value: totalClients, icon: Briefcase, color: "text-violet-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className={cn("h-9 w-9 rounded-lg bg-muted flex items-center justify-center", color)}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-border"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-44 bg-muted/50 border-border"><SelectValue placeholder="Filter by role" /></SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="ALL">All Roles</SelectItem>
              {STAFF_ROLES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium pl-4">Member</TableHead>
              <TableHead className="text-muted-foreground font-medium">Role</TableHead>
              <TableHead className="text-muted-foreground font-medium">Department</TableHead>
              <TableHead className="text-muted-foreground font-medium">Contact</TableHead>
              <TableHead className="text-muted-foreground font-medium">Clients</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Users className="h-8 w-8 opacity-30" />
                    <p className="text-sm">
                      {search || roleFilter !== "ALL"
                        ? "No staff members match your filters."
                        : "No staff members yet. Add your first team member."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.map((member) => (
              <TableRow
                key={member.id}
                className="border-border hover:bg-muted/30 cursor-pointer"
                onClick={() => setDetailTarget(member)}
              >
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src={member.imageUrl} alt={member.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {initials(member.firstName, member.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground text-sm">{member.firstName} {member.lastName}</p>
                      <p className="text-xs text-muted-foreground">{member.staffProfile?.employeeId ?? "—"}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-xs font-medium border", ROLE_COLORS[member.role] ?? "")}>
                    {member.role.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-foreground">{member.staffProfile?.department ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{member.staffProfile?.position ?? ""}</p>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {member.email}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {member.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-semibold text-foreground">{member.staffProfile?._count?.assignedClients ?? 0}</span>
                  <span className="text-xs text-muted-foreground ml-1">clients</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-xs font-medium border", STATUS_COLORS[member.status] ?? STATUS_COLORS.INACTIVE)}>
                    {member.staffProfile?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border w-44">
                      <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setDetailTarget(member)}>
                        <Eye className="h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setEditTarget(member)}>
                        <Pencil className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer text-amber-500 focus:text-amber-500"
                        onClick={() => setDeactivateTarget(member)}
                        disabled={!member.staffProfile?.isActive}
                      >
                        <UserX className="h-4 w-4" /> Deactivate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => setDeleteTarget(member)}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          Showing {filtered.length} of {staff.length} staff members
        </p>
      )}

      {/* Dialogs */}
      <StaffFormDialog open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={handleCreated} />
      <StaffFormDialog open={!!editTarget} onClose={() => setEditTarget(null)} onSuccess={handleUpdated} editTarget={editTarget} />

      <StaffDetailDialog
        open={!!detailTarget}
        staff={detailTarget}
        onClose={() => setDetailTarget(null)}
        onUpdated={(updated) => { handleUpdated(updated); setDetailTarget(updated); }}
      />

      <DeactivateDialog
        open={!!deactivateTarget}
        staff={deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onSuccess={handleDeactivated}
      />
      <DeleteDialog
        open={!!deleteTarget}
        staff={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={handleDeleted}
      />
    </div>
  );
}