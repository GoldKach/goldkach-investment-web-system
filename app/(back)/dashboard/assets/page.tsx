// app/(dashboard)/assets/page.tsx
import { listAssets } from "@/actions/assets"
import { AssetManagement } from "./components/asset-management";

export default async function AssetsPage() {
  const assetsData = await listAssets();
  const assets = assetsData.data || [];

  return (
    <div className="container mx-auto py-8 px-8">
      <AssetManagement initialAssets={assets} />
    </div>
  )
}