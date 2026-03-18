// app/dashboard/master-wallets/page.tsx
import { listMasterWallets } from "@/actions/master-wallets";
import { MasterWalletsClient } from "../portfolio-wallets/components/wallets-client";

export default async function MasterWalletsPage() {
  const res     = await listMasterWallets();
  const wallets = res.data ?? [];
  return <MasterWalletsClient initialWallets={wallets} />;
}