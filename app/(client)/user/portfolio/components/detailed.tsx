// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   Area,
//   AreaChart,
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   Line,
//   LineChart,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
// } from "recharts"
// import {
//   ArrowDownIcon,
//   ArrowUpIcon,
//   ArrowLeft,
//   TrendingDown,
//   TrendingUp,
//   Calendar,
//   DollarSign,
//   Percent,
//   PieChart as PieChartIcon,
//   Activity,
//   Info,
//   Download,
//   RefreshCw,
// } from "lucide-react"

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
//       allocationPercentage: number
//       costPerShare: number
//       closePrice: number
//     }
//   }
// }

// interface PortfolioDetailData {
//   id: string
//   userId: string
//   portfolioId: string
//   portfolioValue: number
//   portfolio: {
//     id: string
//     name: string
//     description: string | null
//     timeHorizon: string
//     riskTolerance: string
//     allocationPercentage: number
//     createdAt: Date | string
//   }
//   userAssets: UserPortfolioAsset[]
//   createdAt: Date | string
//   user?: {
//     name: string
//     email: string
//     wallet?: {
//       balance: number
//       netAssetValue: number
//       accountNumber: string
//     } | null
//   }
// }

// interface PortfolioDetailProps {
//   portfolioData: PortfolioDetailData
//   onBack?: () => void
// }

// export function PortfolioDetailPage({ portfolioData, onBack }: PortfolioDetailProps) {
//   const portfolio = portfolioData.portfolio
  
//   // Calculate totals
//   const totalCost = portfolioData.userAssets.reduce((sum, asset) => sum + asset.costPrice, 0)
//   const totalValue = portfolioData.userAssets.reduce((sum, asset) => sum + asset.closeValue, 0)
//   const totalLossGain = portfolioData.userAssets.reduce((sum, asset) => sum + asset.lossGain, 0)
//   const lossGainPercentage = totalCost > 0 ? (totalLossGain / totalCost) * 100 : 0
//   const isPositive = totalLossGain >= 0

//   // Calculate sector allocation
//   const sectorAllocation = portfolioData.userAssets.reduce((acc, asset) => {
//     const sector = asset.portfolioAsset.asset.sector
//     const existing = acc.find(item => item.sector === sector)
//     if (existing) {
//       existing.value += asset.closeValue
//       existing.percentage += ((asset.closeValue / totalValue) * 100)
//     } else {
//       acc.push({
//         sector,
//         value: asset.closeValue,
//         percentage: (asset.closeValue / totalValue) * 100
//       })
//     }
//     return acc
//   }, [] as Array<{ sector: string; value: number; percentage: number }>)

//   // Asset allocation for pie chart
//   const assetAllocation = portfolioData.userAssets.map(asset => ({
//     name: asset.portfolioAsset.asset.symbol,
//     value: asset.closeValue,
//     percentage: (asset.closeValue / totalValue) * 100
//   }))

//   // Performance data (mock - would need historical data)
//   const performanceData = [
//     { date: "Jan", value: totalCost * 0.85, benchmark: totalCost * 0.87 },
//     { date: "Feb", value: totalCost * 0.90, benchmark: totalCost * 0.91 },
//     { date: "Mar", value: totalCost * 0.95, benchmark: totalCost * 0.94 },
//     { date: "Apr", value: totalCost * 0.92, benchmark: totalCost * 0.93 },
//     { date: "May", value: totalCost * 1.00, benchmark: totalCost * 0.98 },
//     { date: "Jun", value: totalValue, benchmark: totalCost * 1.02 },
//   ]

//   // Top performers
//   const topPerformers = [...portfolioData.userAssets]
//     .sort((a, b) => b.lossGain - a.lossGain)
//     .slice(0, 5)

//   // Bottom performers
//   const bottomPerformers = [...portfolioData.userAssets]
//     .sort((a, b) => a.lossGain - b.lossGain)
//     .slice(0, 5)

//   const COLORS = [
//     "hsl(var(--chart-1))",
//     "hsl(var(--chart-2))",
//     "hsl(var(--chart-3))",
//     "hsl(var(--chart-4))",
//     "hsl(var(--chart-5))",
//   ]

