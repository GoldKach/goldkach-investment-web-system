// app/(dashboard)/actions/user-portfolio-assets.ts
"use server";

import axios from "axios";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
});

/* =========================
   Types
   ========================= */

export type UserPortfolioAssetDTO = {
  id: string;
  userPortfolioId: string;
  portfolioAssetId: string;
  costPrice: number;
  stock: number;
  closeValue: number;
  lossGain: number;
  // Backend may include expanded relations depending on controller `include`
  portfolioAsset?: any;
  userPortfolio?: any;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateUserPortfolioAssetInput = {
  userPortfolioId: string;
  portfolioAssetId: string;
  // Optional overrides if your API allows (normally computed on server)
  costPrice?: number;
  stock?: number;
  closeValue?: number;
};

export type UpdateUserPortfolioAssetInput = Partial<{
  userPortfolioId: string;
  portfolioAssetId: string;
  recompute: boolean; // ask the API to recompute from relations
  costPrice: number;
  stock: number;
  closeValue: number;
  lossGain: number; // usually derived; allow if your API supports manual override
}>;

/* =========================
   Actions
   ========================= */

/** Create (POST /user-portfolio-assets) */
export async function createUserPortfolioAsset(input: CreateUserPortfolioAssetInput) {
  if (!input?.userPortfolioId || !input?.portfolioAssetId) {
    return { success: false, error: "userPortfolioId and portfolioAssetId are required." };
  }
  try {
    const res = await api.post("/user-portfolio-assets", input);
    return { success: true, data: res.data?.data as UserPortfolioAssetDTO };
  } catch (e: any) {
    const msg =
      e?.response?.data?.error ||
      (e?.response?.status === 409 ? "This asset already exists in the user's portfolio." : "Failed to create user portfolio asset.");
    return { success: false, error: msg };
  }
}

/** List (GET /user-portfolio-assets?userPortfolioId=...) */
export async function getUserPortfolioAssets(params?: { userPortfolioId?: string }) {
  try {
    const q = params?.userPortfolioId ? `?userPortfolioId=${encodeURIComponent(params.userPortfolioId)}` : "";
    const res = await api.get(`/user-portfolio-assets${q}`);
    return { success: true, data: (res.data?.data ?? []) as UserPortfolioAssetDTO[] };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to load user portfolio assets.";
    return { success: false, error: msg };
  }
}

/** Read one (GET /user-portfolio-assets/:id) */
export async function getUserPortfolioAssetById(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const res = await api.get(`/user-portfolio-assets/${encodeURIComponent(id)}`);
    return { success: true, data: res.data?.data as UserPortfolioAssetDTO };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to load user portfolio asset.";
    return { success: false, error: msg };
  }
}

/** Update (PATCH /user-portfolio-assets/:id) */
export async function updateUserPortfolioAsset(id: string, patch: UpdateUserPortfolioAssetInput) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const res = await api.patch(`/user-portfolio-assets/${encodeURIComponent(id)}`, patch ?? {});
    return { success: true, data: res.data?.data as UserPortfolioAssetDTO };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to update user portfolio asset.";
    return { success: false, error: msg };
  }
}

/** Delete (DELETE /user-portfolio-assets/:id) */
export async function deleteUserPortfolioAsset(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    await api.delete(`/user-portfolio-assets/${encodeURIComponent(id)}`);
    return { success: true };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to delete user portfolio asset.";
    return { success: false, error: msg };
  }
}

/** Bulk recompute for one user portfolio (POST /user-portfolio-assets/recompute/:userPortfolioId) */
export async function recomputeUserPortfolioAssets(userPortfolioId: string) {
  if (!userPortfolioId) return { success: false, error: "Missing userPortfolioId." };
  try {
    const res = await api.post(`/user-portfolio-assets/recompute/${encodeURIComponent(userPortfolioId)}`, {});
    // backend returns e.g. { ok: true, count }
    return { success: true, data: res.data?.data ?? res.data };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to recompute user portfolio assets.";
    return { success: false, error: msg };
  }
}
