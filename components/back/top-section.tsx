
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"

export default function AdminTop() {
  // --- DUMMY DATA (replace with real data later) ---
  const users = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }]
  const userPortfolios = [
    { id: 1, userId: 1 },
    { id: 2, userId: 2 },
    { id: 3, userId: 3 },
    { id: 4, userId: 4 },
    { id: 5, userId: 5 },
  ]
  const deposits = [
    { id: 1, amount: 120000 },
    { id: 2, amount: 95000 },
    { id: 3, amount: 45000 },
    { id: 4, amount: 87000 },
  ]
  const withdraws = [
    { id: 1, amount: 30000 },
    { id: 2, amount: 22000 },
    { id: 3, amount: 18000 },
  ]

  const totalDeposits = deposits.reduce((sum, d) => sum + (d.amount || 0), 0)
  const totalWithdraws = withdraws.reduce((sum, w) => sum + (w.amount || 0), 0)
  const totalTransactions = totalDeposits + totalWithdraws

  const kpiData = [
    {
      title: "Total Assets Under Management",
      value: "$2.4B",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "vs last quarter",
      gradient: "from-[#0089ff] to-[#302a5e]",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-[#0089ff] dark:text-blue-400",
    },
    {
      title: "Active Users",
      value: users.length,
      change: "+8.2%",
      trend: "up",
      icon: Users,
      description: "vs last month",
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total User Portfolios",
      value: userPortfolios.length,
      change: "+15.3%",
      trend: "up",
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
      trend: "down",
      icon: Activity,
      description: "uptime this month",
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ] as const

  const transactionKpis = [
    {
      title: "Total Deposits",
      value: `$ ${totalDeposits.toLocaleString()}`,
      change: "+18.4%",
      trend: "up",
      icon: ArrowUpRight,
      description: "this month",
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      iconBg: "bg-gradient-to-br from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      glowColor: "shadow-emerald-500/20",
    },
    {
      title: "Total Withdrawals",
      value: `$ ${totalWithdraws.toLocaleString()}`,
      change: "+5.2%",
      trend: "up",
      icon: ArrowDownRight,
      description: "this month",
      gradient: "from-rose-500 via-red-500 to-pink-500",
      iconBg: "bg-gradient-to-br from-rose-500/20 to-red-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      glowColor: "shadow-rose-500/20",
    },
    {
      title: "Total Transactions",
      value: totalTransactions.toLocaleString(),
      change: "+22.1%",
      trend: "up",
      icon: ArrowRightLeft,
      description: "this month",
      gradient: "from-[#0089ff] via-blue-500 to-cyan-500",
      iconBg: "bg-gradient-to-br from-[#0089ff]/20 to-cyan-500/20",
      iconColor: "text-[#0089ff] dark:text-blue-400",
      glowColor: "shadow-blue-500/20",
    },
    {
      title: "Net Flow",
      value: "$612.4M",
      change: "+28.7%",
      trend: "up",
      icon: Wallet,
      description: "deposits - withdrawals",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      iconBg: "bg-gradient-to-br from-violet-500/20 to-purple-500/20",
      iconColor: "text-violet-600 dark:text-violet-400",
      glowColor: "shadow-violet-500/20",
    },
  ] as const

  const aumGrowthData = [
    { month: "Jan", aum: 1800, target: 1900, users: 38000 },
    { month: "Feb", aum: 1950, target: 2000, users: 39500 },
    { month: "Mar", aum: 2100, target: 2100, users: 41000 },
    { month: "Apr", aum: 2200, target: 2200, users: 42800 },
    { month: "May", aum: 2350, target: 2300, users: 44200 },
    { month: "Jun", aum: 2400, target: 2400, users: 45231 },
    { month: "Jul", aum: 2400, target: 2400, users: 45231 },
    { month: "Aug", aum: 2400, target: 2400, users: 45231 },
    { month: "Sept", aum: 2400, target: 2400, users: 45231 },
    { month: "Oct", aum: 2400, target: 2400, users: 45231 },
    { month: "Nov", aum: 2400, target: 2400, users: 45231 },
  ]

  const userGrowthData = [
    { month: "Jan", newUsers: 2800, activeUsers: 35200, churnRate: 2.1 },
    { month: "Feb", newUsers: 3200, activeUsers: 37800, churnRate: 1.9 },
    { month: "Mar", newUsers: 2900, activeUsers: 39100, churnRate: 2.3 },
    { month: "Apr", newUsers: 3500, activeUsers: 41200, churnRate: 1.8 },
    { month: "May", newUsers: 3100, activeUsers: 42900, churnRate: 2.0 },
    { month: "Jun", newUsers: 3400, activeUsers: 45231, churnRate: 1.7 },
  ]

  const portfolioPerformanceData = [
    { range: "< -10%", count: 234, color: "#dc2626" },
    { range: "-10% to -5%", count: 567, color: "#ea580c" },
    { range: "-5% to 0%", count: 1234, color: "#d97706" },
    { range: "0% to 5%", count: 3456, color: "#65a30d" },
    { range: "5% to 10%", count: 4567, color: "#16a34a" },
    { range: "10% to 15%", count: 2345, color: "#059669" },
    { range: "> 15%", count: 444, color: "#047857" },
  ]

  const transactionVolumeData = [
    { month: "Jan", deposits: 650, withdrawals: 180, transactions: 89000, netFlow: 470 },
    { month: "Feb", deposits: 720, withdrawals: 200, transactions: 95000, netFlow: 520 },
    { month: "Mar", deposits: 680, withdrawals: 220, transactions: 87000, netFlow: 460 },
    { month: "Apr", deposits: 780, withdrawals: 190, transactions: 102000, netFlow: 590 },
    { month: "May", deposits: 820, withdrawals: 210, transactions: 108000, netFlow: 610 },
    { month: "Jun", deposits: 847, withdrawals: 235, transactions: 124000, netFlow: 612 },
  ]

  const dailyTransactionData = [
    { day: "Mon", deposits: 142, withdrawals: 38, net: 104, volume: 18500 },
    { day: "Tue", deposits: 158, withdrawals: 42, net: 116, volume: 21200 },
    { day: "Wed", deposits: 134, withdrawals: 35, net: 99, volume: 17800 },
    { day: "Thu", deposits: 167, withdrawals: 45, net: 122, volume: 23400 },
    { day: "Fri", deposits: 189, withdrawals: 52, net: 137, volume: 26700 },
    { day: "Sat", deposits: 98, withdrawals: 28, net: 70, volume: 12300 },
    { day: "Sun", deposits: 76, withdrawals: 22, net: 54, volume: 9800 },
  ]

  const transactionTypeData = [
    { name: "Deposits", value: 847200000, color: "#10b981", percentage: 68.2 },
    { name: "Withdrawals", value: 234800000, color: "#ef4444", percentage: 18.9 },
    { name: "Transfers", value: 156300000, color: "#3b82f6", percentage: 12.6 },
    { name: "Fees", value: 23400000, color: "#f59e0b", percentage: 1.9 },
  ]

  const transactionMethodData = [
    { method: "Bank Transfer", count: 456789, percentage: 36.6, avgAmount: 1850 },
    { method: "Credit Card", count: 312456, percentage: 25.1, avgAmount: 680 },
    { method: "Digital Wallet", count: 289123, percentage: 23.2, avgAmount: 420 },
    { method: "Wire Transfer", count: 134567, percentage: 10.8, avgAmount: 5200 },
    { method: "Crypto", count: 54957, percentage: 4.4, avgAmount: 2100 },
  ]

  const fundPerformance = [
    {
      name: "GK Prime Growth Fund",
      nav: "$156.42",
      change: "+2.34%",
      aum: "$890M",
      investors: "8,234",
      ytd: 12.4,
      oneYear: 18.7,
      threeYear: 45.2,
    },
    {
      name: "iShares Semiconductor ETF (SOXX)",
      nav: "$234.67",
      change: "-1.23%",
      aum: "$567M",
      investors: "5,678",
      ytd: -2.1,
      oneYear: 28.9,
      threeYear: 67.8,
    },
    {
      name: "Invesco QQQ ETF",
      nav: "$389.12",
      change: "+0.89%",
      aum: "$1.2B",
      investors: "12,456",
      ytd: 8.9,
      oneYear: 22.3,
      threeYear: 52.1,
    },
    {
      name: "Technology Growth Fund",
      nav: "$98.76",
      change: "+3.45%",
      aum: "$345M",
      investors: "3,421",
      ytd: 15.6,
      oneYear: 31.2,
      threeYear: 78.4,
    },
  ]

  const fundHistoricalData = [
    { month: "Jan", gkPrime: 148.2, soxx: 245.1, qqq: 375.4, techGrowth: 89.3 },
    { month: "Feb", gkPrime: 151.7, soxx: 238.9, qqq: 382.1, techGrowth: 92.1 },
    { month: "Mar", gkPrime: 149.3, soxx: 241.2, qqq: 378.9, techGrowth: 90.8 },
    { month: "Apr", gkPrime: 153.8, soxx: 239.7, qqq: 385.2, techGrowth: 94.2 },
    { month: "May", gkPrime: 155.1, soxx: 236.4, qqq: 387.8, techGrowth: 96.1 },
    { month: "Jun", gkPrime: 156.4, soxx: 234.7, qqq: 389.1, techGrowth: 98.8 },
  ]

  const systemPerformanceData = [
    { time: "00:00", cpu: 45, memory: 62, network: 78, transactions: 1200 },
    { time: "04:00", cpu: 38, memory: 58, network: 65, transactions: 890 },
    { time: "08:00", cpu: 72, memory: 71, network: 85, transactions: 2100 },
    { time: "12:00", cpu: 68, memory: 69, network: 82, transactions: 1950 },
    { time: "16:00", cpu: 75, memory: 73, network: 88, transactions: 2300 },
    { time: "20:00", cpu: 52, memory: 65, network: 75, transactions: 1650 },
  ]

  const userStats = [
    { category: "Account Status", approved: 42156, pending: 2847, rejected: 228 },
    { category: "KYC Verification", approved: 41203, pending: 3567, rejected: 461 },
    { category: "Two-Factor Auth", approved: 38945, pending: 6286, rejected: 0 },
  ]

  const recentActivity = [
    { type: "account_approval", message: "1,247 new accounts approved today", time: "2 hours ago", status: "success" },
    { type: "fund_update", message: "GK Prime Growth Fund NAV updated", time: "4 hours ago", status: "info" },
    { type: "system_alert", message: "High trading volume detected", time: "6 hours ago", status: "warning" },
    { type: "compliance", message: "Monthly compliance report generated", time: "1 day ago", status: "success" },
  ]

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      <div className="p-6 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <Card
              key={index}
              className="relative overflow-hidden bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 group cursor-pointer"
            >
              {/* Gradient overlay on hover */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {transactionKpis.map((kpi, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl hover:${kpi.glowColor} hover:scale-[1.03] hover:-translate-y-1 group cursor-pointer`}
            >
              {/* Animated gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-all duration-500`}
              />

              {/* Animated border glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}
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
  )
}
