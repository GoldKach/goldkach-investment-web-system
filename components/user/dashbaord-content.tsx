

// // components/user/dashboard-content.tsx
// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// import {
//   Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
//   Pie, PieChart, ResponsiveContainer, XAxis, YAxis,
// } from "recharts"
// import {
//   ArrowUpRight, TrendingUp, Wallet as WalletIcon, DollarSign, Activity,
//   Shield, Target, Briefcase, CreditCard,
// } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// type TxStatus = "PENDING" | "APPROVED" | "REJECTED"

// type Deposit = {
//   id: string
//   amount: number
//   createdAt: string
//   method?: string | null
//   transactionStatus: TxStatus
// }

// type Withdrawal = {
//   id: string
//   amount: number
//   createdAt: string
//   method?: string | null
//   transactionStatus: TxStatus
// }

// type Wallet = {
//   id: string
//   accountNumber: string
//   balance?: number | null
//   netAssetValue?: number | null
//   totalFees?: number | null
//   bankFee?: number | null
//   transactionFee?: number | null
//   feeAtBank?: number | null
//   status?: string | null
//   updatedAt?: string | null
// }

// type EntityOnboarding = {
//   entityType?: string | null
//   occupation?: string | null
//   companyName?: string | null
//   primaryGoal?: string | null
//   timeHorizon?: string | null
//   riskTolerance?: string | null
//   investmentExperience?: string | null
//   sourceOfWealth?: string | null
//   tin?: string | null
//   isPEP?: string | null
//   // add other fields you have
// }

// type UserForDashboard = {
//   id: string
//   name: string
//   firstName?: string | null
//   lastName?: string | null
//   email?: string | null
//   phone?: string | null
//   imageUrl?: string | null
//   status?: string | null
//   isApproved?: boolean | null
//   createdAt?: string | null
//   wallet?: Wallet | null
//   deposits?: Deposit[] | null
//   withdrawals?: Withdrawal[] | null
//   entityOnboarding?: EntityOnboarding | null
// }

// type TxRow = {
//   id: string
//   type: "Deposit" | "Withdrawal"
//   amount: number
//   status: TxStatus
//   date: string
//   method?: string | null
// }

// type SeriesPoint = { date: string; value: number; deposits?: number; withdrawals?: number }

// export function DashboardContent({ user }: { user: UserForDashboard }) {
//   // ---------- SAFE MAPS FROM USER ----------
//   const wallet = user.wallet ?? {
//     id: "n/a",
//     accountNumber: "—",
//     balance: 0,
//     netAssetValue: 0,
//     totalFees: 0,
//     bankFee: 0,
//     transactionFee: 0,
//     feeAtBank: 0,
//     status: "INACTIVE",
//     updatedAt: new Date().toISOString(),
//   }

//   const deposits = (user.deposits ?? []).map(d => ({
//     ...d,
//     amount: Number(d.amount ?? 0),
//   }))
//   const withdrawals = (user.withdrawals ?? []).map(w => ({
//     ...w,
//     amount: Number(w.amount ?? 0),
//   }))

//   const recentTx: TxRow[] = [
//     ...deposits.map(d => ({
//       id: d.id,
//       type: "Deposit" as const,
//       amount: d.amount,
//       status: d.transactionStatus,
//       date: d.createdAt,
//       method: d.method ?? null,
//     })),
//     ...withdrawals.map(w => ({
//       id: w.id,
//       type: "Withdrawal" as const,
//       amount: w.amount,
//       status: w.transactionStatus,
//       date: w.createdAt,
//       method: w.method ?? null,
//     })),
//   ]
//     .sort((a, b) => +new Date(b.date) - +new Date(a.date))
//     .slice(0, 12)

//   // ---------- KPIs ----------
//   const totalBalance = Number(wallet.netAssetValue ?? 0)
//   const netAssetValue = Number(wallet.netAssetValue ?? 0)
//   const totalDeposits = deposits.reduce((s, d) => s + d.amount, 0)
//   const totalWithdrawals = withdrawals.reduce((s, w) => s + w.amount, 0)

//   // ---------- BUILD SIMPLE SERIES FROM TX ----------
//   // Group by month label (Jan, Feb, …); if you have historical NAV, plug it in instead of flat NAV.
//   const byMonth = new Map<string, { deposits: number; withdrawals: number }>()
//   for (const t of recentTx) {
//     const d = new Date(t.date)
//     const label = d.toLocaleString("default", { month: "short" }) // e.g., "Jan"
//     const bucket = byMonth.get(label) ?? { deposits: 0, withdrawals: 0 }
//     if (t.type === "Deposit") bucket.deposits += t.amount
//     else bucket.withdrawals += t.amount
//     byMonth.set(label, bucket)
//   }
//   const series: SeriesPoint[] = Array.from(byMonth.entries()).map(([month, v]) => ({
//     date: month,
//     value: netAssetValue, // if you have month NAV, use that here
//     deposits: v.deposits,
//     withdrawals: v.withdrawals,
//   }))

