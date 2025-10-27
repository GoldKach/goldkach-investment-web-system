import React from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Plus } from "lucide-react"
import { DeletePortfolioAssetButton } from "@/components/delete-portfolio-asset-button"
import { listAssets } from "@/actions/assets"
import { getPortfolios } from "@/actions/portfolios"

export default function PortfolioAssetListing({mockPortfolioAssets}:{mockPortfolioAssets:any}) {
    function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
  return (
    <div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Portfolio Assets</CardTitle>
          <CardDescription>View and manage all portfolio-asset relationships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Portfolio</TableHead>
                  <TableHead>Asset</TableHead>
                  {/* <TableHead className="text-right">Sector</TableHead> */}
                  {/* <TableHead className="text-right">Cost Price</TableHead>
                  <TableHead className="text-right">Close Value</TableHead>
                  <TableHead className="text-right">Gain/Loss</TableHead> */}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPortfolioAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No portfolio assets found. Add assets to your portfolios to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  mockPortfolioAssets.map((portfolioAsset:any) => (
                    <TableRow key={portfolioAsset.id}>
                      <TableCell className="font-semibold">{portfolioAsset.portfolio.name}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{portfolioAsset.asset.symbol}</div>
                          <div className="text-sm text-muted-foreground">{portfolioAsset.asset.sector}</div>
                        </div>
                      </TableCell>
                     
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild title="View details">
                            <Link href={`/dashboard/portfolioassets/${portfolioAsset.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild title="Edit portfolio asset">
                            <Link href={`/dashboard/portfolioassets/${portfolioAsset.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeletePortfolioAssetButton
                            portfolioAssetId={portfolioAsset.id}
                            assetSymbol={portfolioAsset.assetSymbol}
                            portfolioName={portfolioAsset.portfolioName}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
