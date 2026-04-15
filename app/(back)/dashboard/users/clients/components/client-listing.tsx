"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { updateUserById, deleteUser } from "@/actions/auth";
import { approveIndividualOnboarding, approveCompanyOnboarding } from "@/actions/onboarding";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Users, Search, Filter, MoreHorizontal, Eye, BadgeCheck,
  UserX, Mail, Phone, Wallet, TrendingUp, Briefcase,
  FileText, Loader2, CheckCircle2, XCircle, Clock,
  Building2, User, ShieldCheck, Calendar, Hash, Trash2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Client = {
  id: string;
  firstName: string;
  lastName: string | null;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  role: string;
  status: string;
  isApproved: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  individualOnboarding: {
    id: string;
    fullName: string | null;
    isApproved: boolean;
    createdAt: string;
  } | null;
  companyOnboarding: {
    id: string;
    companyName: string;
    companyType: string;
    isApproved: boolean;
    createdAt: string;
  } | null;
  masterWallet: {
    id: string;
    accountNumber: string;
    totalDeposited: number;
    totalWithdrawn: number;
    totalFees: number;
    netAssetValue: number;
    status: string;
  } | null;
  deposits: { id: string; amount: number; transactionStatus: string; createdAt: string }[];
  withdrawals: { id: string; amount: number; transactionStatus: string; createdAt: string }[];
  userPortfolios: { id: string; customName: string; portfolioValue: number; isActive: boolean }[];
};

