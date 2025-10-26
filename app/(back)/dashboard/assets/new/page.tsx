import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AssetForm } from "@/components/back/assets-form"

export default function NewAssetPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/assets">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assets
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Add New Asset</h1>
        <p className="text-muted-foreground">Add a new asset to your portfolio</p>
      </div>

      <AssetForm mode="create" />
    </div>
  )
}
