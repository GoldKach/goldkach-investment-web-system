





"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon, ArrowUpIcon, Clock, TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"

interface PortfolioListProps {
  userPortfolios: any[]
  masterWallet?: { totalDeposited: number; totalFees: number } | null
}

export function PortfolioList({ userPortfolios, masterWallet }: PortfolioListProps) {
  const initialInvestment = (masterWallet?.totalDeposited ?? 0) - (masterWallet?.totalFees ?? 0)
  const validPortfolios = userPortfolios.filter(up => up.portfolio)

  const portfolios = validPortfolios.map((up) => {
    const totalValue    = up.userAssets.reduce((sum: any, asset: any) => sum + asset.closeValue, 0)
    const invested      = Number(up.totalInvested ?? 0)
    // True gain/loss = current close value minus total amount ever invested
    const totalLossGain = totalValue - invested
    const lossGainPercentage = invested > 0 ? (totalLossGain / invested) * 100 : 0

    return {
      id: up.portfolio!.id,
      name: up.customName || up.portfolio!.name,
      templateName: up.portfolio!.name,
      userPortfolioId: up.id,
      description: up.portfolio!.description || "No description",
      totalValue,
      initialInvestment,
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
  const totalPortfolioCost  = portfolios.reduce((sum, p) => sum + p.initialInvestment, 0)
  const totalPortfolioGain  = portfolios.reduce((sum, p) => sum + p.totalLossGain, 0)
  const totalPortfolioGainPercentage = totalPortfolioCost > 0
    ? ((totalPortfolioGain / totalPortfolioCost) * 100).toFixed(2)
    : "0.00"

  const wallet = validPortfolios[0]?.user?.wallet

  if (validPortfolios.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[500px]">
        <div className="w-full max-w-md text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <Clock className="h-9 w-9 text-amber-500" />
              </div>
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-400 flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              Portfolio Allocation Pending
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Your account is active and your deposit has been received. Our team is currently
              reviewing your investment profile and will allocate your portfolio shortly.
            </p>
          </div>

          {/* Status pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-400 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            Awaiting portfolio allocation
          </div>

          {/* What to expect */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 p-4 text-left space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">What happens next</p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                </span>
                Our team reviews your onboarding profile and risk assessment
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                </span>
                A portfolio matching your investment goals is assigned to you
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                </span>
                You will be notified once your portfolio is live and visible here
              </li>
            </ul>
          </div>

          <Link href="/user/deposits">
            <Button variant="outline" className="w-full">
              View My Deposits
            </Button>
          </Link>
        </div>
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
            <div className="text-2xl font-bold">${totalPortfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
              ${Math.abs(totalPortfolioGain).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className={`text-xs flex items-center gap-1 ${totalPortfolioGain >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalPortfolioGain >= 0 ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
              {totalPortfolioGainPercentage}% return
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Not Invested</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(wallet?.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Available for allocation</p>
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

        <div className="grid gap-6 md:grid-cols-2">
          {portfolios.map((portfolio) => {
            const isPositive = portfolio.totalLossGain >= 0

            return (
              <Card key={portfolio.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{portfolio.name}</CardTitle>
                      <CardDescription className="line-clamp-1 mt-0.5 text-xs font-medium text-muted-foreground">
                        {portfolio.templateName}
                      </CardDescription>
                    </div>
                    <Badge variant={portfolio.status === "ACTIVE" ? "default" : "secondary"}>
                      {portfolio.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                    <p className="text-xl font-bold">${portfolio.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Gain/Loss</span>
                      <span className={`text-sm font-semibold flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                        {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                        ${Math.abs(portfolio.totalLossGain).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({portfolio.lossGainPercentage.toFixed(2)}%)
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