

// app/(app)/actions/assets.ts
"use server";

import axios from "axios";
import { cookies } from "next/headers";

/** Axios client to your backend API */
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";
const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

/* --------------------------------- helpers --------------------------------- */

function msg(e: any, fallback = "Request failed") {
  return e?.response?.data?.error || e?.message || fallback;
}

async function authHeaderFromCookies() {
  const jar = await cookies();
  const token = jar.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ---------------------------------- types ---------------------------------- */

export interface Asset {
  id: string;
  symbol: string;
  description: string;
  sector: string;
  // ✅ UPDATED: Renamed fields for new schema
  defaultAllocationPercentage: number;
  defaultCostPerShare: number;
  assetClass?: "EQUITIES" | "ETFS" | "REITS" | "BONDS" | "CASH" | "OTHERS";
  closePrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssetCreateInput {
  symbol: string;
  description: string;
  sector: string;
  // ✅ UPDATED: Renamed fields
  defaultAllocationPercentage?: number;
  defaultCostPerShare?: number;
  assetClass?: "EQUITIES" | "ETFS" | "REITS" | "BONDS" | "CASH" | "OTHERS";
  closePrice?: number;
}

export interface AssetUpdateInput {
  symbol?: string;
  description?: string;
  sector?: string;
  assetClass?: "EQUITIES" | "ETFS" | "REITS" | "BONDS" | "CASH" | "OTHERS";
  // ✅ UPDATED: Renamed fields
  defaultAllocationPercentage?: number;
  defaultCostPerShare?: number;
  closePrice?: number;
}

/* ------------------------------- server actions ---------------------------- */

/** GET /assets (optional query/pagination if your API supports it) */
export async function listAssets(params?: { q?: string; page?: number; pageSize?: number }) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/assets", { headers, params });
    return { success: true, data: (res.data?.data ?? []) as Asset[] };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load assets") };
  }
}

/** GET /assets/:id */
export async function getAsset(id: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/assets/${id}`, { headers });
    return { success: true, data: res.data?.data as Asset };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch asset") };
  }
}

/** POST /assets */
export async function createAsset(input: AssetCreateInput) {
  try {
    const headers = await authHeaderFromCookies();
    const payload: AssetCreateInput = {
      symbol: input.symbol.trim().toUpperCase(),
      description: input.description.trim(),
      sector: input.sector.trim(),
      assetClass: input.assetClass,
      // ✅ UPDATED: Use new field names
      defaultAllocationPercentage: input.defaultAllocationPercentage ?? 0,
      defaultCostPerShare: input.defaultCostPerShare ?? 0,
      closePrice: input.closePrice ?? 0,
    };
    const res = await api.post("/assets", payload, { headers });
    return { success: true, data: res.data?.data as Asset };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to create asset") };
  }
}

/** PATCH /assets/:id */
export async function updateAsset(id: string, input: AssetUpdateInput) {
  try {
    const headers = await authHeaderFromCookies();
    const payload: AssetUpdateInput = {
      ...input,
      symbol: input.symbol?.trim().toUpperCase(),
      description: input.description?.trim(),
      sector: input.sector?.trim(),
    };
    const res = await api.patch(`/assets/${id}`, payload, { headers });
    return { success: true, data: res.data?.data as Asset };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to update asset") };
  }
}

/** DELETE /assets/:id */
export async function deleteAsset(id: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.delete(`/assets/${id}`, { headers });
    return { success: true, data: res.data?.data as Asset };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to delete asset") };
  }
}

/**
 * ✅ NEW: Batch update asset prices
 * POST /assets/batch-update-prices
 */
export async function batchUpdateAssetPrices(
  updates: Array<{ assetId: string; closePrice: number }>
) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post("/assets/batch-update-prices", { updates }, { headers });
    return { 
      success: true, 
      data: res.data?.data as Asset[],
      message: res.data?.message,
    };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to batch update asset prices") };
  }
}