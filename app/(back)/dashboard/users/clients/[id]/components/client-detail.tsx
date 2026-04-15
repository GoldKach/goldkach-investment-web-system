"use client";

import { useState, useTransition, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Mail, Phone, Calendar, Edit2, Activity, Loader2, Check, DollarSign, FileText, Eye, Download, ChevronDown, ChevronUp
} from "lucide-react";
import { updateUserById } from "@/actions/auth";
import { createDeposit } from "@/actions/deposits";
import { UserDetailPreview } from "@/components/user/user-detail-view";
import type { PortfolioSummary } from "@/actions/portfolio-summary";
import { generatePerformanceReportPDF } from "@/components/front-end/generate-report-pdf";

const fmt = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

type UserForDashboard = {
  id: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  imageUrl?: string | null;
  status?: string | null;
  isApproved?: boolean | null;
  emailVerified?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  wallet?: any | null;
  masterWallet?: any | null;
  deposits?: any[] | null;
  withdrawals?: any[] | null;
  entityOnboarding?: any | null;
  userPortfolios?: Array<{ id: string; customName: string; portfolio?: { name: string } | null }> | null;
};

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  { value: "INACTIVE", label: "Inactive", color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  { value: "PENDING", label: "Pending", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  { value: "SUSPENDED", label: "Suspended", color: "bg-red-500/15 text-red-400 border-red-500/20" },
];

interface DepositFeeSummary {
  totalBankCost: number;
  totalTransactionCost: number;
  totalCashAtBank: number;
  totalFees: number;
  depositCount: number;
}

export function ClientDetail({
  user: initialUser,
  portfolioSummary,
  reports = {},
  portfolios = [],
  depositFeeSummary,
}: {
  user: UserForDashboard;
  portfolioSummary?: PortfolioSummary | null;
  reports?: Record<string, any[]>;
  portfolios?: Array<{ id: string; customName: string; portfolio?: { name: string } | null }>;
  depositFeeSummary?: DepositFeeSummary | null;
}) {
  const [user, setUser] = useState(initialUser);
  const [isPending, startTransition] = useTransition();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [expandedPortfolios, setExpandedPortfolios] = useState<Set<string>>(new Set());
  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loadingReports, setLoadingReports] = useState<Set<string>>(new Set());
  const [filteredReports, setFilteredReports] = useState<Record<string, any[]>>(reports ?? {});
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
  });

  // Status form state
  const [newStatus, setNewStatus] = useState(user.status || "ACTIVE");

  // Deposit form state
  const [depositForm, setDepositForm] = useState({
    portfolioId: user.userPortfolios?.[0]?.id || "",
    amount: "",
    description: "",
  });

  const displayName =
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "User";

  function handleEditChange(field: string, value: string) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSaveEdit() {
    startTransition(async () => {
      try {
        const result = await updateUserById(user.id, {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          phone: editForm.phone,
        });
        
        if (result?.error) {
          toast.error(result.error);
          return;
        }

        const updatedUser = {
          ...user,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          phone: editForm.phone,
          name: [editForm.firstName, editForm.lastName].filter(Boolean).join(" "),
        };

        setUser(updatedUser);
        setEditModalOpen(false);
        toast.success("Client information updated successfully");
      } catch (error) {
        toast.error("Failed to update client information");
      }
    });
  }

  function handleChangeStatus() {
    startTransition(async () => {
      try {
        const result = await updateUserById(user.id, {
          status: newStatus as any,
        });

        if (result?.error) {
          toast.error(result.error);
          setStatusModalOpen(false);
          return;
        }

        setUser((prev) => ({
          ...prev,
          status: newStatus,
        }));
        setStatusModalOpen(false);
        toast.success(`Account status changed to ${newStatus}`);
      } catch (error) {
        toast.error("Failed to change account status");
      }
    });
  }

  function handleRequestDeposit() {
    if (!depositForm.portfolioId) {
      toast.error("Please select a portfolio");
      return;
    }

    if (!depositForm.amount || isNaN(Number(depositForm.amount)) || Number(depositForm.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createDeposit({
          userId: user.id,
          userPortfolioId: depositForm.portfolioId,
          amount: Number(depositForm.amount),
          description: depositForm.description || `Deposit initiated by admin for ${displayName}`,
        });

        if (!result.success) {
          toast.error(result.error || "Failed to create deposit request");
          return;
        }

        toast.success(`Deposit request created for ${displayName} - Amount: ${depositForm.amount}`);
        setDepositModalOpen(false);
        setDepositForm({
          portfolioId: user.userPortfolios?.[0]?.id || "",
          amount: "",
          description: "",
        });
      } catch (error) {
        toast.error("Failed to create deposit request");
      }
    });
  }

  const filterReportsByDate = async () => {
    if (!selectedDate) {
      setFilteredReports(reports ?? {});
      return;
    }

    setLoadingReports(new Set(portfolios.map((p) => p.id)));
    
    try {
      const dateParams = {
        startDate: new Date(selectedDate + "T00:00:00.000Z").toISOString(),
        endDate: new Date(selectedDate + "T23:59:59.999Z").toISOString(),
      };

      const results: Record<string, any[]> = {};
      
      for (const portfolio of portfolios) {
        const { listPerformanceReports } = await import("@/actions/portfolioPerformanceReports");
        const res = await listPerformanceReports({ 
          userPortfolioId: portfolio.id, 
          period: "daily",
          ...dateParams
        });
        if (res.success && res.data) {
          results[portfolio.id] = [...res.data].sort(
            (a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
          );
        }
      }
      
      setFilteredReports(results);
    } catch (error) {
      toast.error("Failed to filter reports");
    } finally {
      setLoadingReports(new Set());
    }
  };

  const statusOption = STATUS_OPTIONS.find((s) => s.value === user.status);

  const togglePortfolio = useCallback((portfolioId: string) => {
    setExpandedPortfolios((prev) => {
      const s = new Set(prev);
      if (s.has(portfolioId)) { s.delete(portfolioId); return s; }
      s.add(portfolioId);
      return s;
    });
  }, []);

  const handleView = async (report: any, portfolio: any) => {
    setGeneratingPdf(report.id);
    try {
      const enrichedReport = {
        ...report,
        userPortfolio: {
          ...(report.userPortfolio ?? {
            id: report.userPortfolioId,
            portfolioId: portfolio.portfolio?.id,
            customName: portfolio.customName,
          }),
          portfolio: portfolio.portfolio,
          userAssets: portfolio.userAssets ?? [],
        },
      };
      const doc = await generatePerformanceReportPDF(enrichedReport, user, displayName, depositFeeSummary ?? undefined);
      window.open(URL.createObjectURL(doc.output("blob")), "_blank");
    } finally {
      setGeneratingPdf(null);
    }
  };

  const handleDownload = async (report: any, portfolio: any) => {
    setGeneratingPdf(report.id);
    try {
      const enrichedReport = {
        ...report,
        userPortfolio: {
          ...(report.userPortfolio ?? {
            id: report.userPortfolioId,
            portfolioId: portfolio.portfolio?.id,
            customName: portfolio.customName,
          }),
          portfolio: portfolio.portfolio,
          userAssets: portfolio.userAssets ?? [],
        },
      };
      const doc = await generatePerformanceReportPDF(enrichedReport, user, displayName, depositFeeSummary ?? undefined);
      doc.save(`portfolio-report-${displayName.replace(/\s+/g, "-")}-${report.reportDate.split("T")[0]}.pdf`);
    } finally {
      setGeneratingPdf(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Card */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-2 border-border">
                <AvatarImage src={user.imageUrl || ""} alt={displayName} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                  {(user.firstName?.[0] ?? "").toUpperCase()}
                  {(user.lastName?.[0] ?? "").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{displayName}</CardTitle>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge
                    variant="outline"
                    className={
                      statusOption
                        ? `border ${statusOption.color}`
                        : "border-border"
                    }
                  >
                    {user.status || "ACTIVE"}
                  </Badge>
                  {user.isApproved && (
                    <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                      Verified
                    </Badge>
                  )}
                  {user.emailVerified ? (
                    <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-400">
                      Email Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-500/20 bg-amber-500/10 text-amber-400">
                      Email Unverified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setEditModalOpen(true)}
                className="gap-2"
                variant="outline"
              >
                <Edit2 className="h-4 w-4" />
                Edit Info
              </Button>
              <Button
                onClick={() => setStatusModalOpen(true)}
                className="gap-2"
                variant="outline"
              >
                <Activity className="h-4 w-4" />
                Change Status
              </Button>
              {user.userPortfolios && user.userPortfolios.length > 0 && (
                <Button
                  onClick={() => setDepositModalOpen(true)}
                  className="gap-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20"
                  variant="outline"
                >
                  <DollarSign className="h-4 w-4" />
                  Request Deposit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-border" />

        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email
              </p>
              <p className="text-sm font-medium text-foreground">{user.email || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> Phone
              </p>
              <p className="text-sm font-medium text-foreground">{user.phone || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Joined
              </p>
              <p className="text-sm font-medium text-foreground">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-sm font-medium text-foreground">
                {user.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Detail Preview */}
      <UserDetailPreview portfolioSummary={portfolioSummary} user={(() => {
        const individual = (user as any).individualOnboarding;
        const company = (user as any).companyOnboarding;
        const entityOnboarding =
          user.entityOnboarding ||
          (individual ? { ...individual, entityType: "individual", sourceOfWealth: individual.sourceOfIncome } : null) ||
          (company    ? { ...company,    entityType: "company",    sourceOfWealth: company.sourceOfIncome    } : null) ||
          null;
        return { ...user, entityOnboarding };
      })()} />

      {/* Performance Reports Section */}
      {portfolios.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Performance Reports
              </CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-40 text-sm h-8"
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={filterReportsByDate}
                  disabled={!selectedDate || loadingReports.size > 0}
                  className="h-8 gap-1"
                >
                  {loadingReports.size > 0 ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Filter"
                  )}
                </Button>
                {selectedDate && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      setSelectedDate("");
                      setFilteredReports(reports ?? {});
                    }}
                    className="h-8 text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {portfolios.map((portfolio) => {
              const isExpanded = expandedPortfolios.has(portfolio.id);
              const portfolioReports = (filteredReports ?? {})[portfolio.id] ?? [];
              const latestReport = portfolioReports[0];

              return (
                <div key={portfolio.id} className="rounded-lg border border-border/60 overflow-hidden">
                  <div
                    className="flex items-center gap-3 p-3 bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => togglePortfolio(portfolio.id)}
                  >
                    <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{portfolio.customName}</p>
                      <p className="text-xs text-muted-foreground">{portfolio.portfolio?.name}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-xs">
                      {latestReport && (
                        <>
                          <span className="text-muted-foreground">
                            NAV: <span className="font-semibold text-blue-500">{fmt(latestReport.netAssetValue)}</span>
                          </span>
                          <span className={latestReport.totalLossGain >= 0 ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                            {latestReport.totalLossGain >= 0 ? "+" : ""}{latestReport.totalLossGain.toFixed(2)}
                          </span>
                          <span className={latestReport.totalPercentage >= 0 ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                            {latestReport.totalPercentage >= 0 ? "+" : ""}{latestReport.totalPercentage.toFixed(2)}%
                          </span>
                        </>
                      )}
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border/60">
                      {portfolioReports.length === 0 ? (
                        <p className="px-4 py-4 text-xs text-muted-foreground italic">
                          No reports generated yet.
                        </p>
                      ) : (
                        <div className="divide-y divide-border/40">
                          {portfolioReports.map((report: any) => {
                            const pos = report.totalLossGain >= 0;
                            const isGen = generatingPdf === report.id;
                            return (
                              <div key={report.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/10 flex-wrap">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold">{fmtDate(report.reportDate)}</p>
                                  <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                                    <span>NAV: <span className="text-blue-500 font-medium">{fmt(report.netAssetValue)}</span></span>
                                    <span>Close: <span className="font-medium">{fmt(report.totalCloseValue)}</span></span>
                                    <span className={`font-medium ${pos ? "text-green-600" : "text-red-500"}`}>{fmt(report.totalLossGain)}</span>
                                    <span className={`font-medium ${pos ? "text-green-600" : "text-red-500"}`}>
                                      {report.totalPercentage >= 0 ? "+" : ""}{report.totalPercentage.toFixed(2)}%
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <Button size="sm" variant="outline" onClick={() => handleView(report, portfolio)} disabled={isGen} className="gap-1.5 text-xs h-7">
                                    {isGen ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />}
                                    View
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleDownload(report, portfolio)} disabled={isGen} className="gap-1.5 text-xs h-7">
                                    {isGen ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                                    PDF
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit Client Information</DialogTitle>
            <DialogDescription>
              Update the client's personal information below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={editForm.firstName}
                  onChange={(e) => handleEditChange("firstName", e.target.value)}
                  className="bg-muted/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={editForm.lastName}
                  onChange={(e) => handleEditChange("lastName", e.target.value)}
                  className="bg-muted/50 border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={editForm.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
                className="bg-muted/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Phone number"
                value={editForm.phone}
                onChange={(e) => handleEditChange("phone", e.target.value)}
                className="bg-muted/50 border-border"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isPending}
              className="gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deposit Request Modal */}
      <Dialog open={depositModalOpen} onOpenChange={setDepositModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              Request Deposit for {displayName}
            </DialogTitle>
            <DialogDescription>
              Create a deposit request for this client. The deposit will be initiated by admin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio">Select Portfolio</Label>
              <Select value={depositForm.portfolioId} onValueChange={(value) => setDepositForm({ ...depositForm, portfolioId: value })}>
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Select a portfolio" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {user.userPortfolios?.map((portfolio) => (
                    <SelectItem key={portfolio.id} value={portfolio.id}>
                      {portfolio.customName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Deposit Amount (UGX)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={depositForm.amount}
                onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                className="bg-muted/50 border-border"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Add notes about this deposit..."
                value={depositForm.description}
                onChange={(e) => setDepositForm({ ...depositForm, description: e.target.value })}
                className="bg-muted/50 border-border"
              />
            </div>

            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
              <p className="text-xs text-emerald-400 flex items-center gap-2">
                <FileText className="h-3 w-3" />
                This deposit will be tracked with the initiating admin's information
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDepositModalOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRequestDeposit}
              disabled={isPending}
              className="gap-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Deposit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Modal */}
      <AlertDialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              Change Account Status
            </AlertDialogTitle>
            <AlertDialogDescription>
              Select a new status for {displayName}'s account. This will affect their access and visibility.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Account Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 border border-border">
              <p className="text-xs text-muted-foreground">Current Status</p>
              <Badge variant="outline" className={statusOption ? `border ${statusOption.color}` : ""}>
                {user.status || "ACTIVE"}
              </Badge>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleChangeStatus}
              disabled={isPending || newStatus === user.status}
              className="gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {newStatus === user.status ? "No Change" : "Change Status"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
