// app/admin/deposits/components/admin-deposits-content.tsx
"use client"

import { useState, useMemo, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  X,
  FileDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type Deposit, type DepositsAnalyticsData } from "@/actions/deposits"
import { useRouter } from "next/navigation"
import { DepositDetailsModal } from "./deposit-details-modal"
import { CreateDepositDialog } from "./create-deposit-dialog"
import { DepositReceipt } from "./deposit-receipt"
import { DepositsAnalytics } from "./deposits-analytics"
import { toast } from "sonner"
import { downloadReceiptPdf } from "@/lib/download-receipt"
import { downloadDepositsPdf } from "@/lib/generate-deposits-pdf"
import { DepositTrendChart } from "./deposit-trend-chart"

interface AdminDepositsContentProps {
  deposits:         Deposit[]
  analytics:        DepositsAnalyticsData | null
  adminId:          string
  adminName:        string
  canCreate?:       boolean
  restrictToTarget?: string
  onRefresh?:       () => void
}

export function AdminDepositsContent({ deposits, analytics, adminId, adminName, canCreate = true, restrictToTarget, onRefresh }: AdminDepositsContentProps) {
  const [searchQuery,     setSearchQuery]     = useState("")
  const [statusFilter,    setStatusFilter]    = useState<string>("all")
  const [typeFilter,      setTypeFilter]      = useState<string>("all")
  const [dateFrom,        setDateFrom]        = useState<string>("")
  const [dateTo,          setDateTo]          = useState<string>("")
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null)
  const [isModalOpen,     setIsModalOpen]     = useState(false)
  const [createOpen,      setCreateOpen]      = useState(false)
  const [page,            setPage]            = useState(1)
  const ITEMS_PER_PAGE = 15
  const router = useRouter()

  const hasDateRange = dateFrom || dateTo

  const filteredDeposits = useMemo(() => {
    return deposits.filter(deposit => {
      const q = searchQuery.toLowerCase()
      const accountNumber = (deposit.depositTarget === "MASTER"
        ? deposit.masterWallet?.accountNumber
        : deposit.portfolioWallet?.accountNumber) ?? ""
      const matchesSearch =
        deposit.transactionId?.toLowerCase().includes(q) ||
        deposit.user?.firstName?.toLowerCase().includes(q) ||
        deposit.user?.lastName?.toLowerCase().includes(q) ||
        deposit.user?.email?.toLowerCase().includes(q) ||
        accountNumber.toLowerCase().includes(q) ||
        deposit.id.toLowerCase().includes(q)

      const matchesStatus = statusFilter === "all" || deposit.transactionStatus === statusFilter
      const matchesType   = (restrictToTarget ? deposit.depositTarget === restrictToTarget
                              : typeFilter === "all" || deposit.depositTarget === typeFilter)

      const ds = (deposit.createdAt ?? "").slice(0, 10)
      const matchesFrom = !dateFrom || ds >= dateFrom
      const matchesTo   = !dateTo   || ds <= dateTo

      return matchesSearch && matchesStatus && matchesType && matchesFrom && matchesTo
    })
  }, [deposits, searchQuery, statusFilter, typeFilter, dateFrom, dateTo, restrictToTarget])

  const totalPages = Math.ceil(filteredDeposits.length / ITEMS_PER_PAGE)
  const paginatedDeposits = filteredDeposits.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const startIdx = (page - 1) * ITEMS_PER_PAGE + 1
  const endIdx = Math.min(page * ITEMS_PER_PAGE, filteredDeposits.length)

  useEffect(() => {
    setPage(1)
  }, [searchQuery, statusFilter, typeFilter, dateFrom, dateTo, deposits.length])

  const stats = useMemo(() => {
    const pending  = deposits.filter(d => d.transactionStatus === "PENDING")
    const approved = deposits.filter(d => d.transactionStatus === "APPROVED")
    const rejected = deposits.filter(d => d.transactionStatus === "REJECTED")
    const master     = deposits.filter(d => d.depositTarget === "MASTER")
    const allocation = deposits.filter(d => d.depositTarget === "ALLOCATION")
    return {
      total:           deposits.length,
      pending:         pending.length,
      approved:        approved.length,
      rejected:        rejected.length,
      masterCount:     master.length,
      allocationCount: allocation.length,
      totalAmount:     deposits.reduce((s, d) => s + d.amount, 0),
      approvedAmount:  approved.reduce((s, d) => s + d.amount, 0),
      pendingAmount:   pending.reduce((s, d)  => s + d.amount, 0),
    }
  }, [deposits])

  const handleViewDetails = (deposit: Deposit) => {
    setSelectedDeposit(deposit)
    setIsModalOpen(true)
  }

  const handleRefresh = () => { if (onRefresh) onRefresh(); else router.refresh(); }

  // ─── Export helpers ──────────────────────────────────────────────────────────

  function friendlyDate(iso: string) {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  }

  function rangePeriodLabel() {
    if (dateFrom && dateTo) return `${friendlyDate(dateFrom)} – ${friendlyDate(dateTo)}`;
    if (dateFrom) return `From ${friendlyDate(dateFrom)}`;
    if (dateTo)   return `Up to ${friendlyDate(dateTo)}`;
    return "";
  }

  function exportCurrentView() {
    const hasFilters = statusFilter !== "all" || typeFilter !== "all" || searchQuery || hasDateRange;
    const label = hasDateRange
      ? "Deposits — Date Range"
      : hasFilters ? "Deposits — Filtered View" : "Deposits — All Loaded";
    const sub = hasDateRange
      ? rangePeriodLabel()
      : `${filteredDeposits.length} deposit${filteredDeposits.length !== 1 ? "s" : ""} matching current filters`;
    downloadDepositsPdf({ label, period: sub, deposits: filteredDeposits });
  }

  function exportForRange() {
    if (!hasDateRange) return;
    downloadDepositsPdf({
      label:   "Deposits — Date Range",
      period:  rangePeriodLabel(),
      deposits: filteredDeposits,
    });
  }

  function exportByPeriod(period: "today" | "week" | "month") {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekStartStr = weekStart.toISOString().slice(0, 10);

    const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    let filtered: Deposit[];
    let label: string;
    let sub: string;

    if (period === "today") {
      filtered = deposits.filter(d => (d.createdAt ?? "").slice(0, 10) === todayStr);
      label = "Deposits — Today";
      sub = now.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
    } else if (period === "week") {
      filtered = deposits.filter(d => {
        const ds = (d.createdAt ?? "").slice(0, 10);
        return ds >= weekStartStr && ds <= todayStr;
      });
      label = "Deposits — This Week";
      sub = `${friendlyDate(weekStartStr)} – ${friendlyDate(todayStr)}`;
    } else {
      filtered = deposits.filter(d => (d.createdAt ?? "").slice(0, 10) >= monthStartStr);
      label = "Deposits — This Month";
      sub = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    }

    downloadDepositsPdf({ label, period: sub, deposits: filtered });
  }

  const handleDownloadReceipt = useCallback(async (deposit: Deposit, e: React.MouseEvent) => {
    e.stopPropagation()
    const el = document.getElementById(`receipt-${deposit.id}`)
    if (!el) { toast.error("Receipt not ready"); return }
    try {
      await downloadReceiptPdf(
        el,
        `GoldKach-Receipt-${deposit.id.slice(0, 8).toUpperCase()}.pdf`
      )
      toast.success("Receipt downloaded")
    } catch (err) {
      console.error("PDF error:", err)
      toast.error("Failed to generate receipt")
    }
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30"
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30"
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30"
      default:
        return "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Deposit Management</h1>
            <p className="text-slate-500 dark:text-slate-400">Review and manage all deposit requests</p>
          </div>
          <div className="flex gap-2">
            {canCreate && (
              <Button
                size="sm"
                onClick={() => setCreateOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Deposit
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <DropdownMenuLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Period
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => exportByPeriod("today")} className="gap-2 cursor-pointer">
                  <Download className="h-3.5 w-3.5 text-blue-500" /> Today
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportByPeriod("week")} className="gap-2 cursor-pointer">
                  <Download className="h-3.5 w-3.5 text-indigo-500" /> This Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportByPeriod("month")} className="gap-2 cursor-pointer">
                  <Download className="h-3.5 w-3.5 text-violet-500" /> This Month
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                <DropdownMenuLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Current View
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={exportCurrentView} className="gap-2 cursor-pointer">
                  <FileDown className="h-3.5 w-3.5 text-green-500" />
                  <span>Filtered view <span className="text-slate-400 text-xs">({filteredDeposits.length})</span></span>
                </DropdownMenuItem>
                {hasDateRange && (
                  <>
                    <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                    <DropdownMenuLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Date Range
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={exportForRange} className="gap-2 cursor-pointer">
                      <CalendarDays className="h-3.5 w-3.5 text-amber-500" />
                      <span className="truncate">{rangePeriodLabel()}</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Analytics */}
        {analytics && <DepositsAnalytics analytics={analytics} />}

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Total",            value: stats.total,           sub: `$${stats.totalAmount.toLocaleString()}`,    color: "text-slate-900 dark:text-white" },
            { label: "Master Deposits",  value: stats.masterCount,     sub: "External cash-in",                         color: "text-blue-600 dark:text-blue-400" },
            { label: "Allocations",      value: stats.allocationCount, sub: "Master → Portfolio",                       color: "text-purple-600 dark:text-purple-400" },
            { label: "Pending",          value: stats.pending,         sub: `$${stats.pendingAmount.toLocaleString()}`,  color: "text-yellow-600 dark:text-yellow-400" },
            { label: "Approved",         value: stats.approved,        sub: `$${stats.approvedAmount.toLocaleString()}`, color: "text-green-600 dark:text-green-400" },
            { label: "Rejected",         value: stats.rejected,        sub: `${stats.rejected} requests`,               color: "text-red-600 dark:text-red-400" },
          ].map((s) => (
            <Card key={s.label} className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{s.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trend Chart */}
        <DepositTrendChart deposits={deposits} />

        {/* Filters */}
        <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            {/* Search row — sits above other filters */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by transaction ID, name, email, or GK account number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Filter row: status, type, date range */}
          <div className="flex flex-col md:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              {!restrictToTarget && (
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-48 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="MASTER">Master (External)</SelectItem>
                    <SelectItem value="ALLOCATION">Allocation (Internal)</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {/* Date range: From */}
              <div className="relative flex items-center">
                <CalendarDays className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  title="From date"
                  className="pl-9 pr-3 h-10 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
                />
              </div>
              <span className="text-slate-400 text-sm hidden md:inline">to</span>
              {/* Date range: To */}
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  title="To date"
                  className="pl-3 pr-3 h-10 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
                />
              </div>
              {hasDateRange && (
                <button
                  onClick={() => { setDateFrom(""); setDateTo(""); }}
                  title="Clear date range"
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {hasDateRange && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {rangePeriodLabel()} — {filteredDeposits.length} deposit{filteredDeposits.length !== 1 ? "s" : ""}
                </p>
                <Button
                  size="sm"
                  onClick={exportForRange}
                  className="h-7 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FileDown className="h-3.5 w-3.5" />
                  Print Range
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deposits Table */}
        <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">
              Deposits ({filteredDeposits.length})
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Click on any deposit to view details and take action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredDeposits.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p>No deposits found</p>
                </div>
              ) : (
                paginatedDeposits.map((deposit) => (
                  <div
                    key={deposit.id}
                    className="relative flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(deposit)}
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3 min-w-0">
                      {/* Col 1-2: User (wider) */}
                      <div className="md:col-span-2 flex items-start gap-2.5 min-w-0">
                        <Avatar className="h-9 w-9 shrink-0 mt-0.5">
                          <AvatarImage
                            src={
                              (deposit.user as any)?.individualOnboarding?.passportPhotoUrl ||
                              (deposit.user as any)?.imageUrl ||
                              ""
                            }
                            alt={[deposit.user?.firstName, deposit.user?.lastName].filter(Boolean).join(" ") || ""}
                          />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold">
                            {[deposit.user?.firstName?.[0], deposit.user?.lastName?.[0]].filter(Boolean).join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-400 dark:text-slate-500">User</p>
                          <p className="text-sm text-slate-900 dark:text-white font-medium leading-snug">
                            {[deposit.user?.firstName, deposit.user?.lastName].filter(Boolean).join(" ") || "N/A"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{deposit.user?.email || ""}</p>
                          {(deposit.masterWallet?.accountNumber || deposit.portfolioWallet?.accountNumber) && (
                            <p className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                              {deposit.depositTarget === "MASTER"
                                ? deposit.masterWallet?.accountNumber
                                : deposit.portfolioWallet?.accountNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Col 2: Amount */}
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Amount</p>
                        <p className="text-slate-900 dark:text-white font-bold text-lg">
                          ${deposit.amount.toLocaleString()}
                        </p>
                      </div>

                      {/* Col 3: Transaction ID with Type + Date below */}
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Transaction ID</p>
                        <code className="text-slate-700 dark:text-white text-xs font-mono">
                          {deposit.transactionId || "N/A"}
                        </code>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <Badge
                            variant="outline"
                            className={
                              deposit.depositTarget === "MASTER"
                                ? "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30"
                                : "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30"
                            }
                          >
                            {deposit.depositTarget === "MASTER" ? "External" : "Allocation"}
                          </Badge>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {deposit.createdAt
                              ? new Date(deposit.createdAt).toLocaleDateString("en-UG", {
                                  day: "2-digit", month: "short", year: "numeric",
                                }) + " · " + new Date(deposit.createdAt).toLocaleTimeString("en-UG", {
                                  hour: "2-digit", minute: "2-digit",
                                })
                              : "—"}
                          </span>
                        </div>
                      </div>

                      {/* Col 4: Status */}
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Status</p>
                        <Badge variant="outline" className={getStatusBadge(deposit.transactionStatus)}>
                          {deposit.transactionStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="ml-4 flex items-center gap-1 shrink-0">
                      {deposit.transactionStatus === "APPROVED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 h-8"
                          onClick={(e) => handleDownloadReceipt(deposit, e)}
                        >
                          <Download className="h-3.5 w-3.5 mr-1" /> Receipt
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-900 dark:hover:text-white h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Hidden receipt for PDF generation */}
                    <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -1, pointerEvents: "none" }}>
                      <DepositReceipt id={`receipt-${deposit.id}`} deposit={deposit} staffName={adminName} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {deposits.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {startIdx}-{endIdx} of {filteredDeposits.length} deposits
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="h-7 w-7 p-0 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs text-slate-500 dark:text-slate-400 px-2">
                  {page} / {totalPages}
                </span>
                <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="h-7 w-7 p-0 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Deposit Dialog */}
      <CreateDepositDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        adminId={adminId}
        adminName={adminName}
        onSuccess={() => {
          setCreateOpen(false)
          handleRefresh()
        }}
      />

      {/* Details Modal */}
      {selectedDeposit && (
        <DepositDetailsModal
          deposit={selectedDeposit}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedDeposit(null)
          }}
          adminId={adminId}
          adminName={adminName}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  )
}
