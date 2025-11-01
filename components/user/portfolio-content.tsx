// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// import {
//   Area,
//   AreaChart,
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
// } from "recharts"
// import { ArrowDownIcon, ArrowUpIcon, TrendingDown, TrendingUp, Wallet } from "lucide-react"

// export function PortfolioContent() {
//   // Mock data - replace with actual data from your database
//   const portfolios = [
//     {
//       id: "1",
//       name: "Growth Portfolio",
//       description: "Long-term growth focused investments",
//       totalValue: 125000,
//       totalCost: 100000,
//       totalLossGain: 25000,
//       lossGainPercentage: 25,
//       status: "ACTIVE",
//       createdAt: new Date("2024-01-15"),
//     },
//     {
//       id: "2",
//       name: "Conservative Portfolio",
//       description: "Low-risk stable investments",
//       totalValue: 75000,
//       totalCost: 70000,
//       totalLossGain: 5000,
//       lossGainPercentage: 7.14,
//       status: "ACTIVE",
//       createdAt: new Date("2024-03-20"),
//     },
//   ]

//   const portfolioAssets = [
//     {
//       id: "1",
//       portfolioId: "1",
//       assetName: "Apple Inc.",
//       assetSymbol: "AAPL",
//       cost: 45000,
//       stock: 250,
//       closeValue: 55000,
//       lossGain: 10000,
//       lossGainPercentage: 22.22,
//     },
//     {
//       id: "2",
//       portfolioId: "1",
//       assetName: "Microsoft Corp.",
//       assetSymbol: "MSFT",
//       cost: 35000,
//       stock: 100,
//       closeValue: 45000,
//       lossGain: 10000,
//       lossGainPercentage: 28.57,
//     },
//     {
//       id: "3",
//       portfolioId: "1",
//       assetName: "Tesla Inc.",
//       assetSymbol: "TSLA",
//       cost: 20000,
//       stock: 80,
//       closeValue: 25000,
//       lossGain: 5000,
//       lossGainPercentage: 25,
//     },
//     {
//       id: "4",
//       portfolioId: "2",
//       assetName: "US Treasury Bonds",
//       assetSymbol: "UST",
//       cost: 40000,
//       stock: 400,
//       closeValue: 42000,
//       lossGain: 2000,
//       lossGainPercentage: 5,
//     },
//     {
//       id: "5",
//       portfolioId: "2",
//       assetName: "Gold ETF",
//       assetSymbol: "GLD",
//       cost: 30000,
//       stock: 150,
//       closeValue: 33000,
//       lossGain: 3000,
//       lossGainPercentage: 10,
//     },
//   ]

//   const cashSummary = {
//     totalCash: 50000,
//     availableCash: 45000,
//     reservedCash: 5000,
//   }

//   // Performance data for charts
//   const performanceData = [
//     { month: "Jan", value: 100000 },
//     { month: "Feb", value: 105000 },
//     { month: "Mar", value: 110000 },
//     { month: "Apr", value: 108000 },
//     { month: "May", value: 115000 },
//     { month: "Jun", value: 125000 },
//   ]

//   // Asset allocation data
//   const allocationData = portfolioAssets.map((asset) => ({
//     name: asset.assetSymbol,
//     value: asset.closeValue,
//   }))

//   const COLORS = [
//     "hsl(var(--chart-1))",
//     "hsl(var(--chart-2))",
//     "hsl(var(--chart-3))",
//     "hsl(var(--chart-4))",
//     "hsl(var(--chart-5))",
//   ]

//   const totalPortfolioValue = portfolios.reduce((sum, p) => sum + p.totalValue, 0)
//   const totalPortfolioCost = portfolios.reduce((sum, p) => sum + p.totalCost, 0)
//   const totalPortfolioGain = portfolios.reduce((sum, p) => sum + p.totalLossGain, 0)
//   const totalPortfolioGainPercentage = ((totalPortfolioGain / totalPortfolioCost) * 100).toFixed(2)

//   return (
//     <div className="p-6">
//       <Tabs defaultValue="overview" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
//           <TabsTrigger value="assets">Assets</TabsTrigger>
//           <TabsTrigger value="cash">Cash Summary</TabsTrigger>
//         </TabsList>

