


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
// import { ArrowDownIcon, ArrowUpIcon, ArrowLeft, TrendingDown, TrendingUp, Wallet } from "lucide-react"
// import Link from "next/link"

// interface PortfolioDetailProps {
//   userPortfolio: any
// }

// export function UserPortfolioDetail({ userPortfolio }: PortfolioDetailProps) {
//   if (!userPortfolio || !userPortfolio.portfolio) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-[400px]">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle>Portfolio Not Found</CardTitle>
//             <CardDescription>This portfolio doesn't exist or you don't have access to it.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Link href="/user/portfolio">
//               <Button className="w-full">Back to Portfolios</Button>
//             </Link>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   // Calculate portfolio metrics
//   const totalCost = userPortfolio.userAssets.reduce((sum: any, asset: any) => sum + asset.costPrice, 0)
//   const totalValue = userPortfolio.userAssets.reduce((sum: any, asset: any) => sum + asset.closeValue, 0)
//   const totalLossGain = userPortfolio.userAssets.reduce((sum: any, asset: any) => sum + asset.lossGain, 0)
//   const lossGainPercentage = totalCost > 0 ? (totalLossGain / totalCost) * 100 : 0
//   const isPositive = totalLossGain >= 0

//   // Transform assets data
//   const assets = userPortfolio.userAssets.map((asset: any) => {
//     const assetLossGainPercentage = asset.costPrice > 0 ? (asset.lossGain / asset.costPrice) * 100 : 0
    
//     return {
//       id: asset.id,
//       assetName: asset.portfolioAsset.asset.description,
//       assetSymbol: asset.portfolioAsset.asset.symbol,
//       sector: asset.portfolioAsset.asset.sector,
//       cost: asset.costPrice,
//       stock: asset.stock,
//       closeValue: asset.closeValue,
//       lossGain: asset.lossGain,
//       lossGainPercentage: assetLossGainPercentage,
//     }
//   })

//   // Asset allocation data for pie chart
//   const allocationData = assets.map((asset: any) => ({
//     name: asset.assetSymbol,
//     value: asset.closeValue,
//   }))

//   // Sector allocation
//   const sectorAllocation = assets.reduce((acc: any, asset: any) => {
//     if (!acc[asset.sector]) {
//       acc[asset.sector] = 0
//     }
//     acc[asset.sector] += asset.closeValue
//     return acc
//   }, {})

//   const sectorData = Object.entries(sectorAllocation).map(([sector, value]) => ({
//     name: sector,
//     value: value as number,
//   }))

//   // Performance data (mock historical data - replace with real data)
//   const performanceData = [
//     { month: "Jan", value: totalCost * 0.85 },
//     { month: "Feb", value: totalCost * 0.90 },
//     { month: "Mar", value: totalCost * 0.95 },
//     { month: "Apr", value: totalCost * 0.92 },
//     { month: "May", value: totalCost * 1.00 },
//     { month: "Jun", value: totalValue },
//   ]

//   const COLORS = [
//     "hsl(var(--chart-1))",
//     "hsl(var(--chart-2))",
//     "hsl(var(--chart-3))",
//     "hsl(var(--chart-4))",
//     "hsl(var(--chart-5))",
//   ]

//   const portfolio = userPortfolio.portfolio

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Link href="/user/portfolio">
//             <Button variant="ghost" size="icon">
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//           </Link>
//           <div>
//             <div className="flex items-center gap-3">
//               <h1 className="text-3xl font-bold">{portfolio.name}</h1>
//               <Badge variant="default">ACTIVE</Badge>
//             </div>
//             <p className="text-muted-foreground mt-1">{portfolio.description || "No description"}</p>
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline">Edit Portfolio</Button>
//           <Button>Add Assets</Button>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Current Value</CardTitle>
//             <Wallet className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground">Portfolio value</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Cost Basis</CardTitle>
//             <TrendingDown className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground">Initial investment</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
//               ${Math.abs(totalLossGain).toLocaleString()}
//             </div>
//             <p className={`text-xs flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
//               {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
//               {lossGainPercentage.toFixed(2)}% return
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
//             <Wallet className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{assets.length}</div>
//             <p className="text-xs text-muted-foreground">Investments</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Tabs */}
//       <Tabs defaultValue="overview" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="assets">Assets</TabsTrigger>
//           <TabsTrigger value="allocation">Allocation</TabsTrigger>
//           <TabsTrigger value="analytics">Analytics</TabsTrigger>
//         </TabsList>