//   return (
//     <div className="min-h-screen bg-background p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           {onBack && (
//             <Button variant="ghost" size="icon" onClick={onBack}>
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//           )}
//           <div>
//             <h1 className="text-3xl font-bold">{portfolio.name}</h1>
//             <p className="text-muted-foreground">{portfolio.description || "No description"}</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="sm">
//             <Download className="h-4 w-4 mr-2" />
//             Export
//           </Button>
//           <Button variant="outline" size="sm">
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       {/* Key Metrics */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground">
//               {portfolioData.userAssets.length} assets
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
//               {isPositive ? "+" : ""}${totalLossGain.toLocaleString()}
//             </div>
//             <p className={`text-xs flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
//               {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
//               {lossGainPercentage.toFixed(2)}%
//             </p>
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
//             <CardTitle className="text-sm font-medium">Risk Tolerance</CardTitle>
//             <Activity className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold capitalize">{portfolio.riskTolerance}</div>
//             <p className="text-xs text-muted-foreground">{portfolio.timeHorizon}</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Portfolio Info Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Portfolio Information</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             <div>
//               <p className="text-sm text-muted-foreground mb-1">Created Date</p>
//               <p className="font-semibold flex items-center gap-2">
//                 <Calendar className="h-4 w-4" />
//                 {new Date(portfolio.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground mb-1">Time Horizon</p>
//               <Badge variant="outline">{portfolio.timeHorizon}</Badge>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground mb-1">Risk Tolerance</p>
//               <Badge variant="outline">{portfolio.riskTolerance}</Badge>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground mb-1">Allocation</p>
//               <p className="font-semibold flex items-center gap-2">
//                 <Percent className="h-4 w-4" />
//                 {portfolio.allocationPercentage}%
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Tabs defaultValue="overview" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="holdings">Holdings</TabsTrigger>
//           <TabsTrigger value="performance">Performance</TabsTrigger>
//           <TabsTrigger value="allocation">Allocation</TabsTrigger>
//         </TabsList>

//         {/* Overview Tab */}
//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             {/* Performance Chart */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Performance vs Benchmark</CardTitle>
//                 <CardDescription>6-month performance comparison</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ChartContainer
//                   config={{
//                     value: {
//                       label: "Portfolio",
//                       color: "hsl(var(--chart-1))",
//                     },
//                     benchmark: {
//                       label: "Benchmark",
//                       color: "hsl(var(--chart-2))",
//                     },
//                   }}
//                   className="h-[300px]"
//                 >
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={performanceData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="date" />
//                       <YAxis />
//                       <ChartTooltip content={<ChartTooltipContent />} />
//                       <Legend />
//                       <Line
//                         type="monotone"
//                         dataKey="value"
//                         stroke="hsl(var(--chart-1))"
//                         strokeWidth={2}
//                         name="Portfolio"
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="benchmark"
//                         stroke="hsl(var(--chart-2))"
//                         strokeWidth={2}
//                         strokeDasharray="5 5"
//                         name="Benchmark"
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </ChartContainer>
//               </CardContent>
//             </Card>

//             {/* Asset Allocation Pie */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Asset Allocation</CardTitle>
//                 <CardDescription>Distribution by value</CardDescription>
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
//                         data={assetAllocation}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
//                       >
//                         {assetAllocation.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         )
//                   })}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Rebalancing Recommendations */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Rebalancing Recommendations</CardTitle>
//               <CardDescription>Suggested adjustments to meet target allocation</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Asset</TableHead>
//                     <TableHead className="text-right">Current %</TableHead>
//                     <TableHead className="text-right">Target %</TableHead>
//                     <TableHead className="text-right">Difference</TableHead>
//                     <TableHead className="text-right">Action</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {portfolioData.userAssets.map((asset) => {
//                     const actualAllocation = (asset.closeValue / totalValue) * 100
//                     const targetAllocation = asset.portfolioAsset.asset.allocationPercentage
//                     const difference = actualAllocation - targetAllocation
//                     const action = difference > 1 ? 'Sell' : difference < -1 ? 'Buy' : 'Hold'
//                     const actionColor = action === 'Sell' ? 'text-red-600' : action === 'Buy' ? 'text-green-600' : 'text-muted-foreground'
                    
//                     return (
//                       <TableRow key={asset.id}>
//                         <TableCell className="font-medium">
//                           {asset.portfolioAsset.asset.symbol}
//                         </TableCell>
//                         <TableCell className="text-right">{actualAllocation.toFixed(2)}%</TableCell>
//                         <TableCell className="text-right">{targetAllocation.toFixed(2)}%</TableCell>
//                         <TableCell className={`text-right font-semibold ${difference > 0 ? 'text-blue-600' : 'text-orange-600'}`}>
//                           {difference > 0 ? '+' : ''}{difference.toFixed(2)}%
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <Badge variant={action === 'Hold' ? 'secondary' : 'outline'} className={actionColor}>
//                             {action}
//                           </Badge>
//                         </TableCell>
//                       </TableRow>
//                     )
//                   })}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Risk Analysis Card */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Risk Analysis</CardTitle>
//               <CardDescription>Portfolio risk assessment and recommendations</CardDescription>
//             </div>
//             <Info className="h-5 w-5 text-muted-foreground" />
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-6 md:grid-cols-3">
//             <div className="space-y-2">
//               <p className="text-sm font-medium">Risk Profile</p>
//               <Badge className="text-base" variant="outline">{portfolio.riskTolerance}</Badge>
//               <p className="text-xs text-muted-foreground mt-2">
//                 Your portfolio is aligned with your {portfolio.riskTolerance.toLowerCase()} risk tolerance.
//               </p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm font-medium">Diversification Score</p>
//               <div className="flex items-end gap-2">
//                 <p className="text-3xl font-bold">
//                   {((sectorAllocation.length / 10) * 100).toFixed(0)}
//                 </p>
//                 <span className="text-muted-foreground mb-1">/100</span>
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 {sectorAllocation.length} sectors represented
//               </p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm font-medium">Volatility</p>
//               <div className="flex items-center gap-2">
//                 <Activity className="h-5 w-5 text-orange-500" />
//                 <p className="text-2xl font-bold">Moderate</p>
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 Expected fluctuation range: ±{(lossGainPercentage * 1.5).toFixed(1)}%
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Additional Stats */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Largest Position</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-lg font-bold">
//               {assetAllocation.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
//             </p>
//             <p className="text-xs text-muted-foreground">
//               {assetAllocation.sort((a, b) => b.value - a.value)[0]?.percentage.toFixed(1) || 0}% of portfolio
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Most Profitable</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-lg font-bold text-green-600">
//               {topPerformers[0]?.portfolioAsset.asset.symbol || 'N/A'}
//             </p>
//             <p className="text-xs text-green-600">
//               +${topPerformers[0]?.lossGain.toLocaleString() || 0}
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Avg Share Price</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-lg font-bold">
//               ${(portfolioData.userAssets.reduce((sum, a) => sum + a.portfolioAsset.asset.closePrice, 0) / portfolioData.userAssets.length).toFixed(2)}
//             </p>
//             <p className="text-xs text-muted-foreground">Current market price</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Days Held</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-lg font-bold">
//               {Math.floor((new Date().getTime() - new Date(portfolioData.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
//             </p>
//             <p className="text-xs text-muted-foreground">
//               Since {new Date(portfolioData.createdAt).toLocaleDateString()}
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// })}
//                       </Pie>
//                       <ChartTooltip content={<ChartTooltipContent />} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </ChartContainer>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Top and Bottom Performers */}
//           <div className="grid gap-6 md:grid-cols-2">
//             {/* Top Performers */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Top Performers</CardTitle>
//                 <CardDescription>Best performing assets</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {topPerformers.map((asset, index) => {
//                     const gainPercent = asset.costPrice > 0 ? (asset.lossGain / asset.costPrice) * 100 : 0
//                     return (
//                       <div key={asset.id} className="flex items-center justify-between border-b pb-3 last:border-0">
//                         <div className="flex items-center gap-3">
//                           <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold text-sm">
//                             {index + 1}
//                           </div>
//                           <div>
//                             <p className="font-semibold">{asset.portfolioAsset.asset.symbol}</p>
//                             <p className="text-xs text-muted-foreground">{asset.portfolioAsset.asset.description}</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-semibold text-green-600">+${asset.lossGain.toLocaleString()}</p>
//                           <p className="text-xs text-green-600">+{gainPercent.toFixed(2)}%</p>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Bottom Performers */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Bottom Performers</CardTitle>
//                 <CardDescription>Underperforming assets</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {bottomPerformers.map((asset, index) => {
//                     const gainPercent = asset.costPrice > 0 ? (asset.lossGain / asset.costPrice) * 100 : 0
//                     const isNegative = asset.lossGain < 0
//                     return (
//                       <div key={asset.id} className="flex items-center justify-between border-b pb-3 last:border-0">
//                         <div className="flex items-center gap-3">
//                           <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isNegative ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'} font-bold text-sm`}>
//                             {index + 1}
//                           </div>
//                           <div>
//                             <p className="font-semibold">{asset.portfolioAsset.asset.symbol}</p>
//                             <p className="text-xs text-muted-foreground">{asset.portfolioAsset.asset.description}</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className={`font-semibold ${isNegative ? 'text-red-600' : 'text-yellow-600'}`}>
//                             {isNegative ? '' : '+'}${asset.lossGain.toLocaleString()}
//                           </p>
//                           <p className={`text-xs ${isNegative ? 'text-red-600' : 'text-yellow-600'}`}>
//                             {gainPercent.toFixed(2)}%
//                           </p>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Holdings Tab */}
//         <TabsContent value="holdings" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>All Holdings</CardTitle>
//               <CardDescription>Complete list of assets in this portfolio</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Symbol</TableHead>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Sector</TableHead>
//                     <TableHead className="text-right">Shares</TableHead>
//                     <TableHead className="text-right">Cost Price</TableHead>
//                     <TableHead className="text-right">Current Value</TableHead>
//                     <TableHead className="text-right">Gain/Loss</TableHead>
//                     <TableHead className="text-right">Return %</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {portfolioData.userAssets.map((asset) => {
//                     const gainPercent = asset.costPrice > 0 ? (asset.lossGain / asset.costPrice) * 100 : 0
//                     const isPositive = asset.lossGain >= 0
//                     return (
//                       <TableRow key={asset.id}>
//                         <TableCell className="font-medium">
//                           <Badge variant="outline">{asset.portfolioAsset.asset.symbol}</Badge>
//                         </TableCell>
//                         <TableCell>{asset.portfolioAsset.asset.description}</TableCell>
//                         <TableCell>
//                           <Badge variant="secondary">{asset.portfolioAsset.asset.sector}</Badge>
//                         </TableCell>
//                         <TableCell className="text-right">{asset.stock.toFixed(2)}</TableCell>
//                         <TableCell className="text-right">${asset.costPrice.toLocaleString()}</TableCell>
//                         <TableCell className="text-right">${asset.closeValue.toLocaleString()}</TableCell>
//                         <TableCell className={`text-right font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
//                           {isPositive ? '+' : ''}${asset.lossGain.toLocaleString()}
//                         </TableCell>
//                         <TableCell className={`text-right font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
//                           {isPositive ? '+' : ''}{gainPercent.toFixed(2)}%
//                         </TableCell>
//                       </TableRow>
//                     )
//                   })}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>

//           {/* Holdings Summary */}
//           <div className="grid gap-4 md:grid-cols-3">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-sm">Total Holdings</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-2xl font-bold">{portfolioData.userAssets.length}</p>
//                 <p className="text-xs text-muted-foreground">Unique assets</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-sm">Average Cost per Share</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-2xl font-bold">
//                   ${(totalCost / portfolioData.userAssets.reduce((sum, a) => sum + a.stock, 0)).toFixed(2)}
//                 </p>
//                 <p className="text-xs text-muted-foreground">Weighted average</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-sm">Total Shares</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-2xl font-bold">
//                   {portfolioData.userAssets.reduce((sum, a) => sum + a.stock, 0).toFixed(2)}
//                 </p>
//                 <p className="text-xs text-muted-foreground">Across all assets</p>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Performance Tab */}
//         <TabsContent value="performance" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Performance Metrics</CardTitle>
//               <CardDescription>Detailed performance analysis</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-2">Total Return</p>
//                   <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
//                     {isPositive ? '+' : ''}{lossGainPercentage.toFixed(2)}%
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-2">Absolute Gain</p>
//                   <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
//                     ${Math.abs(totalLossGain).toLocaleString()}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-2">Best Asset</p>
//                   <p className="text-2xl font-bold text-green-600">
//                     +{topPerformers[0] ? ((topPerformers[0].lossGain / topPerformers[0].costPrice) * 100).toFixed(1) : 0}%
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-2">Worst Asset</p>
//                   <p className="text-2xl font-bold text-red-600">
//                     {bottomPerformers[0] ? ((bottomPerformers[0].lossGain / bottomPerformers[0].costPrice) * 100).toFixed(1) : 0}%
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Asset Performance Bar Chart */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Individual Asset Performance</CardTitle>
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
//                 className="h-[400px]"
//               >
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={portfolioData.userAssets}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="portfolioAsset.asset.symbol" />
//                     <YAxis />
//                     <ChartTooltip content={<ChartTooltipContent />} />
//                     <Bar dataKey="lossGain" fill="hsl(var(--chart-1))">
//                       {portfolioData.userAssets.map((entry, index) => (
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
//           {/* Sector Allocation */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Sector Allocation</CardTitle>
//               <CardDescription>Portfolio distribution by sector</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {sectorAllocation.map((sector, index) => (
//                   <div key={sector.sector} className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <div
//                           className="w-3 h-3 rounded-full"
//                           style={{ backgroundColor: COLORS[index % COLORS.length] }}
//                         />
//                         <span className="font-medium">{sector.sector}</span>
//                       </div>
//                       <div className="text-right">
//                         <span className="font-bold">${sector.value.toLocaleString()}</span>
//                         <span className="text-sm text-muted-foreground ml-2">
//                           ({sector.percentage.toFixed(1)}%)
//                         </span>
//                       </div>
//                     </div>
//                     <div className="w-full bg-secondary rounded-full h-2">
//                       <div
//                         className="h-2 rounded-full"
//                         style={{
//                           width: `${sector.percentage}%`,
//                           backgroundColor: COLORS[index % COLORS.length],
//                         }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           <div className="grid gap-6 md:grid-cols-2">
//             {/* Sector Pie Chart */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Sector Distribution</CardTitle>
//                 <CardDescription>Visual breakdown by sector</CardDescription>
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
//                         data={sectorAllocation}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({ sector, percentage }) => `${sector} ${percentage.toFixed(1)}%`}
//                       >
//                         {sectorAllocation.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <ChartTooltip content={<ChartTooltipContent />} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </ChartContainer>
//               </CardContent>
//             </Card>

//             {/* Allocation Targets */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Target vs Actual Allocation</CardTitle>
//                 <CardDescription>Planned vs current distribution</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {portfolioData.userAssets.map((asset) => {
//                     const actualAllocation = (asset.closeValue / totalValue) * 100
//                     const targetAllocation = asset.portfolioAsset.asset.allocationPercentage
//                     const difference = actualAllocation - targetAllocation
                    
//                     return (
//                       <div key={asset.id} className="space-y-1">
//                         <div className="flex items-center justify-between text-sm">
//                           <span className="font-medium">{asset.portfolioAsset.asset.symbol}</span>
//                           <span className={difference > 0 ? 'text-blue-600' : 'text-orange-600'}>
//                             {actualAllocation.toFixed(1)}% / {targetAllocation.toFixed(1)}%
//                           </span>
//                         </div>
//                         <div className="flex gap-1 h-2">
//                           <div
//                             className="bg-blue-500 rounded-l"
//                             style={{ width: `${actualAllocation}%` }}
//                           />
//                           <div
//                             className="bg-orange-300 rounded-r"
//                             style={{ width: `${Math.max(0, targetAllocation - actualAllocation)}%` }}
//                           />
//                         </div>
//                       </div>
//                     )





"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  Calendar,
  DollarSign,
  Percent,
  Activity,
  Info,
  Download,
  RefreshCw,
} from "lucide-react"
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
      allocationPercentage: number
      costPerShare: number
      closePrice: number
    }
  }
}

