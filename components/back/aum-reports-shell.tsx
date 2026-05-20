"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountantReports } from "@/components/back/aum-reports";
import { getClientsForAssignmentAction, type ClientUser } from "@/actions/staff";

function buildClientPortfolios(clients: ClientUser[]) {
  return [...clients]
    .sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime())
    .map((client) => {
      const portfolios: any[] = (client.userPortfolios ?? []).map((up: any) => ({
        ...up,
        assets: up.userAssets ?? up.assets ?? [],
      }));

      const feeTotals = portfolios.reduce(
        (acc, p) => ({
          bankFee:        acc.bankFee        + (p.wallet?.bankFee        ?? 0),
          transactionFee: acc.transactionFee + (p.wallet?.transactionFee ?? 0),
          feeAtBank:      acc.feeAtBank      + (p.wallet?.feeAtBank      ?? 0),
        }),
        { bankFee: 0, transactionFee: 0, feeAtBank: 0 }
      );

      const approvedDeposits: any[] = (client.deposits ?? []).filter(
        (d: any) => d.transactionStatus === "APPROVED"
      );
      const depositFeeSummary =
        approvedDeposits.length > 0
          ? approvedDeposits.reduce(
              (acc, d) => ({
                totalBankCost:        acc.totalBankCost        + (d.bankCost        ?? 0),
                totalTransactionCost: acc.totalTransactionCost + (d.transactionCost ?? 0),
                totalCashAtBank:      acc.totalCashAtBank      + (d.cashAtBank      ?? 0),
                totalFees:            acc.totalFees            + (d.totalFees       ?? 0),
                depositCount:         acc.depositCount         + 1,
              }),
              { totalBankCost: 0, totalTransactionCost: 0, totalCashAtBank: 0, totalFees: 0, depositCount: 0 }
            )
          : null;

      const mw = (client.masterWallet as any) ?? null;
      const cashBalance: number = mw?.balance ?? mw?.netAssetValue ?? 0;
      const isCashOnly = portfolios.length === 0;

      return {
        client,
        portfolios,
        masterWallet: mw,
        feeTotals,
        depositFeeSummary,
        isCashOnly,
        cashBalance,
      };
    })
    // Include clients with portfolios OR clients with unallocated cash in the master wallet
    .filter((x) => x.portfolios.length > 0 || x.cashBalance > 0);
}

export function AccountantReportsShell() {
  const [clients, setClients]   = useState<ClientUser[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getClientsForAssignmentAction();
      if (res.success) {
        setClients(
          (res.data ?? []).filter((c: any) => !c.role || c.role === "USER")
        );
      } else {
        setError(res.error ?? "Failed to load clients.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error loading clients.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const clientPortfolios = useMemo(() => buildClientPortfolios(clients), [clients]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin opacity-40" />
        <p className="text-sm">Loading client data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-6 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Failed to load client data</p>
          <p className="text-xs text-red-500 dark:text-red-500 mt-1 opacity-80">{error}</p>
        </div>
        <Button size="sm" variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-12 text-center text-sm text-muted-foreground">
        No clients found.
      </div>
    );
  }

  return (
    <AccountantReports
      clientPortfolios={clientPortfolios}
      isLoadingClients={false}
      totalClients={clients.length}
    />
  );
}