//   const portfolioChange =
//     series.length >= 2 ? series[series.length - 1].value - series[0].value : 0
//   const portfolioChangePercent =
//     series.length >= 2 && series[0].value
//       ? +(((portfolioChange / series[0].value) * 100).toFixed(1))
//       : 0

//   // ---------- OPTIONAL: allocation/performance (wire your own portfolio API here) ----------
//   const allocation: Array<{ name: string; value: number; amount?: number }> = []
//   const assetPerformance: Array<{ symbol: string; costPrice: number; closeValue: number; lossGain: number; percentage: number }> = []

//   const COLORS = [
//     "hsl(var(--chart-1))",
//     "hsl(var(--chart-2))",
//     "hsl(var(--chart-3))",
//     "hsl(var(--chart-4))",
//     "hsl(var(--chart-5))",
//   ]

//   return (
//     <div className="flex-1 space-y-6 p-6">
//       <Tabs defaultValue="overview" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-5 lg:w-auto">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           {/* <TabsTrigger value="portfolio">Portfolio</TabsTrigger> */}
//           <TabsTrigger value="wallet">Wallet</TabsTrigger>
//           <TabsTrigger value="transactions">Transactions</TabsTrigger>
//           <TabsTrigger value="profile">Profile</TabsTrigger>
//         </TabsList>

//         {/* ===== Overview ===== */}
//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
//                 <WalletIcon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
//                 <p className="text-xs text-muted-foreground">Wallet balance</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Net Asset Value</CardTitle>
//                 <TrendingUp className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">${netAssetValue.toLocaleString()}</div>
//                 <div className={`flex items-center text-xs ${portfolioChange >= 0 ? "text-green-600" : "text-red-600"}`}>
//                   <ArrowUpRight className="mr-1 h-3 w-3" />
//                   {portfolioChange >= 0 ? "+" : ""}
//                   {portfolioChangePercent}% (${portfolioChange.toLocaleString()})
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
//                 <DollarSign className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">${totalDeposits.toLocaleString()}</div>
//                 <p className="text-xs text-muted-foreground">All time deposits</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
//                 <Activity className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">${totalWithdrawals.toLocaleString()}</div>
//                 <p className="text-xs text-muted-foreground">All time withdrawals</p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Portfolio Performance */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Portfolio Performance</CardTitle>
//               <CardDescription>Your portfolio value over time</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ChartContainer
//                 config={{ value: { label: "Portfolio Value", color: "hsl(var(--chart-1))" } }}
//                 className="h-[300px]"
//               >
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={series}>
//                     <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
//                     <XAxis dataKey="date" className="text-xs" />
//                     <YAxis className="text-xs" />
//                     <ChartTooltip content={<ChartTooltipContent />} />
//                     <Legend />
//                     <Area
//                       type="monotone"
//                       dataKey="value"
//                       stroke="var(--color-value)"
//                       fill="var(--color-value)"
//                       fillOpacity={0.2}
//                       name="Portfolio Value"
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </ChartContainer>
//             </CardContent>
//           </Card>

//           {/* Deposits vs Withdrawals */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Deposits vs Withdrawals</CardTitle>
//               <CardDescription>Monthly transaction trends</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ChartContainer
//                 config={{
//                   deposits: { label: "Deposits", color: "hsl(var(--chart-2))" },
//                   withdrawals: { label: "Withdrawals", color: "hsl(var(--chart-3))" },
//                 }}
//                 className="h-[300px]"
//               >
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={series}>
//                     <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
//                     <XAxis dataKey="date" className="text-xs" />
//                     <YAxis className="text-xs" />
//                     <ChartTooltip content={<ChartTooltipContent />} />
//                     <Legend />
//                     <Line type="monotone" dataKey="deposits" stroke="var(--color-deposits)" strokeWidth={2} name="Deposits" />
//                     <Line type="monotone" dataKey="withdrawals" stroke="var(--color-withdrawals)" strokeWidth={2} name="Withdrawals" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </ChartContainer>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* ===== Portfolio ===== */}
//         <TabsContent value="portfolio" className="space-y-6">
//           <div className="grid gap-4 md:grid-cols-2">
//             {/* Allocation */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Asset Allocation</CardTitle>
//                 <CardDescription>Distribution across sectors</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ChartContainer
//                   config={{ value: { label: "Allocation", color: "hsl(var(--chart-1))" } }}
//                   className="h-[300px]"
//                 >
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={allocation}
//                         cx="50%" cy="50%"
//                         labelLine={false}
//                         label={(p) => `${p.name} ${p.value}%`}
//                         outerRadius={80}
//                         dataKey="value"
//                       >
//                         {allocation.map((_, i) => (
//                           <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <ChartTooltip content={<ChartTooltipContent />} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </ChartContainer>
//               </CardContent>
//             </Card>

