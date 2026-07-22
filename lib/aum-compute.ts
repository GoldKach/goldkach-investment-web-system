// Pure AUM computation logic — no React, usable in both client components and server routes

export interface ClientPortfolioSummary {
  client: any;
  portfolios: any[];
  masterWallet: any | null;
  feeTotals: { bankFee: number; transactionFee: number; feeAtBank: number };
  depositFeeSummary: {
    totalBankCost: number;
    totalTransactionCost: number;
    totalCashAtBank: number;
    totalFees: number;
    depositCount: number;
  } | null;
  isCashOnly: boolean;
  cashBalance: number;
  pureDepositCash: number;
  totalRedemptions: number;
}

export interface AumRow {
  investorName: string;
  symbol: string;
  description: string;
  stocks: number;
  costPerShare: number;
  costPrice: number;
  closePrice: number;
  closeValue: number;
  unrealizedGainLoss: number;
  bankCost: number;
  transactionCost: number;
  cashAtBank: number;
  cashAvailable: number;
  totalCashAtBank: number;
}

export interface CashClientSnapshotRow {
  name: string;
  accountNumber: string;
  totalDeposited: number;
  totalWithdrawn: number;
  totalRedemptions: number;
  pureDepositCash: number;
  cashAtBank: number;
  totalCashAtBank: number;
}

export interface AumSummary {
  totalClients: number;
  cashClientsCount: number;
  totalAUM: number;
  totalGains: number;
  totalCash: number;
  totalCashAtBank: number;
}

export interface AumSnapshot {
  date: string;
  generatedAt: string;
  summary: AumSummary;
  rows: AumRow[];
  cashClients: CashClientSnapshotRow[];
}

export interface ClientListSnapshot {
  date: string;
  generatedAt: string;
  totalClients: number;
  clients: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
    isApproved: boolean;
    createdAt: string;
  }>;
}

export function buildClientPortfolios(clients: any[]): ClientPortfolioSummary[] {
  return [...clients]
    .sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime())
    .map((client) => {
      const portfolios: any[] = (client.userPortfolios ?? []).map((up: any) => ({
        ...up,
        assets: up.userAssets ?? up.assets ?? [],
      }));

      const feeTotals = portfolios.reduce(
        (acc, p) => ({
          bankFee: acc.bankFee + (p.wallet?.bankFee ?? 0),
          transactionFee: acc.transactionFee + (p.wallet?.transactionFee ?? 0),
          feeAtBank: acc.feeAtBank + (p.wallet?.feeAtBank ?? 0),
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
                totalBankCost: acc.totalBankCost + (d.bankCost ?? 0),
                totalTransactionCost: acc.totalTransactionCost + (d.transactionCost ?? 0),
                totalCashAtBank: acc.totalCashAtBank + (d.cashAtBank ?? 0),
                totalFees: acc.totalFees + (d.totalFees ?? 0),
                depositCount: acc.depositCount + 1,
              }),
              { totalBankCost: 0, totalTransactionCost: 0, totalCashAtBank: 0, totalFees: 0, depositCount: 0 }
            )
          : null;

      const mw = (client.masterWallet as any) ?? null;
      const cashBalance: number = mw?.balance ?? mw?.netAssetValue ?? 0;
      const isCashOnly = portfolios.length === 0;

      const totalRedemptions = ((client.withdrawals ?? []) as any[])
        .filter((w: any) => w.withdrawalType === "REDEMPTION" && w.transactionStatus === "APPROVED")
        .reduce((s: number, w: any) => s + (w.amount ?? 0), 0);

      const pureDepositCash = Math.max(0, cashBalance - totalRedemptions);

      return {
        client,
        portfolios,
        masterWallet: mw,
        feeTotals,
        depositFeeSummary,
        isCashOnly,
        cashBalance,
        pureDepositCash,
        totalRedemptions,
      };
    })
    .filter((x) => x.portfolios.length > 0 || x.cashBalance > 0);
}

