

// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// import { Button } from "@/components/ui/button"
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
// import Link from "next/link"

// interface UserPortfolioAsset {
//   id: string
//   costPrice: number
//   stock: number
//   closeValue: number
//   lossGain: number
//   portfolioAsset: {
//     asset: {
//       symbol: string
//       description: string
//       sector: string
//     }
//   }
// }

// interface UserPortfolio {
//   id: string
//   userId: string
//   portfolioId: string
//   portfolioValue: number
//   portfolio?: {
//     id: string
//     name: string
//     description: string | null
//     timeHorizon: string
//     riskTolerance: string
//     createdAt: Date | string
//   }
//   userAssets: UserPortfolioAsset[]
//   createdAt: Date | string
//   user?: {
//     wallet?: {
//       balance: number
//       netAssetValue: number
//     } | null
//   }
// }

// interface PortfolioContentProps {
//   userPortfolios: any[]
// }

// export function PortfolioContent({ userPortfolios }: PortfolioContentProps) {
//   // Filter out portfolios without portfolio data
//   const validPortfolios = userPortfolios.filter(up => up.portfolio)

//   // Transform userPortfolios into portfolio format
//   const portfolios = validPortfolios.map((up) => {
//     const totalCost = up.userAssets.reduce((sum:any, asset:any) => sum + asset.costPrice, 0)
//     const totalValue = up.userAssets.reduce((sum:any, asset:any) => sum + asset.closeValue, 0)
//     const totalLossGain = up.userAssets.reduce((sum:any, asset:any) => sum + asset.lossGain, 0)
//     const lossGainPercentage = totalCost > 0 ? (totalLossGain / totalCost) * 100 : 0

//     return {
//       id: up.portfolio!.id,
//       name: up.portfolio!.name,
//       userPortfolioId: up.id, // ADD THIS LINE - This is the UserPortfolio.id
//       description: up.portfolio!.description || "No description",
//       totalValue: totalValue,
//       totalCost: totalCost,
//       totalLossGain: totalLossGain,
//       lossGainPercentage: lossGainPercentage,
//       status: "ACTIVE",
//       createdAt: new Date(up.portfolio!.createdAt),
//       timeHorizon: up.portfolio!.timeHorizon,
//       riskTolerance: up.portfolio!.riskTolerance,
//     }
//   })

//   // Transform userAssets into portfolioAssets format
//   const portfolioAssets = validPortfolios.flatMap((up) =>
//     up.userAssets.map((asset:any) => {
//       const lossGainPercentage = asset.costPrice > 0 ? (asset.lossGain / asset.costPrice) * 100 : 0
      
//       return {
//         id: asset.id,
//         portfolioId: up.portfolio!.id,
//         assetName: asset.portfolioAsset.asset.description,
//         assetSymbol: asset.portfolioAsset.asset.symbol,
//         sector: asset.portfolioAsset.asset.sector,
//         cost: asset.costPrice,
//         stock: asset.stock,
//         closeValue: asset.closeValue,
//         lossGain: asset.lossGain,
//         lossGainPercentage: lossGainPercentage,
//       }
//     })
//   )

//   // Calculate cash summary from user's wallet
//   const wallet = validPortfolios[0]?.user?.wallet
//   const cashSummary = {
//     totalCash: wallet?.balance || 0,
//     availableCash: wallet?.netAssetValue || 0,
//     reservedCash: (wallet?.balance || 0) - (wallet?.netAssetValue || 0),
//   }

//   // Generate performance data (mock - you'd need historical data for this)
//   const performanceData = [
//     { month: "Jan", value: portfolios.reduce((sum, p) => sum + p.totalCost, 0) * 0.9 },
//     { month: "Feb", value: portfolios.reduce((sum, p) => sum + p.totalCost, 0) * 0.95 },
//     { month: "Mar", value: portfolios.reduce((sum, p) => sum + p.totalCost, 0) * 1.0 },
//     { month: "Apr", value: portfolios.reduce((sum, p) => sum + p.totalCost, 0) * 0.98 },
//     { month: "May", value: portfolios.reduce((sum, p) => sum + p.totalCost, 0) * 1.05 },
//     { month: "Jun", value: portfolios.reduce((sum, p) => sum + p.totalValue, 0) },
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
//   const totalPortfolioGainPercentage = totalPortfolioCost > 0 
//     ? ((totalPortfolioGain / totalPortfolioCost) * 100).toFixed(2) 
//     : "0.00"