//             {/* Performance */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Asset Performance</CardTitle>
//                 <CardDescription>Gain/Loss by asset</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ChartContainer
//                   config={{ lossGain: { label: "Gain/Loss", color: "hsl(var(--chart-1))" } }}
//                   className="h-[300px]"
//                 >
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={assetPerformance}>
//                       <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
//                       <XAxis dataKey="symbol" className="text-xs" />
//                       <YAxis className="text-xs" />
//                       <ChartTooltip content={<ChartTooltipContent />} />
//                       <Bar dataKey="lossGain" name="Gain/Loss ($)" radius={[4, 4, 0, 0]}>
//                         {assetPerformance.map((a, i) => (
//                           <Cell key={i} fill={a.lossGain >= 0 ? "hsl(var(--chart-2))" : "hsl(var(--destructive))"} />
//                         ))}
//                       </Bar>
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </ChartContainer>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* ===== Wallet ===== */}
//         <TabsContent value="wallet" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CreditCard className="h-5 w-5" />
//                 Wallet Details
//               </CardTitle>
//               <CardDescription>Account information and fee breakdown</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//                 <div className="space-y-2">
//                   <p className="text-sm text-muted-foreground">Account Number</p>
//                   <p className="font-mono text-lg font-semibold">{wallet.accountNumber}</p>
//                   <Badge variant={(wallet.status ?? "ACTIVE") === "ACTIVE" ? "default" : "secondary"}>
//                     {wallet.status ?? "ACTIVE"}
//                   </Badge>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm text-muted-foreground">Current Balance</p>
//                   <p className="text-2xl font-bold">${Number(wallet.balance ?? 0).toLocaleString()}</p>
//                   <p className="text-xs text-muted-foreground">Available funds</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm text-muted-foreground">Net Asset Value</p>
//                   <p className="text-2xl font-bold">${Number(wallet.netAssetValue ?? 0).toLocaleString()}</p>
//                   <p className="text-xs text-muted-foreground">After fees</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm text-muted-foreground">Total Fees</p>
//                   <p className="text-2xl font-bold">${Number(wallet.totalFees ?? 0).toLocaleString()}</p>
//                   <p className="text-xs text-muted-foreground">All charges</p>
//                 </div>
//               </div>
//               <div className="mt-6 pt-6 border-t">
//                 <p className="text-sm font-medium mb-4">Fee Breakdown</p>
//                 <div className="grid gap-3 md:grid-cols-3">
//                   <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
//                     <span className="text-sm text-muted-foreground">Bank Fee</span>
//                     <span className="font-semibold">${Number(wallet.bankFee ?? 0).toLocaleString()}</span>
//                   </div>
//                   <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
//                     <span className="text-sm text-muted-foreground">Transaction Fee</span>
//                     <span className="font-semibold">${Number(wallet.transactionFee ?? 0).toLocaleString()}</span>
//                   </div>
//                   <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
//                     <span className="text-sm text-muted-foreground">Fee at Bank</span>
//                     <span className="font-semibold">${Number(wallet.feeAtBank ?? 0).toLocaleString()}</span>
//                   </div>
//                 </div>
//                 <div className="mt-4 text-xs text-muted-foreground">
//                   Last updated: {new Date(wallet.updatedAt ?? new Date().toISOString()).toLocaleString()}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* ===== Transactions ===== */}
//         <TabsContent value="transactions" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Recent Transactions</CardTitle>
//               <CardDescription>Your latest deposits and withdrawals</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {recentTx.map((t) => (
//                   <div key={t.id} className="flex items-center justify-between border-b pb-3 last:border-0">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2">
//                         <p className="text-sm font-medium">{t.type}</p>
//                         <Badge
//                           variant={
//                             t.status === "APPROVED" ? "default" : t.status === "PENDING" ? "secondary" : "destructive"
//                           }
//                           className="text-xs"
//                         >
//                           {t.status}
//                         </Badge>
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         {(t.method ?? "—")} • {new Date(t.date).toLocaleString()}
//                       </p>
//                     </div>
//                     <div className={`text-sm font-semibold ${t.type === "Deposit" ? "text-green-600" : "text-red-600"}`}>
//                       {t.type === "Deposit" ? "+" : "-"}${t.amount.toLocaleString()}
//                     </div>
//                   </div>
//                 ))}
//                 {recentTx.length === 0 && (
//                   <p className="text-sm text-muted-foreground">No recent transactions.</p>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* ===== Profile ===== */}
//         <TabsContent value="profile" className="space-y-6">
//           <div className="grid gap-4 md:grid-cols-3">
//             {/* User Info */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">Profile Information</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center gap-4">
//                   <Avatar className="h-16 w-16">
//                     <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.name} />
//                     <AvatarFallback>
//                       {(user.firstName?.[0] ?? user.name?.[0] ?? "U")}
//                       {(user.lastName?.[0] ?? "").toString()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="space-y-1">
//                     <p className="font-semibold">{user.name}</p>
//                     <div className="flex items-center gap-2">
//                       <Badge variant="default">{user.status ?? "ACTIVE"}</Badge>
//                       {user.isApproved && (
//                         <Badge variant="outline" className="text-green-600 border-green-600">
//                           <Shield className="mr-1 h-3 w-3" />
//                           Verified
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Email:</span>
//                     <span className="font-medium">{user.email ?? "—"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Phone:</span>
//                     <span className="font-medium">{user.phone ?? "—"}</span>
//                   </div>
//                   {user.createdAt && (
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Member Since:</span>
//                       <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Investment Profile */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base flex items-center gap-2">
//                   <Target className="h-4 w-4" />
//                   Investment Profile
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3 text-sm">
//                 {user.entityOnboarding ? (
//                   <>
//                     <div className="grid grid-cols-2 gap-3">
//                       <div className="space-y-1">
//                         <p className="text-muted-foreground">Primary Goal</p>
//                         <p className="font-medium">{user.entityOnboarding.primaryGoal ?? "—"}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-muted-foreground">Time Horizon</p>
//                         <Badge variant="outline">{user.entityOnboarding.timeHorizon ?? "—"}</Badge>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-muted-foreground">Risk Tolerance</p>
//                         <Badge variant="outline">{user.entityOnboarding.riskTolerance ?? "—"}</Badge>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-muted-foreground">Experience</p>
//                         <p className="font-medium">{user.entityOnboarding.investmentExperience ?? "—"}</p>
//                       </div>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-muted-foreground">Source of Wealth</p>
//                       <p className="font-medium">{user.entityOnboarding.sourceOfWealth ?? "—"}</p>
//                     </div>
//                   </>
//                 ) : (
//                   <p className="text-muted-foreground">No investment profile found.</p>
//                 )}
//               </CardContent>
//             </Card>