//         {/* Overview Tab */}
//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             {/* Portfolio Performance Chart */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Performance Over Time</CardTitle>
//                 <CardDescription>Portfolio value history</CardDescription>
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

//             {/* Portfolio Details */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Portfolio Details</CardTitle>
//                 <CardDescription>Key information</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center justify-between pb-3 border-b">
//                   <span className="text-sm font-medium">Risk Tolerance</span>
//                   <Badge variant="outline">{portfolio.riskTolerance}</Badge>
//                 </div>
//                 <div className="flex items-center justify-between pb-3 border-b">
//                   <span className="text-sm font-medium">Time Horizon</span>
//                   <span className="text-sm">{portfolio.timeHorizon}</span>
//                 </div>
//                 <div className="flex items-center justify-between pb-3 border-b">
//                   <span className="text-sm font-medium">Number of Assets</span>
//                   <span className="text-sm font-semibold">{assets.length}</span>
//                 </div>
//                 <div className="flex items-center justify-between pb-3 border-b">
//                   <span className="text-sm font-medium">Created Date</span>
//                   <span className="text-sm">{new Date(portfolio.createdAt).toLocaleDateString()}</span>
//                 </div>
//                 <div className="flex items-center justify-between pb-3 border-b">
//                   <span className="text-sm font-medium">Total Return</span>
//                   <span className={`text-sm font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
//                     {lossGainPercentage.toFixed(2)}%
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium">Portfolio ID</span>
//                   <span className="text-xs text-muted-foreground font-mono">{userPortfolio.id}</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Assets Tab */}
//         <TabsContent value="assets" className="space-y-6">
//           {/* Asset Performance Chart */}
        
//           {/* Assets Table */}
//           <Card>
//             <CardHeader>
//               <CardTitle>All Assets</CardTitle>
//               <CardDescription>Detailed asset breakdown</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b">
//                       <th className="text-left py-3 px-4 font-medium text-sm">Symbol</th>
//                       <th className="text-left py-3 px-4 font-medium text-sm">Description</th>
//                       <th className="text-left py-3 px-4 font-medium text-sm">Sector</th>
//                       <th className="text-right py-3 px-4 font-medium text-sm">Stocks</th>
//                       <th className="text-right py-3 px-4 font-medium text-sm">Allocation</th>
//                       <th className="text-right py-3 px-4 font-medium text-sm">Cost Per Share</th>
//                       <th className="text-right py-3 px-4 font-medium text-sm">Cost Price</th>
//                       <th className="text-right py-3 px-4 font-medium text-sm">Close Price</th>
//                       <th className="text-right py-3 px-4 font-medium text-sm">Close Value</th>
//                       <th className="text-right py-3 px-4 font-medium text-sm">U/L/G</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {assets.map((asset: any) => {
//                       const assetIsPositive = asset.lossGain >= 0
//                       const allocationPercent = ((asset.cost / totalCost) * 100).toFixed(1)
//                       const costPerShare = asset.stock > 0 ? (asset.cost / asset.stock) : 0

