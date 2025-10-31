// import Link from "next/link"
// import { notFound } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft } from "lucide-react"
// import { UserPortfolioAssetForm } from "@/components/user-portfolio-asset-form"
// import { getPortfolioAssetById } from "@/actions/portfolioassets"

// // Mock data - replace with actual database query
// const mockUserPortfolioAssets = [
//   {
//     id: "1",
//     userPortfolioId: "1",
//     portfolioAssetId: "1",
//     costPrice: 15000.0,
//     stock: 100,
//     closeValue: 17500.5,
//     lossGain: 2500.5,
//   },
// ]

// export default async function EditUserPortfolioAssetPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {

//     const { id } = await params;
//   const portfolioAsset = getPortfolioAssetById(id)


//   return (
//     <div className="container mx-auto py-8 px-4 max-w-2xl">
//       <Button variant="ghost" asChild className="mb-4">
//         <Link href={`/dashboard/portfolio-assets/${id}`}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Details
//         </Link>
//       </Button>

//       <div className="mb-8">
//         <h1 className="text-4xl font-bold tracking-tight">Edit User Portfolio Asset</h1>
//         <p className="text-muted-foreground mt-2">Update the user portfolio asset information</p>
//       </div>

//       <UserPortfolioAssetForm initialData={portfolioAsset} mode="edit" />
//     </div>
//   )
// }




import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserPortfolioAssetForm } from "@/components/user-portfolio-asset-form";
import { getPortfolioAssetById } from "@/actions/portfolioassets";

export default async function EditUserPortfolioAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ✅ Await the server action
  const res = await getPortfolioAssetById(id);
  if (!res.success || !res.data) {
    return notFound();
  }

  // API returns a PortfolioAssetDTO; map to the minimal shape the form expects
  const dto = res.data; // PortfolioAssetDTO
  const initialData = {
    id: dto.id,
    portfolioId: dto.portfolioId,
    assetId: dto.assetId,
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={`/dashboard/portfolio-assets/${id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Details
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Edit User Portfolio Asset</h1>
        <p className="text-muted-foreground mt-2">
          Update the user portfolio asset information
        </p>
      </div>

      <UserPortfolioAssetForm initialData={initialData} mode="edit" />
    </div>
  );
}
