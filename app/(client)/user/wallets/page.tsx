import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getMasterWalletByUser } from "@/actions/master-wallets";
import { getPortfolioSummary } from "@/actions/portfolio-summary";
import { WalletsView } from "./components/wallets-view";

export const dynamic = "force-dynamic";

export default async function WalletsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  const [walletRes, summaryRes] = await Promise.allSettled([
    getMasterWalletByUser(userId),
    getPortfolioSummary(userId),
  ]);

  const walletDetail =
    walletRes.status === "fulfilled" && walletRes.value?.success
      ? walletRes.value.data
      : null;

  const portfolioSummary =
    summaryRes.status === "fulfilled" && summaryRes.value?.success
      ? summaryRes.value.data
      : null;

  return (
    <WalletsView
      userId={userId}
      walletDetail={walletDetail}
      portfolioSummary={portfolioSummary}
    />
  );
}
