

// // app/(dashboard)/actions/user-portfolio-assets.ts
// "use server";

// import axios from "axios";

// const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// const api = axios.create({
//   baseURL: BASE_API_URL,
//   timeout: 60000,
//   headers: { "Content-Type": "application/json" },
// });

// /* =========================
//    Types
//    ========================= */

// // ✅ UPDATED: Direct relation to Asset now
// export type UserPortfolioAssetDTO = {
//   id: string;
//   userPortfolioId: string;
//   assetId: string;                    // ✅ UPDATED: Direct relation
//   allocationPercentage: number;       // ✅ NEW: User-specific
//   costPerShare: number;               // ✅ NEW: User-specific
//   costPrice: number;
//   stock: number;
//   closeValue: number;
//   lossGain: number;
//   createdAt?: string;
//   updatedAt?: string;
//   // ✅ UPDATED: Direct asset relation
//   asset?: {
//     id: string;
//     symbol: string;
//     description: string;
//     sector: string;
//     defaultCostPerShare: number;
//     closePrice: number;
//   };
//   userPortfolio?: any;
// };

// // ✅ DEPRECATED: UserPortfolioAssets are now managed automatically
// // When you create/update a UserPortfolio with assetAllocations,
// // the backend creates/updates UserPortfolioAssets for you

// export type CreateUserPortfolioAssetInput = {
//   userPortfolioId: string;
//   assetId: string;                    // ✅ UPDATED: Direct assetId
//   allocationPercentage: number;       // ✅ NEW: Required
//   costPerShare: number;               // ✅ NEW: Required
// };

// export type UpdateUserPortfolioAssetInput = Partial<{
//   allocationPercentage: number;       // ✅ NEW: User-specific
//   costPerShare: number;               // ✅ NEW: User-specific
//   recompute: boolean;
// }>;

// /* =========================
//    Actions
//    ========================= */

// /**
//  * ⚠️ NOTE: In most cases, you don't need to call these directly.
//  * UserPortfolioAssets are managed automatically when you:
//  * - createUserPortfolio() with assetAllocations
//  * - updateUserPortfolio() with assetAllocations
//  * 
//  * These are here for edge cases where you need direct control.
//  */

// /** Create (POST /user-portfolio-assets) - RARELY USED */
// export async function createUserPortfolioAsset(input: CreateUserPortfolioAssetInput) {
//   if (!input?.userPortfolioId || !input?.assetId) {
//     return { success: false, error: "userPortfolioId and assetId are required." };
//   }
//   if (typeof input.allocationPercentage !== 'number' || input.allocationPercentage < 0) {
//     return { success: false, error: "allocationPercentage must be a valid number >= 0." };
//   }
//   if (typeof input.costPerShare !== 'number' || input.costPerShare < 0) {
//     return { success: false, error: "costPerShare must be a valid number >= 0." };
//   }
  
//   try {
//     const res = await api.post("/user-portfolio-assets", input);
//     return { success: true, data: res.data?.data as UserPortfolioAssetDTO };
//   } catch (e: any) {
//     const msg =
//       e?.response?.data?.error ||
//       (e?.response?.status === 409 
//         ? "This asset already exists in the user's portfolio." 
//         : "Failed to create user portfolio asset.");
//     return { success: false, error: msg };
//   }
// }

// /** List (GET /user-portfolio-assets?userPortfolioId=...) */
// export async function getUserPortfolioAssets(params?: { userPortfolioId?: string }) {
//   try {
//     const q = params?.userPortfolioId 
//       ? `?userPortfolioId=${encodeURIComponent(params.userPortfolioId)}` 
//       : "";
//     const res = await api.get(`/user-portfolio-assets${q}`);
//     return { success: true, data: (res.data?.data ?? []) as UserPortfolioAssetDTO[] };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to load user portfolio assets.";
//     return { success: false, error: msg };
//   }
// }

// /** Read one (GET /user-portfolio-assets/:id) */
// export async function getUserPortfolioAssetById(id: string) {
//   if (!id) return { success: false, error: "Missing id." };
//   try {
//     const res = await api.get(`/user-portfolio-assets/${encodeURIComponent(id)}`);
//     return { success: true, data: res.data?.data as UserPortfolioAssetDTO };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to load user portfolio asset.";
//     return { success: false, error: msg };
//   }
// }

