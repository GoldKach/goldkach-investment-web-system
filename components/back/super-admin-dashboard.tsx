

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Area,
  AreaChart,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Legend,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  PieChartIcon,
  Activity,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
} from "lucide-react"
import { DashboardStats, DashboardGraphData } from "@/actions/dashboard"

interface AdminDashboardProps {
  stats?: DashboardStats;
  graphs?: DashboardGraphData;
}

export default function AdminDashboard({ stats, graphs }: AdminDashboardProps) {
  // Fallback to dummy data if stats not provided
  const data = stats || {
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    inactiveUsers: 0,
    totalPortfolios: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalTransactions: 0,
    totalAUM: 0,
    pendingDeposits: 0,
    approvedDeposits: 0,
    pendingWithdrawals: 0,
    approvedWithdrawals: 0,
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

  const kpiData = [
    {
      title: "Total Assets Under Management",
      value: formatCurrency(data.totalAUM),
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      description: "vs last quarter",
      gradient: "from-[#0089ff] to-[#302a5e]",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-[#0089ff] dark:text-blue-400",
    },
    {
      title: "Active Users",
      value: data.activeUsers,
      change: "+8.2%",
      trend: "up" as const,
      icon: Users,
      description: `${data.totalUsers} total`,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total User Portfolios",
      value: data.totalPortfolios,
      change: "+15.3%",
      trend: "up" as const,
      icon: PieChartIcon,
      description: "active portfolios",
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      title: "Platform Performance",
      value: "99.8%",
      change: "-0.1%",
      trend: "down" as const,
      icon: Activity,
      description: "uptime this month",
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  const netFlow = data.totalDeposits - data.totalWithdrawals;

  const transactionKpis = [
    {
      title: "Total Deposits",
      value: formatCurrency(data.totalDeposits),
      change: "+18.4%",
      trend: "up" as const,
      icon: ArrowUpRight,
      description: `${data.approvedDeposits} approved, ${data.pendingDeposits} pending`,
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      iconBg: "bg-gradient-to-br from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      glowColor: "shadow-emerald-500/20",
    },
    {
      title: "Total Withdrawals",
      value: formatCurrency(data.totalWithdrawals),
      change: "+5.2%",
      trend: "up" as const,
      icon: ArrowDownRight,
      description: `${data.approvedWithdrawals} approved, ${data.pendingWithdrawals} pending`,
      gradient: "from-rose-500 via-red-500 to-pink-500",
      iconBg: "bg-gradient-to-br from-rose-500/20 to-red-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      glowColor: "shadow-rose-500/20",
    },
    {
      title: "Total Transactions",
      value: formatNumber(data.totalTransactions),
      change: "+22.1%",
      trend: "up" as const,
      icon: ArrowRightLeft,
      description: "this month",
      gradient: "from-[#0089ff] via-blue-500 to-cyan-500",
      iconBg: "bg-gradient-to-br from-[#0089ff]/20 to-cyan-500/20",
      iconColor: "text-[#0089ff] dark:text-blue-400",
      glowColor: "shadow-blue-500/20",
    },
    {
      title: "Net Flow",
      value: formatCurrency(netFlow),
      change: netFlow >= 0 ? "+28.7%" : "-15.3%",
      trend: netFlow >= 0 ? ("up" as const) : ("down" as const),
      icon: Wallet,
      description: "deposits - withdrawals",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      iconBg: "bg-gradient-to-br from-violet-500/20 to-purple-500/20",
      iconColor: "text-violet-600 dark:text-violet-400",
      glowColor: "shadow-violet-500/20",
    },
  ];

  // Use real graph data when available, otherwise use calculated fallback
  const aumGrowthData = graphs?.monthlyTransactions.map(m => ({
    month: m.month,
    aum: m.aum,
    target: m.aum * 1.05,
    users: m.users,
  })) || [
    { month: "Jan", aum: data.totalAUM * 0.75, target: data.totalAUM * 0.80, users: Math.floor(data.totalUsers * 0.84) },
    { month: "Feb", aum: data.totalAUM * 0.81, target: data.totalAUM * 0.83, users: Math.floor(data.totalUsers * 0.87) },
    { month: "Mar", aum: data.totalAUM * 0.88, target: data.totalAUM * 0.88, users: Math.floor(data.totalUsers * 0.91) },
    { month: "Apr", aum: data.totalAUM * 0.92, target: data.totalAUM * 0.92, users: Math.floor(data.totalUsers * 0.95) },
    { month: "May", aum: data.totalAUM * 0.98, target: data.totalAUM * 0.96, users: Math.floor(data.totalUsers * 0.98) },
    { month: "Jun", aum: data.totalAUM, target: data.totalAUM, users: data.totalUsers },
  ];

  const userGrowthData = graphs?.userGrowth.map(m => ({
    month: m.month,
    newUsers: m.newUsers,
    activeUsers: m.activeUsers,
    churnRate: 2.0,
  })) || [
    { month: "Jan", newUsers: Math.floor(data.totalUsers * 0.062), activeUsers: Math.floor(data.activeUsers * 0.78), churnRate: 2.1 },
    { month: "Feb", newUsers: Math.floor(data.totalUsers * 0.071), activeUsers: Math.floor(data.activeUsers * 0.84), churnRate: 1.9 },
    { month: "Mar", newUsers: Math.floor(data.totalUsers * 0.064), activeUsers: Math.floor(data.activeUsers * 0.86), churnRate: 2.3 },
    { month: "Apr", newUsers: Math.floor(data.totalUsers * 0.077), activeUsers: Math.floor(data.activeUsers * 0.91), churnRate: 1.8 },
    { month: "May", newUsers: Math.floor(data.totalUsers * 0.069), activeUsers: Math.floor(data.activeUsers * 0.95), churnRate: 2.0 },
    { month: "Jun", newUsers: Math.floor(data.totalUsers * 0.075), activeUsers: data.activeUsers, churnRate: 1.7 },
  ];

  const portfolioPerformanceData = graphs?.portfolioPerformance || [
    { range: "< -10%", count: Math.floor(data.totalPortfolios * 0.05), color: "#dc2626" },
    { range: "-10% to -5%", count: Math.floor(data.totalPortfolios * 0.08), color: "#ea580c" },
    { range: "-5% to 0%", count: Math.floor(data.totalPortfolios * 0.15), color: "#d97706" },
    { range: "0% to 5%", count: Math.floor(data.totalPortfolios * 0.28), color: "#65a30d" },
    { range: "5% to 10%", count: Math.floor(data.totalPortfolios * 0.25), color: "#16a34a" },
    { range: "10% to 15%", count: Math.floor(data.totalPortfolios * 0.15), color: "#059669" },
    { range: "> 15%", count: Math.floor(data.totalPortfolios * 0.04), color: "#047857" },
  ];

  const transactionVolumeData = graphs?.monthlyTransactions || [
    { 
      month: "Jan", 
      deposits: Math.floor(data.totalDeposits * 0.14), 
      withdrawals: Math.floor(data.totalWithdrawals * 0.15), 
      transactions: Math.floor(data.totalTransactions * 0.15), 
      netFlow: Math.floor((data.totalDeposits - data.totalWithdrawals) * 0.14) 
    },
    { 
      month: "Feb", 
      deposits: Math.floor(data.totalDeposits * 0.16), 
      withdrawals: Math.floor(data.totalWithdrawals * 0.17), 
      transactions: Math.floor(data.totalTransactions * 0.16), 
      netFlow: Math.floor((data.totalDeposits - data.totalWithdrawals) * 0.16) 
    },
    { 
      month: "Mar", 
      deposits: Math.floor(data.totalDeposits * 0.15), 
      withdrawals: Math.floor(data.totalWithdrawals * 0.18), 
      transactions: Math.floor(data.totalTransactions * 0.15), 
      netFlow: Math.floor((data.totalDeposits - data.totalWithdrawals) * 0.14) 
    },
    { 
      month: "Apr", 
      deposits: Math.floor(data.totalDeposits * 0.17), 
      withdrawals: Math.floor(data.totalWithdrawals * 0.16), 
      transactions: Math.floor(data.totalTransactions * 0.17), 
      netFlow: Math.floor((data.totalDeposits - data.totalWithdrawals) * 0.18) 
    },
    { 
      month: "May", 
      deposits: Math.floor(data.totalDeposits * 0.18), 
      withdrawals: Math.floor(data.totalWithdrawals * 0.17), 
      transactions: Math.floor(data.totalTransactions * 0.18), 
      netFlow: Math.floor((data.totalDeposits - data.totalWithdrawals) * 0.19) 
    },
    { 
      month: "Jun", 
      deposits: Math.floor(data.totalDeposits * 0.20), 
      withdrawals: Math.floor(data.totalWithdrawals * 0.19), 
      transactions: Math.floor(data.totalTransactions * 0.21), 
      netFlow: Math.floor((data.totalDeposits - data.totalWithdrawals) * 0.20) 
    },
  ];

  const dailyTransactionData = [
    { day: "Mon", deposits: Math.floor(data.totalDeposits * 0.15), withdrawals: Math.floor(data.totalWithdrawals * 0.14), net: Math.floor(netFlow * 0.15), volume: Math.floor(data.totalTransactions * 0.15) },
    { day: "Tue", deposits: Math.floor(data.totalDeposits * 0.17), withdrawals: Math.floor(data.totalWithdrawals * 0.16), net: Math.floor(netFlow * 0.17), volume: Math.floor(data.totalTransactions * 0.17) },
    { day: "Wed", deposits: Math.floor(data.totalDeposits * 0.14), withdrawals: Math.floor(data.totalWithdrawals * 0.13), net: Math.floor(netFlow * 0.14), volume: Math.floor(data.totalTransactions * 0.14) },
    { day: "Thu", deposits: Math.floor(data.totalDeposits * 0.18), withdrawals: Math.floor(data.totalWithdrawals * 0.17), net: Math.floor(netFlow * 0.18), volume: Math.floor(data.totalTransactions * 0.19) },
    { day: "Fri", deposits: Math.floor(data.totalDeposits * 0.20), withdrawals: Math.floor(data.totalWithdrawals * 0.19), net: Math.floor(netFlow * 0.20), volume: Math.floor(data.totalTransactions * 0.22) },
    { day: "Sat", deposits: Math.floor(data.totalDeposits * 0.10), withdrawals: Math.floor(data.totalWithdrawals * 0.11), net: Math.floor(netFlow * 0.10), volume: Math.floor(data.totalTransactions * 0.10) },
    { day: "Sun", deposits: Math.floor(data.totalDeposits * 0.08), withdrawals: Math.floor(data.totalWithdrawals * 0.09), net: Math.floor(netFlow * 0.08), volume: Math.floor(data.totalTransactions * 0.08) },
  ];

  const transactionTypeData = [
    { name: "Deposits", value: data.totalDeposits, color: "#10b981", percentage: 68.2 },
    { name: "Withdrawals", value: data.totalWithdrawals, color: "#ef4444", percentage: 18.9 },
    { name: "Transfers", value: Math.floor(data.totalDeposits * 0.18), color: "#3b82f6", percentage: 12.6 },
    { name: "Fees", value: Math.floor(data.totalDeposits * 0.03), color: "#f59e0b", percentage: 1.9 },
  ];

  const transactionMethodData = [
    { method: "Bank Transfer", count: Math.floor(data.totalTransactions * 0.366), percentage: 36.6, avgAmount: 1850 },
    { method: "Credit Card", count: Math.floor(data.totalTransactions * 0.251), percentage: 25.1, avgAmount: 680 },
    { method: "Digital Wallet", count: Math.floor(data.totalTransactions * 0.232), percentage: 23.2, avgAmount: 420 },
    { method: "Wire Transfer", count: Math.floor(data.totalTransactions * 0.108), percentage: 10.8, avgAmount: 5200 },
    { method: "Crypto", count: Math.floor(data.totalTransactions * 0.044), percentage: 4.4, avgAmount: 2100 },
  ];

  const userStats = [
    { category: "Account Status", approved: data.activeUsers, pending: data.pendingUsers, rejected: Math.floor(data.totalUsers * 0.005) },
    { category: "KYC Verification", approved: Math.floor(data.activeUsers * 0.98), pending: Math.floor(data.totalUsers * 0.08), rejected: Math.floor(data.totalUsers * 0.01) },
    { category: "Two-Factor Auth", approved: Math.floor(data.activeUsers * 0.92), pending: Math.floor(data.totalUsers * 0.14), rejected: 0 },
  ];

  const recentActivity = [
    { type: "account_approval", message: `${data.approvedDeposits} new deposits approved today`, time: "2 hours ago", status: "success" },
    { type: "fund_update", message: `${data.totalPortfolios} portfolios updated`, time: "4 hours ago", status: "info" },
    { type: "system_alert", message: "High trading volume detected", time: "6 hours ago", status: "warning" },
    { type: "compliance", message: "Monthly compliance report generated", time: "1 day ago", status: "success" },
  ];

  const systemPerformanceData = [
    { time: "00:00", cpu: 45, memory: 62, network: 78, transactions: Math.floor(data.totalTransactions * 0.10) },
    { time: "04:00", cpu: 38, memory: 58, network: 65, transactions: Math.floor(data.totalTransactions * 0.07) },
    { time: "08:00", cpu: 72, memory: 71, network: 85, transactions: Math.floor(data.totalTransactions * 0.17) },
    { time: "12:00", cpu: 68, memory: 69, network: 82, transactions: Math.floor(data.totalTransactions * 0.16) },
    { time: "16:00", cpu: 75, memory: 73, network: 88, transactions: Math.floor(data.totalTransactions * 0.19) },
    { time: "20:00", cpu: 52, memory: 65, network: 75, transactions: Math.floor(data.totalTransactions * 0.13) },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600 dark:text-slate-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">GoldKach Admin</h1>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-slate-800 dark:text-slate-300">
              Super Admin
            </Badge>
          </div>
        </div>
      </header>

      <div className="bg-gray-50 dark:bg-slate-950 transition-colors">
        <div className="p-6 space-y-3">
          {/* Main KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => (
              <Card
                key={index}
                className="relative overflow-hidden bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 group cursor-pointer"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`}
                />

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-slate-200 transition-colors">
                    {kpi.title}
                  </CardTitle>
                  <div
                    className={`p-2.5 rounded-xl ${kpi.iconBg} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <kpi.icon className={`h-5 w-5 ${kpi.iconColor} transition-all duration-300`} />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2 transition-all duration-300 group-hover:scale-105">
                    {kpi.value}
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                        kpi.trend === "up" ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-rose-100 dark:bg-rose-900/30"
                      }`}
                    >
                      {kpi.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                      )}
                      <span
                        className={
                          kpi.trend === "up"
                            ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                            : "text-rose-600 dark:text-rose-400 font-semibold"
                        }
                      >
                        {kpi.change}
                      </span>
                    </div>
                    <span className="text-gray-500 dark:text-slate-400">{kpi.description}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Transaction KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {transactionKpis.map((kpi, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 group cursor-pointer`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-all duration-500`}
                />

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-slate-200 transition-colors">
                    {kpi.title}
                  </CardTitle>
                  <div
                    className={`p-3 rounded-xl ${kpi.iconBg} backdrop-blur-sm transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 shadow-lg`}
                  >
                    <kpi.icon className={`h-5 w-5 ${kpi.iconColor} transition-all duration-300`} />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-3 transition-all duration-300 group-hover:scale-105">
                    {kpi.value}
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 shadow-sm">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{kpi.change}</span>
                    </div>
                    <span className="text-gray-500 dark:text-slate-400 font-medium">{kpi.description}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-slate-100">
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-slate-100">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-slate-100">
              User Management
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-slate-100">
              System Activity
            </TabsTrigger>
            <TabsTrigger value="portfolios" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-slate-100">
              Portfolios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* AUM Growth Chart */}
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-slate-100">Assets Under Management Growth</CardTitle>
                <CardDescription className="text-gray-600 dark:text-slate-400">AUM growth vs targets and user acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={aumGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
                      <XAxis dataKey="month" className="text-gray-600 dark:text-slate-400" />
                      <YAxis yAxisId="left" className="text-gray-600 dark:text-slate-400" />
                      <YAxis yAxisId="right" orientation="right" className="text-gray-600 dark:text-slate-400" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
                      />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="aum" fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" name="AUM" />
                      <Line yAxisId="left" type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" name="Target" />
                      <Bar yAxisId="right" dataKey="users" fill="#10b981" name="Active Users" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-slate-100">User Growth & Engagement</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-slate-400">New users, active users, and churn rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
                        <XAxis dataKey="month" className="text-gray-600 dark:text-slate-400" />
                        <YAxis yAxisId="left" className="text-gray-600 dark:text-slate-400" />
                        <YAxis yAxisId="right" orientation="right" className="text-gray-600 dark:text-slate-400" />
                        <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                        <Bar yAxisId="left" dataKey="newUsers" fill="#3b82f6" name="New Users" />
                        <Line yAxisId="right" type="monotone" dataKey="churnRate" stroke="#ef4444" name="Churn Rate (%)" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Performance Distribution */}
              <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-slate-100">Portfolio Performance Distribution</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-slate-400">Distribution of portfolio returns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={portfolioPerformanceData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
                        <XAxis type="number" className="text-gray-600 dark:text-slate-400" />
                        <YAxis dataKey="range" type="category" className="text-gray-600 dark:text-slate-400" />
                        <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                        <Bar dataKey="count" name="Portfolios">
                          {portfolioPerformanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            {/* Transaction Volume Chart */}
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-slate-100">Transaction Volume & Net Flow Trends</CardTitle>
                <CardDescription className="text-gray-600 dark:text-slate-400">Monthly deposits, withdrawals, and net flow analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={transactionVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
                      <XAxis dataKey="month" className="text-gray-600 dark:text-slate-400" />
                      <YAxis yAxisId="left" className="text-gray-600 dark:text-slate-400" />
                      <YAxis yAxisId="right" orientation="right" className="text-gray-600 dark:text-slate-400" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="deposits" fill="#10b981" name="Deposits" />
                      <Bar yAxisId="left" dataKey="withdrawals" fill="#ef4444" name="Withdrawals" />
                      <Line yAxisId="left" type="monotone" dataKey="netFlow" stroke="#8b5cf6" strokeWidth={3} name="Net Flow" />
                      <Area yAxisId="right" type="monotone" dataKey="transactions" fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" name="Transaction Count" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Transaction Patterns */}
              <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-slate-100">Daily Transaction Patterns</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-slate-400">Weekly transaction volume and patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={dailyTransactionData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
                        <XAxis dataKey="day" className="text-gray-600 dark:text-slate-400" />
                        <YAxis yAxisId="left" className="text-gray-600 dark:text-slate-400" />
                        <YAxis yAxisId="right" orientation="right" className="text-gray-600 dark:text-slate-400" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
                        />
                        <Bar yAxisId="left" dataKey="deposits" fill="#10b981" name="Deposits" />
                        <Bar yAxisId="left" dataKey="withdrawals" fill="#ef4444" name="Withdrawals" />
                        <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#3b82f6" name="Transaction Volume" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Type Distribution */}
              <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-slate-100">Transaction Type Distribution</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-slate-400">Breakdown by transaction type and volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={transactionTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                          {transactionTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {transactionTypeData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600 dark:text-slate-400">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-slate-100">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transaction Methods Analysis */}
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-slate-100">Transaction Methods Analysis</CardTitle>
                <CardDescription className="text-gray-600 dark:text-slate-400">Payment methods usage and average transaction amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionMethodData.map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-4 w-4 text-gray-400 dark:text-slate-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-slate-100">{method.method}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32">
                          <Progress value={method.percentage} className="h-2" />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-slate-400 w-12 text-right">{method.percentage}%</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-slate-100 w-20 text-right">{formatNumber(method.count)}</span>
                        <span className="text-sm text-gray-500 dark:text-slate-400 w-16 text-right">${method.avgAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {userStats.map((stat, index) => (
                <Card key={index} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-slate-100">{stat.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-900 dark:text-slate-100">
                          {stat.category === "Two-Factor Auth" ? "Enabled" : "Approved"}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-slate-100">{(stat.approved || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-900 dark:text-slate-100">
                          {stat.category === "Two-Factor Auth" ? "Disabled" : "Pending"}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-slate-100">{(stat.pending || 0).toLocaleString()}</span>
                    </div>
                    {(stat.rejected || 0) > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-gray-900 dark:text-slate-100">Rejected</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-slate-100">{(stat.rejected || 0).toLocaleString()}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {/* System Performance Chart */}
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-slate-100">System Performance Metrics</CardTitle>
                <CardDescription className="text-gray-600 dark:text-slate-400">Real-time system resource usage and transaction load</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={systemPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
                      <XAxis dataKey="time" className="text-gray-600 dark:text-slate-400" />
                      <YAxis yAxisId="left" className="text-gray-600 dark:text-slate-400" />
                      <YAxis yAxisId="right" orientation="right" className="text-gray-600 dark:text-slate-400" />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="cpu" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="CPU Usage (%)" />
                      <Area yAxisId="left" type="monotone" dataKey="memory" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Memory Usage (%)" />
                      <Line yAxisId="left" type="monotone" dataKey="network" stroke="#f59e0b" strokeWidth={2} name="Network Usage (%)" />
                      <Bar yAxisId="right" dataKey="transactions" fill="#8b5cf6" name="Transactions/min" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-slate-100">Recent System Activity</CardTitle>
                <CardDescription className="text-gray-600 dark:text-slate-400">Latest events and system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800">
                      <div
                        className={`p-2 rounded-full ${
                          activity.status === "success"
                            ? "bg-green-100 dark:bg-green-900"
                            : activity.status === "warning"
                            ? "bg-yellow-100 dark:bg-yellow-900"
                            : "bg-blue-100 dark:bg-blue-900"
                        }`}
                      >
                        {activity.status === "success" ? (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : activity.status === "warning" ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        ) : (
                          <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{activity.message}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolios" className="space-y-6">
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-slate-100">Portfolio Performance Distribution</CardTitle>
                <CardDescription className="text-gray-600 dark:text-slate-400">Distribution of portfolio returns across performance ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={portfolioPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
                      <XAxis dataKey="range" className="text-gray-600 dark:text-slate-400" />
                      <YAxis className="text-gray-600 dark:text-slate-400" />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                      <Bar dataKey="count" name="Number of Portfolios">
                        {portfolioPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}