//         {/* Overview Tab */}
//         <TabsContent value="overview" className="space-y-6">
//           {/* Summary Cards */}
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
//                 <Wallet className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</div>
//                 <p className="text-xs text-muted-foreground">Across {portfolios.length} portfolios</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Cost Basis</CardTitle>
//                 <TrendingDown className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">${totalPortfolioCost.toLocaleString()}</div>
//                 <p className="text-xs text-muted-foreground">Initial investment</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
//                 <TrendingUp className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-green-600">${totalPortfolioGain.toLocaleString()}</div>
//                 <p className="text-xs text-green-600 flex items-center gap-1">
//                   <ArrowUpIcon className="h-3 w-3" />
//                   {totalPortfolioGainPercentage}% return
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Available Cash</CardTitle>
//                 <Wallet className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">${cashSummary.availableCash.toLocaleString()}</div>
//                 <p className="text-xs text-muted-foreground">Ready to invest</p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Charts */}
//           <div className="grid gap-6 md:grid-cols-2">
//             {/* Portfolio Performance Chart */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Portfolio Performance</CardTitle>
//                 <CardDescription>Total portfolio value over time</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ChartContainer
//                   config={{
//                     value: {
//                       label: "Portfolio Value",
//                       color: "hsl(var(--chart-1))",
//                     },
//                   }}
//                   className="h-[300px]"
//                 >
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={performanceData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <ChartTooltip content={<ChartTooltipContent />} />
//                       <Area
//                         type="monotone"
//                         dataKey="value"
//                         stroke="hsl(var(--chart-1))"
//                         fill="hsl(var(--chart-1))"
//                         fillOpacity={0.2}
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </ChartContainer>
//               </CardContent>
//             </Card>

//             {/* Asset Allocation Chart */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Asset Allocation</CardTitle>
//                 <CardDescription>Distribution across all assets</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ChartContainer
//                   config={{
//                     value: {
//                       label: "Value",
//                       color: "hsl(var(--chart-1))",
//                     },
//                   }}
//                   className="h-[300px]"
//                 >
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={allocationData}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({ name, percent }) => `${name} ${(80 * 100).toFixed(0)}%`}
//                       >
//                         {allocationData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <ChartTooltip content={<ChartTooltipContent />} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </ChartContainer>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Portfolios Tab */}
//         <TabsContent value="portfolios" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             {portfolios.map((portfolio) => {
//               const assets = portfolioAssets.filter((a) => a.portfolioId === portfolio.id)
//               const isPositive = portfolio.totalLossGain >= 0

//               return (
//                 <Card key={portfolio.id}>
//                   <CardHeader>
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <CardTitle>{portfolio.name}</CardTitle>
//                         <CardDescription>{portfolio.description}</CardDescription>
//                       </div>
//                       <Badge variant={portfolio.status === "ACTIVE" ? "default" : "secondary"}>
//                         {portfolio.status}
//                       </Badge>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <p className="text-sm text-muted-foreground">Current Value</p>
//                         <p className="text-2xl font-bold">${portfolio.totalValue.toLocaleString()}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">Cost Basis</p>
//                         <p className="text-2xl font-bold">${portfolio.totalCost.toLocaleString()}</p>
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-muted-foreground">Gain/Loss</span>
//                         <span
//                           className={`text-sm font-semibold flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
//                         >
//                           {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}$
//                           {Math.abs(portfolio.totalLossGain).toLocaleString()} (
//                           {portfolio.lossGainPercentage.toFixed(2)}%)
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-muted-foreground">Assets</span>
//                         <span className="text-sm font-semibold">{assets.length}</span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-muted-foreground">Created</span>
//                         <span className="text-sm">{portfolio.createdAt.toLocaleDateString()}</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )
//             })}
//           </div>
//         </TabsContent>

//         {/* Assets Tab */}
//         <TabsContent value="assets" className="space-y-6">
//           {/* Asset Performance Chart */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Asset Performance</CardTitle>
//               <CardDescription>Gain/Loss by asset</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ChartContainer
//                 config={{
//                   lossGain: {
//                     label: "Gain/Loss",
//                     color: "hsl(var(--chart-1))",
//                   },
//                 }}
//                 className="h-[300px]"
//               >
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={portfolioAssets}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="assetSymbol" />
//                     <YAxis />
//                     <ChartTooltip content={<ChartTooltipContent />} />
//                     <Bar dataKey="lossGain" fill="hsl(var(--chart-1))">
//                       {portfolioAssets.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={entry.lossGain >= 0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-5))"}
//                         />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </ChartContainer>
//             </CardContent>
//           </Card>

//           {/* Assets Table */}
//           <Card>
//             <CardHeader>
//               <CardTitle>All Assets</CardTitle>
//               <CardDescription>Detailed view of all portfolio assets</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {portfolioAssets.map((asset) => {
//                   const isPositive = asset.lossGain >= 0
//                   const portfolio = portfolios.find((p) => p.id === asset.portfolioId)

