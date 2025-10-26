import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AssetListing({mockAssets}: {mockAssets:any}) {
    
    function formatCurrency(value: number) {
         
        
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value)
    }
    
    function formatPercentage(value: number) {
      return `${value.toFixed(2)}%`
    }
    
    function calculateGainLoss(costPerShare: number, closePrice: number) {
      const diff = closePrice - costPerShare
      const percentage = (diff / costPerShare) * 100
      return { diff, percentage }
    }
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>All Assets</CardTitle>
          <CardDescription>View and manage all assets in your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead className="text-right">Allocation</TableHead>
                  <TableHead className="text-right">Cost/Share</TableHead>
                  <TableHead className="text-right">Close Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No assets found. Add your first asset to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  mockAssets.map((asset:any) => {
                    const { diff, percentage } = calculateGainLoss(asset.costPerShare, asset.closePrice)
                    const isPositive = diff >= 0

                    return (
                      <TableRow key={asset.id}>
                        <TableCell className="font-mono font-semibold">{asset.symbol}</TableCell>
                        <TableCell>{asset.description}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{asset.sector}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatPercentage(asset.allocationPercentage)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(asset.costPerShare)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(asset.closePrice)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild title="View details">
                              <Link href={`/dashboard/assets/${asset.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild title="Edit asset">
                              <Link href={`/dashboard/assets/${asset.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            {/* <DeleteAssetButton assetId={asset.id} assetSymbol={asset.symbol} /> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
