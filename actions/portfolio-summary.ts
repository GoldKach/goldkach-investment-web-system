// app/(dashboard)/actions/portfolio-summary.ts
"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

function msg(e: any, fallback = "Request failed") {
  return e?.response?.data?.error || e?.message || fallback;
}

async function authHeaderFromCookies() {
  const jar = await cookies();
  const token = jar.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* -------------------------------------------------------------------------- */
/*  Types                                                                       */
/* -------------------------------------------------------------------------- */

export interface SubPortfolioSummary {
  id:              string;
  generation:      number;
  label:           string;
  amountInvested:  number;
  totalCostPrice:  number;
  totalCloseValue: number;
  totalLossGain:   number;
  totalFees:       number;
  cashAtBank:      number;
  snapshotDate:    string;
}

export interface TopupHistoryEntry {
  id:               string;
  topupAmount:      number;
  previousTotal:    number;
  newTotalInvested: number;
  newCloseValue:    number;
  newNAV:           number;
  gainLoss:         number;
  totalFees:        number;
  status:           string;
  mergedAt:         string | null;
  createdAt:        string;
}

export interface PortfolioSummaryItem {
  id:             string;
  customName:     string;
  portfolio: {
    id:            string;
    name:          string;
    riskTolerance: string;
    timeHorizon:   string;
  };
  wallet: {
    id:             string;
    accountNumber:  string;
    balance:        number;
    netAssetValue:  number;
    totalFees:      number;
    status:         string;
  };
  totalInvested:  number;
  portfolioValue: number;
  totalLossGain:  number;
  returnPct:      number;
  assets: Array<{
    id:                   string;
    assetId:              string;
    allocationPercentage: number;
    costPerShare:         number;
    costPrice:            number;
    stock:                number;
    closeValue:           number;
    lossGain:             number;
    asset: {
      id:          string;
      symbol:      string;
      description: string;
      assetClass:  string;
      closePrice:  number;
    };
  }>;
  subPortfolios:  SubPortfolioSummary[];
  topupHistory:   TopupHistoryEntry[];
  latestReport: {
    id:              string;
    reportDate:      string;
    totalCloseValue: number;
    totalFees:       number;
    netAssetValue:   number;
    totalLossGain:   number;
    totalPercentage: number;
  } | null;
}

export interface PortfolioAggregateTotals {
  totalInvested:  number;
  totalValue:     number;
  totalGainLoss:  number;
  totalFees:      number;
  portfolioCount: number;
  returnPct:      number;
}

export interface PortfolioSummary {
  user: {
    id:         string;
    firstName:  string;
    lastName:   string;
    email:      string;
  };
  masterWallet: {
    id:             string;
    accountNumber:  string;
    totalDeposited: number;
    totalWithdrawn: number;
    totalFees:      number;
    netAssetValue:  number;
    status:         string;
  } | null;
  aggregate:  PortfolioAggregateTotals;
  portfolios: PortfolioSummaryItem[];
}

export interface RefreshResult {
  portfolioId: string;
  customName:  string;
  newValue:    number;
}

/* -------------------------------------------------------------------------- */
/*  Actions                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * GET /portfolio-summary/:userId
 * Single call that returns everything needed for a user dashboard:
 * master wallet, all portfolios with wallets/assets/sub-portfolios/topup
 * history, latest report per portfolio, and aggregated totals.
 */
export async function getPortfolioSummary(userId: string) {
  if (!userId) return { success: false, error: "Missing userId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(
      `/portfolio-summary/${encodeURIComponent(userId)}`,
      { headers }
    );
    return { success: true, data: res.data?.data as PortfolioSummary };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load portfolio summary.") };
  }
}

/**
 * POST /portfolio-summary/:userId/refresh
 * Force-recompute all asset positions using current closePrice values,
 * then sync master wallet. Call this after end-of-day price updates.
 */
export async function refreshPortfolioSummary(userId: string) {
  if (!userId) return { success: false, error: "Missing userId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post(
      `/portfolio-summary/${encodeURIComponent(userId)}/refresh`,
      {},
      { headers }
    );
    return {
      success: true,
      data:    (res.data?.data ?? []) as RefreshResult[],
      message: res.data?.message as string | undefined,
    };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to refresh portfolio summary.") };
  }
}

/* -------------------------------------------------------------------------- */
/*  Convenience helpers                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Get just the aggregate totals without full portfolio detail.
 * Useful for a compact dashboard header/stats bar.
 */
export async function getPortfolioAggregateTotals(userId: string) {
  const result = await getPortfolioSummary(userId);
  if (!result.success || !result.data) return result;
  return { success: true, data: result.data.aggregate };
}

/**
 * Get just the master wallet without full portfolio detail.
 */
export async function getMasterWalletSummary(userId: string) {
  const result = await getPortfolioSummary(userId);
  if (!result.success || !result.data) return result;
  return { success: true, data: result.data.masterWallet };
}

/**
 * Get a flat list of all portfolios with their current NAV and return%.
 * Useful for portfolio selector dropdowns or comparison tables.
 */
export async function getPortfolioValueList(userId: string) {
  const result = await getPortfolioSummary(userId);
  if (!result.success || !result.data) return result;
  return {
    success: true,
    data: result.data.portfolios.map((p) => ({
      id:            p.id,
      customName:    p.customName,
      portfolioName: p.portfolio.name,
      nav:           p.wallet?.netAssetValue ?? 0,
      returnPct:     p.returnPct,
      totalInvested: p.totalInvested,
      totalFees:     p.wallet?.totalFees ?? 0,
    })),
  };
}