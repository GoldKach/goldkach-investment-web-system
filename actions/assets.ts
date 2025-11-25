// app/(app)/actions/assets.ts
"use server";

import axios from "axios";
import { cookies } from "next/headers";

/** Axios client to your backend API */
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";
const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 12000,
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
  allocationPercentage: number;
  assetClass?: "EQUITIES" | "ETFS" | "REITS" | "BONDS" | "CASH" | "OTHERS";
  costPerShare: number;
  closePrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssetCreateInput {
  symbol: string;
  description: string;
  sector: string;
  allocationPercentage?: number;
  costPerShare?: number;
  assetClass?: "EQUITIES" | "ETFS" | "REITS" | "BONDS" | "CASH" | "OTHERS";
  closePrice?: number;
}

export interface AssetUpdateInput {
  symbol?: string;
  description?: string;
  sector?: string;
  assetClass?: "EQUITIES" | "ETFS" | "REITS" | "BONDS" | "CASH" | "OTHERS";
  allocationPercentage?: number;
  costPerShare?: number;
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
      assetClass: input.assetClass, // <- include assetClass
      allocationPercentage: input.allocationPercentage ?? 0,
      costPerShare: input.costPerShare ?? 0,
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