// /** Update (PATCH /user-portfolio-assets/:id) - RARELY USED */
// export async function updateUserPortfolioAsset(id: string, patch: UpdateUserPortfolioAssetInput) {
//   if (!id) return { success: false, error: "Missing id." };
//   try {
//     const res = await api.patch(`/user-portfolio-assets/${encodeURIComponent(id)}`, patch ?? {});
//     return { success: true, data: res.data?.data as UserPortfolioAssetDTO };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to update user portfolio asset.";
//     return { success: false, error: msg };
//   }
// }

// /** Delete (DELETE /user-portfolio-assets/:id) - RARELY USED */
// export async function deleteUserPortfolioAsset(id: string) {
//   if (!id) return { success: false, error: "Missing id." };
//   try {
//     await api.delete(`/user-portfolio-assets/${encodeURIComponent(id)}`);
//     return { success: true };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to delete user portfolio asset.";
//     return { success: false, error: msg };
//   }
// }

// /** 
//  * Bulk recompute for one user portfolio (POST /user-portfolio-assets/recompute/:userPortfolioId)
//  * ⚠️ Prefer using recomputeUserPortfolio() from user-portfolios.ts instead
//  */
// export async function recomputeUserPortfolioAssets(userPortfolioId: string) {
//   if (!userPortfolioId) return { success: false, error: "Missing userPortfolioId." };
//   try {
//     const res = await api.post(
//       `/user-portfolio-assets/recompute/${encodeURIComponent(userPortfolioId)}`, 
//       {}
//     );
//     return { success: true, data: res.data?.data ?? res.data };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to recompute user portfolio assets.";
//     return { success: false, error: msg };
//   }
// }







// app/(dashboard)/actions/user-portfolio-assets.ts
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

/** Live merged (X2) position — reflects weighted average across all top-up slices */
export type UserPortfolioAssetDTO = {
  id:                   string;
  userPortfolioId:      string;
  assetId:              string;
  allocationPercentage: number;
  costPerShare:         number;  // weighted average across all sub-portfolios
  costPrice:            number;  // (allocationPercentage / 100) * NAV
  stock:                number;  // costPrice / costPerShare
  closeValue:           number;  // stock * asset.closePrice
  lossGain:             number;  // closeValue - costPrice
  createdAt?:           string;
  updatedAt?:           string;
  asset?: {
    id:                  string;
    symbol:              string;
    description:         string;
    sector:              string;
    assetClass:          string;
    defaultCostPerShare: number;
    closePrice:          number;
  };
  userPortfolio?: {
    id:         string;
    customName: string;
    portfolioId: string;
  };
};

/** Snapshot of one asset's position within a single sub-portfolio slice (X, X1, etc.) */
export type SubPortfolioAssetDTO = {
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
  createdAt?:           string;
  asset?: {
    id:          string;
    symbol:      string;
    description: string;
    assetClass:  string;
    closePrice:  number;
  };
};

export type CreateUserPortfolioAssetInput = {
  userPortfolioId:      string;
  assetId:              string;
  allocationPercentage: number;
  costPerShare:         number;
};

export type UpdateUserPortfolioAssetInput = Partial<{
  allocationPercentage: number;
  costPerShare:         number;
  recompute:            boolean;
}>;

/* -------------------------------------------------------------------------- */
/*  UserPortfolioAsset actions (live merged X2 positions)                      */
/* -------------------------------------------------------------------------- */

/**
 * NOTE: In most cases you don't call these directly.
 * UserPortfolioAssets are managed automatically when you:
 *   - createUserPortfolio() with assetAllocations
 *   - updateUserPortfolio() with assetAllocations
 *   - approveDeposit() — top-up recalculates everything
 */

/** POST /user-portfolio-assets — RARELY USED */
export async function createUserPortfolioAsset(input: CreateUserPortfolioAssetInput) {
  if (!input?.userPortfolioId || !input?.assetId) {
    return { success: false, error: "userPortfolioId and assetId are required." };
  }
  if (typeof input.allocationPercentage !== "number" || input.allocationPercentage < 0) {
    return { success: false, error: "allocationPercentage must be a valid number >= 0." };
  }
  if (typeof input.costPerShare !== "number" || input.costPerShare < 0) {
    return { success: false, error: "costPerShare must be a valid number >= 0." };
  }
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post("/user-portfolio-assets", input, { headers });
    return { success: true, data: res.data?.data as UserPortfolioAssetDTO };
  } catch (e: any) {
    return {
      success: false,
      error: msg(e, e?.response?.status === 409
        ? "This asset already exists in the portfolio."
        : "Failed to create user portfolio asset."),
    };
  }
}

