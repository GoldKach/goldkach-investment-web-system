import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Plus } from "lucide-react"
import { listAssets } from "@/actions/assets"
import AssetListing from "@/components/back/asset-listing"




export default async function AssetsPage() {
     const assetsData = await listAssets();
     const assets = assetsData.data;
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground mt-2">Manage your portfolio assets and track performance</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/assets/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Asset
          </Link>
        </Button>
      </div>
        <AssetListing mockAssets={assets} />

      
    </div>
  )
}
