import React from 'react'
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Pencil } from "lucide-react"
import { DeletePortfolioButton } from "@/components/back/delete-portfolio-button"
import { formatDate } from '../formart-date'


export default function PortfolioDetail({portfolio}:{portfolio:any}) {

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
          <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/portfolios">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolios
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{portfolio.name}</h1>
          <p className="text-muted-foreground">{portfolio.description || "No description provided"}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/dashboard/portfolios/${portfolio.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <DeletePortfolioButton portfolioId={portfolio.id} portfolioName={portfolio.name} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Details</CardTitle>
            <CardDescription>Basic information about this portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Time Horizon</span>
              <span className="font-medium">{portfolio.timeHorizon}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Risk Tolerance</span>
              <Badge variant={getRiskBadgeVariant(portfolio.riskTolerance)}>{portfolio.riskTolerance}</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Allocation Percentage</span>
              <span className="font-medium">{formatPercentage(portfolio.allocationPercentage)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Portfolio creation and update history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 py-2 border-b">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">{formatDate(portfolio.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">{formatDate(portfolio.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Portfolio Assets</CardTitle>
          <CardDescription>Assets allocated to this portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">No assets assigned to this portfolio yet.</div>
        </CardContent>
      </Card>
      
    </div>
  )
}
