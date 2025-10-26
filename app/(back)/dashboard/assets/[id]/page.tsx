import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Pencil, TrendingUp, TrendingDown } from "lucide-react"
import { DeleteAssetButton } from "@/components/back/delete-asset-button"
import { getAsset } from "@/actions/assets"
import { formatDate } from "@/components/formart-date"

// Mock data - replace with actual database query
const mockAssets = [
  {
    id: "1",
    symbol: "AAPL",
    description: "Apple Inc.",
    sector: "Technology",
    allocationPercentage: 15.5,
    costPerShare: 150.25,
    closePrice: 175.43,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-10-20"),
  },
  {
    id: "2",
    symbol: "GOOGL",
    description: "Alphabet Inc.",
    sector: "Technology",
    allocationPercentage: 12.3,
    costPerShare: 120.5,
    closePrice: 142.8,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-10-19"),
  },
  {
    id: "3",
    symbol: "JPM",
    description: "JPMorgan Chase & Co.",
    sector: "Financial Services",
    allocationPercentage: 8.7,
    costPerShare: 145.0,
    closePrice: 158.25,
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-10-18"),
  },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function formatPercentage(value: number) {
  return `${value.toFixed(2)}%`
}

// function formatDate(date: Date) {
//   return new Intl.DateTimeFormat("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   }).format(date)
// }

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // In a real app, fetch from database using params.id
    const id = (await params).id;
   const assetData = await getAsset(id);
   const asset = assetData.data;
  console.log(asset);

  if (!asset) {
    notFound()
  }

  const gainLoss = asset.closePrice - asset.costPerShare
  const gainLossPercentage = (gainLoss / asset.costPerShare) * 100
  const isPositive = gainLoss >= 0

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/assets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assets
          </Link>
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{asset.symbol}</h1>
            <p className="text-xl text-muted-foreground">{asset.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/assets/${asset.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <DeleteAssetButton assetId={asset.id} assetSymbol={asset.symbol} variant="outline" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Price</CardTitle>
            <CardDescription>Latest closing price</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(asset.closePrice)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Gain/Loss since purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="h-6 w-6 text-green-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600" />
              )}
              <div>
                <div className={`text-3xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {isPositive ? "+" : ""}
                  {formatCurrency(gainLoss)}
                </div>
                <div className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {isPositive ? "+" : ""}
                  {formatPercentage(gainLossPercentage)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Details</CardTitle>
          <CardDescription>Complete information about this asset</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Symbol</div>
              <div className="text-lg font-mono font-semibold">{asset.symbol}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Sector</div>
              <div>
                <Badge variant="secondary" className="text-sm">
                  {asset.sector}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Cost Per Share</div>
              <div className="text-lg font-semibold">{formatCurrency(asset.costPerShare)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Close Price</div>
              <div className="text-lg font-semibold">{formatCurrency(asset.closePrice)}</div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Portfolio Allocation</div>
            <div className="text-lg font-semibold">{formatPercentage(asset.allocationPercentage)}</div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Created</div>
              <div className="text-sm">{formatDate(asset.createdAt)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Last Updated</div>
              <div className="text-sm">{formatDate(asset.updatedAt)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