//             {/* KYC / Employment */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base flex items-center gap-2">
//                   <Briefcase className="h-4 w-4" />
//                   KYC Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3 text-sm">
//                 {user.entityOnboarding ? (
//                   <>
//                     <div className="flex items-center justify-between">
//                       <span className="text-muted-foreground">Entity Type</span>
//                       <Badge>{user.entityOnboarding.entityType ?? "—"}</Badge>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-muted-foreground">Employment</p>
//                       <p className="font-medium">{user.entityOnboarding.occupation ?? "—"}</p>
//                       <p className="text-xs text-muted-foreground">{user.entityOnboarding.companyName ?? "—"}</p>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-muted-foreground">TIN</p>
//                       <p className="font-mono text-xs">{user.entityOnboarding.tin ?? "—"}</p>
//                     </div>
//                     <div className="flex items-center justify-between pt-2 border-t">
//                       <span className="text-muted-foreground">PEP Status</span>
//                       <Badge variant={(user.entityOnboarding.isPEP ?? "No") === "No" ? "outline" : "destructive"}>
//                         {user.entityOnboarding.isPEP ?? "No"}
//                       </Badge>
//                     </div>
//                   </>
//                 ) : (
//                   <p className="text-muted-foreground">No KYC/onboarding data found.</p>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }






// components/user/dashboard-content.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, XAxis, YAxis,
} from "recharts"
import {
  ArrowUpRight, TrendingUp, Wallet as WalletIcon, DollarSign, Activity,
  Shield, Target, Briefcase, CreditCard, FileText, Download, Eye, 
  Image as ImageIcon, File, Building2, CheckCircle2, Clock, XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatDistanceToNow } from "date-fns"

type TxStatus = "PENDING" | "APPROVED" | "REJECTED"

