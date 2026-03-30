


// // "use client"

// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // import { Badge } from "@/components/ui/badge"
// // import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// // import { Button } from "@/components/ui/button"
// // import {
// //   Area,
// //   AreaChart,
// //   Bar,
// //   BarChart,
// //   CartesianGrid,
// //   Cell,
// //   Pie,
// //   PieChart,
// //   ResponsiveContainer,
// //   XAxis,
// //   YAxis,
// // } from "recharts"
// // import { ArrowDownIcon, ArrowUpIcon, ArrowLeft, TrendingDown, TrendingUp, Wallet } from "lucide-react"
// // import Link from "next/link"

// // interface PortfolioDetailProps {
// //   userPortfolio: any
// // }

// // export function UserPortfolioDetail({ userPortfolio }: PortfolioDetailProps) {
// //   if (!userPortfolio || !userPortfolio.portfolio) {
// //     return (
// //       <div className="p-6 flex items-center justify-center min-h-[400px]">
// //         <Card className="w-full max-w-md">
// //           <CardHeader>
// //             <CardTitle>Portfolio Not Found</CardTitle>
// //             <CardDescription>This portfolio doesn't exist or you don't have access to it.</CardDescription>
// //           </CardHeader>
// //           <CardContent>
// //             <Link href="/user/portfolio">
// //               <Button className="w-full">Back to Portfolios</Button>
// //             </Link>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     )
// //   }

// //   // Calculate portfolio metrics
// //   const totalCost = userPortfolio.userAssets.reduce((sum: any, asset: any) => sum + asset.costPrice, 0)
// //   const totalValue = userPortfolio.userAssets.reduce((sum: any, asset: any) => sum + asset.closeValue, 0)
// //   const totalLossGain = userPortfolio.userAssets.reduce((sum: any, asset: any) => sum + asset.lossGain, 0)
// //   const lossGainPercentage = totalCost > 0 ? (totalLossGain / totalCost) * 100 : 0
// //   const isPositive = totalLossGain >= 0

// //   // Transform assets data
// //   const assets = userPortfolio.userAssets.map((asset: any) => {
// //     const assetLossGainPercentage = asset.costPrice > 0 ? (asset.lossGain / asset.costPrice) * 100 : 0
    
// //     return {
// //       id: asset.id,
// //       assetName: asset.portfolioAsset.asset.description,
// //       assetSymbol: asset.portfolioAsset.asset.symbol,
// //       sector: asset.portfolioAsset.asset.sector,
// //       cost: asset.costPrice,
// //       stock: asset.stock,
// //       closeValue: asset.closeValue,
// //       lossGain: asset.lossGain,
// //       lossGainPercentage: assetLossGainPercentage,
// //     }
// //   })

// //   // Asset allocation data for pie chart
// //   const allocationData = assets.map((asset: any) => ({
// //     name: asset.assetSymbol,
// //     value: asset.closeValue,
// //   }))

// //   // Sector allocation
// //   const sectorAllocation = assets.reduce((acc: any, asset: any) => {
// //     if (!acc[asset.sector]) {
// //       acc[asset.sector] = 0
// //     }
// //     acc[asset.sector] += asset.closeValue
// //     return acc
// //   }, {})

// //   const sectorData = Object.entries(sectorAllocation).map(([sector, value]) => ({
// //     name: sector,
// //     value: value as number,
// //   }))

// //   // Performance data (mock historical data - replace with real data)
// //   const performanceData = [
// //     { month: "Jan", value: totalCost * 0.85 },
// //     { month: "Feb", value: totalCost * 0.90 },
// //     { month: "Mar", value: totalCost * 0.95 },
// //     { month: "Apr", value: totalCost * 0.92 },
// //     { month: "May", value: totalCost * 1.00 },
// //     { month: "Jun", value: totalValue },
// //   ]

// //   const COLORS = [
// //     "hsl(var(--chart-1))",
// //     "hsl(var(--chart-2))",
// //     "hsl(var(--chart-3))",
// //     "hsl(var(--chart-4))",
// //     "hsl(var(--chart-5))",
// //   ]

// //   const portfolio = userPortfolio.portfolio

// //   return (
// //     <div className="p-6 space-y-6">
// //       {/* Header */}
// //       <div className="flex items-center justify-between">
// //         <div className="flex items-center gap-4">
// //           <Link href="/user/portfolio">
// //             <Button variant="ghost" size="icon">
// //               <ArrowLeft className="h-4 w-4" />
// //             </Button>
// //           </Link>
// //           <div>
// //             <div className="flex items-center gap-3">
// //               <h1 className="text-3xl font-bold">{portfolio.name}</h1>
// //               <Badge variant="default">ACTIVE</Badge>
// //             </div>
// //             <p className="text-muted-foreground mt-1">{portfolio.description || "No description"}</p>
// //           </div>
// //         </div>
// //         <div className="flex gap-2">
// //           <Button variant="outline">Edit Portfolio</Button>
// //           <Button>Add Assets</Button>
// //         </div>
// //       </div>

// //       {/* Summary Cards */}
// //       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
// //         <Card>
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-medium">Current Value</CardTitle>
// //             <Wallet className="h-4 w-4 text-muted-foreground" />
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
// //             <p className="text-xs text-muted-foreground">Portfolio value</p>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-medium">Cost Basis</CardTitle>
// //             <TrendingDown className="h-4 w-4 text-muted-foreground" />
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
// //             <p className="text-xs text-muted-foreground">Initial investment</p>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
// //             <TrendingUp className="h-4 w-4 text-muted-foreground" />
// //           </CardHeader>
// //           <CardContent>
// //             <div className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
// //               ${Math.abs(totalLossGain).toLocaleString()}
// //             </div>
// //             <p className={`text-xs flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
// //               {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
// //               {lossGainPercentage.toFixed(2)}% return
// //             </p>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
// //             <Wallet className="h-4 w-4 text-muted-foreground" />
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold">{assets.length}</div>
// //             <p className="text-xs text-muted-foreground">Investments</p>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {/* Tabs */}
// //       <Tabs defaultValue="overview" className="space-y-6">
// //         <TabsList>
// //           <TabsTrigger value="overview">Overview</TabsTrigger>
// //           <TabsTrigger value="assets">Assets</TabsTrigger>
// //           <TabsTrigger value="allocation">Allocation</TabsTrigger>
// //           <TabsTrigger value="analytics">Analytics</TabsTrigger>
// //         </TabsList>

