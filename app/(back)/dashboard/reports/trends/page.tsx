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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowUpIcon,
  ArrowDownIcon,
  Activity,
  Calendar,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getTransactionTrends,
  TrendsReportData,
} from "@/actions/financialReports";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
} from "recharts";

type PeriodType = "daily" | "weekly" | "monthly";

export default function TransactionTrendsPage() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<TrendsReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodType>("daily");
  const [limit, setLimit] = useState("30");

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    const result = await getTransactionTrends({
      period,
      limit: parseInt(limit, 10),
    });

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

  const handleApplyFilter = () => {
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

  const { trends, statistics } = report;

  // Format chart data
  const chartData = trends.map((t) => ({
    ...t,
    netFlow: t.netFlow,
    deposits: t.deposits,
    withdrawals: t.withdrawals,
  }));

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            Transaction Trends
          </h1>
          <p className="text-muted-foreground">
            Analyze deposit and withdrawal patterns over time
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={fetchReport}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
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
            {/* Period Filter */}
            <Select
              value={period}
              onValueChange={(value) => setPeriod(value as PeriodType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

            {/* Limit */}
            <Select value={limit} onValueChange={setLimit}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="60">Last 60 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleApplyFilter}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              UGX {statistics.totalDeposits.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: UGX {Math.round(statistics.averageDeposits).toLocaleString()}/day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              UGX {statistics.totalWithdrawals.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: UGX {Math.round(statistics.averageWithdrawals).toLocaleString()}/day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
            {statistics.netFlow >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                statistics.netFlow >= 0 ? "text-green-600" : "text-red-600"
              )}
            >
              UGX {Math.abs(statistics.netFlow).toLocaleString()}
            </div>
            <Badge
              variant={statistics.netFlow >= 0 ? "default" : "destructive"}
              className="mt-1"
            >
              {statistics.netFlow >= 0 ? "POSITIVE" : "NEGATIVE"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Deposit Day</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {statistics.peakDepositDay ? (
              <>
                <div className="text-lg font-bold">
                  {statistics.peakDepositDay.date}
                </div>
                <p className="text-xs text-muted-foreground">
                  UGX {statistics.peakDepositDay.deposits.toLocaleString()} ({statistics.peakDepositDay.depositCount} txns)
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Withdrawal Day</CardTitle>
            <Calendar className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {statistics.peakWithdrawalDay ? (
              <>
                <div className="text-lg font-bold">
                  {statistics.peakWithdrawalDay.date}
                </div>
                <p className="text-xs text-muted-foreground">
                  UGX {statistics.peakWithdrawalDay.withdrawals.toLocaleString()} ({statistics.peakWithdrawalDay.withdrawalCount} txns)
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Transaction Volume Over Time
          </CardTitle>
          <CardDescription>
            Deposits vs Withdrawals ({period} view, {statistics.dataPoints} data points)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `UGX ${value.toLocaleString()}`,
                    name === "deposits" ? "Deposits" : name === "withdrawals" ? "Withdrawals" : "Net Flow",
                  ]}
                />
                <Legend />
                <Bar dataKey="deposits" fill="#22c55e" name="Deposits" />
                <Bar dataKey="withdrawals" fill="#ef4444" name="Withdrawals" />
                <Line
                  type="monotone"
                  dataKey="netFlow"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Net Flow"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Net Flow Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Net Cash Flow Trend
          </CardTitle>
          <CardDescription>
            Shows whether deposits exceed withdrawals over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  formatter={(value: number) => [`UGX ${value.toLocaleString()}`, "Net Flow"]}
                />
                <defs>
                  <linearGradient id="colorNetFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="netFlow"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorNetFlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Count Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Count</CardTitle>
          <CardDescription>
            Number of deposit and withdrawal transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="depositCount"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Deposit Count"
                  dot={{ fill: "#22c55e" }}
                />
                <Line
                  type="monotone"
                  dataKey="withdrawalCount"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Withdrawal Count"
                  dot={{ fill: "#ef4444" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Data</CardTitle>
          <CardDescription>
            Raw data for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border max-h-[400px] overflow-auto">
            <table className="w-full">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-right p-3 font-medium">Deposits</th>
                  <th className="text-right p-3 font-medium">Deposit Count</th>
                  <th className="text-right p-3 font-medium">Withdrawals</th>
                  <th className="text-right p-3 font-medium">Withdrawal Count</th>
                  <th className="text-right p-3 font-medium">Net Flow</th>
                </tr>
              </thead>
              <tbody>
                {trends.map((row, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3 font-medium">{row.date}</td>
                    <td className="p-3 text-right text-green-600">
                      UGX {row.deposits.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">{row.depositCount}</td>
                    <td className="p-3 text-right text-red-600">
                      UGX {row.withdrawals.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">{row.withdrawalCount}</td>
                    <td
                      className={cn(
                        "p-3 text-right font-medium",
                        row.netFlow >= 0 ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {row.netFlow >= 0 ? "+" : ""}UGX {row.netFlow.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <Skeleton className="h-[80px] w-full" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[100px]" />
        ))}
      </div>
      <Skeleton className="h-[450px]" />
      <Skeleton className="h-[350px]" />
      <Skeleton className="h-[350px]" />
    </div>
  );
}