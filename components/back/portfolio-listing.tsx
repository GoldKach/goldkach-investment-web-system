import React from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Plus } from "lucide-react"
import { DeletePortfolioButton } from "@/components/back/delete-portfolio-button"
import { getPortfolios } from "@/actions/portfolios"

export default function PortfolioListing({portfolios}: {portfolios:any}) {


    function formatPercentage(value: number) {
  return `${value.toFixed(2)}%`
}

function getRiskBadgeVariant(risk: string) {
  switch (risk.toLowerCase()) {
    case "high":
      return "destructive"
    case "medium":
      return "default"
    case "low":
      return "secondary"
    default:
      return "outline"
  }
}

  return (
    <div>
         <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Time Horizon</TableHead>
                  <TableHead>Risk Tolerance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No portfolios found. Create your first portfolio to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  portfolios.map((portfolio:any) => (
                    <TableRow key={portfolio.id}>
                      <TableCell className="font-semibold">{portfolio.name}</TableCell>
                      <TableCell className="max-w-md">
                        {portfolio.description || <span className="text-muted-foreground italic">No description</span>}
                      </TableCell>
                      <TableCell>{portfolio.timeHorizon}</TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeVariant(portfolio.riskTolerance)}>{portfolio.riskTolerance}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild title="View details">
                            <Link href={`/dashboard/portfolios/${portfolio.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild title="Edit portfolio">
                            <Link href={`/dashboard/portfolios/${portfolio.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeletePortfolioButton portfolioId={portfolio.id} portfolioName={portfolio.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
      
    </div>
  )
}
