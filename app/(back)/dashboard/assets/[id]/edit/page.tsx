import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AssetForm } from "@/components/back/assets-form"
import { getAsset } from "@/actions/assets"

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

export default async function EditAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  
    const id = (await params).id;
       const assetData = await getAsset(id);
       const asset = assetData.data;
      console.log(asset);

  if (!asset) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href={`/dashboard/assets`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Asset
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Edit Asset</h1>
        <p className="text-muted-foreground">Update the details for {asset.symbol}</p>
      </div>

      <AssetForm asset={asset} mode="edit" />
    </div>
  )
}
