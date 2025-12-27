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
import { Input } from "@/components/ui/input";
import {
  Download,
  RefreshCw,
  Search,
  Wallet,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Activity,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getWalletsReport,
  exportWalletsReport,
  WalletsReportData,
  AccountStatus,
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

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  CLOSED: "bg-red-100 text-red-800",
  FROZEN: "bg-blue-100 text-blue-800",
};

const PIE_COLORS = ["#22c55e", "#6b7280", "#3b82f6", "#ef4444"];

export default function WalletsReportPage() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [report, setReport] = useState<WalletsReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AccountStatus | "ALL">("ALL");

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    const result = await getWalletsReport(
      statusFilter !== "ALL" ? statusFilter : undefined
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
      const result = await exportWalletsReport(
        statusFilter !== "ALL" ? statusFilter : undefined
      );

      if (result.success && result.blob) {
        const url = window.URL.createObjectURL(result.blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.filename || "wallets_report.xlsx";
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

  // Filter wallets by search term
  const filteredWallets = report?.wallets.filter((wallet:any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      wallet.user.firstName.toLowerCase().includes(term) ||
      wallet.user.lastName.toLowerCase().includes(term) ||
      wallet.user.email.toLowerCase().includes(term) ||
      wallet.user.phone.includes(term) ||
      wallet.accountNumber.toLowerCase().includes(term)
    );
  });

  // Prepare chart data
  const statusChartData = report
    ? [
        { name: "Active", value: report.summary.byStatus.active.count, balance: report.summary.byStatus.active.totalBalance },
        { name: "Inactive", value: report.summary.byStatus.inactive.count, balance: report.summary.byStatus.inactive.totalBalance },
        { name: "Frozen", value: report.summary.byStatus.frozen.count, balance: report.summary.byStatus.frozen.totalBalance },
      ]
    : [];

  const topWalletsChartData = report?.topWallets.slice(0, 10).map((wallet:any) => ({
    name: `${wallet.user.firstName} ${wallet.user.lastName.charAt(0)}.`,
    balance: wallet.balance,
    nav: wallet.netAssetValue,
  })) || [];

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
            <Wallet className="h-8 w-8 text-blue-500" />
            Wallets Report
          </h1>
          <p className="text-muted-foreground">
            Overview of all user wallets and balances
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
            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as AccountStatus | "ALL")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="FROZEN">Frozen</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleApplyFilter}>Apply Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.summary.totalWallets}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="default">{report.summary.byStatus.active.count} Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {report.summary.totalBalanceFormatted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: UGX {Math.round(report.summary.averageBalance).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Asset Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {report.summary.totalNetAssetValueFormatted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Combined NAV
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Collected</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {report.summary.totalFeesCollectedFormatted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total fees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Wallets by Status</CardTitle>
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
                      `Count: ${value}, Balance: UGX ${props.payload.balance.toLocaleString()}`,
                      name,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Wallets Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top 10 Wallets by Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topWalletsChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis dataKey="name" type="category" fontSize={11} width={80} />
                  <Tooltip
                    formatter={(value) => [`UGX ${Number(value).toLocaleString()}`, "Balance"]}
                  />
                  <Bar dataKey="balance" fill="#3b82f6" name="Balance" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Wallets Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top Wallets Overview
          </CardTitle>
          <CardDescription>Highest balance wallets in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {report.topWallets.slice(0, 5).map((wallet:any, index:any) => (
              <div
                key={wallet.id}
                className={cn(
                  "p-4 rounded-lg border",
                  index === 0 && "bg-yellow-50 border-yellow-200",
                  index === 1 && "bg-gray-50 border-gray-200",
                  index === 2 && "bg-orange-50 border-orange-200"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold">#{index + 1}</span>
                  {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                </div>
                <div className="font-medium truncate">
                  {wallet.user.firstName} {wallet.user.lastName}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {wallet.accountNumber}
                </div>
                <div className="text-lg font-bold text-green-600 mt-2">
                  UGX {wallet.balance.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wallets Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Wallets</CardTitle>
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, account..."
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
                  <TableHead>Account Number</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Net Asset Value</TableHead>
                  <TableHead>Total Fees</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWallets && filteredWallets.length > 0 ? (
                  filteredWallets.slice(0, 50).map((wallet:any) => (
                    <TableRow key={wallet.id}>
                      <TableCell className="font-mono">
                        {wallet.accountNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {wallet.user.firstName} {wallet.user.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {wallet.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        UGX {wallet.balance.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-purple-600">
                        UGX {wallet.netAssetValue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-orange-600">
                        UGX {wallet.totalFees.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-green-600">
                            {wallet._count.deposits} dep
                          </Badge>
                          <Badge variant="outline" className="text-red-600">
                            {wallet._count.withdrawals} wth
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(STATUS_COLORS[wallet.status])}>
                          {wallet.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No wallets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {filteredWallets && filteredWallets.length > 50 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Showing 50 of {filteredWallets.length} wallets. Export to Excel for full data.
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
      <Skeleton className="h-[80px] w-full" />
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