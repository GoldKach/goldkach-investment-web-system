"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { format } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  Download,
  FileSpreadsheet,
  TrendingDown,
  TrendingUp,
  Wallet,
  Users,
  PieChart,
  Activity,
  DollarSign,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getComprehensiveReport,
  exportComprehensiveReport,
  ComprehensiveReportData,
} from "@/actions/financialReports";
import { toast } from "sonner";

export default function FinancialReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [report, setReport] = useState<ComprehensiveReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
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

    const filters: { startDate?: string; endDate?: string } = {};
    if (dateRange.from) filters.startDate = dateRange.from.toISOString();
    if (dateRange.to) filters.endDate = dateRange.to.toISOString();

    const result = await getComprehensiveReport(
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
      const filters: { startDate?: string; endDate?: string } = {};
      if (dateRange.from) filters.startDate = dateRange.from.toISOString();
      if (dateRange.to) filters.endDate = dateRange.to.toISOString();

      const result = await exportComprehensiveReport(
        Object.keys(filters).length > 0 ? filters : undefined
      );

      if (result.success && result.blob) {
        // Create download link
        const url = window.URL.createObjectURL(result.blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.filename || "financial_report.xlsx";
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

  const handleClearFilter = () => {
    setDateRange({ from: undefined, to: undefined });
    fetchReport();
  };

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

  const { financialSummary, walletMetrics, userMetrics, portfolioMetrics, keyInsights } = report;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of system financials
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Filter */}
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
            <PopoverContent className="w-auto p-0" align="end">
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
              <div className="flex justify-end gap-2 p-3 border-t">
                <Button variant="outline" size="sm" onClick={handleClearFilter}>
                  Clear
                </Button>
                <Button size="sm" onClick={handleApplyFilter}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={fetchReport}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button onClick={handleExport} disabled={exporting}>
            <Download className="mr-2 h-4 w-4" />
            {exporting ? "Exporting..." : "Export to Excel"}
          </Button>
        </div>
      </div>

      {/* Report Period Info */}
      <div className="text-sm text-muted-foreground">
        Report Period: {report.overview.reportPeriod.startDate} to{" "}
        {report.overview.reportPeriod.endDate} | Generated:{" "}
        {new Date(report.overview.generatedAt).toLocaleString()}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Net Cash Flow */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
            {financialSummary.netCashFlow.status === "POSITIVE" ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                financialSummary.netCashFlow.status === "POSITIVE"
                  ? "text-green-600"
                  : "text-red-600"
              )}
            >
              {financialSummary.netCashFlow.amountFormatted}
            </div>
            <Badge
              variant={
                financialSummary.netCashFlow.status === "POSITIVE"
                  ? "default"
                  : "destructive"
              }
              className="mt-2"
            >
              {financialSummary.netCashFlow.status}
            </Badge>
          </CardContent>
        </Card>

        {/* Total Deposits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {financialSummary.deposits.approvedFormatted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {financialSummary.deposits.approvedCount} approved of{" "}
              {financialSummary.deposits.count} total
            </p>
          </CardContent>
        </Card>

        {/* Total Withdrawals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {financialSummary.withdrawals.approvedFormatted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {financialSummary.withdrawals.approvedCount} approved of{" "}
              {financialSummary.withdrawals.count} total
            </p>
          </CardContent>
        </Card>

        {/* Total Fees */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialSummary.fees.totalFormatted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From all transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Wallets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletMetrics.totalWallets}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="default">{walletMetrics.activeWallets} Active</Badge>
              <Badge variant="secondary">{walletMetrics.inactiveWallets} Inactive</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userMetrics.totalUsers}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="default">{userMetrics.activeUsers} Active</Badge>
              <Badge variant="outline">{userMetrics.pendingUsers} Pending</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Portfolios */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioMetrics.totalPortfolioValueFormatted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {portfolioMetrics.totalUserPortfolios} user portfolios
            </p>
          </CardContent>
        </Card>

        {/* Wallet Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {walletMetrics.totalBalanceFormatted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              NAV: {walletMetrics.totalNetAssetValueFormatted}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      {keyInsights && keyInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {keyInsights.map((insight:any, index:any) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="inline-block w-2 h-2 mt-2 rounded-full bg-blue-500" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/dashboard/reports/deposits")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowDownIcon className="h-5 w-5 text-green-500" />
              Deposits Report
            </CardTitle>
            <CardDescription>
              Detailed deposits analysis and breakdown
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/dashboard/reports/withdrawals")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowUpIcon className="h-5 w-5 text-red-500" />
              Withdrawals Report
            </CardTitle>
            <CardDescription>
              Detailed withdrawals analysis by bank
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/dashboard/reports/wallets")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-500" />
              Wallets Report
            </CardTitle>
            <CardDescription>
              Wallet balances and fee analysis
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/dashboard/reports/trends")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Transaction Trends
            </CardTitle>
            <CardDescription>
              Daily, weekly, monthly trends
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Users by Role */}
      <Card>
        <CardHeader>
          <CardTitle>Users by Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {userMetrics.usersByRole.superAdmin}
              </div>
              <div className="text-sm text-muted-foreground">Super Admins</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {userMetrics.usersByRole.admin}
              </div>
              <div className="text-sm text-muted-foreground">Admins</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {userMetrics.usersByRole.manager}
              </div>
              <div className="text-sm text-muted-foreground">Managers</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {userMetrics.usersByRole.user}
              </div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
          </div>
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
          <Skeleton className="h-10 w-[280px]" />
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[150px]" />
              <Skeleton className="h-4 w-[100px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[150px]" />
              <Skeleton className="h-4 w-[100px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}