//                       return (
//                         <tr key={asset.id} className="border-b hover:bg-muted/50 transition-colors">
//                           <td className="py-3 px-4">
//                             <Badge variant="outline" className="font-mono">
//                               {asset.assetSymbol}
//                             </Badge>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="max-w-[200px]">
//                               <p className="text-sm font-medium truncate">{asset.assetName}</p>
//                             </div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <span className="text-sm text-muted-foreground">{asset.sector}</span>
//                           </td>
//                           <td className="py-3 px-4 text-right">
//                             <span className="text-sm font-mono">{asset.stock.toFixed(2)}</span>
//                           </td>
//                           <td className="py-3 px-4 text-right">
//                             <span className="text-sm font-semibold">{allocationPercent}%</span>
//                           </td>
//                           <td className="py-3 px-4 text-right">
//                             <span className="text-sm font-mono">${costPerShare.toFixed(2)}</span>
//                           </td>
//                           <td className="py-3 px-4 text-right">
//                             <span className="text-sm font-semibold">${asset.cost.toLocaleString()}</span>
//                           </td>
//                           <td className="py-3 px-4 text-right">
//                             <span className="text-sm font-mono">${(asset.closeValue / asset.stock).toFixed(2)}</span>
//                           </td>
//                           <td className="py-3 px-4 text-right">
//                             <span className="text-sm font-semibold">${asset.closeValue.toLocaleString()}</span>
//                           </td>
//                           <td className="py-3 px-4 text-right">
//                             <div className="flex flex-col items-end gap-0.5">
//                               <span
//                                 className={`text-sm font-bold ${assetIsPositive ? "text-green-600" : "text-red-600"}`}
//                               >
//                                 ${Math.abs(asset.lossGain).toLocaleString()}
//                               </span>
//                               <span
//                                 className={`text-xs font-semibold flex items-center gap-1 ${assetIsPositive ? "text-green-600" : "text-red-600"}`}
//                               >
//                                 {assetIsPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
//                                 {asset.lossGainPercentage.toFixed(2)}%
//                               </span>
//                             </div>
//                           </td>
//                         </tr>
//                       )
//                     })}
//                   </tbody>
//                   <tfoot>
//                     <tr className="border-t-2 font-semibold bg-muted/30">
//                       <td colSpan={3} className="py-3 px-4 text-sm">
//                         Total
//                       </td>
//                       <td className="py-3 px-4 text-right text-sm">
//                         {assets.reduce((sum: number, a: any) => sum + a.stock, 0).toFixed(2)}
//                       </td>
//                       <td className="py-3 px-4 text-right text-sm">100%</td>
//                       <td className="py-3 px-4 text-right text-sm">-</td>
//                       <td className="py-3 px-4 text-right text-sm">
//                         ${totalCost.toLocaleString()}
//                       </td>
//                       <td className="py-3 px-4 text-right text-sm">-</td>
//                       <td className="py-3 px-4 text-right text-sm">
//                         ${totalValue.toLocaleString()}
//                       </td>
//                       <td className="py-3 px-4 text-right">
//                         <div className="flex flex-col items-end gap-0.5">
//                           <span className={`text-sm font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
//                             ${Math.abs(totalLossGain).toLocaleString()}
//                           </span>
//                           <span className={`text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
//                             {lossGainPercentage.toFixed(2)}%
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </CardContent>
//           </Card>
//             <Card>
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
//                   <BarChart data={assets}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="assetSymbol" />
//                     <YAxis />
//                     <ChartTooltip content={<ChartTooltipContent />} />
//                     <Bar dataKey="lossGain" fill="hsl(var(--chart-1))">
//                       {assets.map((entry: any, index: number) => (
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

//         </TabsContent>

//         {/* Allocation Tab */}
//         <TabsContent value="allocation" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             {/* Asset Allocation Chart */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Asset Allocation</CardTitle>
//                 <CardDescription>Distribution by asset</CardDescription>
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
//                         {allocationData.map((entry:any, index:any) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <ChartTooltip content={<ChartTooltipContent />} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </ChartContainer>
//               </CardContent>
//             </Card>

//             {/* Sector Allocation Chart */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Sector Allocation</CardTitle>
//                 <CardDescription>Distribution by sector</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ChartContainer
//                   config={{
//                     value: {
//                       label: "Value",
//                       color: "hsl(var(--chart-2))",
//                     },
//                   }}
//                   className="h-[300px]"
//                 >
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={sectorData}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                       >
//                         {sectorData.map((entry, index) => (
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

//           {/* Allocation Table */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Allocation Breakdown</CardTitle>
//               <CardDescription>Percentage allocation by asset</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {assets.map((asset: any) => {
//                   const percentage = ((asset.closeValue / totalValue) * 100).toFixed(2)
                  
