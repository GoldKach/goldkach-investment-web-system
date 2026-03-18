

// // app/dashboard/asset-allocation/page.tsx (or your page file)
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plus } from "lucide-react";
// import { AssetAllocationTable, type UserPortfolioAssetRow } from "@/components/asset-allocation-table";
// import { getPortfolioAssets, type PortfolioAssetDTO } from "@/actions/portfolioassets";

// export default async function UserPortfolioAssetsPage() {
//   const assetsRes = await getPortfolioAssets();
//   const assets: PortfolioAssetDTO[] = assetsRes.success ? (assetsRes.data ?? []) : [];

//   // 🔁 Map API DTO → table row shape
//   const rows: UserPortfolioAssetRow[] = assets.map((a) => ({
//     id: a.id,
//     userPortfolioId: a.portfolioId,          // if you truly have a separate "user portfolio" id, swap here
//     portfolioAssetId: a.assetId,
//     userPortfolioName: a.portfolio?.name ?? "—", // if you have a separate user-portfolio name, map it here
//     portfolioName: a.portfolio?.name ?? "—",
//     assetSymbol: a.asset?.symbol ?? "—",
//     costPrice: a.costPrice ?? 0,
//     stock: a.stock ?? 0,
//     closeValue: a.closeValue ?? 0,
//     lossGain: typeof a.lossGain === "number" ? a.lossGain : (a.closeValue ?? 0) - (a.costPrice ?? 0),
//     createdAt: a.createdAt,
//     updatedAt: a.updatedAt,
//   }));

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-4xl font-bold tracking-tight">Asset Allocation</h1>
//           <p className="text-muted-foreground mt-2">
//             Manage user-specific asset holdings and performance
//           </p>
//         </div>
//         <Button asChild>
//           <Link href="/dashboard/asset-allocation/new">
//             <Plus className="mr-2 h-4 w-4" />
//             Add Asset Allocation
//           </Link>
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>All Asset Allocation</CardTitle>
//           <CardDescription>View and manage asset allocation</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <AssetAllocationTable items={rows} basePath="/dashboard/asset-allocation" />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


// app/dashboard/portfolio-assets/page.tsx
import { listAssets } from "@/actions/assets";
import { getPortfolioAssets } from "@/actions/portfolioassets";
import { getPortfolios } from "@/actions/portfolios";
import PortfolioAssetsClient from "./components/portfolio-asset-client";

export default async function PortfolioAssetsPage() {
  const [itemsRes, assetsRes, portfoliosRes] = await Promise.all([
    getPortfolioAssets(),
    listAssets(),
    getPortfolios({ include: "assets" }),
  ]);

  return (
    <PortfolioAssetsClient
      initialItems={itemsRes.data  ?? []}
      allAssets={assetsRes.data    ?? []}
      allPortfolios={portfoliosRes.data ?? []}
    />
  );
}
