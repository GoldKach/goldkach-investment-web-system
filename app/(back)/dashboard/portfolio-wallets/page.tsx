// app/dashboard/portfolio-wallets/page.tsx
import { listPortfolioWallets } from "@/actions/portfolio-wallets";
import { PortfolioWalletsClient } from "./components/wallets-client";

export default async function PortfolioWalletsPage() {
  const res     = await listPortfolioWallets();
  const wallets = res.data ?? [];
  return <PortfolioWalletsClient initialWallets={wallets} />;
}