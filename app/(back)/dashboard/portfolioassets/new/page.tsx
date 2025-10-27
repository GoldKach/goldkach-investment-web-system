// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft } from "lucide-react"
// import { PortfolioAssetForm } from "@/components/portfolio-asset-form"
// import { listAssets } from "@/actions/assets";
// import { getPortfolios } from "@/actions/portfolios";

// export default async function NewPortfolioAssetPage() {
//     const assetsData = await listAssets();
//     const assets = assetsData.data;

//     const portfolioData = await getPortfolios();
//     const portfolios = portfolioData.data;
//   return (
//     <div className="container mx-auto py-8 px-4 max-w-2xl">
//       <Button variant="ghost" asChild className="mb-6">
//         <Link href="/portfolio-assets">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Portfolio Assets
//         </Link>
//       </Button>

//       <div className="mb-8">
//         <h1 className="text-4xl font-bold tracking-tight mb-2">Add Portfolio Asset</h1>
//         <p className="text-muted-foreground">Add a new asset to a portfolio</p>
//       </div>

//       <PortfolioAssetForm mode="create" assets={assets} portfolios={portfolios} />
//     </div>
//   )
// }



// app/(dashboard)/portfolio-assets/new/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { PortfolioAssetForm } from "@/components/portfolio-asset-form"
import { listAssets } from "@/actions/assets"
import { getPortfolios } from "@/actions/portfolios"

export default async function NewPortfolioAssetPage() {
  const assetsRes = await listAssets()
  const portfoliosRes = await getPortfolios()

  const assets = assetsRes.success ? assetsRes.data : []
  const portfolios = portfoliosRes.success ? portfoliosRes.data : []

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/portfolio-assets">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Portfolio Assets
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Add Portfolio Asset</h1>
        <p className="text-muted-foreground">Add a new asset to a portfolio</p>
      </div>

      <PortfolioAssetForm mode="create" assets={assets} portfolios={portfolios} />
    </div>
  )
}