//                   return (
//                     <div key={asset.id} className="flex items-center justify-between border-b pb-4 last:border-0">
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-2">
//                           <p className="font-semibold">{asset.assetName}</p>
//                           <Badge variant="outline">{asset.assetSymbol}</Badge>
//                         </div>
//                         <p className="text-sm text-muted-foreground">{portfolio?.name}</p>
//                         <p className="text-xs text-muted-foreground">{asset.stock} shares</p>
//                       </div>
//                       <div className="text-right space-y-1">
//                         <p className="font-semibold">${asset.closeValue.toLocaleString()}</p>
//                         <p className="text-sm text-muted-foreground">Cost: ${asset.cost.toLocaleString()}</p>
//                         <p
//                           className={`text-sm font-semibold flex items-center justify-end gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
//                         >
//                           {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}$
//                           {Math.abs(asset.lossGain).toLocaleString()} ({asset.lossGainPercentage.toFixed(2)}%)
//                         </p>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Cash Summary Tab */}
//         <TabsContent value="cash" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-3">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Total Cash</CardTitle>
//                 <CardDescription>All available funds</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold">${cashSummary.totalCash.toLocaleString()}</div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Available Cash</CardTitle>
//                 <CardDescription>Ready to invest</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-green-600">${cashSummary.availableCash.toLocaleString()}</div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Reserved Cash</CardTitle>
//                 <CardDescription>Pending transactions</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-orange-600">${cashSummary.reservedCash.toLocaleString()}</div>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Cash Breakdown</CardTitle>
//               <CardDescription>Detailed cash allocation</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between border-b pb-3">
//                   <span className="text-sm font-medium">Total Cash Holdings</span>
//                   <span className="text-sm font-bold">${cashSummary.totalCash.toLocaleString()}</span>
//                 </div>
//                 <div className="flex items-center justify-between border-b pb-3">
//                   <span className="text-sm font-medium">Available for Investment</span>
//                   <span className="text-sm font-bold text-green-600">
//                     ${cashSummary.availableCash.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium">Reserved (Pending)</span>
//                   <span className="text-sm font-bold text-orange-600">
//                     ${cashSummary.reservedCash.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }



"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button" // Import Button component
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { ArrowDownIcon, ArrowUpIcon, TrendingDown, TrendingUp, Wallet } from "lucide-react"