// //         {/* Overview Tab */}
// //         <TabsContent value="overview" className="space-y-6">
// //           <div className="grid gap-6 md:grid-cols-2">
// //             {/* Portfolio Performance Chart */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Performance Over Time</CardTitle>
// //                 <CardDescription>Portfolio value history</CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <ChartContainer
// //                   config={{
// //                     value: {
// //                       label: "Portfolio Value",
// //                       color: "hsl(var(--chart-1))",
// //                     },
// //                   }}
// //                   className="h-[300px]"
// //                 >
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <AreaChart data={performanceData}>
// //                       <CartesianGrid strokeDasharray="3 3" />
// //                       <XAxis dataKey="month" />
// //                       <YAxis />
// //                       <ChartTooltip content={<ChartTooltipContent />} />
// //                       <Area
// //                         type="monotone"
// //                         dataKey="value"
// //                         stroke="hsl(var(--chart-1))"
// //                         fill="hsl(var(--chart-1))"
// //                         fillOpacity={0.2}
// //                       />
// //                     </AreaChart>
// //                   </ResponsiveContainer>
// //                 </ChartContainer>
// //               </CardContent>
// //             </Card>

// //             {/* Portfolio Details */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Portfolio Details</CardTitle>
// //                 <CardDescription>Key information</CardDescription>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div className="flex items-center justify-between pb-3 border-b">
// //                   <span className="text-sm font-medium">Risk Tolerance</span>
// //                   <Badge variant="outline">{portfolio.riskTolerance}</Badge>
// //                 </div>
// //                 <div className="flex items-center justify-between pb-3 border-b">
// //                   <span className="text-sm font-medium">Time Horizon</span>
// //                   <span className="text-sm">{portfolio.timeHorizon}</span>
// //                 </div>
// //                 <div className="flex items-center justify-between pb-3 border-b">
// //                   <span className="text-sm font-medium">Number of Assets</span>
// //                   <span className="text-sm font-semibold">{assets.length}</span>
// //                 </div>
// //                 <div className="flex items-center justify-between pb-3 border-b">
// //                   <span className="text-sm font-medium">Created Date</span>
// //                   <span className="text-sm">{new Date(portfolio.createdAt).toLocaleDateString()}</span>
// //                 </div>
// //                 <div className="flex items-center justify-between pb-3 border-b">
// //                   <span className="text-sm font-medium">Total Return</span>
// //                   <span className={`text-sm font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
// //                     {lossGainPercentage.toFixed(2)}%
// //                   </span>
// //                 </div>
// //                 <div className="flex items-center justify-between">
// //                   <span className="text-sm font-medium">Portfolio ID</span>
// //                   <span className="text-xs text-muted-foreground font-mono">{userPortfolio.id}</span>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </TabsContent>

// //         {/* Assets Tab */}
// //         <TabsContent value="assets" className="space-y-6">
// //           {/* Asset Performance Chart */}
        
// //           {/* Assets Table */}
// //           <Card>
// //             <CardHeader>
// //               <CardTitle>All Assets</CardTitle>
// //               <CardDescription>Detailed asset breakdown</CardDescription>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="overflow-x-auto">
// //                 <table className="w-full">
// //                   <thead>
// //                     <tr className="border-b">
// //                       <th className="text-left py-3 px-4 font-medium text-sm">Symbol</th>
// //                       <th className="text-left py-3 px-4 font-medium text-sm">Description</th>
// //                       <th className="text-left py-3 px-4 font-medium text-sm">Sector</th>
// //                       <th className="text-right py-3 px-4 font-medium text-sm">Stocks</th>
// //                       <th className="text-right py-3 px-4 font-medium text-sm">Allocation</th>
// //                       <th className="text-right py-3 px-4 font-medium text-sm">Cost Per Share</th>
// //                       <th className="text-right py-3 px-4 font-medium text-sm">Cost Price</th>
// //                       <th className="text-right py-3 px-4 font-medium text-sm">Close Price</th>
// //                       <th className="text-right py-3 px-4 font-medium text-sm">Close Value</th>
// //                       <th className="text-right py-3 px-4 font-medium text-sm">U/L/G</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {assets.map((asset: any) => {
// //                       const assetIsPositive = asset.lossGain >= 0
// //                       const allocationPercent = ((asset.cost / totalCost) * 100).toFixed(1)
// //                       const costPerShare = asset.stock > 0 ? (asset.cost / asset.stock) : 0

