"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  CalendarIcon,
  Download,
  RefreshCw,
  Search,
  ArrowDownIcon,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getDepositsReport,
  exportDepositsReport,
  DepositsReportData,
  TransactionStatus,
} from "@/actions/financialReports";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const PIE_COLORS = ["#22c55e", "#eab308", "#ef4444"];

export default function DepositsReportPage() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [report, setReport] = useState<DepositsReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "ALL">("ALL");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    const filters: any = {};
    if (dateRange.from) filters.startDate = dateRange.from.toISOString();
    if (dateRange.to) filters.endDate = dateRange.to.toISOString();
    if (statusFilter !== "ALL") filters.status = statusFilter;

    const result = await getDepositsReport(
      Object.keys(filters).length > 0 ? filters : undefined
    );

    if (result.success && result.data) {
      setReport(result.data);
    } else {
      setError(result.error || "Failed to load report");
      toast.error(result.error || "Failed to load report");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const filters: any = {};
      if (dateRange.from) filters.startDate = dateRange.from.toISOString();
      if (dateRange.to) filters.endDate = dateRange.to.toISOString();
      if (statusFilter !== "ALL") filters.status = statusFilter;

      const result = await exportDepositsReport(
        Object.keys(filters).length > 0 ? filters : undefined
      );

      if (result.success && result.blob) {
        const url = window.URL.createObjectURL(result.blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.filename || "deposits_report.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("Report exported successfully");
      } else {
        toast.error(result.error || "Failed to export report");
      }
    } catch (err) {
      toast.error("Failed to export report");
    }
    setExporting(false);
  };

  const handleApplyFilter = () => {
    fetchReport();
  };

  // Filter deposits by search term
  const filteredDeposits = report?.deposits.filter((deposit) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      deposit.user.firstName.toLowerCase().includes(term) ||
      deposit.user.lastName.toLowerCase().includes(term) ||
      deposit.user.email.toLowerCase().includes(term) ||
      deposit.user.phone.includes(term) ||
      deposit.referenceNo?.toLowerCase().includes(term) ||
      deposit.transactionId?.toLowerCase().includes(term)
    );
  });

  // Prepare chart data
  const statusChartData = report
    ? [
        { name: "Approved", value: report.summary.approved.count, amount: report.summary.approved.amount },
        { name: "Pending", value: report.summary.pending.count, amount: report.summary.pending.amount },
        { name: "Rejected", value: report.summary.rejected.count, amount: report.summary.rejected.amount },
      ]
    : [];

  const methodChartData = report
    ? Object.entries(report.byMethod).map(([method, data]) => ({
        method,
        count: data.count,
        amount: data.amount,
      }))
    : [];

  const dailyChartData = report
    ? Object.entries(report.dailyBreakdown)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-14) // Last 14 days
        .map(([date, data]) => ({
          date: format(new Date(date), "MMM dd"),
          count: data.count,
          amount: data.amount,
        }))
    : [];

  if (loading) {
    return <ReportSkeleton />;
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold">Failed to Load Report</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchReport}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ArrowDownIcon className="h-8 w-8 text-green-500" />
            Deposits Report
          </h1>
          <p className="text-muted-foreground">
            Detailed analysis of all deposit transactions
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={fetchReport}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleExport} disabled={exporting}>
            <Download className="mr-2 h-4 w-4" />
            {exporting ? "Exporting..." : "Export Excel"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Select date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) =>
                    setDateRange({ from: range?.from, to: range?.to })
                  }
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as TransactionStatus | "ALL")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleApplyFilter}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.summary.totalCount}</div>
            <p className="text-xs text-muted-foreground">
              {report.summary.totalAmountFormatted}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {report.summary.approved.count}
            </div>
            <p className="text-xs text-muted-foreground">
              UGX {report.summary.approved.amount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {report.summary.pending.count}
            </div>
            <p className="text-xs text-muted-foreground">
              UGX {report.summary.pending.amount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {report.summary.rejected.count}
            </div>
            <p className="text-xs text-muted-foreground">
              UGX {report.summary.rejected.amount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Deposits by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `Count: ${value}, Amount: UGX ${props.payload.amount.toLocaleString()}`,
                      name,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Deposits (Last 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "count"
                        ? `${value} deposits`
                        : `UGX ${Number(value).toLocaleString()}`,
                      name === "count" ? "Count" : "Amount",
                    ]}
                  />
                  <Bar dataKey="count" fill="#22c55e" name="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deposits by Method */}
      {methodChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Deposits by Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              {methodChartData.map((item) => (
                <div
                  key={item.method}
                  className="text-center p-4 bg-muted rounded-lg"
                >
                  <div className="text-lg font-bold">{item.count}</div>
                  <div className="text-sm text-muted-foreground">{item.method}</div>
                  <div className="text-xs text-green-600">
                    UGX {item.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deposits Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Deposit Transactions</CardTitle>
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Approved By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeposits && filteredDeposits.length > 0 ? (
                  filteredDeposits.slice(0, 50).map((deposit) => (
                    <TableRow key={deposit.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(deposit.createdAt), "MMM dd, yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {deposit.user.firstName} {deposit.user.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {deposit.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        UGX {deposit.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{deposit.method || "N/A"}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {deposit.referenceNo || deposit.transactionId || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            STATUS_COLORS[deposit.transactionStatus]
                          )}
                        >
                          {deposit.transactionStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{deposit.ApprovedBy || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No deposits found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {filteredDeposits && filteredDeposits.length > 50 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Showing 50 of {filteredDeposits.length} deposits. Export to Excel for full data.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>
      <Skeleton className="h-[100px] w-full" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[100px]" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[350px]" />
        <Skeleton className="h-[350px]" />
      </div>
      <Skeleton className="h-[400px]" />
    </div>
  );
}