export function PortfolioContent() {
  // Mock data - replace with actual data from your database
  const portfolios = [
    {
      id: "1",
      name: "Growth Portfolio",
      description: "Long-term growth focused investments",
      totalValue: 125000,
      totalCost: 100000,
      totalLossGain: 25000,
      lossGainPercentage: 25,
      status: "ACTIVE",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Conservative Portfolio",
      description: "Low-risk stable investments",
      totalValue: 75000,
      totalCost: 70000,
      totalLossGain: 5000,
      lossGainPercentage: 7.14,
      status: "ACTIVE",
      createdAt: new Date("2024-03-20"),
    },
  ]

  const portfolioAssets = [
    {
      id: "1",
      portfolioId: "1",
      assetName: "Apple Inc.",
      assetSymbol: "AAPL",
      cost: 45000,
      stock: 250,
      closeValue: 55000,
      lossGain: 10000,
      lossGainPercentage: 22.22,
    },
    {
      id: "2",
      portfolioId: "1",
      assetName: "Microsoft Corp.",
      assetSymbol: "MSFT",
      cost: 35000,
      stock: 100,
      closeValue: 45000,
      lossGain: 10000,
      lossGainPercentage: 28.57,
    },
    {
      id: "3",
      portfolioId: "1",
      assetName: "Tesla Inc.",
      assetSymbol: "TSLA",
      cost: 20000,
      stock: 80,
      closeValue: 25000,
      lossGain: 5000,
      lossGainPercentage: 25,
    },
    {
      id: "4",
      portfolioId: "2",
      assetName: "US Treasury Bonds",
      assetSymbol: "UST",
      cost: 40000,
      stock: 400,
      closeValue: 42000,
      lossGain: 2000,
      lossGainPercentage: 5,
    },
    {
      id: "5",
      portfolioId: "2",
      assetName: "Gold ETF",
      assetSymbol: "GLD",
      cost: 30000,
      stock: 150,
      closeValue: 33000,
      lossGain: 3000,
      lossGainPercentage: 10,
    },
  ]

  const cashSummary = {
    totalCash: 50000,
    availableCash: 45000,
    reservedCash: 5000,
  }

  // Performance data for charts
  const performanceData = [
    { month: "Jan", value: 100000 },
    { month: "Feb", value: 105000 },
    { month: "Mar", value: 110000 },
    { month: "Apr", value: 108000 },
    { month: "May", value: 115000 },
    { month: "Jun", value: 125000 },
  ]

  // Asset allocation data
  const allocationData = portfolioAssets.map((asset) => ({
    name: asset.assetSymbol,
    value: asset.closeValue,
  }))

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  const totalPortfolioValue = portfolios.reduce((sum, p) => sum + p.totalValue, 0)
  const totalPortfolioCost = portfolios.reduce((sum, p) => sum + p.totalCost, 0)
  const totalPortfolioGain = portfolios.reduce((sum, p) => sum + p.totalLossGain, 0)
  const totalPortfolioGainPercentage = ((totalPortfolioGain / totalPortfolioCost) * 100).toFixed(2)

  return (
    <div className="p-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="cash">Cash Summary</TabsTrigger>
        </TabsList>

        {/* Overview Tab (Content remains unchanged) */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across {portfolios.length} portfolios</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost Basis</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalPortfolioCost.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Initial investment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${totalPortfolioGain.toLocaleString()}</div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUpIcon className="h-3 w-3" />
                  {totalPortfolioGainPercentage}% return
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Cash</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${cashSummary.availableCash.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Ready to invest</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Portfolio Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Total portfolio value over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Portfolio Value",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--chart-1))"
                        fill="hsl(var(--chart-1))"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Asset Allocation Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Distribution across all assets</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Value",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(80 * 100).toFixed(0)}%`}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Portfolios Tab (MODIFIED) */}
        <TabsContent value="portfolios" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {portfolios.map((portfolio) => {
              const assets = portfolioAssets.filter((a) => a.portfolioId === portfolio.id)
              const isPositive = portfolio.totalLossGain >= 0

              return (
                <Card key={portfolio.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{portfolio.name}</CardTitle>
                        <CardDescription>{portfolio.description}</CardDescription>
                      </div>
                      <Badge variant={portfolio.status === "ACTIVE" ? "default" : "secondary"}>
                        {portfolio.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Value</p>
                        <p className="text-2xl font-bold">${portfolio.totalValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cost Basis</p>
                        <p className="text-2xl font-bold">${portfolio.totalCost.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Gain/Loss</span>
                        <span
                          className={`text-sm font-semibold flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
                        >
                          {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}$
                          {Math.abs(portfolio.totalLossGain).toLocaleString()} (
                          {portfolio.lossGainPercentage.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Assets</span>
                        <span className="text-sm font-semibold">{assets.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Created</span>
                        <span className="text-sm">{portfolio.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* NEW: View Details Button */}
                    <div className="pt-4 border-t">
                      <Button className="w-full" onClick={() => console.log(`Viewing details for portfolio: ${portfolio.name}`)}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Assets Tab (Content remains unchanged) */}
        <TabsContent value="assets" className="space-y-6">
          {/* Asset Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Performance</CardTitle>
              <CardDescription>Gain/Loss by asset</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  lossGain: {
                    label: "Gain/Loss",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={portfolioAssets}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="assetSymbol" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="lossGain" fill="hsl(var(--chart-1))">
                      {portfolioAssets.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.lossGain >= 0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-5))"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Assets Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Assets</CardTitle>
              <CardDescription>Detailed view of all portfolio assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioAssets.map((asset) => {
                  const isPositive = asset.lossGain >= 0
                  const portfolio = portfolios.find((p) => p.id === asset.portfolioId)

                  return (
                    <div key={asset.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{asset.assetName}</p>
                          <Badge variant="outline">{asset.assetSymbol}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{portfolio?.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.stock} shares</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold">${asset.closeValue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Cost: ${asset.cost.toLocaleString()}</p>
                        <p
                          className={`text-sm font-semibold flex items-center justify-end gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
                        >
                          {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}$
                          {Math.abs(asset.lossGain).toLocaleString()} ({asset.lossGainPercentage.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Summary Tab (Content remains unchanged) */}
        <TabsContent value="cash" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Cash</CardTitle>
                <CardDescription>All available funds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${cashSummary.totalCash.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Cash</CardTitle>
                <CardDescription>Ready to invest</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">${cashSummary.availableCash.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reserved Cash</CardTitle>
                <CardDescription>Pending transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">${cashSummary.reservedCash.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cash Breakdown</CardTitle>
              <CardDescription>Detailed cash allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm font-medium">Total Cash Holdings</span>
                  <span className="text-sm font-bold">${cashSummary.totalCash.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm font-medium">Available for Investment</span>
                  <span className="text-sm font-bold text-green-600">
                    ${cashSummary.availableCash.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Reserved (Pending)</span>
                  <span className="text-sm font-bold text-orange-600">
                    ${cashSummary.reservedCash.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}