// //                       return (
// //                         <tr key={asset.id} className="border-b hover:bg-muted/50 transition-colors">
// //                           <td className="py-3 px-4">
// //                             <Badge variant="outline" className="font-mono">
// //                               {asset.assetSymbol}
// //                             </Badge>
// //                           </td>
// //                           <td className="py-3 px-4">
// //                             <div className="max-w-[200px]">
// //                               <p className="text-sm font-medium truncate">{asset.assetName}</p>
// //                             </div>
// //                           </td>
// //                           <td className="py-3 px-4">
// //                             <span className="text-sm text-muted-foreground">{asset.sector}</span>
// //                           </td>
// //                           <td className="py-3 px-4 text-right">
// //                             <span className="text-sm font-mono">{asset.stock.toFixed(2)}</span>
// //                           </td>
// //                           <td className="py-3 px-4 text-right">
// //                             <span className="text-sm font-semibold">{allocationPercent}%</span>
// //                           </td>
// //                           <td className="py-3 px-4 text-right">
// //                             <span className="text-sm font-mono">${costPerShare.toFixed(2)}</span>
// //                           </td>
// //                           <td className="py-3 px-4 text-right">
// //                             <span className="text-sm font-semibold">${asset.cost.toLocaleString()}</span>
// //                           </td>
// //                           <td className="py-3 px-4 text-right">
// //                             <span className="text-sm font-mono">${(asset.closeValue / asset.stock).toFixed(2)}</span>
// //                           </td>
// //                           <td className="py-3 px-4 text-right">
// //                             <span className="text-sm font-semibold">${asset.closeValue.toLocaleString()}</span>
// //                           </td>
// //                           <td className="py-3 px-4 text-right">
// //                             <div className="flex flex-col items-end gap-0.5">
// //                               <span
// //                                 className={`text-sm font-bold ${assetIsPositive ? "text-green-600" : "text-red-600"}`}
// //                               >
// //                                 ${Math.abs(asset.lossGain).toLocaleString()}
// //                               </span>
// //                               <span
// //                                 className={`text-xs font-semibold flex items-center gap-1 ${assetIsPositive ? "text-green-600" : "text-red-600"}`}
// //                               >
// //                                 {assetIsPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
// //                                 {asset.lossGainPercentage.toFixed(2)}%
// //                               </span>
// //                             </div>
// //                           </td>
// //                         </tr>
// //                       )
// //                     })}
// //                   </tbody>
// //                   <tfoot>
// //                     <tr className="border-t-2 font-semibold bg-muted/30">
// //                       <td colSpan={3} className="py-3 px-4 text-sm">
// //                         Total
// //                       </td>
// //                       <td className="py-3 px-4 text-right text-sm">
// //                         {assets.reduce((sum: number, a: any) => sum + a.stock, 0).toFixed(2)}
// //                       </td>
// //                       <td className="py-3 px-4 text-right text-sm">100%</td>
// //                       <td className="py-3 px-4 text-right text-sm">-</td>
// //                       <td className="py-3 px-4 text-right text-sm">
// //                         ${totalCost.toLocaleString()}
// //                       </td>
// //                       <td className="py-3 px-4 text-right text-sm">-</td>
// //                       <td className="py-3 px-4 text-right text-sm">
// //                         ${totalValue.toLocaleString()}
// //                       </td>
// //                       <td className="py-3 px-4 text-right">
// //                         <div className="flex flex-col items-end gap-0.5">
// //                           <span className={`text-sm font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
// //                             ${Math.abs(totalLossGain).toLocaleString()}
// //                           </span>
// //                           <span className={`text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
// //                             {lossGainPercentage.toFixed(2)}%
// //                           </span>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   </tfoot>
// //                 </table>
// //               </div>
// //             </CardContent>
// //           </Card>
// //             <Card>
// //             <CardHeader>
// //               <CardTitle>Asset Performance</CardTitle>
// //               <CardDescription>Gain/Loss by asset</CardDescription>
// //             </CardHeader>
// //             <CardContent>
// //               <ChartContainer
// //                 config={{
// //                   lossGain: {
// //                     label: "Gain/Loss",
// //                     color: "hsl(var(--chart-1))",
// //                   },
// //                 }}
// //                 className="h-[300px]"
// //               >
// //                 <ResponsiveContainer width="100%" height="100%">
// //                   <BarChart data={assets}>
// //                     <CartesianGrid strokeDasharray="3 3" />
// //                     <XAxis dataKey="assetSymbol" />
// //                     <YAxis />
// //                     <ChartTooltip content={<ChartTooltipContent />} />
// //                     <Bar dataKey="lossGain" fill="hsl(var(--chart-1))">
// //                       {assets.map((entry: any, index: number) => (
// //                         <Cell
// //                           key={`cell-${index}`}
// //                           fill={entry.lossGain >= 0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-5))"}
// //                         />
// //                       ))}
// //                     </Bar>
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               </ChartContainer>
// //             </CardContent>
// //           </Card>

// //         </TabsContent>

// //         {/* Allocation Tab */}
// //         <TabsContent value="allocation" className="space-y-6">
// //           <div className="grid gap-6 md:grid-cols-2">
// //             {/* Asset Allocation Chart */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Asset Allocation</CardTitle>
// //                 <CardDescription>Distribution by asset</CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <ChartContainer
// //                   config={{
// //                     value: {
// //                       label: "Value",
// //                       color: "hsl(var(--chart-1))",
// //                     },
// //                   }}
// //                   className="h-[300px]"
// //                 >
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <PieChart>
// //                       <Pie
// //                         data={allocationData}
// //                         cx="50%"
// //                         cy="50%"
// //                         labelLine={false}
// //                         outerRadius={80}
// //                         fill="#8884d8"
// //                         dataKey="value"
// //                         label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
// //                       >
// //                         {allocationData.map((entry:any, index:any) => (
// //                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //                         ))}
// //                       </Pie>
// //                       <ChartTooltip content={<ChartTooltipContent />} />
// //                     </PieChart>
// //                   </ResponsiveContainer>
// //                 </ChartContainer>
// //               </CardContent>
// //             </Card>

// //             {/* Sector Allocation Chart */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Sector Allocation</CardTitle>
// //                 <CardDescription>Distribution by sector</CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <ChartContainer
// //                   config={{
// //                     value: {
// //                       label: "Value",
// //                       color: "hsl(var(--chart-2))",
// //                     },
// //                   }}
// //                   className="h-[300px]"
// //                 >
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <PieChart>
// //                       <Pie
// //                         data={sectorData}
// //                         cx="50%"
// //                         cy="50%"
// //                         labelLine={false}
// //                         outerRadius={80}
// //                         fill="#8884d8"
// //                         dataKey="value"
// //                         label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
// //                       >
// //                         {sectorData.map((entry, index) => (
// //                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //                         ))}
// //                       </Pie>
// //                       <ChartTooltip content={<ChartTooltipContent />} />
// //                     </PieChart>
// //                   </ResponsiveContainer>
// //                 </ChartContainer>
// //               </CardContent>
// //             </Card>
// //           </div>