/** GET /user-portfolio-assets?userPortfolioId=... */
export async function getUserPortfolioAssets(params?: { userPortfolioId?: string }) {
  try {
    const headers = await authHeaderFromCookies();
    const q = params?.userPortfolioId
      ? `?userPortfolioId=${encodeURIComponent(params.userPortfolioId)}`
      : "";
    const res = await api.get(`/user-portfolio-assets${q}`, { headers });
    return { success: true, data: (res.data?.data ?? []) as UserPortfolioAssetDTO[] };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load user portfolio assets.") };
  }
}

/** GET /user-portfolio-assets/:id */
export async function getUserPortfolioAssetById(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/user-portfolio-assets/${encodeURIComponent(id)}`, { headers });
    return { success: true, data: res.data?.data as UserPortfolioAssetDTO };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load user portfolio asset.") };
  }
}

/** PATCH /user-portfolio-assets/:id — RARELY USED */
export async function updateUserPortfolioAsset(id: string, patch: UpdateUserPortfolioAssetInput) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.patch(
      `/user-portfolio-assets/${encodeURIComponent(id)}`,
      patch ?? {},
      { headers }
    );
    return { success: true, data: res.data?.data as UserPortfolioAssetDTO };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to update user portfolio asset.") };
  }
}

/** DELETE /user-portfolio-assets/:id — RARELY USED */
export async function deleteUserPortfolioAsset(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    await api.delete(`/user-portfolio-assets/${encodeURIComponent(id)}`, { headers });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to delete user portfolio asset.") };
  }
}

/**
 * POST /user-portfolios/:id/recompute
 * Prefer this over the asset-level recompute — recalculates all X2 positions
 * from current PortfolioWallet NAV then syncs MasterWallet.
 */
export async function recomputeUserPortfolioAssets(userPortfolioId: string) {
  if (!userPortfolioId) return { success: false, error: "Missing userPortfolioId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post(
      `/user-portfolios/${encodeURIComponent(userPortfolioId)}/recompute`,
      {},
      { headers }
    );
    return { success: true, data: res.data?.data ?? res.data };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to recompute user portfolio assets.") };
  }
}

/* -------------------------------------------------------------------------- */
/*  SubPortfolioAsset actions (historical slice snapshots)                     */
/* -------------------------------------------------------------------------- */

/**
 * GET /sub-portfolios?userPortfolioId=...
 * Returns all slices (X, X1, X2-source...) for a portfolio with their asset snapshots.
 */
export async function getSubPortfolios(userPortfolioId: string) {
  if (!userPortfolioId) return { success: false, error: "Missing userPortfolioId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/sub-portfolios", {
      headers,
      params: { userPortfolioId },
    });
    return { success: true, data: res.data?.data ?? [] };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load sub-portfolios.") };
  }
}

/**
 * GET /sub-portfolios?userPortfolioId=...&generation=0
 * Returns only the original X slice (generation=0).
 */
export async function getOriginalSubPortfolio(userPortfolioId: string) {
  if (!userPortfolioId) return { success: false, error: "Missing userPortfolioId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/sub-portfolios", {
      headers,
      params: { userPortfolioId, generation: 0 },
    });
    return { success: true, data: res.data?.data?.[0] ?? null };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load original sub-portfolio.") };
  }
}

/**
 * GET /topup-events/portfolio/:userPortfolioId
 * Returns the full top-up timeline showing before/after NAV at each merge.
 */
export async function getTopupTimeline(userPortfolioId: string) {
  if (!userPortfolioId) return { success: false, error: "Missing userPortfolioId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(
      `/topup-events/portfolio/${encodeURIComponent(userPortfolioId)}`,
      { headers }
    );
    return { success: true, data: res.data?.data ?? [] };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load top-up timeline.") };
  }
}