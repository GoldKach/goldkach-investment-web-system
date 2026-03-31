import { listPortfolioWallets } from "@/actions/portfolio-wallets";
import { PortfolioWalletsClient } from "@/app/(back)/dashboard/portfolio-wallets/components/wallets-client";

export const dynamic = "force-dynamic";

export default async function CRPortfolioWalletsPage() {
  const res = await listPortfolioWallets();
  return <PortfolioWalletsClient initialWallets={res.data ?? []} />;
}