// //           {/* Allocation Table */}
// //           <Card>
// //             <CardHeader>
// //               <CardTitle>Allocation Breakdown</CardTitle>
// //               <CardDescription>Percentage allocation by asset</CardDescription>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="space-y-3">
// //                 {assets.map((asset: any) => {
// //                   const percentage = ((asset.closeValue / totalValue) * 100).toFixed(2)
                  
// //                   return (
// //                     <div key={asset.id} className="flex items-center justify-between">
// //                       <div className="flex items-center gap-2">
// //                         <Badge variant="outline">{asset.assetSymbol}</Badge>
// //                         <span className="text-sm">{asset.assetName}</span>
// //                       </div>
// //                       <div className="flex items-center gap-4">
// //                         <span className="text-sm font-semibold">${asset.closeValue.toLocaleString()}</span>
// //                         <span className="text-sm text-muted-foreground w-16 text-right">{percentage}%</span>
// //                       </div>
// //                     </div>
// //                   )
// //                 })}
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </TabsContent>

// //         {/* Analytics Tab */}
// //         <TabsContent value="analytics" className="space-y-6">
// //           <div className="grid gap-6 md:grid-cols-2">
// //             {/* Performance Metrics */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Performance Metrics</CardTitle>
// //                 <CardDescription>Key performance indicators</CardDescription>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div className="flex items-center justify-between pb-3 border-b">
// //                   <span className="text-sm font-medium">Total Return</span>
// //                   <span className={`text-sm font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
// //                     {lossGainPercentage.toFixed(2)}%
// //                   </span>
// //                 </div>
// //                 <div className="flex items-center justify-between pb-3 border-b">
// //                   <span className="text-sm font-medium">Absolute Return</span>
// //                   <span className={`text-sm font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
// //                     ${Math.abs(totalLossGain).toLocaleString()}
// //                   </span>
// //                 </div>
// //                 <div className="flex items-center justify-between pb-3 border-b">
// //                   <span className="text-sm font-medium">Best Performing Asset</span>
// //                   <span className="text-sm font-semibold">
// //                     {assets.reduce((best: any, asset: any) => 
// //                       asset.lossGainPercentage > (best?.lossGainPercentage || -Infinity) ? asset : best
// //                     , null)?.assetSymbol || "N/A"}
// //                   </span>
// //                 </div>
// //                 <div className="flex items-center justify-between pb-3 border-b">
// //                   <span className="text-sm font-medium">Worst Performing Asset</span>
// //                   <span className="text-sm font-semibold">
// //                     {assets.reduce((worst: any, asset: any) => 
// //                       asset.lossGainPercentage < (worst?.lossGainPercentage || Infinity) ? asset : worst
// //                     , null)?.assetSymbol || "N/A"}
// //                   </span>
// //                 </div>
// //                 <div className="flex items-center justify-between">
// //                   <span className="text-sm font-medium">Average Asset Return</span>
// //                   <span className="text-sm font-semibold">
// //                     {(assets.reduce((sum: number, asset: any) => sum + asset.lossGainPercentage, 0) / assets.length).toFixed(2)}%
// //                   </span>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Risk Metrics */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Risk Analysis</CardTitle>
// //                 <CardDescription>Portfolio risk assessment</CardDescription>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div className="flex items-center justify-between pb-3 border-b">
// //                   <span className="text-sm font-medium">Risk Tolerance</span>
// //                   <Badge variant="outline">{portfolio.riskTolerance}</Badge>
// //                 </div>
// //                 <div className="flex items-center justify-between pb-3 border-b">
// //                   <span className="text-sm font-medium">Diversification</span>
// //                   <span className="text-sm font-semibold">{assets.length} assets</span>
// //                 </div>
// //                 <div className="flex items-center justify-between pb-3 border-b">
// //                   <span className="text-sm font-medium">Sectors</span>
// //                   <span className="text-sm font-semibold">{Object.keys(sectorAllocation).length} sectors</span>
// //                 </div>
// //                 <div className="flex items-center justify-between pb-3 border-b">
// //                   <span className="text-sm font-medium">Largest Position</span>
// //                   <span className="text-sm font-semibold">
// //                     {((Math.max(...assets.map((a: any) => a.closeValue)) / totalValue) * 100).toFixed(2)}%
// //                   </span>
// //                 </div>
// //                 <div className="flex items-center justify-between">
// //                   <span className="text-sm font-medium">Smallest Position</span>
// //                   <span className="text-sm font-semibold">
// //                     {((Math.min(...assets.map((a: any) => a.closeValue)) / totalValue) * 100).toFixed(2)}%
// //                   </span>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </TabsContent>
// //       </Tabs>
// //     </div>
// //   )
// // }




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
//   Legend,
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

// // Enhanced color palette with more variety
// const CHART_COLORS = [
//   "#3b82f6", // Blue
//   "#10b981", // Green
//   "#f59e0b", // Amber
//   "#ef4444", // Red
//   "#8b5cf6", // Purple
//   "#ec4899", // Pink
//   "#06b6d4", // Cyan
//   "#84cc16", // Lime
//   "#f97316", // Orange
//   "#14b8a6", // Teal
//   "#6366f1", // Indigo
//   "#eab308", // Yellow
// ]

// // Function to generate a color based on index
// const getColor = (index: number) => CHART_COLORS[index % CHART_COLORS.length]

// // Custom label component for pie charts
// const renderCustomLabel = ({
//   cx,
//   cy,
//   midAngle,
//   innerRadius,
//   outerRadius,
//   percent,
//   name,
// }: any) => {
//   const RADIAN = Math.PI / 180
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5
//   const x = cx + radius * Math.cos(-midAngle * RADIAN)
//   const y = cy + radius * Math.sin(-midAngle * RADIAN)

//   if (percent < 0.05) return null // Don't show label for very small slices

//   return (
//     <text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor={x > cx ? "start" : "end"}
//       dominantBaseline="central"
//       className="font-semibold text-xs"
//     >
//       {`${name} ${(percent * 100).toFixed(0)}%`}
//     </text>
//   )
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

//   // Asset allocation data for pie chart with colors
//   const allocationData = assets.map((asset: any, index: number) => ({
//     name: asset.assetSymbol,
//     value: asset.closeValue,
//     color: getColor(index),
//   }))

