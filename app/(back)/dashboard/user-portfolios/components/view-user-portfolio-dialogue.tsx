// components/back/view-user-portfolio-dialog.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, TrendingUp, TrendingDown } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type UserPortfolio = {
  id: string
  userId: string
  portfolioId: string
  portfolioValue: number
  createdAt?: string
  updatedAt?: string
  user?: {
    name?: string | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
  }
  portfolio?: {
    name: string
    description?: string | null
  }
  userAssets?: Array<{
    id: string
    assetId: string
    allocationPercentage: number
    costPerShare: number
    costPrice: number
    stock: number
    closeValue: number
    lossGain: number
    asset?: {
      symbol: string
      description: string
      closePrice: number
    }
  }>
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  userPortfolio: UserPortfolio
  onDelete: () => void
}

export function ViewUserPortfolioDialog({ open, onOpenChange, userPortfolio, onDelete }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—"
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString))
  }

  const getUserName = () => {
    if (userPortfolio.user?.name) return userPortfolio.user.name
    if (userPortfolio.user?.firstName || userPortfolio.user?.lastName) {
      return `${userPortfolio.user.firstName || ""} ${userPortfolio.user.lastName || ""}`.trim()
    }
    return "—"
  }

  const totalAllocation = userPortfolio.userAssets?.reduce((sum, a) => sum + a.allocationPercentage, 0) || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">User Portfolio Details</DialogTitle>
              <DialogDescription className="mt-2">
                {getUserName()} • {userPortfolio.portfolio?.name || "—"}
              </DialogDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
              Delete
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Portfolio Value
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(userPortfolio.portfolioValue)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Total Allocation
                </div>
                <div className="text-2xl font-bold">
                  <Badge variant={Math.abs(totalAllocation - 100) < 0.01 ? "default" : "secondary"}>
                    {formatPercentage(totalAllocation)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Number of Assets
                </div>
                <div className="text-2xl font-bold">
                  {userPortfolio.userAssets?.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">User Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-medium">{getUserName()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2 font-medium">{userPortfolio.user?.email || "—"}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Asset Allocations Table */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Asset Allocations (User-Specific)</h3>
            <p className="text-sm text-muted-foreground">
              This user's custom allocation percentages and cost basis for each asset
            </p>

            {userPortfolio.userAssets && userPortfolio.userAssets.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead className="text-right">User Alloc%</TableHead>
                      <TableHead className="text-right">User Cost/Share</TableHead>
                      <TableHead className="text-right">Shares</TableHead>
                      <TableHead className="text-right">Current Price</TableHead>
                      <TableHead className="text-right">Market Value</TableHead>
                      <TableHead className="text-right">Gain/Loss</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userPortfolio.userAssets.map((userAsset) => {
                      const gainLoss = userAsset.lossGain || 0
                      const isPositive = gainLoss >= 0

                      return (
                        <TableRow key={userAsset.id}>
                          <TableCell>
                            <div>
                              <div className="font-mono font-semibold">
                                {userAsset.asset?.symbol || "—"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {userAsset.asset?.description || "—"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            <Badge variant="secondary">
                              {formatPercentage(userAsset.allocationPercentage)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(userAsset.costPerShare)}
                          </TableCell>
                          <TableCell className="text-right">
                            {userAsset.stock.toFixed(4)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(userAsset.asset?.closePrice || 0)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(userAsset.closeValue)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {isPositive ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                              <span className={isPositive ? "text-green-600" : "text-red-600"}>
                                {isPositive ? "+" : ""}
                                {formatCurrency(gainLoss)}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No assets in this portfolio
              </div>
            )}
          </div>

          <Separator />

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span>
              <span className="ml-2">{formatDate(userPortfolio.createdAt)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="ml-2">{formatDate(userPortfolio.updatedAt)}</span>
            </div>
          </div>

          {/* Info Box */}
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> These allocation percentages and cost basis are specific to this user. 
                Other users with the same portfolio can have completely different allocations and costs based on 
                their individual investment strategies and purchase prices.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}