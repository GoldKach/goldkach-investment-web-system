// import Link from "next/link"
// import { notFound } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft } from "lucide-react"
// import { AssetForm } from "@/components/back/assets-form"
// import { getAsset } from "@/actions/assets"


// export default async function EditAssetPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
  
//     const id = (await params).id;
//        const assetData = await getAsset(id);
//        const asset = assetData.data;
//   if (!asset) {
//     notFound()
//   }

//   return (
//     <div className="container mx-auto py-8 px-4 max-w-2xl">
//       <Button variant="ghost" asChild className="mb-6">
//         <Link href={`/dashboard/assets`}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Asset
//         </Link>
//       </Button>

//       <div className="mb-8">
//         <h1 className="text-4xl font-bold tracking-tight mb-2">Edit Asset</h1>
//         <p className="text-muted-foreground">Update the details for {asset.symbol}</p>
//       </div>

//       <AssetForm asset={asset} mode="edit" />
//     </div>
//   )
// }




import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AssetForm } from "@/components/back/assets-form"
import { getAsset } from "@/actions/assets"

export default async function EditAssetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id;

  const assetData = await getAsset(id);
  if (!assetData.success || !assetData.data) {
    notFound();
  }

  // 🔥 Important fix: ensure assetClass is never undefined
  const asset = {
    ...assetData.data,
    assetClass: assetData.data.assetClass ?? "OTHERS",
  };

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
        <p className="text-muted-foreground">
          Update the details for {asset.symbol}
        </p>
      </div>

      <AssetForm asset={asset} mode="edit" />
    </div>
  );
}