//                   return (
//                     <div key={asset.id} className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Badge variant="outline">{asset.assetSymbol}</Badge>
//                         <span className="text-sm">{asset.assetName}</span>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <span className="text-sm font-semibold">${asset.closeValue.toLocaleString()}</span>
//                         <span className="text-sm text-muted-foreground w-16 text-right">{percentage}%</span>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Analytics Tab */}
//         <TabsContent value="analytics" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             {/* Performance Metrics */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Performance Metrics</CardTitle>
//                 <CardDescription>Key performance indicators</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center justify-between pb-3 border-b">
//                   <span className="text-sm font-medium">Total Return</span>
//                   <span className={`text-sm font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
//                     {lossGainPercentage.toFixed(2)}%
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between pb-3 border-b">
//                   <span className="text-sm font-medium">Absolute Return</span>
//                   <span className={`text-sm font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
//                     ${Math.abs(totalLossGain).toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between pb-3 border-b">
//                   <span className="text-sm font-medium">Best Performing Asset</span>
//                   <span className="text-sm font-semibold">
//                     {assets.reduce((best: any, asset: any) => 
//                       asset.lossGainPercentage > (best?.lossGainPercentage || -Infinity) ? asset : best
//                     , null)?.assetSymbol || "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between pb-3 border-b">
//                   <span className="text-sm font-medium">Worst Performing Asset</span>
//                   <span className="text-sm font-semibold">
//                     {assets.reduce((worst: any, asset: any) => 
//                       asset.lossGainPercentage < (worst?.lossGainPercentage || Infinity) ? asset : worst
//                     , null)?.assetSymbol || "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium">Average Asset Return</span>
//                   <span className="text-sm font-semibold">
//                     {(assets.reduce((sum: number, asset: any) => sum + asset.lossGainPercentage, 0) / assets.length).toFixed(2)}%
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Risk Metrics */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Risk Analysis</CardTitle>
//                 <CardDescription>Portfolio risk assessment</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center justify-between pb-3 border-b">
//                   <span className="text-sm font-medium">Risk Tolerance</span>
//                   <Badge variant="outline">{portfolio.riskTolerance}</Badge>
//                 </div>
//                 <div className="flex items-center justify-between pb-3 border-b">
//                   <span className="text-sm font-medium">Diversification</span>
//                   <span className="text-sm font-semibold">{assets.length} assets</span>
//                 </div>
//                 <div className="flex items-center justify-between pb-3 border-b">
//                   <span className="text-sm font-medium">Sectors</span>
//                   <span className="text-sm font-semibold">{Object.keys(sectorAllocation).length} sectors</span>
//                 </div>
//                 <div className="flex items-center justify-between pb-3 border-b">
//                   <span className="text-sm font-medium">Largest Position</span>
//                   <span className="text-sm font-semibold">
//                     {((Math.max(...assets.map((a: any) => a.closeValue)) / totalValue) * 100).toFixed(2)}%
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium">Smallest Position</span>
//                   <span className="text-sm font-semibold">
//                     {((Math.min(...assets.map((a: any) => a.closeValue)) / totalValue) * 100).toFixed(2)}%
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
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
import { Button } from "@/components/ui/button"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { ArrowDownIcon, ArrowUpIcon, ArrowLeft, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"

interface PortfolioDetailProps {
  userPortfolio: any
}

// Enhanced color palette with more variety
const CHART_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#f97316", // Orange
  "#14b8a6", // Teal
  "#6366f1", // Indigo
  "#eab308", // Yellow
]

// Function to generate a color based on index
const getColor = (index: number) => CHART_COLORS[index % CHART_COLORS.length]

