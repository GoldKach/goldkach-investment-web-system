"use client";

import { useState, useTransition, useCallback } from "react";
import {
  Search,
  Shield,
  ShieldCheck,
  ShieldX,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  Hash,
  FileDown,
} from "lucide-react";
import { AuditPdfDialog } from "./audit-pdf-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  AuditLogRow,
  AuditTransactionType,
  AuditTransactionStatus,
  ChainVerificationResult,
} from "@/actions/audit-logs";
import {
  listAuditLogs,
  verifyAuditChainIntegrity,
  getAuditLogExportUrl,
} from "@/actions/audit-logs";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const NAIROBI_TZ = "Africa/Nairobi";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: NAIROBI_TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function fmtAmount(v: number | null, currency = "USD") {
  if (v == null) return "—";
  return `${currency} ${v.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const TX_TYPE_LABELS: Record<AuditTransactionType, string> = {
  DEPOSIT_CREATED: "Deposit Created",
  DEPOSIT_APPROVED: "Deposit Approved",
  DEPOSIT_REJECTED: "Deposit Rejected",
  DEPOSIT_REVERSED: "Deposit Reversed",
  WITHDRAWAL_CREATED: "Withdrawal Created",
  WITHDRAWAL_APPROVED: "Withdrawal Approved",
  WITHDRAWAL_REJECTED: "Withdrawal Rejected",
  REDEMPTION_CREATED: "Redemption Created",
  REDEMPTION_APPROVED: "Redemption Approved",
  REDEMPTION_REJECTED: "Redemption Rejected",
  PORTFOLIO_ALLOCATION: "Portfolio Allocation",
  FEE_DEDUCTED: "Fee Deducted",
  CLOSE_PRICE_UPDATED: "Close Price Updated",
};

const TX_TYPE_COLOR: Record<AuditTransactionType, string> = {
  DEPOSIT_CREATED: "bg-blue-500/10 text-blue-500 border-blue-400/30",
  DEPOSIT_APPROVED: "bg-green-500/10 text-green-500 border-green-400/30",
  DEPOSIT_REJECTED: "bg-red-500/10 text-red-500 border-red-400/30",
  DEPOSIT_REVERSED: "bg-orange-500/10 text-orange-500 border-orange-400/30",
  WITHDRAWAL_CREATED: "bg-purple-500/10 text-purple-500 border-purple-400/30",
  WITHDRAWAL_APPROVED: "bg-emerald-500/10 text-emerald-600 border-emerald-400/30",
  WITHDRAWAL_REJECTED: "bg-red-500/10 text-red-500 border-red-400/30",
  REDEMPTION_CREATED: "bg-violet-500/10 text-violet-500 border-violet-400/30",
  REDEMPTION_APPROVED: "bg-teal-500/10 text-teal-600 border-teal-400/30",
  REDEMPTION_REJECTED: "bg-rose-500/10 text-rose-500 border-rose-400/30",
  PORTFOLIO_ALLOCATION: "bg-sky-500/10 text-sky-500 border-sky-400/30",
  FEE_DEDUCTED: "bg-amber-500/10 text-amber-600 border-amber-400/30",
  CLOSE_PRICE_UPDATED: "bg-slate-500/10 text-slate-500 border-slate-400/30",
};

const STATUS_COLOR: Record<AuditTransactionStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-400/30",
  APPROVED: "bg-green-500/10 text-green-600 border-green-400/30",
  REJECTED: "bg-red-500/10 text-red-500 border-red-400/30",
  REVERSED: "bg-orange-500/10 text-orange-600 border-orange-400/30",
};

const TX_TYPE_OPTIONS: AuditTransactionType[] = [
  "DEPOSIT_CREATED",
  "DEPOSIT_APPROVED",
  "DEPOSIT_REJECTED",
  "DEPOSIT_REVERSED",
  "WITHDRAWAL_CREATED",
  "WITHDRAWAL_APPROVED",
  "WITHDRAWAL_REJECTED",
  "REDEMPTION_CREATED",
  "REDEMPTION_APPROVED",
  "REDEMPTION_REJECTED",
  "PORTFOLIO_ALLOCATION",
  "FEE_DEDUCTED",
  "CLOSE_PRICE_UPDATED",
];

/* -------------------------------------------------------------------------- */
/*  Props                                                                       */
/* -------------------------------------------------------------------------- */

interface Props {
  initialRows: AuditLogRow[];
  initialTotal: number;
  initialTotalPages: number;
  initialError: string | null;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                   */
/* -------------------------------------------------------------------------- */

export function AuditLogsContent({
  initialRows,
  initialTotal,
  initialTotalPages,
  initialError,
}: Props) {
  const [rows, setRows] = useState<AuditLogRow[]>(initialRows);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AuditTransactionType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AuditTransactionStatus | "all">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [error, setError] = useState<string | null>(initialError);
  const [isPending, startTransition] = useTransition();

  const [verifyResult, setVerifyResult] = useState<ChainVerificationResult | null>(null);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyPending, startVerifyTransition] = useTransition();

  const [detailRow, setDetailRow] = useState<AuditLogRow | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);

  const fetchPage = useCallback(
    (targetPage: number, opts?: {
      search?: string;
      typeFilter?: AuditTransactionType | "all";
      statusFilter?: AuditTransactionStatus | "all";
      startDate?: string;
      endDate?: string;
    }) => {
      startTransition(async () => {
        const s = opts?.search ?? search;
        const tf = opts?.typeFilter ?? typeFilter;
        const sf = opts?.statusFilter ?? statusFilter;
        const sd = opts?.startDate ?? startDate;
        const ed = opts?.endDate ?? endDate;

        const res = await listAuditLogs({
          page: targetPage,
          pageSize: 50,
          search: s || undefined,
          transactionType: tf !== "all" ? tf : undefined,
          transactionStatus: sf !== "all" ? sf : undefined,
          startDate: sd || undefined,
          endDate: ed || undefined,
        });

        if (res.error) {
          setError(res.error);
        } else if (res.data) {
          setRows(res.data.rows);
          setTotal(res.data.total);
          setTotalPages(res.data.totalPages);
          setPage(targetPage);
          setError(null);
        }
      });
    },
    [search, typeFilter, statusFilter, startDate, endDate]
  );

  function applyFilters() {
    setPage(1);
    fetchPage(1);
  }

  function handleVerify() {
    startVerifyTransition(async () => {
      const res = await verifyAuditChainIntegrity();
      if (res.data) {
        setVerifyResult(res.data);
        setVerifyOpen(true);
      } else {
        setError(res.error);
      }
    });
  }

  async function handleExport() {
    const res = await getAuditLogExportUrl({
      search: search || undefined,
      transactionType: typeFilter !== "all" ? typeFilter : undefined,
      transactionStatus: statusFilter !== "all" ? statusFilter : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
    if (!res.data) return;
    try {
      const { url, token } = JSON.parse(res.data) as { url: string; token: string };
      // Fetch CSV with auth header and force download
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setError("Failed to download CSV export");
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Shield className="size-6 text-blue-500" />
            CMA Audit Log
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Tamper-evident, immutable transaction log — all timestamps in Africa/Nairobi (EAT)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleVerify}
            disabled={verifyPending}
            className="gap-2"
          >
            {verifyPending ? (
              <RefreshCw className="size-4 animate-spin" />
            ) : (
              <ShieldCheck className="size-4" />
            )}
            Verify Chain
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="size-4" />
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={() => setPdfOpen(true)}
            className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <FileDown className="size-4" />
            PDF Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Entries", value: total, color: "border-l-blue-500 text-blue-500" },
          {
            label: "Deposits",
            value: rows.filter((r) => r.transactionType.startsWith("DEPOSIT")).length,
            color: "border-l-green-500 text-green-500",
          },
          {
            label: "Withdrawals",
            value: rows.filter((r) =>
              r.transactionType.startsWith("WITHDRAWAL") ||
              r.transactionType.startsWith("REDEMPTION")
            ).length,
            color: "border-l-violet-500 text-violet-500",
          },
          {
            label: "Rejections",
            value: rows.filter((r) => r.transactionType.endsWith("REJECTED")).length,
            color: "border-l-red-500 text-red-500",
          },
        ].map((s) => (
          <Card key={s.label} className={`border-l-4 ${s.color}`}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-slate-400 uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color.split(" ")[1]}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Search user, email, tx ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
            </div>

            <Select
              value={typeFilter}
              onValueChange={(v) =>
                setTypeFilter(v as AuditTransactionType | "all")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {TX_TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {TX_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as AuditTransactionStatus | "all")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="REVERSED">Reversed</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={applyFilters} disabled={isPending} className="w-full">
              {isPending ? (
                <RefreshCw className="size-4 animate-spin mr-2" />
              ) : null}
              Apply
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">From</label>
              <Input
                type="date"
                className="w-40 text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">To</label>
              <Input
                type="date"
                className="w-40 text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {(search || typeFilter !== "all" || statusFilter !== "all" || startDate || endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                  setStartDate("");
                  setEndDate("");
                  setTimeout(() => fetchPage(1, {
                    search: "",
                    typeFilter: "all",
                    statusFilter: "all",
                    startDate: "",
                    endDate: "",
                  }), 0);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-500">
          <AlertTriangle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Audit Entries</CardTitle>
            <CardDescription className="text-xs">
              {total.toLocaleString()} total entries
            </CardDescription>
          </div>
          {isPending && <RefreshCw className="size-4 animate-spin text-slate-400" />}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Timestamp (EAT)</TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                      No audit log entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      onClick={() => setDetailRow(row)}
                    >
                      <TableCell className="text-xs text-slate-400 font-mono">
                        {row.sequence}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${TX_TYPE_COLOR[row.transactionType] ?? ""}`}
                        >
                          {TX_TYPE_LABELS[row.transactionType] ?? row.transactionType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${STATUS_COLOR[row.transactionStatus] ?? ""}`}
                        >
                          {row.transactionStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700 dark:text-slate-200">
                            {row.userName ?? "—"}
                          </span>
                          {row.userEmail && (
                            <span className="text-xs text-slate-400">{row.userEmail}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{row.performedByName ?? "—"}</span>
                          {row.performedByRole && (
                            <span className="text-xs text-slate-400">{row.performedByRole}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {fmtAmount(row.amount, row.currency)}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                        {fmtDate(row.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Info className="size-4 text-slate-300 hover:text-blue-500" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Page {page} of {totalPages} ({total.toLocaleString()} entries)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isPending}
              onClick={() => fetchPage(page - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isPending}
              onClick={() => fetchPage(page + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Chain Verification Modal */}
      <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-blue-500" />
              Chain Integrity Verification
            </DialogTitle>
          </DialogHeader>
          {verifyResult && (
            <div className="space-y-4">
              <div
                className={`rounded-lg p-4 flex items-start gap-3 ${
                  verifyResult.valid
                    ? "bg-green-500/10 border border-green-400/30"
                    : "bg-red-500/10 border border-red-400/30"
                }`}
              >
                {verifyResult.valid ? (
                  <CheckCircle2 className="size-5 text-green-500 mt-0.5 shrink-0" />
                ) : (
                  <ShieldX className="size-5 text-red-500 mt-0.5 shrink-0" />
                )}
                <div>
                  <p className={`font-semibold ${verifyResult.valid ? "text-green-600" : "text-red-500"}`}>
                    {verifyResult.valid ? "Chain Integrity: VALID" : "Chain Integrity: COMPROMISED"}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {verifyResult.valid
                      ? `All ${verifyResult.totalRows.toLocaleString()} rows verified — no tampering detected.`
                      : `Integrity failure detected at sequence ${verifyResult.firstBrokenSequence} (id: ${verifyResult.brokenAt}).`}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total rows verified</span>
                  <span className="font-mono font-semibold">{verifyResult.totalRows.toLocaleString()}</span>
                </div>
                {!verifyResult.valid && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-400">First broken sequence</span>
                      <span className="font-mono text-red-500">{verifyResult.firstBrokenSequence}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Broken row ID</span>
                      <span className="font-mono text-xs text-red-400 truncate max-w-[180px]">
                        {verifyResult.brokenAt}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Checked at</span>
                  <span className="text-xs">{fmtDate(verifyResult.checkedAt)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Row Detail Modal */}
      <Dialog open={!!detailRow} onOpenChange={(o) => !o && setDetailRow(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hash className="size-4 text-slate-400" />
              Audit Entry #{detailRow?.sequence}
            </DialogTitle>
          </DialogHeader>
          {detailRow && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Transaction Type">
                  <Badge
                    variant="outline"
                    className={`text-xs ${TX_TYPE_COLOR[detailRow.transactionType] ?? ""}`}
                  >
                    {TX_TYPE_LABELS[detailRow.transactionType]}
                  </Badge>
                </Field>
                <Field label="Status">
                  <Badge
                    variant="outline"
                    className={`text-xs ${STATUS_COLOR[detailRow.transactionStatus] ?? ""}`}
                  >
                    {detailRow.transactionStatus}
                  </Badge>
                </Field>
                <Field label="Client">{detailRow.userName ?? "—"}</Field>
                <Field label="Client Email">{detailRow.userEmail ?? "—"}</Field>
                <Field label="Performed By">{detailRow.performedByName ?? "—"}</Field>
                <Field label="Role">{detailRow.performedByRole ?? "—"}</Field>
                <Field label="Amount">{fmtAmount(detailRow.amount, detailRow.currency)}</Field>
                <Field label="Currency">{detailRow.currency}</Field>
                <Field label="Transaction ID" mono>
                  {detailRow.transactionId ?? "—"}
                </Field>
                <Field label="Timestamp (EAT)">{fmtDate(detailRow.createdAt)}</Field>
              </div>

              {detailRow.description && (
                <Field label="Description">{detailRow.description}</Field>
              )}

              {detailRow.ipAddress && (
                <Field label="IP Address" mono>{detailRow.ipAddress}</Field>
              )}

              <div className="border-t pt-3 space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Chain Hash
                </p>
                <Field label="Hash" mono breakAll>
                  {detailRow.hash}
                </Field>
                <Field label="Previous Hash" mono breakAll>
                  {detailRow.previousHash}
                </Field>
                <Field label="System Version">{detailRow.systemVersion}</Field>
              </div>

              {detailRow.metadata && (
                <div className="border-t pt-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Metadata
                  </p>
                  <pre className="rounded bg-slate-50 dark:bg-slate-800 p-3 text-xs overflow-auto max-h-40">
                    {JSON.stringify(detailRow.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Report Dialog */}
      <AuditPdfDialog
        open={pdfOpen}
        onOpenChange={setPdfOpen}
        generatedBy={undefined}
      />
    </div>
  );
}

function Field({
  label,
  children,
  mono = false,
  breakAll = false,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
  breakAll?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-slate-400">{label}</p>
      <p
        className={`text-slate-700 dark:text-slate-200 ${mono ? "font-mono text-xs" : ""} ${breakAll ? "break-all" : ""}`}
      >
        {children}
      </p>
    </div>
  );
}
