import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Plus } from "lucide-react"
import { DeletePortfolioAssetButton } from "@/components/delete-portfolio-asset-button"
import { listAssets } from "@/actions/assets"
import { getPortfolios } from "@/actions/portfolios"
import PortfolioAssetListing from "@/components/portfolio-asset-listing"
import { getPortfolioAssets } from "@/actions/portfolioassets"


export default async function Page() {
      const portfolioData = await getPortfolioAssets();
     const portfolioAssets = portfolioData.data;

     console.log(portfolioAssets);

     
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Portfolio Assets</h1>
          <p className="text-muted-foreground mt-2">Manage asset allocations within portfolios</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/portfolioassets/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Portfolio Asset
          </Link>
        </Button>
      </div>
      <PortfolioAssetListing mockPortfolioAssets={portfolioAssets}/>
    </div>
  )
}
