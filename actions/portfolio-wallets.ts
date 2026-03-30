// app/(dashboard)/actions/portfolio-wallets.ts
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

export interface PortfolioWallet {
  id:             string;
  accountNumber:  string;
  userPortfolioId: string;
  balance:        number;
  bankFee:        number;
  transactionFee: number;
  feeAtBank:      number;
  totalFees:      number;
  netAssetValue:  number;
  status:         WalletStatus;
  createdAt?:     string;
  updatedAt?:     string;
  userPortfolio?: {
    id:             string;
    customName:     string;
    isActive:       boolean;
    portfolioValue: number;
    totalInvested:  number;
    totalLossGain:  number;
    userId:         string;
    portfolio?: { id: string; name: string; riskTolerance: string; timeHorizon: string } | null;
  } | null;
}

export interface UpdatePortfolioWalletInput {
  bankFee?:        number;
  transactionFee?: number;
  feeAtBank?:      number;
  status?:         WalletStatus;
}

/* -------------------------------------------------------------------------- */
/*  Actions                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * GET /portfolio-wallets?userId=...&status=...
 * List all portfolio wallets — optionally filtered by user or status.
 */
export async function listPortfolioWallets(params?: {
  userId?: string;
  status?: WalletStatus;
}) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/portfolio-wallets", { headers, params });
    return { success: true, data: (res.data?.data ?? []) as PortfolioWallet[] };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load portfolio wallets.") };
  }
}

/** GET /portfolio-wallets/:id */
export async function getPortfolioWalletById(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/portfolio-wallets/${id}`, { headers });
    return { success: true, data: res.data?.data as PortfolioWallet };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch portfolio wallet.") };
  }
}

/**
 * GET /portfolio-wallets/portfolio/:userPortfolioId
 * Get the wallet for a specific UserPortfolio — most common lookup.
 */
export async function getPortfolioWalletByPortfolio(userPortfolioId: string) {
  if (!userPortfolioId) return { success: false, error: "Missing userPortfolioId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(
      `/portfolio-wallets/portfolio/${encodeURIComponent(userPortfolioId)}`,
      { headers }
    );
    return { success: true, data: res.data?.data as PortfolioWallet };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch portfolio wallet.") };
  }
}

/**
 * PATCH /portfolio-wallets/:id
 * Admin: adjust fee structure or freeze/unfreeze wallet.
 * Does NOT touch balance or NAV.
 */
export async function updatePortfolioWallet(
  id:    string,
  patch: UpdatePortfolioWalletInput
) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.patch(`/portfolio-wallets/${id}`, patch, { headers });
    return { success: true, data: res.data?.data as PortfolioWallet };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to update portfolio wallet.") };
  }
}

/* -------------------------------------------------------------------------- */
/*  Convenience helpers                                                         */
/* -------------------------------------------------------------------------- */

/** Get all portfolio wallets for a user */
export async function getUserPortfolioWallets(userId: string) {
  return listPortfolioWallets({ userId });
}

/** Freeze a portfolio wallet */
export async function freezePortfolioWallet(id: string) {
  return updatePortfolioWallet(id, { status: "FROZEN" });
}

/** Unfreeze a portfolio wallet */
export async function unfreezePortfolioWallet(id: string) {
  return updatePortfolioWallet(id, { status: "ACTIVE" });
}