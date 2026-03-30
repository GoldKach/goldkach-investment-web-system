// app/(dashboard)/actions/sub-portfolios.ts
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

export interface SubPortfolioAsset {
  id:                   string;
  subPortfolioId:       string;
  assetId:              string;
  allocationPercentage: number;
  costPerShare:         number;
  costPrice:            number;
  stock:                number;
  closePrice:           number;
  closeValue:           number;
  lossGain:             number;
  asset?: {
    id:          string;
    symbol:      string;
    description: string;
    assetClass:  string;
    closePrice:  number;
  };
}

export interface SubPortfolio {
  id:              string;
  userPortfolioId: string;
  generation:      number;   // 0=X (initial), 1=X1 (first top-up), etc.
  label:           string;
  amountInvested:  number;
  totalCostPrice:  number;
  totalCloseValue: number;
  totalLossGain:   number;
  bankFee:         number;
  transactionFee:  number;
  feeAtBank:       number;
  totalFees:       number;
  cashAtBank:      number;
  snapshotDate:    string;
  createdAt?:      string;
  assets?:         SubPortfolioAsset[];
  userPortfolio?: {
    id:          string;
    customName:  string;
    userId:      string;
    portfolioId: string;
  };
  mergedByTopup?: {
    id:         string;
    status:     string;
    mergedAt:   string | null;
    topupAmount: number;
  } | null;
}

export interface UpdateSubPortfolioInput {
  label?:           string;
  amountInvested?:  number;
  totalCostPrice?:  number;
  totalCloseValue?: number;
  bankFee?:         number;
  transactionFee?:  number;
  feeAtBank?:       number;
  cashAtBank?:      number;
  snapshotDate?:    string;
}

/* -------------------------------------------------------------------------- */
/*  Actions                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * GET /sub-portfolios?userPortfolioId=...&generation=...
 * Returns all slices (X=0, X1=1, ...) for a portfolio.
 */
export async function listSubPortfolios(
  userPortfolioId: string,
  generation?: number
) {
  if (!userPortfolioId) return { success: false, error: "userPortfolioId is required." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/sub-portfolios", {
      headers,
      params: {
        userPortfolioId,
        ...(generation !== undefined ? { generation } : {}),
      },
    });
    return { success: true, data: (res.data?.data ?? []) as SubPortfolio[] };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load sub-portfolios.") };
  }
}

/** GET /sub-portfolios/:id */
export async function getSubPortfolioById(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/sub-portfolios/${id}`, { headers });
    return { success: true, data: res.data?.data as SubPortfolio };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch sub-portfolio.") };
  }
}

/**
 * PATCH /sub-portfolios/:id
 * Admin: correct snapshot figures. Does NOT recompute live positions.
 */
export async function updateSubPortfolio(
  id:    string,
  patch: UpdateSubPortfolioInput
) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.patch(`/sub-portfolios/${id}`, patch, { headers });
    return { success: true, data: res.data?.data as SubPortfolio };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to update sub-portfolio.") };
  }
}

/* -------------------------------------------------------------------------- */
/*  Convenience helpers                                                         */
/* -------------------------------------------------------------------------- */

/** Get only the original X slice (generation=0) */
export async function getInitialSubPortfolio(userPortfolioId: string) {
  const result = await listSubPortfolios(userPortfolioId, 0);
  if (!result.success) return result;
  return { success: true, data: result.data?.[0] ?? null };
}

/** Get all top-up slices (generation > 0) */
export async function getTopupSlices(userPortfolioId: string) {
  const result = await listSubPortfolios(userPortfolioId);
  if (!result.success) return result;
  return {
    success: true,
    data: (result.data ?? []).filter((s) => s.generation > 0),
  };
}