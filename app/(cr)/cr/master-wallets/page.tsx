import { listMasterWallets } from "@/actions/master-wallets";
import { MasterWalletsClient } from "@/app/(back)/dashboard/portfolio-wallets/components/wallets-client";

export const dynamic = "force-dynamic";

export default async function CRMasterWalletsPage() {
  const res = await listMasterWallets();
  return <MasterWalletsClient initialWallets={res.data ?? []} />;
}