//   // Sector allocation
//   const sectorAllocation = assets.reduce((acc: any, asset: any) => {
//     if (!acc[asset.sector]) {
//       acc[asset.sector] = 0
//     }
//     acc[asset.sector] += asset.closeValue
//     return acc
//   }, {})

//   const sectorData = Object.entries(sectorAllocation).map(([sector, value], index) => ({
//     name: sector,
//     value: value as number,
//     color: getColor(index),
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
//                       color: "#3b82f6",
//                     },
//                   }}
//                   className="h-[300px]"
//                 >
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={performanceData}>
//                       <defs>
//                         <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
//                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                       <XAxis dataKey="month" stroke="#6b7280" />
//                       <YAxis stroke="#6b7280" />
//                       <ChartTooltip content={<ChartTooltipContent />} />
//                       <Area
//                         type="monotone"
//                         dataKey="value"
//                         stroke="#3b82f6"
//                         strokeWidth={2}
//                         fill="url(#colorValue)"
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
//                     {assets.map((asset: any, index: number) => {
//                       const assetIsPositive = asset.lossGain >= 0
//                       const allocationPercent = ((asset.cost / totalCost) * 100).toFixed(1)
//                       const costPerShare = asset.stock > 0 ? (asset.cost / asset.stock) : 0

//                       return (
//                         <tr key={asset.id} className="border-b hover:bg-muted/50 transition-colors">
//                           <td className="py-3 px-4">
//                             <Badge 
//                               variant="outline" 
//                               className="font-mono"
//                               style={{ borderColor: getColor(index), color: getColor(index) }}
//                             >
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
//                     color: "#3b82f6",
//                   },
//                 }}
//                 className="h-[300px]"
//               >
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={assets}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="assetSymbol" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <ChartTooltip content={<ChartTooltipContent />} />
//                     <Bar dataKey="lossGain" radius={[4, 4, 0, 0]}>
//                       {assets.map((entry: any, index: number) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={entry.lossGain >= 0 ? "#10b981" : "#ef4444"}
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
//                       color: "#3b82f6",
//                     },
//                   }}
//                   className="h-[350px]"
//                 >
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={allocationData}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={100}
//                         dataKey="value"
//                         label={renderCustomLabel}
//                       >
//                         {allocationData.map((entry: any, index: number) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <ChartTooltip content={<ChartTooltipContent />} />
//                       <Legend 
//                         verticalAlign="bottom" 
//                         height={36}
//                         formatter={(value, entry: any) => (
//                           <span style={{ color: entry.color }}>{value}</span>
//                         )}
//                       />
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
//                       color: "#10b981",
//                     },
//                   }}
//                   className="h-[350px]"
//                 >
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={sectorData}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={100}
//                         dataKey="value"
//                         label={renderCustomLabel}
//                       >
//                         {sectorData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <ChartTooltip content={<ChartTooltipContent />} />
//                       <Legend 
//                         verticalAlign="bottom" 
//                         height={36}
//                         formatter={(value, entry: any) => (
//                           <span style={{ color: entry.color }}>{value}</span>
//                         )}
//                       />
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
//                 {assets.map((asset: any, index: number) => {
//                   const percentage = ((asset.closeValue / totalValue) * 100).toFixed(2)
                  
//                   return (
//                     <div key={asset.id} className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <div 
//                           className="w-3 h-3 rounded-full"
//                           style={{ backgroundColor: getColor(index) }}
//                         />
//                         <Badge variant="outline" style={{ borderColor: getColor(index), color: getColor(index) }}>
//                           {asset.assetSymbol}
//                         </Badge>
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

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createRedemption } from "@/actions/withdraws"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Wallet,
  Activity,
  Clock,
  Layers,
  PieChartIcon,
  ArrowLeftRight,
  PlusCircle,
  CreditCard,
  BarChart2,
} from "lucide-react"
import Link from "next/link"

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const fmt = new Intl.NumberFormat("en-UG", {
  style: "currency",
  currency: "UGX",
  maximumFractionDigits: 0,
})

const fmtDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"

const CHART_COLORS = [
  "#0089ff", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#14b8a6",
]

const getColor = (i: number) => CHART_COLORS[i % CHART_COLORS.length]

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                   */
/* -------------------------------------------------------------------------- */

interface PortfolioDetailProps {
  userPortfolio: any
}

