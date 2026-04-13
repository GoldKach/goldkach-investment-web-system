import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getClientsForAssignmentAction } from "@/actions/staff";
import { getPortfolioSummary } from "@/actions/portfolio-summary";
import { listMasterWallets } from "@/actions/master-wallets";
import { listDeposits } from "@/actions/deposits";
import { listWithdrawals } from "@/actions/withdraws";
import { AccountantDashboard } from "./components/accountant-dashboard";

export const dynamic = "force-dynamic";

export default async function AccountantPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const [clientsRes, walletsRes, depositsRes, withdrawalsRes] = await Promise.all([
    getClientsForAssignmentAction(),
    listMasterWallets(),
    listDeposits({ sortBy: "createdAt", order: "desc", pageSize: 500, include: ["user"] }),
    listWithdrawals({ sortBy: "createdAt", order: "desc", pageSize: 500, include: ["user"] }),
  ]);

  const clients = (clientsRes.data ?? []).filter((c: any) => !c.role || c.role === "USER");
  const wallets = walletsRes.success ? (walletsRes.data ?? []) : [];
  const deposits = depositsRes.success ? (depositsRes.data ?? []) : [];
  const withdrawals = withdrawalsRes.success ? (withdrawalsRes.data ?? []) : [];

  // Fetch portfolio summaries for all clients (limit to 25)
  const summaryResults = await Promise.allSettled(
    clients.slice(0, 25).map((c: any) => getPortfolioSummary(c.id))
  );

  const clientSummaries = summaryResults
    .map((r, i) => ({
      client: clients[i],
      summary: r.status === "fulfilled" && r.value?.success ? r.value.data : null,
    }))
    .filter((x) => x.summary !== null);

  return (
    <AccountantDashboard
      clientSummaries={clientSummaries as any[]}
      wallets={wallets}
      deposits={deposits}
      withdrawals={withdrawals}
      totalClients={clients.length}
    />
  );
}
