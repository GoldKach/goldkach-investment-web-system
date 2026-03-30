// app/(dashboard)/actions/master-wallets.ts
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

export type WalletStatus = "ACTIVE" | "FROZEN" | "CLOSED";

export interface MasterWallet {
  id:             string;
  accountNumber:  string;
  userId:         string;
  /** Cash available for allocation or hard withdrawal (external deposits minus allocations/withdrawals) */
  balance:        number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalFees:      number;
  /** Sum of all portfolio wallet NAVs — separate from cash balance */
  netAssetValue:  number;
  status:         WalletStatus;
  createdAt?:     string;
  updatedAt?:     string;
  user?: {
    id:         string;
    firstName:  string;
    lastName:   string;
    email:      string;
    phone?:     string | null;
    role:       string;
    status:     string;
  } | null;
}

export interface PortfolioWalletBreakdown {
  id:             string;
  accountNumber:  string;
  balance:        number;
  netAssetValue:  number;
  totalFees:      number;
  status:         WalletStatus;
  userPortfolio?: {
    id:             string;
    customName:     string;
    isActive:       boolean;
    portfolioValue: number;
    totalInvested:  number;
    totalLossGain:  number;
    portfolio?: { id: string; name: string; riskTolerance: string; timeHorizon: string } | null;
  } | null;
}

export interface MasterWalletDetail {
  masterWallet:    MasterWallet;
  portfolioWallets: PortfolioWalletBreakdown[];
  aggregateTotals: {
    totalBalance:   number;
    totalNAV:       number;
    totalFees:      number;
    portfolioCount: number;
  };
}

export interface UpdateMasterWalletInput {
  status?:     WalletStatus;
  totalFees?:  number;
}

/* -------------------------------------------------------------------------- */
/*  Actions                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * GET /master-wallets?status=...
 * Admin: list all master wallets in the system.
 */
export async function listMasterWallets(params?: { status?: WalletStatus }) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/master-wallets", { headers, params });
    return { success: true, data: (res.data?.data ?? []) as MasterWallet[] };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load master wallets.") };
  }
}

/** GET /master-wallets/:id */
export async function getMasterWalletById(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/master-wallets/${id}`, { headers });
    return { success: true, data: res.data?.data as MasterWallet };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch master wallet.") };
  }
}

/**
 * GET /master-wallets/user/:userId
 * Returns master wallet + all portfolio wallet breakdowns + aggregate totals.
 * This is the primary call for a user's financial overview page.
 */
export async function getMasterWalletByUser(userId: string) {
  if (!userId) return { success: false, error: "Missing userId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(
      `/master-wallets/user/${encodeURIComponent(userId)}`,
      { headers }
    );
    return { success: true, data: res.data?.data as MasterWalletDetail };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch master wallet.") };
  }
}

/**
 * PATCH /master-wallets/:id
 * Admin: freeze/unfreeze or correct totalFees.
 */
export async function updateMasterWallet(
  id:    string,
  patch: UpdateMasterWalletInput
) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.patch(`/master-wallets/${id}`, patch, { headers });
    return { success: true, data: res.data?.data as MasterWallet };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to update master wallet.") };
  }
}

/**
 * POST /master-wallets/sync/:userId
 * Force-recalculate master wallet NAV by summing all PortfolioWallet NAVs.
 * Run after migrations or if records drift.
 */
export async function syncMasterWallet(userId: string) {
  if (!userId) return { success: false, error: "Missing userId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post(
      `/master-wallets/sync/${encodeURIComponent(userId)}`,
      {},
      { headers }
    );
    return {
      success: true,
      data:    res.data?.data as MasterWallet,
      message: res.data?.message as string | undefined,
    };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to sync master wallet.") };
  }
}

/* -------------------------------------------------------------------------- */
/*  Convenience helpers                                                         */
/* -------------------------------------------------------------------------- */

/** Freeze a master wallet */
export async function freezeMasterWallet(id: string) {
  return updateMasterWallet(id, { status: "FROZEN" });
}

/** Unfreeze a master wallet */
export async function unfreezeMasterWallet(id: string) {
  return updateMasterWallet(id, { status: "ACTIVE" });
}