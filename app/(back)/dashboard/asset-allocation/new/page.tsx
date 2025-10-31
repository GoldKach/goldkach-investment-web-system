
// // app/user-portfolio-assets/new/page.tsx
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import { UserPortfolioAssetForm } from "@/components/user-portfolio-asset-form";
// import { listAssets } from "@/actions/assets";
// import { getPortfolios } from "@/actions/portfolios";

// export default async function NewUserPortfolioAssetPage() {
//     const assetsData = await listAssets();
//          const assets = assetsData.data;
//         const portfolioData = await getPortfolios();
//         const portfolios = portfolioData.data;

//         console.log(assets)
//   return (
//     <div className="container mx-auto py-8 px-4 max-w-2xl">
//       <Button variant="ghost" asChild className="mb-4">
//         <Link href="/dashboard/portfolio-assets">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to User Portfolio Assets
//         </Link>
//       </Button>

//       <div className="mb-8">
//         <h1 className="text-4xl font-bold tracking-tight">Add User Portfolio Asset</h1>
//         <p className="text-muted-foreground mt-2">Create a new user portfolio asset holding</p>
//       </div>

//       {/* If you have real lists, pass them as props: <UserPortfolioAssetForm mode="create" userPortfolios={...} portfolioAssets={...} /> */}
//       <UserPortfolioAssetForm mode="create" portfolios={portfolios} assets={assets} />
//     </div>
//   );
// }


// app/user-portfolio-assets/new/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserPortfolioAssetForm } from "@/components/user-portfolio-asset-form";
import { listAssets } from "@/actions/assets";
import { getPortfolios } from "@/actions/portfolios";

export default async function NewUserPortfolioAssetPage() {
  const assetsRes = await listAssets();
  const assets = (assetsRes.data ?? []).map((a: any) => ({
    id: a.id,
    symbol: a.symbol,
    description: a.description,
    sector: a.sector,
    costPerShare: a.costPerShare,
    closePrice: a.closePrice,
  }));

  const portfoliosRes = await getPortfolios();
  const portfolios = (portfoliosRes.data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
  }));

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard/portfolio-assets">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to User Portfolio Assets
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Add User Portfolio Asset</h1>
        <p className="text-muted-foreground mt-2">Create a new user portfolio asset holding</p>
      </div>

      <UserPortfolioAssetForm mode="create" portfolios={portfolios} assets={assets} />
    </div>
  );
}