interface PortfolioDetailData {
  id: string
  userId: string
  portfolioId: string
  portfolioValue: number
  portfolio?: {
    id: string
    name: string
    description: string | null
    timeHorizon: string
    riskTolerance: string
    allocationPercentage: number
    createdAt: Date | string
  }
  userAssets: UserPortfolioAsset[]
  createdAt: Date | string
  user?: {
    name: string
    email: string
    wallet?: {
      balance: number
      netAssetValue: number
      accountNumber: string
    } | null
  }
}

interface PortfolioDetailProps {
  portfolioData: any
}

export function PortfolioDetailPage({ portfolioData }: PortfolioDetailProps) {
  if (!portfolioData.portfolio) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Portfolio Data Missing</CardTitle>
            <CardDescription>Portfolio information is not available.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const portfolio = portfolioData.portfolio
  
  // Calculate totals
  const totalCost = portfolioData.userAssets.reduce((sum:any, asset:any) => sum + asset.costPrice, 0)
  const totalValue = portfolioData.userAssets.reduce((sum:any, asset:any) => sum + asset.closeValue, 0)
  const totalLossGain = portfolioData.userAssets.reduce((sum:any, asset:any) => sum + asset.lossGain, 0)
  const lossGainPercentage = totalCost > 0 ? (totalLossGain / totalCost) * 100 : 0
  const isPositive = totalLossGain >= 0

  // Calculate sector allocation
  const sectorAllocation = portfolioData.userAssets.reduce((acc:any, asset:any) => {
    const sector = asset.portfolioAsset.asset.sector
    const existing = acc.find((item:any) => item.sector === sector)
    if (existing) {
      existing.value += asset.closeValue
      existing.percentage = (existing.value / totalValue) * 100
    } else {
      acc.push({
        sector,
        value: asset.closeValue,
        percentage: (asset.closeValue / totalValue) * 100
      })
    }
    return acc
  }, [] as Array<{ sector: string; value: number; percentage: number }>)

  // Asset allocation for pie chart
  const assetAllocation = portfolioData.userAssets.map((asset:any) => ({
    name: asset.portfolioAsset.asset.symbol,
    value: asset.closeValue,
    percentage: (asset.closeValue / totalValue) * 100
  }))

  // Performance data (mock - would need historical data)
  const performanceData = [
    { date: "Jan", value: totalCost * 0.85, benchmark: totalCost * 0.87 },
    { date: "Feb", value: totalCost * 0.90, benchmark: totalCost * 0.91 },
    { date: "Mar", value: totalCost * 0.95, benchmark: totalCost * 0.94 },
    { date: "Apr", value: totalCost * 0.92, benchmark: totalCost * 0.93 },
    { date: "May", value: totalCost * 1.00, benchmark: totalCost * 0.98 },
    { date: "Jun", value: totalValue, benchmark: totalCost * 1.02 },
  ]

  // Top performers
  const topPerformers = [...portfolioData.userAssets]
    .sort((a, b) => b.lossGain - a.lossGain)
    .slice(0, 5)

  // Bottom performers
  const bottomPerformers = [...portfolioData.userAssets]
    .sort((a, b) => a.lossGain - b.lossGain)
    .slice(0, 5)

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/portfolio">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{portfolio.name}</h1>
            <p className="text-muted-foreground">{portfolio.description || "No description"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {portfolioData.userAssets.length} assets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? "+" : ""}${totalLossGain.toLocaleString()}
            </div>
            <p className={`text-xs flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
              {lossGainPercentage.toFixed(2)}%
            </p>
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
            <CardTitle className="text-sm font-medium">Risk Tolerance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{portfolio.riskTolerance}</div>
            <p className="text-xs text-muted-foreground">{portfolio.timeHorizon}</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Created Date</p>
              <p className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(portfolio.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Time Horizon</p>
              <Badge variant="outline">{portfolio.timeHorizon}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Risk Tolerance</p>
              <Badge variant="outline">{portfolio.riskTolerance}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Allocation</p>
              <p className="font-semibold flex items-center gap-2">
                <Percent className="h-4 w-4" />
                {portfolio.allocationPercentage}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance vs Benchmark</CardTitle>
                <CardDescription>6-month performance comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Portfolio",
                      color: "hsl(var(--chart-1))",
                    },
                    benchmark: {
                      label: "Benchmark",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        name="Portfolio"
                      />
                      <Line
                        type="monotone"
                        dataKey="benchmark"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Benchmark"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Asset Allocation Pie */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Distribution by value</CardDescription>
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
                        data={assetAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                      >
                        {assetAllocation.map((entry:any, index:any) => (
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

          {/* Top and Bottom Performers */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Best performing assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((asset, index) => {
                    const gainPercent = asset.costPrice > 0 ? (asset.lossGain / asset.costPrice) * 100 : 0
                    return (
                      <div key={asset.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{asset.portfolioAsset.asset.symbol}</p>
                            <p className="text-xs text-muted-foreground">{asset.portfolioAsset.asset.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">+${asset.lossGain.toLocaleString()}</p>
                          <p className="text-xs text-green-600">+{gainPercent.toFixed(2)}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Bottom Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Bottom Performers</CardTitle>
                <CardDescription>Underperforming assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bottomPerformers.map((asset, index) => {
                    const gainPercent = asset.costPrice > 0 ? (asset.lossGain / asset.costPrice) * 100 : 0
                    const isNegative = asset.lossGain < 0
                    return (
                      <div key={asset.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isNegative ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'} font-bold text-sm`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{asset.portfolioAsset.asset.symbol}</p>
                            <p className="text-xs text-muted-foreground">{asset.portfolioAsset.asset.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${isNegative ? 'text-red-600' : 'text-yellow-600'}`}>
                            {isNegative ? '' : '+'}${asset.lossGain.toLocaleString()}
                          </p>
                          <p className={`text-xs ${isNegative ? 'text-red-600' : 'text-yellow-600'}`}>
                            {gainPercent.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Holdings Tab */}
        <TabsContent value="holdings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Holdings</CardTitle>
              <CardDescription>Complete list of assets in this portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead className="text-right">Cost Price</TableHead>
                    <TableHead className="text-right">Current Value</TableHead>
                    <TableHead className="text-right">Gain/Loss</TableHead>
                    <TableHead className="text-right">Return %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioData.userAssets.map((asset:any) => {
                    const gainPercent = asset.costPrice > 0 ? (asset.lossGain / asset.costPrice) * 100 : 0
                    const isPositiveAsset = asset.lossGain >= 0
                    return (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">
                          <Badge variant="outline">{asset.portfolioAsset.asset.symbol}</Badge>
                        </TableCell>
                        <TableCell>{asset.portfolioAsset.asset.description}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{asset.portfolioAsset.asset.sector}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{asset.stock.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${asset.costPrice.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${asset.closeValue.toLocaleString()}</TableCell>
                        <TableCell className={`text-right font-semibold ${isPositiveAsset ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositiveAsset ? '+' : ''}${asset.lossGain.toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${isPositiveAsset ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositiveAsset ? '+' : ''}{gainPercent.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Holdings Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{portfolioData.userAssets.length}</p>
                <p className="text-xs text-muted-foreground">Unique assets</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Average Cost per Share</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  ${(totalCost / portfolioData.userAssets.reduce((sum:any, a:any) => sum + a.stock, 0)).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">Weighted average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Shares</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {portfolioData.userAssets.reduce((sum:any, a:any) => sum + a.stock, 0).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">Across all assets</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Detailed performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Return</p>
                  <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{lossGainPercentage.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Absolute Gain</p>
                  <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(totalLossGain).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Best Asset</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{topPerformers[0] ? ((topPerformers[0].lossGain / topPerformers[0].costPrice) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Worst Asset</p>
                  <p className="text-2xl font-bold text-red-600">
                    {bottomPerformers[0] ? ((bottomPerformers[0].lossGain / bottomPerformers[0].costPrice) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asset Performance Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Asset Performance</CardTitle>
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
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={portfolioData.userAssets}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="portfolioAsset.asset.symbol" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="lossGain" fill="hsl(var(--chart-1))">
                      {portfolioData.userAssets.map((entry:any, index:any) => (
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
        </TabsContent>

        {/* Allocation Tab */}
        <TabsContent value="allocation" className="space-y-6">
          {/* Sector Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Sector Allocation</CardTitle>
              <CardDescription>Portfolio distribution by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectorAllocation.map((sector:any, index:any) => (
                  <div key={sector.sector} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{sector.sector}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">${sector.value.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({sector.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${sector.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Sector Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sector Distribution</CardTitle>
                <CardDescription>Visual breakdown by sector</CardDescription>
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
                        data={sectorAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ sector, percentage }) => `${sector} ${percentage.toFixed(1)}%`}
                      >
                        {sectorAllocation.map((entry:any, index:any) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Allocation Targets */}
            <Card>
              <CardHeader>
                <CardTitle>Target vs Actual Allocation</CardTitle>
                <CardDescription>Planned vs current distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.userAssets.map((asset:any) => {
                    const actualAllocation = (asset.closeValue / totalValue) * 100
                    const targetAllocation = asset.portfolioAsset.asset.allocationPercentage
                    const difference = actualAllocation - targetAllocation
                    
                    return (
                      <div key={asset.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{asset.portfolioAsset.asset.symbol}</span>
                          <span className={difference > 0 ? 'text-blue-600' : 'text-orange-600'}>
                            {actualAllocation.toFixed(1)}% / {targetAllocation.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex gap-1 h-2">
                          <div
                            className="bg-blue-500 rounded-l"
                            style={{ width: `${actualAllocation}%` }}
                          />
                          <div
                            className="bg-orange-300 rounded-r"
                            style={{ width: `${Math.max(0, targetAllocation - actualAllocation)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rebalancing Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Rebalancing Recommendations</CardTitle>
              <CardDescription>Suggested adjustments to meet target allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead className="text-right">Current %</TableHead>
                    <TableHead className="text-right">Target %</TableHead>
                    <TableHead className="text-right">Difference</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioData.userAssets.map((asset:any) => {
                    const actualAllocation = (asset.closeValue / totalValue) * 100
                    const targetAllocation = asset.portfolioAsset.asset.allocationPercentage
                    const difference = actualAllocation - targetAllocation
                    const action = difference > 1 ? 'Sell' : difference < -1 ? 'Buy' : 'Hold'
                    const actionColor = action === 'Sell' ? 'text-red-600' : action === 'Buy' ? 'text-green-600' : 'text-muted-foreground'
                    
                    return (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">
                          {asset.portfolioAsset.asset.symbol}
                        </TableCell>
                        <TableCell className="text-right">{actualAllocation.toFixed(2)}%</TableCell>
                        <TableCell className="text-right">{targetAllocation.toFixed(2)}%</TableCell>
                        <TableCell className={`text-right font-semibold ${difference > 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                          {difference > 0 ? '+' : ''}{difference.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={action === 'Hold' ? 'secondary' : 'outline'} className={actionColor}>
                            {action}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Risk Analysis Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Risk Analysis</CardTitle>
              <CardDescription>Portfolio risk assessment and recommendations</CardDescription>
            </div>
            <Info className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Risk Profile</p>
              <Badge className="text-base" variant="outline">{portfolio.riskTolerance}</Badge>
              <p className="text-xs text-muted-foreground mt-2">
                Your portfolio is aligned with your {portfolio.riskTolerance.toLowerCase()} risk tolerance.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Diversification Score</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">
                  {((sectorAllocation.length / 10) * 100).toFixed(0)}
                </p>
                <span className="text-muted-foreground mb-1">/100</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {sectorAllocation.length} sectors represented
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Volatility</p>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                <p className="text-2xl font-bold">Moderate</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Expected fluctuation range: ±{(lossGainPercentage * 1.5).toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Largest Position</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">
              {assetAllocation.sort((a:any, b:any) => b.value - a.value)[0]?.name || 'N/A'}
            </p>
            <p className="text-xs text-muted-foreground">
              {assetAllocation.sort((a:any, b:any) => b.value - a.value)[0]?.percentage.toFixed(1) || 0}% of portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Profitable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-green-600">
              {topPerformers[0]?.portfolioAsset.asset.symbol || 'N/A'}
            </p>
            <p className="text-xs text-green-600">
              +${topPerformers[0]?.lossGain.toLocaleString() || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Share Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">
              ${(portfolioData.userAssets.reduce((sum:any, a:any) => sum + a.portfolioAsset.asset.closePrice, 0) / portfolioData.userAssets.length).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">Current market price</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Days Held</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">
              {Math.floor((new Date().getTime() - new Date(portfolioData.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </p>
            <p className="text-xs text-muted-foreground">
              Since {new Date(portfolioData.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}