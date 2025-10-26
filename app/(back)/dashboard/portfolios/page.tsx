import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Plus } from "lucide-react"
import { DeletePortfolioButton } from "@/components/back/delete-portfolio-button"
import { getPortfolios } from "@/actions/portfolios"
import PortfolioListing from "@/components/back/portfolio-listing"

export default async function PortfoliosPage() {
    const portfolioData = await getPortfolios();
         const portfolios = portfolioData.data;
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Portfolios</h1>
          <p className="text-muted-foreground mt-2">Manage your investment portfolios and strategies</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/portfolios/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Portfolio
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Portfolios</CardTitle>
          <CardDescription>View and manage all your investment portfolios</CardDescription>
        </CardHeader>
        <CardContent>
            <PortfolioListing portfolios={portfolios} />
         
        </CardContent>
      </Card>
    </div>
  )
}