// Builds AUM rows using live asset data (no historical report lookup needed)
export function buildLiveAumRows(clientPortfolios: ClientPortfolioSummary[]): AumRow[] {
  const rows: AumRow[] = [];

  for (const { client, portfolios, feeTotals, depositFeeSummary, isCashOnly, pureDepositCash } of clientPortfolios) {
    const investorName = [client.firstName, client.lastName].filter(Boolean).join(" ") || client.email;
    const bankCost = depositFeeSummary?.totalBankCost ?? feeTotals?.bankFee ?? 0;
    const transactionCost = depositFeeSummary?.totalTransactionCost ?? feeTotals?.transactionFee ?? 0;
    const cashAtBank = depositFeeSummary?.totalCashAtBank ?? feeTotals?.feeAtBank ?? 0;
    const cashAmt = pureDepositCash ?? 0;

    if (isCashOnly) {
      rows.push({
        investorName,
        symbol: "—",
        description: "Awaiting portfolio allocation",
        stocks: 0,
        costPerShare: 0,
        costPrice: 0,
        closePrice: 0,
        closeValue: 0,
        unrealizedGainLoss: 0,
        bankCost,
        transactionCost,
        cashAtBank,
        cashAvailable: cashAmt,
        totalCashAtBank: cashAmt + cashAtBank,
      });
      continue;
    }

    let clientRowAdded = false;
    for (const p of portfolios) {
      const assets: any[] = p.assets ?? p.userAssets ?? [];
      if (assets.length === 0) continue;

      assets.forEach((a, idx) => {
        const isFirstRow = !clientRowAdded && idx === 0;
        rows.push({
          investorName: isFirstRow ? investorName : "",
          symbol: a.asset?.symbol ?? "—",
          description: a.asset?.description ?? "—",
          stocks: a.stock ?? 0,
          costPerShare: a.costPerShare ?? 0,
          costPrice: a.costPrice ?? 0,
          closePrice: a.asset?.closePrice ?? 0,
          closeValue: a.closeValue ?? 0,
          unrealizedGainLoss: a.lossGain ?? 0,
          bankCost: isFirstRow ? bankCost : 0,
          transactionCost: isFirstRow ? transactionCost : 0,
          cashAtBank: isFirstRow ? cashAtBank : 0,
          cashAvailable: isFirstRow ? cashAmt : 0,
          totalCashAtBank: isFirstRow ? cashAmt + cashAtBank : 0,
        });
        if (idx === 0) clientRowAdded = true;
      });
    }
  }

  return rows;
}

export function buildCashClientRows(clientPortfolios: ClientPortfolioSummary[]): CashClientSnapshotRow[] {
  return clientPortfolios
    .filter((cp) => cp.pureDepositCash > 0)
    .map(({ client, pureDepositCash, totalRedemptions, depositFeeSummary, feeTotals }) => {
      const name = [client.firstName, client.lastName].filter(Boolean).join(" ") || client.email;
      const accountNumber = (client.masterWallet as any)?.accountNumber ?? "";
      const cashAtBank = depositFeeSummary?.totalCashAtBank ?? feeTotals?.feeAtBank ?? 0;

      const totalDeposited = ((client.deposits ?? []) as any[])
        .filter((d: any) => d.transactionStatus === "APPROVED" && d.depositTarget === "MASTER")
        .reduce((s: number, d: any) => s + (d.amount ?? 0), 0);

      const totalWithdrawn = ((client.withdrawals ?? []) as any[])
        .filter((w: any) => w.withdrawalType === "HARD_WITHDRAWAL" && w.transactionStatus === "APPROVED")
        .reduce((s: number, w: any) => s + (w.amount ?? 0), 0);

      return {
        name,
        accountNumber,
        totalDeposited,
        totalWithdrawn,
        totalRedemptions,
        pureDepositCash,
        cashAtBank,
        totalCashAtBank: pureDepositCash + cashAtBank,
      };
    });
}

export function computeAumSummary(rows: AumRow[], totalClients: number): AumSummary {
  const cashClientsCount = new Set(
    rows.filter((r) => r.cashAvailable > 0 && r.closeValue === 0).map((r) => r.investorName).filter(Boolean)
  ).size;
  return {
    totalClients,
    cashClientsCount,
    totalAUM: rows.reduce((s, r) => s + r.closeValue, 0),
    totalGains: rows.reduce((s, r) => s + r.unrealizedGainLoss, 0),
    totalCash: rows.reduce((s, r) => s + r.cashAvailable, 0),
    totalCashAtBank: rows.reduce((s, r) => s + r.totalCashAtBank, 0),
  };
}