//   // Handle empty state
//   if (validPortfolios.length === 0) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-[400px]">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle>No Portfolios Found</CardTitle>
//             <CardDescription>You don't have any portfolios yet.</CardDescription>
//           </CardHeader>
//         </Card>
//       </div>
//     )
//   }

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
//                 <div className={`text-2xl font-bold ${totalPortfolioGain >= 0 ? "text-green-600" : "text-red-600"}`}>
//                   ${Math.abs(totalPortfolioGain).toLocaleString()}
//                 </div>
//                 <p className={`text-xs flex items-center gap-1 ${totalPortfolioGain >= 0 ? "text-green-600" : "text-red-600"}`}>
//                   {totalPortfolioGain >= 0 ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
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
//                         label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
//                         <span className="text-sm text-muted-foreground">Risk Tolerance</span>
//                         <span className="text-sm">{portfolio.riskTolerance}</span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-muted-foreground">Time Horizon</span>
//                         <span className="text-sm">{portfolio.timeHorizon}</span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-muted-foreground">Created</span>
//                         <span className="text-sm">{portfolio.createdAt.toLocaleDateString()}</span>
//                       </div>
//                     </div>

//                     <div className="pt-4 border-t">
//                      <Link href={`/user/portfolio/${portfolio.userPortfolioId}`}>
//                       <Button className="w-full" onClick={() => console.log(`Viewing details for portfolio: ${portfolio.name}`)}>
//                         View Details
//                       </Button></Link>
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
//                         <p className="text-xs text-muted-foreground">{asset.stock.toFixed(2)} shares · {asset.sector}</p>
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon, ArrowUpIcon, TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"

interface UserPortfolioAsset {
  id: string
  costPrice: number
  stock: number
  closeValue: number
  lossGain: number
  portfolioAsset: {
    asset: {
      symbol: string
      description: string
      sector: string
    }
  }
}

interface PortfolioListProps {
  userPortfolios: any[]
}

export function PortfolioList({ userPortfolios }: PortfolioListProps) {
  // Filter out portfolios without portfolio data
  const validPortfolios = userPortfolios.filter(up => up.portfolio)

  // Transform userPortfolios into portfolio format
  const portfolios = validPortfolios.map((up) => {
    const totalCost = up.userAssets.reduce((sum: any, asset: any) => sum + asset.costPrice, 0)
    const totalValue = up.userAssets.reduce((sum: any, asset: any) => sum + asset.closeValue, 0)
    const totalLossGain = up.userAssets.reduce((sum: any, asset: any) => sum + asset.lossGain, 0)
    const lossGainPercentage = totalCost > 0 ? (totalLossGain / totalCost) * 100 : 0

    return {
      id: up.portfolio!.id,
      name: up.portfolio!.name,
      userPortfolioId: up.id,
      description: up.portfolio!.description || "No description",
      totalValue: totalValue,
      totalCost: totalCost,
      totalLossGain: totalLossGain,
      lossGainPercentage: lossGainPercentage,
      status: "ACTIVE",
      createdAt: new Date(up.portfolio!.createdAt),
      timeHorizon: up.portfolio!.timeHorizon,
      riskTolerance: up.portfolio!.riskTolerance,
      assetCount: up.userAssets.length,
    }
  })

  // Calculate totals
  const totalPortfolioValue = portfolios.reduce((sum, p) => sum + p.totalValue, 0)
  const totalPortfolioCost = portfolios.reduce((sum, p) => sum + p.totalCost, 0)
  const totalPortfolioGain = portfolios.reduce((sum, p) => sum + p.totalLossGain, 0)
  const totalPortfolioGainPercentage = totalPortfolioCost > 0 
    ? ((totalPortfolioGain / totalPortfolioCost) * 100).toFixed(2) 
    : "0.00"

  // Get wallet data
  const wallet = validPortfolios[0]?.user?.wallet

  // Handle empty state
  if (validPortfolios.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Portfolios Found</CardTitle>
            <CardDescription>You don't have any portfolios yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/user/portfolio/create">
              <Button className="w-full">Create Your First Portfolio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
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
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPortfolioGain >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${Math.abs(totalPortfolioGain).toLocaleString()}
            </div>
            <p className={`text-xs flex items-center gap-1 ${totalPortfolioGain >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalPortfolioGain >= 0 ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
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
            <div className="text-2xl font-bold">${(wallet?.netAssetValue || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ready to invest</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolios.reduce((sum, p) => sum + p.assetCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all portfolios</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolios Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">My Portfolios</h2>
         
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => {
            const isPositive = portfolio.totalLossGain >= 0

            return (
              <Card key={portfolio.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{portfolio.name}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {portfolio.description}
                      </CardDescription>
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
                      <p className="text-xl font-bold">${portfolio.totalValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cost Basis</p>
                      <p className="text-xl font-bold">${portfolio.totalCost.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Gain/Loss</span>
                      <span
                        className={`text-sm font-semibold flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
                      >
                        {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                        ${Math.abs(portfolio.totalLossGain).toLocaleString()} ({portfolio.lossGainPercentage.toFixed(2)}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Assets</span>
                      <span className="text-sm font-semibold">{portfolio.assetCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Risk</span>
                      <Badge variant="outline" className="text-xs">{portfolio.riskTolerance}</Badge>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link href={`/user/portfolio/${portfolio.userPortfolioId}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}