// Custom label component for pie charts
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null // Don't show label for very small slices

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="font-semibold text-xs"
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function UserPortfolioDetail({ userPortfolio }: PortfolioDetailProps) {
  if (!userPortfolio || !userPortfolio.portfolio) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Portfolio Not Found</CardTitle>
            <CardDescription>This portfolio doesn't exist or you don't have access to it.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/user/portfolio">
              <Button className="w-full">Back to Portfolios</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate portfolio metrics
  const totalCost = userPortfolio.userAssets.reduce((sum: any, asset: any) => sum + asset.costPrice, 0)
  const totalValue = userPortfolio.userAssets.reduce((sum: any, asset: any) => sum + asset.closeValue, 0)
  const totalLossGain = userPortfolio.userAssets.reduce((sum: any, asset: any) => sum + asset.lossGain, 0)
  const lossGainPercentage = totalCost > 0 ? (totalLossGain / totalCost) * 100 : 0
  const isPositive = totalLossGain >= 0

  // Transform assets data
  const assets = userPortfolio.userAssets.map((asset: any) => {
    const assetLossGainPercentage = asset.costPrice > 0 ? (asset.lossGain / asset.costPrice) * 100 : 0
    
    return {
      id: asset.id,
      assetName: asset.portfolioAsset.asset.description,
      assetSymbol: asset.portfolioAsset.asset.symbol,
      sector: asset.portfolioAsset.asset.sector,
      cost: asset.costPrice,
      stock: asset.stock,
      closeValue: asset.closeValue,
      lossGain: asset.lossGain,
      lossGainPercentage: assetLossGainPercentage,
    }
  })

  // Asset allocation data for pie chart with colors
  const allocationData = assets.map((asset: any, index: number) => ({
    name: asset.assetSymbol,
    value: asset.closeValue,
    color: getColor(index),
  }))

  // Sector allocation
  const sectorAllocation = assets.reduce((acc: any, asset: any) => {
    if (!acc[asset.sector]) {
      acc[asset.sector] = 0
    }
    acc[asset.sector] += asset.closeValue
    return acc
  }, {})

  const sectorData = Object.entries(sectorAllocation).map(([sector, value], index) => ({
    name: sector,
    value: value as number,
    color: getColor(index),
  }))

  // Performance data (mock historical data - replace with real data)
  const performanceData = [
    { month: "Jan", value: totalCost * 0.85 },
    { month: "Feb", value: totalCost * 0.90 },
    { month: "Mar", value: totalCost * 0.95 },
    { month: "Apr", value: totalCost * 0.92 },
    { month: "May", value: totalCost * 1.00 },
    { month: "Jun", value: totalValue },
  ]

  const portfolio = userPortfolio.portfolio

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/user/portfolio">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{portfolio.name}</h1>
              <Badge variant="default">ACTIVE</Badge>
            </div>
            <p className="text-muted-foreground mt-1">{portfolio.description || "No description"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Portfolio</Button>
          <Button>Add Assets</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Portfolio value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Basis</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Initial investment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
              ${Math.abs(totalLossGain).toLocaleString()}
            </div>
            <p className={`text-xs flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
              {lossGainPercentage.toFixed(2)}% return
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-muted-foreground">Investments</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Portfolio Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
                <CardDescription>Portfolio value history</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Portfolio Value",
                      color: "#3b82f6",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Portfolio Details */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Details</CardTitle>
                <CardDescription>Key information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">Risk Tolerance</span>
                  <Badge variant="outline">{portfolio.riskTolerance}</Badge>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">Time Horizon</span>
                  <span className="text-sm">{portfolio.timeHorizon}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">Number of Assets</span>
                  <span className="text-sm font-semibold">{assets.length}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">Created Date</span>
                  <span className="text-sm">{new Date(portfolio.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">Total Return</span>
                  <span className={`text-sm font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {lossGainPercentage.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Portfolio ID</span>
                  <span className="text-xs text-muted-foreground font-mono">{userPortfolio.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          {/* Assets Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Assets</CardTitle>
              <CardDescription>Detailed asset breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">Symbol</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Sector</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Stocks</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Allocation</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Cost Per Share</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Cost Price</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Close Price</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Close Value</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">U/L/G</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset: any, index: number) => {
                      const assetIsPositive = asset.lossGain >= 0
                      const allocationPercent = ((asset.cost / totalCost) * 100).toFixed(1)
                      const costPerShare = asset.stock > 0 ? (asset.cost / asset.stock) : 0

                      return (
                        <tr key={asset.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <Badge 
                              variant="outline" 
                              className="font-mono"
                              style={{ borderColor: getColor(index), color: getColor(index) }}
                            >
                              {asset.assetSymbol}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="max-w-[200px]">
                              <p className="text-sm font-medium truncate">{asset.assetName}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-muted-foreground">{asset.sector}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-sm font-mono">{asset.stock.toFixed(2)}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-sm font-semibold">{allocationPercent}%</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-sm font-mono">${costPerShare.toFixed(2)}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-sm font-semibold">${asset.cost.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-sm font-mono">${(asset.closeValue / asset.stock).toFixed(2)}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-sm font-semibold">${asset.closeValue.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex flex-col items-end gap-0.5">
                              <span
                                className={`text-sm font-bold ${assetIsPositive ? "text-green-600" : "text-red-600"}`}
                              >
                                ${Math.abs(asset.lossGain).toLocaleString()}
                              </span>
                              <span
                                className={`text-xs font-semibold flex items-center gap-1 ${assetIsPositive ? "text-green-600" : "text-red-600"}`}
                              >
                                {assetIsPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                                {asset.lossGainPercentage.toFixed(2)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-semibold bg-muted/30">
                      <td colSpan={3} className="py-3 px-4 text-sm">
                        Total
                      </td>
                      <td className="py-3 px-4 text-right text-sm">
                        {assets.reduce((sum: number, a: any) => sum + a.stock, 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right text-sm">100%</td>
                      <td className="py-3 px-4 text-right text-sm">-</td>
                      <td className="py-3 px-4 text-right text-sm">
                        ${totalCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-sm">-</td>
                      <td className="py-3 px-4 text-right text-sm">
                        ${totalValue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex flex-col items-end gap-0.5">
                          <span className={`text-sm font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                            ${Math.abs(totalLossGain).toLocaleString()}
                          </span>
                          <span className={`text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                            {lossGainPercentage.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

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
                    color: "#3b82f6",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assets}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="assetSymbol" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="lossGain" radius={[4, 4, 0, 0]}>
                      {assets.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.lossGain >= 0 ? "#10b981" : "#ef4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Allocation Tab */}
        <TabsContent value="allocation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Asset Allocation Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Distribution by asset</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Value",
                      color: "#3b82f6",
                    },
                  }}
                  className="h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        dataKey="value"
                        label={renderCustomLabel}
                      >
                        {allocationData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry: any) => (
                          <span style={{ color: entry.color }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Sector Allocation Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sector Allocation</CardTitle>
                <CardDescription>Distribution by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Value",
                      color: "#10b981",
                    },
                  }}
                  className="h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        dataKey="value"
                        label={renderCustomLabel}
                      >
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry: any) => (
                          <span style={{ color: entry.color }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Allocation Table */}
          <Card>
            <CardHeader>
              <CardTitle>Allocation Breakdown</CardTitle>
              <CardDescription>Percentage allocation by asset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assets.map((asset: any, index: number) => {
                  const percentage = ((asset.closeValue / totalValue) * 100).toFixed(2)
                  
                  return (
                    <div key={asset.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getColor(index) }}
                        />
                        <Badge variant="outline" style={{ borderColor: getColor(index), color: getColor(index) }}>
                          {asset.assetSymbol}
                        </Badge>
                        <span className="text-sm">{asset.assetName}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold">${asset.closeValue.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground w-16 text-right">{percentage}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">Total Return</span>
                  <span className={`text-sm font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {lossGainPercentage.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">Absolute Return</span>
                  <span className={`text-sm font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    ${Math.abs(totalLossGain).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">Best Performing Asset</span>
                  <span className="text-sm font-semibold">
                    {assets.reduce((best: any, asset: any) => 
                      asset.lossGainPercentage > (best?.lossGainPercentage || -Infinity) ? asset : best
                    , null)?.assetSymbol || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">Worst Performing Asset</span>
                  <span className="text-sm font-semibold">
                    {assets.reduce((worst: any, asset: any) => 
                      asset.lossGainPercentage < (worst?.lossGainPercentage || Infinity) ? asset : worst
                    , null)?.assetSymbol || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Asset Return</span>
                  <span className="text-sm font-semibold">
                    {(assets.reduce((sum: number, asset: any) => sum + asset.lossGainPercentage, 0) / assets.length).toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Risk Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
                <CardDescription>Portfolio risk assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">Risk Tolerance</span>
                  <Badge variant="outline">{portfolio.riskTolerance}</Badge>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">Diversification</span>
                  <span className="text-sm font-semibold">{assets.length} assets</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">Sectors</span>
                  <span className="text-sm font-semibold">{Object.keys(sectorAllocation).length} sectors</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">Largest Position</span>
                  <span className="text-sm font-semibold">
                    {((Math.max(...assets.map((a: any) => a.closeValue)) / totalValue) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Smallest Position</span>
                  <span className="text-sm font-semibold">
                    {((Math.min(...assets.map((a: any) => a.closeValue)) / totalValue) * 100).toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}