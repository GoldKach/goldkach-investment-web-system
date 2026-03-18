





"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon, ArrowUpIcon, TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"

interface PortfolioListProps {
  userPortfolios: any[]
}

export function PortfolioList({ userPortfolios }: PortfolioListProps) {
  const validPortfolios = userPortfolios.filter(up => up.portfolio)

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
      totalValue,
      totalCost,
      totalLossGain,
      lossGainPercentage,
      status: "ACTIVE",
      createdAt: new Date(up.portfolio!.createdAt),
      timeHorizon: up.portfolio!.timeHorizon,
      riskTolerance: up.portfolio!.riskTolerance,
      assetCount: up.userAssets.length,
    }
  })

  const totalPortfolioValue = portfolios.reduce((sum, p) => sum + p.totalValue, 0)
  const totalPortfolioCost = portfolios.reduce((sum, p) => sum + p.totalCost, 0)
  const totalPortfolioGain = portfolios.reduce((sum, p) => sum + p.totalLossGain, 0)
  const totalPortfolioGainPercentage = totalPortfolioCost > 0
    ? ((totalPortfolioGain / totalPortfolioCost) * 100).toFixed(2)
    : "0.00"

  const wallet = validPortfolios[0]?.user?.wallet

  if (validPortfolios.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Portfolios Found</CardTitle>
            <CardDescription>You don't have any portfolios yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/user/deposits">
              <Button className="w-full">Make your first deposit and wait for portfolio activation</Button>
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
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
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
                      <span className={`text-sm font-semibold flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
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