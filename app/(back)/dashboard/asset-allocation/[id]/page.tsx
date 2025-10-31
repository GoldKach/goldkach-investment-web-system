// import Link from "next/link"
// import { notFound } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { ArrowLeft, Pencil, Calculator } from "lucide-react"
// import { DeleteUserPortfolioAssetButton } from "@/components/delete-user-portfolio-asset-button"
// import { getPortfolioAssetById } from "@/actions/portfolioassets"



// function formatCurrency(value: number) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   }).format(value)
// }

// function formatNumber(value: number) {
//   return new Intl.NumberFormat("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(value)
// }

// function formatPercentage(value: number) {
//   return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
// }

// export default async function UserPortfolioAssetDetailPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {

//     const { id } = await params;
//   const userPortfolioAsset = await getPortfolioAssetById(id);

//   if (!userPortfolioAsset) {
//     notFound()
//   }


//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="mb-8">
//         <Button variant="ghost" asChild className="mb-4">
//           <Link href="/user-portfolio-assets">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to User Portfolio Assets
//           </Link>
//         </Button>

//         <div className="flex items-start justify-between">
//           <div>
//             <h1 className="text-4xl font-bold tracking-tight">{userPortfolioAsset.assetSymbol}</h1>
//             <p className="text-xl text-muted-foreground mt-2">{userPortfolioAsset.assetDescription}</p>
//             <p className="text-sm text-muted-foreground mt-1">
//               {userPortfolioAsset.userPortfolioName} • {userPortfolioAsset.portfolioName}
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <Button asChild>
//               <Link href={`/user-portfolio-assets/${userPortfolioAsset.id}/edit`}>
//                 <Pencil className="mr-2 h-4 w-4" />
//                 Edit
//               </Link>
//             </Button>
//             <DeleteUserPortfolioAssetButton
//               userPortfolioAssetId={userPortfolioAsset.id}
//               assetSymbol={userPortfolioAsset.assetSymbol}
//               userPortfolioName={userPortfolioAsset.userPortfolioName}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Position Details</CardTitle>
//             <CardDescription>Current holdings and pricing information</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Stock Quantity</span>
//               <span className="font-semibold">{formatNumber(userPortfolioAsset.stock)}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Cost Price (Total)</span>
//               <span className="font-semibold">{formatCurrency(userPortfolioAsset.costPrice)}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Cost Per Share</span>
//               <span className="font-semibold">{formatCurrency(userPortfolioAsset.costPerShare)}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Close Price (Per Share)</span>
//               <span className="font-semibold">{formatCurrency(userPortfolioAsset.closePrice)}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Close Value (Total)</span>
//               <span className="font-semibold">{formatCurrency(userPortfolioAsset.closeValue)}</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Performance</CardTitle>
//             <CardDescription>Gain/loss and return metrics</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Gain/Loss</span>
//               <Badge variant={userPortfolioAsset.lossGain >= 0 ? "default" : "destructive"} className="text-base">
//                 {userPortfolioAsset.lossGain >= 0 ? "+" : ""}
//                 {formatCurrency(userPortfolioAsset.lossGain)}
//               </Badge>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Return Percentage</span>
//               <Badge variant={returnPercentage >= 0 ? "default" : "destructive"} className="text-base">
//                 {formatPercentage(returnPercentage)}
//               </Badge>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Allocation Percentage</span>
//               <span className="font-semibold">{userPortfolioAsset.allocationPercentage}%</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Net Asset Value</span>
//               <span className="font-semibold">{formatCurrency(userPortfolioAsset.netAssetValue)}</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Calculator className="h-5 w-5" />
//               Calculation Formulas
//             </CardTitle>
//             <CardDescription>How these values are calculated</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="p-3 bg-muted rounded-lg">
//               <div className="font-semibold mb-1">Cost Price</div>
//               <code className="text-sm">= asset.allocationPercentage × user.wallet.netAssetValue</code>
//               <div className="text-sm text-muted-foreground mt-1">
//                 = {userPortfolioAsset.allocationPercentage}% × {formatCurrency(userPortfolioAsset.netAssetValue)} ={" "}
//                 {formatCurrency(userPortfolioAsset.costPrice)}
//               </div>
//             </div>
//             <div className="p-3 bg-muted rounded-lg">
//               <div className="font-semibold mb-1">Stock</div>
//               <code className="text-sm">= costPrice ÷ asset.costPerShare</code>
//               <div className="text-sm text-muted-foreground mt-1">
//                 = {formatCurrency(userPortfolioAsset.costPrice)} ÷ {formatCurrency(userPortfolioAsset.costPerShare)} ={" "}
//                 {formatNumber(userPortfolioAsset.stock)}
//               </div>
//             </div>
//             <div className="p-3 bg-muted rounded-lg">
//               <div className="font-semibold mb-1">Close Value</div>
//               <code className="text-sm">= asset.closePrice × stock</code>
//               <div className="text-sm text-muted-foreground mt-1">
//                 = {formatCurrency(userPortfolioAsset.closePrice)} × {formatNumber(userPortfolioAsset.stock)} ={" "}
//                 {formatCurrency(userPortfolioAsset.closeValue)}
//               </div>
//             </div>
//             <div className="p-3 bg-muted rounded-lg">
//               <div className="font-semibold mb-1">Loss/Gain</div>
//               <code className="text-sm">= closeValue - costPrice</code>
//               <div className="text-sm text-muted-foreground mt-1">
//                 = {formatCurrency(userPortfolioAsset.closeValue)} - {formatCurrency(userPortfolioAsset.costPrice)} ={" "}
//                 {formatCurrency(userPortfolioAsset.lossGain)}
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle>Metadata</CardTitle>
//             <CardDescription>Record information</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Created At</span>
//               <span className="font-semibold">{userPortfolioAsset.createdAt.toLocaleDateString()}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-muted-foreground">Last Updated</span>
//               <span className="font-semibold">{userPortfolioAsset.updatedAt.toLocaleDateString()}</span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }






import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Calculator } from "lucide-react";
import { DeleteUserPortfolioAssetButton } from "@/components/delete-user-portfolio-asset-button";
import { getPortfolioAssetById } from "@/actions/portfolioassets";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}
function formatPercentage(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export default async function UserPortfolioAssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ✅ Fetch & validate
  const res = await getPortfolioAssetById(id);
  if (!res.success || !res.data) {
    notFound();
  }
  const pa = res.data; // PortfolioAssetDTO

  // Derived
  const symbol = pa.asset?.symbol ?? "—";
  const description = pa.asset?.description ?? "";
  const portfolioName = pa.portfolio?.name ?? "—";
  const costPerShare = pa.asset?.costPerShare ?? 0;
  const closePrice = pa.asset?.closePrice ?? 0;

  // Guard divide-by-zero
  const returnPct = pa.costPrice > 0 ? ((pa.closeValue - pa.costPrice) / pa.costPrice) * 100 : 0;

  const createdAt = new Date(pa.createdAt);
  const updatedAt = new Date(pa.updatedAt);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/portfolio-assets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio Assets
          </Link>
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{symbol}</h1>
            {description && <p className="text-xl text-muted-foreground mt-2">{description}</p>}
            <p className="text-sm text-muted-foreground mt-1">{portfolioName}</p>
          </div>

          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/dashboard/portfolio-assets/${pa.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <DeleteUserPortfolioAssetButton
              userPortfolioAssetId={pa.id}
              assetSymbol={symbol}
              userPortfolioName={portfolioName}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Position Details</CardTitle>
            <CardDescription>Current holdings and pricing information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Stock Quantity</span>
              <span className="font-semibold">{formatNumber(pa.stock)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cost Price (Total)</span>
              <span className="font-semibold">{formatCurrency(pa.costPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cost Per Share</span>
              <span className="font-semibold">{formatCurrency(costPerShare)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Close Price (Per Share)</span>
              <span className="font-semibold">{formatCurrency(closePrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Close Value (Total)</span>
              <span className="font-semibold">{formatCurrency(pa.closeValue)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Gain/Loss and return metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Gain/Loss</span>
              <Badge variant={pa.lossGain >= 0 ? "default" : "destructive"} className="text-base">
                {pa.lossGain >= 0 ? "+" : ""}
                {formatCurrency(pa.lossGain)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Return Percentage</span>
              <Badge variant={returnPct >= 0 ? "default" : "destructive"} className="text-base">
                {formatPercentage(returnPct)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculation Formulas
            </CardTitle>
            <CardDescription>How these values are calculated</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-semibold mb-1">Stock</div>
              <code className="text-sm">stock = costPrice ÷ asset.costPerShare</code>
              <div className="text-sm text-muted-foreground mt-1">
                = {formatCurrency(pa.costPrice)} ÷ {formatCurrency(costPerShare)} = {formatNumber(pa.stock)}
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-semibold mb-1">Close Value</div>
              <code className="text-sm">closeValue = asset.closePrice × stock</code>
              <div className="text-sm text-muted-foreground mt-1">
                = {formatCurrency(closePrice)} × {formatNumber(pa.stock)} = {formatCurrency(pa.closeValue)}
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-semibold mb-1">Loss/Gain</div>
              <code className="text-sm">lossGain = closeValue - costPrice</code>
              <div className="text-sm text-muted-foreground mt-1">
                = {formatCurrency(pa.closeValue)} - {formatCurrency(pa.costPrice)} = {formatCurrency(pa.lossGain)}
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-semibold mb-1">Return %</div>
              <code className="text-sm">return% = (lossGain ÷ costPrice) × 100</code>
              <div className="text-sm text-muted-foreground mt-1">
                = ({formatCurrency(pa.lossGain)} ÷ {formatCurrency(pa.costPrice)}) × 100 = {formatPercentage(returnPct)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
            <CardDescription>Record information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Created At</span>
              <span className="font-semibold">{createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-semibold">{updatedAt.toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