type Deposit = {
  id: string
  amount: number
  createdAt: string
  method?: string | null
  transactionStatus: TxStatus
}

type Withdrawal = {
  id: string
  amount: number
  createdAt: string
  method?: string | null
  transactionStatus: TxStatus
}

type Wallet = {
  id: string
  accountNumber: string
  balance?: number | null
  netAssetValue?: number | null
  totalFees?: number | null
  bankFee?: number | null
  transactionFee?: number | null
  feeAtBank?: number | null
  status?: string | null
  updatedAt?: string | null
  createdAt?: string | null
}

type EntityOnboarding = {
  fullName?: string | null
  entityType?: string | null
  dateOfBirth?: string | null
  tin?: string | null
  homeAddress?: string | null
  nationality?: string | null
  countryOfResidence?: string | null
  employmentStatus?: string | null
  occupation?: string | null
  companyName?: string | null
  registrationNumber?: string | null
  companyAddress?: string | null
  businessType?: string | null
  incorporationDate?: string | null
  primaryGoal?: string | null
  timeHorizon?: string | null
  riskTolerance?: string | null
  investmentExperience?: string | null
  expectedInvestment?: string | null
  sourceOfWealth?: string | null
  isPEP?: boolean | string | null
  isApproved?: boolean | null
  consentToDataCollection?: boolean | null
  agreeToTerms?: boolean | null
  // Documents
  nationalIdUrl?: string | null
  passportPhotoUrl?: string | null
  tinCertificateUrl?: string | null
  bankStatementUrl?: string | null
  proofOfAddressUrl?: string | null
  signatureUrl?: string | null
  certificateOfIncorporationUrl?: string | null
  memorandumUrl?: string | null
  articlesUrl?: string | null
  companyTinUrl?: string | null
  additionalDocumentUrl?: string | null
}

type UserForDashboard = {
  id: string
  name: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  phone?: string | null
  imageUrl?: string | null
  status?: string | null
  isApproved?: boolean | null
  emailVerified?: boolean | null
  createdAt?: string | null
  updatedAt?: string | null
  wallet?: Wallet | null
  deposits?: Deposit[] | null
  withdrawals?: Withdrawal[] | null
  entityOnboarding?: EntityOnboarding | null
}

type TxRow = {
  id: string
  type: "Deposit" | "Withdrawal"
  amount: number
  status: TxStatus
  date: string
  method?: string | null
}

type SeriesPoint = { date: string; value: number; deposits?: number; withdrawals?: number }