export function UserPortfolioDetail({ userPortfolio }: PortfolioDetailProps) {
  const [redeemOpen, setRedeemOpen] = useState(false)
  const [amount, setAmount]         = useState("")
  const [isPending, startTransition] = useTransition()

  if (!userPortfolio || !userPortfolio.portfolio) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md border-border bg-card">
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

  const portfolio   = userPortfolio.portfolio
  const wallet      = userPortfolio.wallet
  const rawAssets   = userPortfolio.userAssets ?? []
  const subPortfolios: any[] = userPortfolio.subPortfolios ?? []

  /* ---- Computed totals from assets ---- */
  const totalCost      = rawAssets.reduce((s: number, a: any) => s + a.costPrice,  0)
  const totalCloseValue = rawAssets.reduce((s: number, a: any) => s + a.closeValue, 0)
  const totalLossGain  = rawAssets.reduce((s: number, a: any) => s + a.lossGain,   0)
  const returnPct      = totalCost > 0 ? (totalLossGain / totalCost) * 100 : 0
  const isPositive     = totalLossGain >= 0

  /* ---- Normalised asset rows ---- */
  const assets = rawAssets.map((a: any) => ({
    id:                   a.id,
    symbol:               a.asset?.symbol        ?? "—",
    description:          a.asset?.description   ?? "Unknown",
    sector:               a.asset?.sector        ?? "—",
    assetClass:           a.asset?.assetClass    ?? "—",
    allocationPercentage: a.allocationPercentage ?? 0,
    costPerShare:         a.costPerShare         ?? 0,
    costPrice:            a.costPrice            ?? 0,
    stock:                a.stock                ?? 0,
    closePrice:           a.asset?.closePrice    ?? 0,
    closeValue:           a.closeValue           ?? 0,
    lossGain:             a.lossGain             ?? 0,
    lossGainPct:          a.costPrice > 0 ? (a.lossGain / a.costPrice) * 100 : 0,
  }))

  /* ---- Chart data ---- */
  const allocationData = assets.map((a: any, i: number) => ({
    name: a.symbol, value: a.closeValue, color: getColor(i),
  }))

  const sectorMap: Record<string, number> = {}
  for (const a of assets) sectorMap[a.sector] = (sectorMap[a.sector] ?? 0) + a.closeValue
  const sectorData = Object.entries(sectorMap).map(([name, value], i) => ({
    name, value: value as number, color: getColor(i),
  }))

  const assetBarData = assets.map((a: any) => ({
    name: a.symbol, lossGain: a.lossGain, color: a.lossGain >= 0 ? "#10b981" : "#ef4444",
  }))

  /* ---- Sub-portfolio split ---- */
  const redemptionSubs = subPortfolios.filter((s) => s.label?.endsWith("- Redemption"))
  const topupSubs      = subPortfolios.filter((s) => !s.label?.endsWith("- Redemption"))

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/user/portfolio">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold leading-tight">{userPortfolio.customName ?? portfolio.name}</h1>
              {userPortfolio.customName && userPortfolio.customName !== portfolio.name && (
                <span className="text-sm text-muted-foreground">· {portfolio.name}</span>
              )}
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">
                {wallet?.status ?? "ACTIVE"}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />{portfolio.timeHorizon}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />{portfolio.riskTolerance}
              </span>
              {wallet && (
                <span className="font-mono">{wallet.accountNumber}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Current Value",
            value: fmt.format(totalCloseValue),
            sub: "Sum of asset close values",
            icon: Wallet,
            cls: "text-blue-400", bg: "bg-blue-500/10", border: "border-l-blue-500",
          },
          {
            label: "Total Invested",
            value: fmt.format(totalCost),
            sub: "Sum of cost prices",
            icon: TrendingUp,
            cls: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-l-emerald-500",
          },
          {
            label: "Gain / Loss",
            value: `${isPositive ? "+" : ""}${fmt.format(totalLossGain)}`,
            sub: `${isPositive ? "+" : ""}${returnPct.toFixed(2)}% return`,
            icon: isPositive ? TrendingUp : TrendingDown,
            cls: isPositive ? "text-emerald-400" : "text-red-400",
            bg:  isPositive ? "bg-emerald-500/10" : "bg-red-500/10",
            border: isPositive ? "border-l-emerald-500" : "border-l-red-500",
          },
          {
            label: "NAV",
            value: fmt.format(wallet?.netAssetValue ?? 0),
            sub: "Portfolio wallet NAV",
            icon: CreditCard,
            cls: "text-violet-400", bg: "bg-violet-500/10", border: "border-l-violet-500",
          },
        ].map((item) => (
          <Card key={item.label} className={`border-border bg-card border-l-4 ${item.border}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                  <p className={`text-lg font-bold leading-tight ${item.cls}`}>{item.value}</p>
                  {item.sub && <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>}
                </div>
                <div className={`rounded-lg p-2 shrink-0 ${item.bg}`}>
                  <item.icon className={`h-4 w-4 ${item.cls}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Available to Redeem callout ── */}
      <Card className="border-orange-500/30 bg-orange-500/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500/10 p-2.5">
                <ArrowLeftRight className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-400">Available to Redeem</p>
                <p className="text-xl font-bold">{fmt.format(totalCloseValue)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Redeeming transfers funds to your master wallet. No admin approval required.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 shrink-0"
              onClick={() => { setAmount(""); setRedeemOpen(true) }}
            >
              Redeem Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Redemption dialog ── */}
      <RedeemDialog
        open={redeemOpen}
        onOpenChange={setRedeemOpen}
        totalCloseValue={totalCloseValue}
        amount={amount}
        setAmount={setAmount}
        isPending={isPending}
        onConfirm={() => {
          const amt = Number(amount)
          if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return }
          if (amt > totalCloseValue) { toast.error(`Cannot exceed current value of ${fmt.format(totalCloseValue)}`); return }
          startTransition(async () => {
            const result = await createRedemption({
              userId:          userPortfolio.userId,
              userPortfolioId: userPortfolio.id,
              amount:          amt,
            })
            if (!result.success) {
              toast.error(result.error ?? "Redemption failed")
            } else {
              toast.success(`${fmt.format(amt)} redeemed and added to your master wallet.`)
              setRedeemOpen(false)
              setAmount("")
              // reload to reflect updated NAV
              window.location.reload()
            }
          })
        }}
      />

      {/* ── Wallet info ── */}
      {wallet && (
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Portfolio Wallet</span>
              <span className="text-xs font-mono text-muted-foreground">· {wallet.accountNumber}</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 text-xs">
              {[
                { label: "NAV",          value: fmt.format(wallet.netAssetValue),   cls: "text-blue-400" },
                { label: "Balance",      value: fmt.format(wallet.balance),          cls: "" },
                { label: "Total Fees",   value: fmt.format(wallet.totalFees),        cls: "text-amber-400" },
                { label: "Bank Fee",     value: `${wallet.bankFee}%`,               cls: "" },
                { label: "Txn Fee",      value: `${wallet.transactionFee}%`,        cls: "" },
              ].map((item) => (
                <div key={item.label} className="rounded border border-border bg-muted/40 p-2">
                  <p className="text-muted-foreground mb-0.5">{item.label}</p>
                  <p className={`font-semibold ${item.cls}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Tabs ── */}
      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList className="bg-muted/40 border border-border h-auto flex-wrap">
          <TabsTrigger value="assets" className="text-xs gap-1 py-1.5">
            <BarChart2 className="h-3 w-3" />
            Assets ({assets.length})
          </TabsTrigger>
          <TabsTrigger value="allocation" className="text-xs gap-1 py-1.5">
            <PieChartIcon className="h-3 w-3" />
            Allocation
          </TabsTrigger>
          <TabsTrigger value="snapshots" className="text-xs gap-1 py-1.5">
            <Layers className="h-3 w-3" />
            Snapshots ({subPortfolios.length})
            {redemptionSubs.length > 0 && (
              <span className="rounded px-1 py-0.5 text-[10px] leading-none bg-orange-500/15 text-orange-400 border border-orange-500/20 ml-0.5">
                {redemptionSubs.length} redeemed
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs gap-1 py-1.5">
            <Activity className="h-3 w-3" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* ── Assets Tab ── */}
        <TabsContent value="assets" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Asset Positions</CardTitle>
              <CardDescription className="text-xs">Live positions based on current close prices</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Asset</th>
                      <th className="text-right py-2.5 px-4 font-medium text-muted-foreground">Alloc %</th>
                      <th className="text-right py-2.5 px-4 font-medium text-muted-foreground">Shares</th>
                      <th className="text-right py-2.5 px-4 font-medium text-muted-foreground hidden sm:table-cell">Cost/Share</th>
                      <th className="text-right py-2.5 px-4 font-medium text-muted-foreground hidden sm:table-cell">Cost Price</th>
                      <th className="text-right py-2.5 px-4 font-medium text-muted-foreground hidden md:table-cell">Close Price</th>
                      <th className="text-right py-2.5 px-4 font-medium text-muted-foreground">Close Value</th>
                      <th className="text-right py-2.5 px-4 font-medium text-muted-foreground">Gain / Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((a: any, i: number) => (
                      <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: getColor(i) }} />
                            <div>
                              <p className="font-semibold">{a.symbol}</p>
                              <p className="text-muted-foreground truncate max-w-[140px]">{a.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">{a.allocationPercentage.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-right font-mono">{a.stock.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right hidden sm:table-cell">{fmt.format(a.costPerShare)}</td>
                        <td className="py-3 px-4 text-right hidden sm:table-cell">{fmt.format(a.costPrice)}</td>
                        <td className="py-3 px-4 text-right hidden md:table-cell">{fmt.format(a.closePrice)}</td>
                        <td className="py-3 px-4 text-right font-semibold">{fmt.format(a.closeValue)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className={`font-bold ${a.lossGain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {a.lossGain >= 0 ? "+" : ""}{fmt.format(a.lossGain)}
                          </div>
                          <div className={`flex items-center justify-end gap-0.5 ${a.lossGain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {a.lossGain >= 0
                              ? <ArrowUpIcon className="h-2.5 w-2.5" />
                              : <ArrowDownIcon className="h-2.5 w-2.5" />}
                            {Math.abs(a.lossGainPct).toFixed(2)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border bg-muted/20 font-semibold">
                      <td className="py-2.5 px-4">Total</td>
                      <td className="py-2.5 px-4 text-right">100%</td>
                      <td className="py-2.5 px-4 text-right">—</td>
                      <td className="py-2.5 px-4 text-right hidden sm:table-cell">—</td>
                      <td className="py-2.5 px-4 text-right hidden sm:table-cell">{fmt.format(totalCost)}</td>
                      <td className="py-2.5 px-4 text-right hidden md:table-cell">—</td>
                      <td className="py-2.5 px-4 text-right">{fmt.format(totalCloseValue)}</td>
                      <td className={`py-2.5 px-4 text-right ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                        {isPositive ? "+" : ""}{fmt.format(totalLossGain)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Gain/Loss bar chart */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Asset Gain / Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assetBarData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tickFormatter={(v) => fmt.format(v).replace("USh\u00A0", "")} tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }}
                      formatter={(v: any) => [fmt.format(v), "Gain / Loss"]}
                    />
                    <Bar dataKey="lossGain" radius={[4, 4, 0, 0]}>
                      {assetBarData.map((entry: any, i: number) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Allocation Tab ── */}
        <TabsContent value="allocation" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">By Asset</CardTitle>
                <CardDescription className="text-xs">Close value distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={allocationData} cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                        paddingAngle={2} dataKey="value" labelLine={false} label={renderPieLabel}>
                        {allocationData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }}
                        formatter={(v: any) => [fmt.format(v)]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">By Sector</CardTitle>
                <CardDescription className="text-xs">Close value by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sectorData} cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                        paddingAngle={2} dataKey="value" labelLine={false} label={renderPieLabel}>
                        {sectorData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }}
                        formatter={(v: any) => [fmt.format(v)]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {assets.map((a: any, i: number) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: getColor(i) }} />
                    <span className="text-sm font-medium">{a.symbol}</span>
                    <span className="text-xs text-muted-foreground truncate hidden sm:block">{a.description}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs">
                    <span className="text-muted-foreground">{a.allocationPercentage.toFixed(1)}%</span>
                    <span className="font-semibold">{fmt.format(a.closeValue)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Snapshots Tab ── */}
        <TabsContent value="snapshots" className="space-y-4">
          {subPortfolios.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No snapshots yet</p>
          ) : (
            <>
              {redemptionSubs.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="h-3.5 w-3.5 text-orange-400" />
                    <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
                      Redemption Snapshots ({redemptionSubs.length})
                    </p>
                  </div>
                  {redemptionSubs.map((s: any) => (
                    <SubSnapshotCard key={s.id} s={s} kind="redemption" />
                  ))}
                </div>
              )}
              {topupSubs.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <PlusCircle className="h-3.5 w-3.5 text-blue-400" />
                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                      Top-up Snapshots ({topupSubs.length})
                    </p>
                  </div>
                  {topupSubs.map((s: any) => (
                    <SubSnapshotCard key={s.id} s={s} kind="topup" />
                  ))}
                </div>
              )}
              {redemptionSubs.length === 0 && topupSubs.length === 0 && subPortfolios.map((s: any) => (
                <SubSnapshotCard key={s.id} s={s} kind="topup" />
              ))}
            </>
          )}
        </TabsContent>

        {/* ── Analytics Tab ── */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {[
                  { label: "Total Return", value: `${isPositive ? "+" : ""}${returnPct.toFixed(2)}%`, cls: isPositive ? "text-emerald-400" : "text-red-400" },
                  { label: "Absolute Return", value: `${isPositive ? "+" : ""}${fmt.format(totalLossGain)}`, cls: isPositive ? "text-emerald-400" : "text-red-400" },
                  { label: "Best Asset", value: assets.length ? assets.reduce((b: any, a: any) => a.lossGainPct > b.lossGainPct ? a : b).symbol : "—", cls: "text-emerald-400" },
                  { label: "Worst Asset", value: assets.length ? assets.reduce((b: any, a: any) => a.lossGainPct < b.lossGainPct ? a : b).symbol : "—", cls: "text-red-400" },
                  { label: "Avg Asset Return", value: assets.length ? `${(assets.reduce((s: number, a: any) => s + a.lossGainPct, 0) / assets.length).toFixed(2)}%` : "—", cls: "" },
                  { label: "Number of Assets", value: String(assets.length), cls: "" },
                ].map((item, i, arr) => (
                  <div key={item.label} className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className={`text-sm font-semibold ${item.cls}`}>{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Portfolio Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {[
                  { label: "Risk Tolerance",  value: portfolio.riskTolerance, badge: true },
                  { label: "Time Horizon",    value: portfolio.timeHorizon },
                  { label: "Sectors",         value: `${Object.keys(sectorMap).length}` },
                  { label: "Largest Position",value: totalCloseValue > 0 && assets.length ? `${((Math.max(...assets.map((a: any) => a.closeValue)) / totalCloseValue) * 100).toFixed(1)}%` : "—" },
                  { label: "Smallest Position", value: totalCloseValue > 0 && assets.length ? `${((Math.min(...assets.map((a: any) => a.closeValue)) / totalCloseValue) * 100).toFixed(1)}%` : "—" },
                  { label: "Created",         value: fmtDate(portfolio.createdAt) },
                ].map((item: any, i, arr) => (
                  <div key={item.label} className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    {item.badge
                      ? <Badge variant="outline" className="text-xs">{item.value}</Badge>
                      : <span className="text-sm font-semibold">{item.value}</span>
                    }
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Sub-snapshot card                                                           */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Redemption dialog                                                           */
/* -------------------------------------------------------------------------- */

const fmtUGX = new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 })

function RedeemDialog({
  open, onOpenChange, totalCloseValue, amount, setAmount, isPending, onConfirm,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  totalCloseValue: number
  amount: string
  setAmount: (v: string) => void
  isPending: boolean
  onConfirm: () => void
}) {
  const num        = Number(amount)
  const overLimit  = num > totalCloseValue
  const invalid    = !amount || num <= 0 || overLimit

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-orange-400" />
            Redeem from Portfolio
          </DialogTitle>
          <DialogDescription>
            Funds will be moved to your master wallet immediately. No admin approval required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Current value callout */}
          <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 px-4 py-3">
            <p className="text-xs text-muted-foreground">Available to Redeem</p>
            <p className="text-xl font-bold text-orange-400">{fmtUGX.format(totalCloseValue)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Current portfolio close value</p>
          </div>

          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Amount (UGX)</label>
            <Input
              type="number"
              min={1}
              max={totalCloseValue}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to redeem"
              className="border-border bg-background"
              disabled={isPending}
            />
            {overLimit && (
              <p className="text-xs text-red-400">
                Cannot redeem more than the current value of {fmtUGX.format(totalCloseValue)}.
              </p>
            )}
            {amount && num > 0 && !overLimit && (
              <p className="text-xs text-muted-foreground">
                Remaining value after redemption: {fmtUGX.format(totalCloseValue - num)}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={invalid || isPending}
              onClick={onConfirm}
            >
              {isPending ? "Processing…" : "Confirm Redemption"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* -------------------------------------------------------------------------- */
/*  Sub-snapshot card                                                           */
/* -------------------------------------------------------------------------- */

function SubSnapshotCard({ s, kind }: { s: any; kind: "redemption" | "topup" }) {
  const fmt = new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 })
  const pos = s.totalLossGain >= 0
  const isRedemption = kind === "redemption"
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })

  return (
    <div className={`rounded-lg border p-3 space-y-3 ${isRedemption ? "border-orange-500/20 bg-orange-500/5" : "border-blue-500/20 bg-blue-500/5"}`}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`rounded p-1 ${isRedemption ? "bg-orange-500/10" : "bg-blue-500/10"}`}>
            {isRedemption
              ? <ArrowLeftRight className="h-3.5 w-3.5 text-orange-400" />
              : <PlusCircle     className="h-3.5 w-3.5 text-blue-400" />
            }
          </div>
          <span className="text-sm font-medium truncate">{s.label}</span>
          <Badge variant="outline" className="text-xs border-border text-muted-foreground shrink-0">
            Gen {s.generation}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{fmtDate(s.snapshotDate)}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="rounded bg-muted/40 p-2">
          <p className="text-muted-foreground mb-0.5">{isRedemption ? "Redeemed" : "Invested"}</p>
          <p className="font-semibold">{fmt.format(s.amountInvested)}</p>
        </div>
        <div className="rounded bg-muted/40 p-2">
          <p className="text-muted-foreground mb-0.5">Close Value</p>
          <p className="font-semibold">{fmt.format(s.totalCloseValue)}</p>
        </div>
        <div className={`rounded p-2 ${pos ? "bg-emerald-500/5" : "bg-red-500/5"}`}>
          <p className="text-muted-foreground mb-0.5">Gain / Loss</p>
          <p className={`font-semibold ${pos ? "text-emerald-400" : "text-red-400"}`}>
            {pos ? "+" : ""}{fmt.format(s.totalLossGain)}
          </p>
        </div>
        <div className="rounded bg-muted/40 p-2">
          <p className="text-muted-foreground mb-0.5">Cash at Bank</p>
          <p className="font-semibold">{fmt.format(s.cashAtBank)}</p>
        </div>
      </div>
    </div>
  )
}