function concatPortfolioNames(portfolios: { customName: string }[], maxLength = 30) {
  if (!portfolios || portfolios.length === 0) return "—";
  const names = portfolios.map(p => p.customName);
  const combined = names.join(" — ");
  if (combined.length > maxLength) {
    const half = Math.floor((maxLength - 3) / 2);
    return combined.slice(0, half) + "..." + combined.slice(-half);
  }
  return combined;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(first: string, last?: string | null) {
  return `${(first[0] ?? "").toUpperCase()}${(last?.[0] ?? "").toUpperCase()}`;
}

function fmtCurrency(val?: number | null) {
  if (val === undefined || val === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(val);
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:      "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  INACTIVE:    "bg-slate-500/15 text-slate-400 border-slate-500/20",
  PENDING:     "bg-amber-500/15 text-amber-400 border-amber-500/20",
  SUSPENDED:   "bg-red-500/15 text-red-400 border-red-500/20",
  DEACTIVATED: "bg-slate-500/15 text-slate-400 border-slate-500/20",
};

// ─── Client Detail Dialog ─────────────────────────────────────────────────────

function ClientDetailDialog({
  open,
  client,
  onClose,
  onUpdated,
}: {
  open: boolean;
  client: Client | null;
  onClose: () => void;
  onUpdated: (updated: Client) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);

  if (!client) return null;

  const onboarding = client.individualOnboarding ?? client.companyOnboarding ?? null;
  const isCompany = !!client.companyOnboarding;
  const wallet = client.masterWallet;

  function handleApprove() {
    startTransition(async () => {
      const result = await updateUserById(client!.id, {
        isApproved: true,
        status: "ACTIVE",
      });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`${client!.firstName} has been approved.`);
      onUpdated({ ...client!, isApproved: true, status: "ACTIVE" });
      setApproveConfirmOpen(false);
    });
  }

  return (
    <>
      <Dialog open={open && !approveConfirmOpen} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-2xl max-h-[88vh] bg-card border-border p-0 overflow-hidden">
          {/* Profile header */}
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
                <Badge variant="outline" className={cn("text-xs border", STATUS_COLORS[client.status] ?? STATUS_COLORS.INACTIVE)}>
                  {client.status}
                </Badge>
                <Badge variant="outline" className={cn("text-xs border",
                  client.emailVerified
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                )}>
                  {client.emailVerified ? "Email Verified" : "Email Unverified"}
                </Badge>
                {isCompany && (
                  <Badge variant="outline" className="text-xs border bg-violet-500/10 text-violet-400 border-violet-500/20">
                    Company
                  </Badge>
                )}
              </div>
            </div>
            {!client.isApproved && (
              <Button
                size="sm"
                onClick={() => setApproveConfirmOpen(true)}
                disabled={isPending}
                className="gap-1.5 shrink-0 bg-primary hover:bg-primary/90"
              >
                <BadgeCheck className="h-4 w-4" />
                Approve
              </Button>
            )}
          </div>

          <ScrollArea className="max-h-[calc(88vh-160px)]">
            <div className="px-6 pb-6 space-y-5">
              <Separator className="bg-border" />

              {/* Contact & Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Mail, label: "Email", value: client.email },
                  { icon: Phone, label: "Phone", value: client.phone },
                  { icon: Calendar, label: "Joined", value: new Date(client.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
                  { icon: Hash, label: "Account No.", value: wallet?.accountNumber ?? "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm text-foreground font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Wallet summary */}
              {wallet && (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Deposited", value: fmtCurrency(wallet.totalDeposited), icon: Wallet },
                    { label: "Net Asset Value", value: fmtCurrency(wallet.netAssetValue), icon: TrendingUp },
                    { label: "Total Withdrawn", value: fmtCurrency(wallet.totalWithdrawn), icon: Briefcase },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-lg bg-muted/50 p-3 text-center">
                      <Icon className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Portfolios */}
              {client.userPortfolios?.length > 0 && (
                <div className="rounded-xl border border-border p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Portfolios ({client.userPortfolios.length})
                  </h3>
                  <div className="space-y-1.5">
                    {client.userPortfolios.map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{p.customName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{fmtCurrency(p.portfolioValue)}</span>
                          <Badge variant="outline" className={cn("text-xs border",
                            p.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                          )}>
                            {p.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Onboarding info */}
              {onboarding && (
                <div className="rounded-xl border border-border p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {isCompany ? "Company Onboarding" : "Individual Onboarding"}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">{isCompany ? "Company Name" : "Full Name"}</p>
                      <p className="text-foreground font-medium">
                        {isCompany
                          ? (onboarding as any).companyName
                          : (onboarding as any).fullName ?? "—"}
                      </p>
                    </div>
                    {isCompany && (
                      <div>
                        <p className="text-xs text-muted-foreground">Company Type</p>
                        <p className="text-foreground font-medium">{(onboarding as any).companyType ?? "—"}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">KYC Status</p>
                      <Badge variant="outline" className={cn("text-xs border mt-0.5",
                        onboarding.isApproved
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      )}>
                        {onboarding.isApproved ? "KYC Approved" : "Pending Review"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                      <p className="text-foreground font-medium text-xs">
                        {new Date(onboarding.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pending transactions */}
              {(client.deposits?.length > 0 || client.withdrawals?.length > 0) && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
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
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Approve confirm */}
      <AlertDialog open={approveConfirmOpen} onOpenChange={(v) => !v && setApproveConfirmOpen(false)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BadgeCheck className="h-4 w-4 text-primary" />
              </div>
              Approve Client Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Approve{" "}
              <span className="font-semibold text-foreground">{client.firstName} {client.lastName}</span>
              ? Their account status will be set to <strong>Active</strong> and they will receive a
              confirmation email prompting them to make a deposit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} onClick={() => setApproveConfirmOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              disabled={isPending}
              className="gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Approve Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Delete Client Dialog ─────────────────────────────────────────────────────

function DeleteClientDialog({
  open,
  client,
  onOpenChange,
  onDeleted,
}: {
  open: boolean;
  client: Client | null;
  onOpenChange: (open: boolean) => void;
  onDeleted: (clientId: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!client) return null;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteUser(client!.id);
      toast.success(`${client!.firstName} ${client!.lastName ?? ""} has been deleted.`);
      onDeleted(client!.id);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete client. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Trash2 className="h-4 w-4 text-red-400" />
            </div>
            Delete Client Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-foreground">
              {client.firstName} {client.lastName}
            </span>{" "}
            ({client.email})? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2 bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Main Listing ─────────────────────────────────────────────────────────────

export default function ClientsListing({ clients: initialClients }: { clients: Client[] }) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [onboardingFilter, setOnboardingFilter] = useState("ALL");
  const [detailTarget, setDetailTarget] = useState<Client | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [approveTarget, setApproveTarget] = useState<Client | null>(null);
  const [isApproving, startApproveTransition] = useTransition();
  const [approveOnboardingTarget, setApproveOnboardingTarget] = useState<Client | null>(null);
  const [isApprovingOnboarding, startApproveOnboardingTransition] = useTransition();

  // Stats
  const total = clients.length;
  const approved = clients.filter((c) => c.isApproved).length;
  const pending = clients.filter((c) => !c.isApproved).length;
  const withOnboarding = clients.filter(
    (c) => c.individualOnboarding || c.companyOnboarding
  ).length;

  // Filter
  const filtered = clients.filter((c) => {
    const matchSearch =
      !search ||
      `${c.firstName} ${c.lastName} ${c.email} ${c.phone} ${c.name}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "ALL" ||
      (statusFilter === "APPROVED" && c.isApproved) ||
      (statusFilter === "PENDING" && !c.isApproved) ||
      c.status === statusFilter;

    const matchOnboarding =
      onboardingFilter === "ALL" ||
      (onboardingFilter === "INDIVIDUAL" && !!c.individualOnboarding) ||
      (onboardingFilter === "COMPANY" && !!c.companyOnboarding) ||
      (onboardingFilter === "NONE" && !c.individualOnboarding && !c.companyOnboarding);

    return matchSearch && matchStatus && matchOnboarding;
  });

  function handleUpdated(updated: Client) {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setDetailTarget(updated);
  }

  function handleApprove() {
    if (!approveTarget) return;
    startApproveTransition(async () => {
      const result = await updateUserById(approveTarget.id, { isApproved: true, status: "ACTIVE" });
      if (result?.error) { toast.error(result.error); return; }
      toast.success(`${approveTarget.firstName} has been approved.`);
      setClients((prev) => prev.map((c) => c.id === approveTarget.id ? { ...c, isApproved: true, status: "ACTIVE" } : c));
      setApproveTarget(null);
    });
  }

  function handleApproveOnboarding() {
    if (!approveOnboardingTarget) return;
    startApproveOnboardingTransition(async () => {
      const onboarding = approveOnboardingTarget.individualOnboarding ?? approveOnboardingTarget.companyOnboarding;
      if (!onboarding) return;

      const result = approveOnboardingTarget.individualOnboarding
        ? await approveIndividualOnboarding(onboarding.id)
        : await approveCompanyOnboarding(onboarding.id);

      if (!result.success) { toast.error(result.error); return; }
      toast.success(`Onboarding for ${approveOnboardingTarget.firstName} has been approved.`);
      setClients((prev) => prev.map((c) => {
        if (c.id !== approveOnboardingTarget.id) return c;
        return {
          ...c,
          individualOnboarding: c.individualOnboarding ? { ...c.individualOnboarding, isApproved: true } : null,
          companyOnboarding: c.companyOnboarding ? { ...c.companyOnboarding, isApproved: true } : null,
        };
      }));
      setApproveOnboardingTarget(null);
    });
  }

  function handleDeleted(clientId: string) {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6 px-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and review all registered client accounts.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Clients", value: total, icon: Users, color: "text-primary" },
          { label: "Approved", value: approved, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Pending Approval", value: pending, icon: Clock, color: "text-amber-400" },
          { label: "Onboarded", value: withOnboarding, icon: FileText, color: "text-violet-400" },
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
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-muted/50 border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending Approval</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={onboardingFilter} onValueChange={setOnboardingFilter}>
            <SelectTrigger className="w-40 bg-muted/50 border-border">
              <SelectValue placeholder="Onboarding" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="INDIVIDUAL">Individual</SelectItem>
              <SelectItem value="COMPANY">Company</SelectItem>
              <SelectItem value="NONE">Not Onboarded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium pl-4">Client</TableHead>
              <TableHead className="text-muted-foreground font-medium">Portfolios</TableHead>
              <TableHead className="text-muted-foreground font-medium">Type</TableHead>
              <TableHead className="text-muted-foreground font-medium">Contact</TableHead>
              <TableHead className="text-muted-foreground font-medium">Onboarding</TableHead>
              <TableHead className="text-muted-foreground font-medium">Wallet</TableHead>
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
                      {search || statusFilter !== "ALL" || onboardingFilter !== "ALL"
                        ? "No clients match your filters."
                        : "No clients registered yet."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((client) => {
                const onboarding = client.individualOnboarding ?? client.companyOnboarding;
                const isCompany = !!client.companyOnboarding;

                return (
                  <TableRow
                    key={client.id}
                    className="border-border hover:bg-muted/30 cursor-pointer"
                    onClick={() => router.push(`/dashboard/users/clients/${client.id}`)}
                  >
                    {/* Client */}
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border shrink-0">
                          <AvatarImage src={client.imageUrl} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {initials(client.firstName, client.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-foreground text-sm truncate">
                              {client.firstName} {client.lastName}
                            </p>
                            {client.isApproved && (
                              <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(client.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs border gap-1",
                        isCompany
                          ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      )}>
                        {isCompany ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        {isCompany ? "Company" : "Individual"}
                      </Badge>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {client.email}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {client.phone}
                        </span>
                      </div>
                    </TableCell>

                    {/* Onboarding */}
                    <TableCell>
                      {onboarding ? (
                        <Badge variant="outline" className={cn("text-xs border",
                          onboarding.isApproved
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        )}>
                          {onboarding.isApproved ? "KYC Approved" : "Pending Review"}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not submitted</span>
                      )}
                    </TableCell>

                    {/* Wallet */}
                    <TableCell>
                      {client.masterWallet ? (
                        <div>
                          <p className="text-xs font-mono text-muted-foreground">
                            {client.masterWallet.accountNumber}
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {fmtCurrency(client.masterWallet.netAssetValue)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className={cn("text-xs font-medium border", STATUS_COLORS[client.status] ?? STATUS_COLORS.INACTIVE)}>
                          {client.status}
                        </Badge>
                        {!client.isApproved && (
                          <Badge variant="outline" className="text-xs border bg-amber-500/10 text-amber-400 border-amber-500/20">
                            Needs Approval
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                          onClick={() => setDeleteTarget(client)}
                          title="Delete client"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border w-44">
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => router.push(`/dashboard/users/clients/${client.id}`)}
                            >
                              <Eye className="h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            {!client.isApproved && (
                              <>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem
                                  className="gap-2 cursor-pointer text-primary focus:text-primary"
                                  onClick={() => setApproveTarget(client)}
                                >
                                  <BadgeCheck className="h-4 w-4" /> Approve
                                </DropdownMenuItem>
                              </>
                            )}
                            {onboarding && !onboarding.isApproved && (
                              <>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem
                                  className="gap-2 cursor-pointer text-emerald-500 focus:text-emerald-500"
                                  onClick={() => setApproveOnboardingTarget(client)}
                                >
                                  <ShieldCheck className="h-4 w-4" /> Approve Onboarding
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer text-red-500 focus:text-red-500"
                              onClick={() => setDeleteTarget(client)}
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          Showing {filtered.length} of {clients.length} clients
        </p>
      )}

      {/* Detail dialog */}
      <ClientDetailDialog
        open={!!detailTarget}
        client={detailTarget}
        onClose={() => setDetailTarget(null)}
        onUpdated={handleUpdated}
      />

      {/* Delete dialog */}
      <DeleteClientDialog
        open={!!deleteTarget}
        client={deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />

      {/* Approve onboarding confirm dialog */}
      <AlertDialog open={!!approveOnboardingTarget} onOpenChange={(v) => !v && setApproveOnboardingTarget(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              Approve Onboarding
            </AlertDialogTitle>
            <AlertDialogDescription>
              Approve KYC onboarding for{" "}
              <span className="font-semibold text-foreground">
                {approveOnboardingTarget?.firstName} {approveOnboardingTarget?.lastName}
              </span>
              ? Their onboarding status will be marked as <strong>KYC Approved</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isApprovingOnboarding} onClick={() => setApproveOnboardingTarget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleApproveOnboarding} disabled={isApprovingOnboarding} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
              {isApprovingOnboarding && <Loader2 className="h-4 w-4 animate-spin" />}
              Approve Onboarding
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve confirm dialog */}
      <AlertDialog open={!!approveTarget} onOpenChange={(v) => !v && setApproveTarget(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BadgeCheck className="h-4 w-4 text-primary" />
              </div>
              Approve Client Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Approve{" "}
              <span className="font-semibold text-foreground">
                {approveTarget?.firstName} {approveTarget?.lastName}
              </span>
              ? Their account status will be set to <strong>Active</strong> and they will be able to log in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isApproving} onClick={() => setApproveTarget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} disabled={isApproving} className="gap-2">
              {isApproving && <Loader2 className="h-4 w-4 animate-spin" />}
              Approve Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}