export function DashboardContent({ user }: { user: UserForDashboard }) {
  const [previewDocument, setPreviewDocument] = useState<{ url: string; name: string; type: string } | null>(null)

  // ---------- SAFE MAPS FROM USER ----------
  const wallet = user.wallet ?? {
    id: "n/a",
    accountNumber: "—",
    balance: 0,
    netAssetValue: 0,
    totalFees: 0,
    bankFee: 0,
    transactionFee: 0,
    feeAtBank: 0,
    status: "INACTIVE",
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }

  const deposits = (user.deposits ?? []).map(d => ({
    ...d,
    amount: Number(d.amount ?? 0),
  }))
  const withdrawals = (user.withdrawals ?? []).map(w => ({
    ...w,
    amount: Number(w.amount ?? 0),
  }))

  const recentTx: TxRow[] = [
    ...deposits.map(d => ({
      id: d.id,
      type: "Deposit" as const,
      amount: d.amount,
      status: d.transactionStatus,
      date: d.createdAt,
      method: d.method ?? null,
    })),
    ...withdrawals.map(w => ({
      id: w.id,
      type: "Withdrawal" as const,
      amount: w.amount,
      status: w.transactionStatus,
      date: w.createdAt,
      method: w.method ?? null,
    })),
  ]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 12)

  // ---------- KPIs ----------
  const totalBalance = Number(wallet.netAssetValue ?? 0)
  const netAssetValue = Number(wallet.netAssetValue ?? 0)
  const totalDeposits = deposits.reduce((s, d) => s + d.amount, 0)
  const totalWithdrawals = withdrawals.reduce((s, w) => s + w.amount, 0)

  // ---------- BUILD SIMPLE SERIES FROM TX ----------
  const byMonth = new Map<string, { deposits: number; withdrawals: number }>()
  for (const t of recentTx) {
    const d = new Date(t.date)
    const label = d.toLocaleString("default", { month: "short" })
    const bucket = byMonth.get(label) ?? { deposits: 0, withdrawals: 0 }
    if (t.type === "Deposit") bucket.deposits += t.amount
    else bucket.withdrawals += t.amount
    byMonth.set(label, bucket)
  }
  const series: SeriesPoint[] = Array.from(byMonth.entries()).map(([month, v]) => ({
    date: month,
    value: netAssetValue,
    deposits: v.deposits,
    withdrawals: v.withdrawals,
  }))

  const portfolioChange =
    series.length >= 2 ? series[series.length - 1].value - series[0].value : 0
  const portfolioChangePercent =
    series.length >= 2 && series[0].value
      ? +(((portfolioChange / series[0].value) * 100).toFixed(1))
      : 0

  const displayName =
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "User"

  const safeDate = (d?: string | null) => (d ? new Date(d) : null)

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return <CheckCircle2 className="mr-1 h-3 w-3" />
      case "PENDING":
        return <Clock className="mr-1 h-3 w-3" />
      case "REJECTED":
      case "FAILED":
        return <XCircle className="mr-1 h-3 w-3" />
      default:
        return null
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return "bg-green-500/10 text-green-600 dark:text-green-400"
      case "PENDING":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400"
      case "REJECTED":
      case "FAILED":
        return "bg-red-500/10 text-red-600 dark:text-red-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getDocumentIcon = (url: string) => {
    const extension = url?.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <ImageIcon className="h-5 w-5" />
    } else if (extension === 'pdf') {
      return <FileText className="h-5 w-5" />
    }
    return <File className="h-5 w-5" />
  }

  const isImage = (url: string) => {
    const extension = url?.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')
  }

  const DocumentCard = ({ title, url }: { title: string; url?: string | null }) => {
    if (!url) {
      return (
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <File className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs">Not uploaded</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="group relative rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {getDocumentIcon(url)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{title}</p>
            <p className="text-xs text-muted-foreground">
              {isImage(url) ? 'Image' : 'PDF'} • Uploaded
            </p>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPreviewDocument({ url, name: title, type: isImage(url) ? 'image' : 'pdf' })}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(url, '_blank')}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* ===== Overview ===== */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <WalletIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Wallet balance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Asset Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${netAssetValue.toLocaleString()}</div>
                <div className={`flex items-center text-xs ${portfolioChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  {portfolioChange >= 0 ? "+" : ""}
                  {portfolioChangePercent}% (${portfolioChange.toLocaleString()})
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalDeposits.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time deposits</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalWithdrawals.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time withdrawals</p>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Your portfolio value over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ value: { label: "Portfolio Value", color: "hsl(var(--chart-1))" } }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-value)"
                      fill="var(--color-value)"
                      fillOpacity={0.2}
                      name="Portfolio Value"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Deposits vs Withdrawals */}
          <Card>
            <CardHeader>
              <CardTitle>Deposits vs Withdrawals</CardTitle>
              <CardDescription>Monthly transaction trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  deposits: { label: "Deposits", color: "hsl(var(--chart-2))" },
                  withdrawals: { label: "Withdrawals", color: "hsl(var(--chart-3))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="deposits" stroke="var(--color-deposits)" strokeWidth={2} name="Deposits" />
                    <Line type="monotone" dataKey="withdrawals" stroke="var(--color-withdrawals)" strokeWidth={2} name="Withdrawals" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Profile ===== */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {(user.firstName?.[0] ?? user.name?.[0] ?? "U")}
                      {(user.lastName?.[0] ?? "").toString()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-semibold">{displayName}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{user.status ?? "ACTIVE"}</Badge>
                      {user.isApproved && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Shield className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{user.email ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{user.phone ?? "—"}</span>
                  </div>
                  {user.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since:</span>
                      <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {user.emailVerified && (
                    <div className="flex items-center gap-2 pt-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Email Verified</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Investment Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Investment Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {user.entityOnboarding ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Primary Goal</p>
                        <p className="font-medium">{user.entityOnboarding.primaryGoal ?? "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Time Horizon</p>
                        <Badge variant="outline">{user.entityOnboarding.timeHorizon ?? "—"}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Risk Tolerance</p>
                        <Badge variant="outline">{user.entityOnboarding.riskTolerance ?? "—"}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Experience</p>
                        <p className="font-medium">{user.entityOnboarding.investmentExperience ?? "—"}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Source of Wealth</p>
                      <p className="font-medium">{user.entityOnboarding.sourceOfWealth ?? "—"}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No investment profile found.</p>
                )}
              </CardContent>
            </Card>

            {/* KYC / Employment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  KYC Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {user.entityOnboarding ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Entity Type</span>
                      <Badge>{user.entityOnboarding.entityType ?? "—"}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Employment</p>
                      <p className="font-medium">{user.entityOnboarding.occupation ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{user.entityOnboarding.companyName ?? "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">TIN</p>
                      <p className="font-mono text-xs">{user.entityOnboarding.tin ?? "—"}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-muted-foreground">PEP Status</span>
                      <Badge variant={(user.entityOnboarding.isPEP ?? "No") === "No" ? "outline" : "destructive"}>
                        {String(user.entityOnboarding.isPEP ?? "No")}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No KYC/onboarding data found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== Onboarding (Combined with Documents) ===== */}
        <TabsContent value="onboarding" className="space-y-4">
          {user.entityOnboarding ? (
            <>
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Basic personal and identification details</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{user.entityOnboarding.fullName || displayName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entity Type</p>
                    <Badge variant="outline" className="capitalize">
                      {user.entityOnboarding.entityType || "—"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">
                      {user.entityOnboarding.dateOfBirth
                        ? new Date(user.entityOnboarding.dateOfBirth).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">TIN</p>
                    <p className="font-mono text-sm font-medium">{user.entityOnboarding.tin || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p className="font-medium">{user.entityOnboarding.nationality || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country of Residence</p>
                    <p className="font-medium">{user.entityOnboarding.countryOfResidence || "—"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Home Address</p>
                    <p className="font-medium">{user.entityOnboarding.homeAddress || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Employment Status</p>
                    <p className="font-medium">{user.entityOnboarding.employmentStatus || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Occupation</p>
                    <p className="font-medium">{user.entityOnboarding.occupation || "—"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Company Information (if applicable) */}
              {user.entityOnboarding.entityType === "company" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Business and company details</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Company Name</p>
                      <p className="font-medium">{user.entityOnboarding.companyName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Registration Number</p>
                      <p className="font-medium">{user.entityOnboarding.registrationNumber || "N/A"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Company Address</p>
                      <p className="font-medium">{user.entityOnboarding.companyAddress || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Business Type</p>
                      <p className="font-medium">{user.entityOnboarding.businessType || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Incorporation Date</p>
                      <p className="font-medium">
                        {user.entityOnboarding.incorporationDate
                          ? new Date(user.entityOnboarding.incorporationDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Investment Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Investment Profile</CardTitle>
                  <CardDescription>Investment goals and preferences</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Primary Goal</p>
                    <p className="font-medium">{user.entityOnboarding.primaryGoal || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Horizon</p>
                    <Badge variant="outline">{user.entityOnboarding.timeHorizon || "—"}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Tolerance</p>
                    <Badge variant="outline">{user.entityOnboarding.riskTolerance || "—"}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Investment Experience</p>
                    <p className="font-medium">{user.entityOnboarding.investmentExperience || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Investment</p>
                    <p className="font-medium">{user.entityOnboarding.expectedInvestment || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Source of Wealth</p>
                    <p className="font-medium">{user.entityOnboarding.sourceOfWealth || "—"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance & Verification */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance & Verification</CardTitle>
                  <CardDescription>KYC and compliance status</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">PEP Status</p>
                    <Badge variant={String(user.entityOnboarding.isPEP) === "true" ? "destructive" : "outline"}>
                      {String(user.entityOnboarding.isPEP ?? "No")}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Approval Status</p>
                    <Badge
                      className={
                        user.entityOnboarding.isApproved
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                      }
                    >
                      {getStatusIcon(user.entityOnboarding.isApproved ? "APPROVED" : "PENDING")}
                      {user.entityOnboarding.isApproved ? "Approved" : "Pending Approval"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data Collection Consent</p>
                    <Badge
                      className={
                        user.entityOnboarding.consentToDataCollection
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }
                    >
                      {user.entityOnboarding.consentToDataCollection ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Granted
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 h-3 w-3" />
                          Not Granted
                        </>
                      )}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Terms Agreement</p>
                    <Badge
                      className={
                        user.entityOnboarding.agreeToTerms
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }
                    >
                      {user.entityOnboarding.agreeToTerms ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Agreed
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 h-3 w-3" />
                          Not Agreed
                        </>
                      )}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Section */}
              <div className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Submitted Documents</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  All documents submitted during the onboarding process
                </p>

                {/* Identity Documents */}
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Identity Documents
                    </CardTitle>
                    <CardDescription>Official identification documents</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <DocumentCard 
                      title="National ID / Passport" 
                      url={user.entityOnboarding.nationalIdUrl} 
                    />
                    <DocumentCard 
                      title="Passport Photo" 
                      url={user.entityOnboarding.passportPhotoUrl} 
                    />
                    <DocumentCard 
                      title="TIN Certificate" 
                      url={user.entityOnboarding.tinCertificateUrl} 
                    />
                  </CardContent>
                </Card>

                {/* Financial Documents */}
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Financial Documents
                    </CardTitle>
                    <CardDescription>Bank statements and financial records</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <DocumentCard 
                      title="Bank Statement" 
                      url={user.entityOnboarding.bankStatementUrl} 
                    />
                    <DocumentCard 
                      title="Proof of Address" 
                      url={user.entityOnboarding.proofOfAddressUrl} 
                    />
                  </CardContent>
                </Card>

                {/* Company Documents (if entity type is company) */}
                {user.entityOnboarding.entityType === "company" && (
                  <Card className="mb-4">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Company Documents
                      </CardTitle>
                      <CardDescription>Company registration and verification documents</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <DocumentCard 
                        title="Certificate of Incorporation" 
                        url={user.entityOnboarding.certificateOfIncorporationUrl} 
                      />
                      <DocumentCard 
                        title="Memorandum of Association" 
                        url={user.entityOnboarding.memorandumUrl} 
                      />
                      <DocumentCard 
                        title="Articles of Association" 
                        url={user.entityOnboarding.articlesUrl} 
                      />
                      <DocumentCard 
                        title="Company TIN Certificate" 
                        url={user.entityOnboarding.companyTinUrl} 
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Additional Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Additional Documents
                    </CardTitle>
                    <CardDescription>Other supporting documents</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <DocumentCard 
                      title="Signature Specimen" 
                      url={user.entityOnboarding.signatureUrl} 
                    />
                    {user.entityOnboarding.additionalDocumentUrl && (
                      <DocumentCard 
                        title="Additional Document" 
                        url={user.entityOnboarding.additionalDocumentUrl} 
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex min-h-[400px] items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Building2 className="mx-auto mb-4 h-16 w-16 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Onboarding Information</h3>
                  <p>Complete your onboarding to view this information.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ===== Wallet ===== */}
        <TabsContent value="wallet" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Wallet Details
              </CardTitle>
              <CardDescription>Account information and fee breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="font-mono text-lg font-semibold">{wallet.accountNumber}</p>
                  <Badge variant={(wallet.status ?? "ACTIVE") === "ACTIVE" ? "default" : "secondary"}>
                    {wallet.status ?? "ACTIVE"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold">${Number(wallet.balance ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Available funds</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Net Asset Value</p>
                  <p className="text-2xl font-bold">${Number(wallet.netAssetValue ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">After fees</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Fees</p>
                  <p className="text-2xl font-bold">${Number(wallet.totalFees ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">All charges</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-medium mb-4">Fee Breakdown</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Bank Fee</span>
                    <span className="font-semibold">${Number(wallet.bankFee ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Transaction Fee</span>
                    <span className="font-semibold">${Number(wallet.transactionFee ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Fee at Bank</span>
                    <span className="font-semibold">${Number(wallet.feeAtBank ?? 0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Last updated: {new Date(wallet.updatedAt ?? new Date().toISOString()).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Transactions ===== */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest deposits and withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTx.map((t) => (
                  <div key={t.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{t.type}</p>
                        <Badge
                          variant={
                            t.status === "APPROVED" ? "default" : t.status === "PENDING" ? "secondary" : "destructive"
                          }
                          className="text-xs"
                        >
                          {t.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {(t.method ?? "—")} • {new Date(t.date).toLocaleString()}
                      </p>
                    </div>
                    <div className={`text-sm font-semibold ${t.type === "Deposit" ? "text-green-600" : "text-red-600"}`}>
                      {t.type === "Deposit" ? "+" : "-"}${t.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
                {recentTx.length === 0 && (
                  <p className="text-sm text-muted-foreground">No recent transactions.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{previewDocument?.name}</DialogTitle>
            <DialogDescription>
              Document preview • {previewDocument?.type === 'image' ? 'Image' : 'PDF'}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 overflow-auto max-h-[calc(90vh-200px)]">
            {previewDocument?.type === 'image' ? (
              <div className="relative w-full h-full flex items-center justify-center bg-muted/10 rounded-lg">
                <Image
                  src={previewDocument.url}
                  alt={previewDocument.name}
                  width={800}
                  height={600}
                  className="max-w-full h-auto rounded-lg"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            ) : (
              <iframe
                src={previewDocument?.url}
                className="w-full h-[600px] rounded-lg border"
                title={previewDocument?.name}
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewDocument(null)}>
              Close
            </Button>
            <Button onClick={() => window.open(previewDocument?.url, '_blank')}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}