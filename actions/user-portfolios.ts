


// // app/(dashboard)/actions/user-portfolios.ts
// "use server";

// import axios from "axios";

// const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// const api = axios.create({
//   baseURL: BASE_API_URL,
//   timeout: 12000,
//   headers: { "Content-Type": "application/json" },
// });

// /* ======================
//    Types
// ====================== */
// export type UserSlim = {
//   id: string;
//   firstName?: string | null;
//   lastName?: string | null;
//   name?: string | null;
//   email: string;
//   phone: string;
//   imageUrl?: string | null;
//   // often useful when included:
//   wallet?: { id: string; accountNumber: string; netAssetValue: number } | null;
// };

// export type AssetSlim = {
//   id: string;
//   symbol: string;
//   description: string;
//   sector: string;
//   defaultCostPerShare: number;  // ✅ UPDATED: Field name
//   closePrice: number;
// };

// export type PortfolioSlim = {
//   id: string;
//   name: string;
//   description?: string | null;
//   timeHorizon: string;
//   riskTolerance: string;
//   allocationPercentage: number;
//   assets?: Array<{
//     id: string; // PortfolioAsset id
//     assetId: string;
//     portfolioId: string;
//     defaultAllocationPercentage: number;  // ✅ UPDATED: Field name
//     defaultCostPerShare: number;          // ✅ UPDATED: Field name
//     asset: AssetSlim;
//   }>;
// };

// // ✅ UPDATED: Direct relation to Asset now
// export type UserPortfolioAssetDTO = {
//   id: string;
//   userPortfolioId: string;
//   assetId: string;                        // ✅ UPDATED: Direct relation
//   allocationPercentage: number;           // ✅ NEW: User-specific
//   costPerShare: number;                   // ✅ NEW: User-specific
//   costPrice: number;
//   stock: number;
//   closeValue: number;
//   lossGain: number;
//   createdAt: string;
//   updatedAt: string;
//   // ✅ UPDATED: Direct asset relation
//   asset?: AssetSlim;
// };

// export type UserPortfolioDTO = {
//   id: string;
//   userId: string;
//   portfolioId: string;
//   portfolioValue: number;
//   createdAt: string; // ISO strings from API
//   updatedAt: string;
//   // optional includes:
//   user?: UserSlim;
//   portfolio?: PortfolioSlim;
//   userAssets?: UserPortfolioAssetDTO[];
// };

// /* ======================
//    Include helpers
// ====================== */
// export type IncludeFlags = {
//   user?: boolean;
//   portfolio?: boolean;
//   userAssets?: boolean;
// };

// function toIncludeParam(flags?: IncludeFlags) {
//   if (!flags) return undefined;
//   const parts: string[] = [];
//   if (flags.user) parts.push("user");
//   if (flags.portfolio) parts.push("portfolio");
//   if (flags.userAssets) parts.push("userAssets");
//   return parts.length ? parts.join(",") : undefined;
// }

// /* ======================
//    Inputs
// ====================== */

// // ✅ MAJOR UPDATE: Now requires assetAllocations
// export type AssetAllocation = {
//   assetId: string;
//   allocationPercentage: number;  // User-specific allocation %
//   costPerShare: number;          // User-specific cost basis
// };

// export type CreateUserPortfolioInput = {
//   userId: string;
//   portfolioId: string;
//   assetAllocations: AssetAllocation[];  // ✅ NEW REQUIRED FIELD
//   include?: IncludeFlags;
// };

// // ✅ UPDATED: Can update user allocations
// export type UpdateUserPortfolioInput = {
//   portfolioId?: string;
//   assetAllocations?: AssetAllocation[];  // ✅ NEW: Update user allocations
//   recompute?: boolean;
//   resetAssets?: boolean;
//   include?: IncludeFlags;
// };

// export type ListUserPortfoliosQuery = {
//   userId?: string;
//   portfolioId?: string;
//   include?: IncludeFlags;
// };

// /* ======================
//    Actions
// ====================== */

// /** 
//  * Create a user-portfolio with USER-SPECIFIC allocations
//  * ✅ MAJOR UPDATE: Now requires assetAllocations array
//  */
// export async function createUserPortfolio(input: CreateUserPortfolioInput) {
//   try {
//     // ✅ Validate assetAllocations
//     if (!input.assetAllocations || input.assetAllocations.length === 0) {
//       return { 
//         success: false, 
//         error: "assetAllocations array is required with at least one asset." 
//       };
//     }

//     // Validate each allocation
//     for (const allocation of input.assetAllocations) {
//       if (!allocation.assetId) {
//         return { success: false, error: "Each asset allocation must have an assetId." };
//       }
//       if (typeof allocation.allocationPercentage !== "number" || allocation.allocationPercentage < 0) {
//         return { success: false, error: "Each asset allocation must have a valid allocationPercentage >= 0." };
//       }
//       if (typeof allocation.costPerShare !== "number" || allocation.costPerShare < 0) {
//         return { success: false, error: "Each asset allocation must have a valid costPerShare >= 0." };
//       }
//     }

//     const params = {
//       include: toIncludeParam(input.include),
//     };

//     const payload = {
//       userId: input.userId,
//       portfolioId: input.portfolioId,
//       assetAllocations: input.assetAllocations,  // ✅ NEW: User-specific allocations
//     };

//     const res = await api.post("/user-portfolios", payload, { params });

//     return { success: true, data: res.data?.data as UserPortfolioDTO };
//   } catch (e: any) {
//     const msg =
//       e?.response?.data?.error ??
//       (e?.code === "ERR_NETWORK" ? "Network error creating user-portfolio." : "Failed to create user-portfolio.");
//     return { success: false, error: msg };
//   }
// }

// /** List user-portfolios (optionally filtered) */
// export async function listUserPortfolios(q?: ListUserPortfoliosQuery) {
//   try {
//     const res = await api.get("/user-portfolios", {
//       params: {
//         userId: q?.userId,
//         portfolioId: q?.portfolioId,
//         include: toIncludeParam(q?.include),
//       },
//     });
//     return { success: true, data: (res.data?.data ?? []) as UserPortfolioDTO[] };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to load user-portfolios.";
//     return { success: false, error: msg };
//   }
// }

// /** Read one user-portfolio */
// export async function getUserPortfolioById(id: string, include?: IncludeFlags) {
//   if (!id) return { success: false, error: "Missing id." };
//   try {
//     const res = await api.get(`/user-portfolios/${id}`, {
//       params: { include: toIncludeParam(include) },
//     });
//     return { success: true, data: res.data?.data as UserPortfolioDTO };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to load user-portfolio.";
//     return { success: false, error: msg };
//   }
// }

// /** 
//  * Update (move to another portfolio / update allocations / recompute / resetAssets)
//  * ✅ UPDATED: Can update user-specific allocations
//  */
// export async function updateUserPortfolio(id: string, patch: UpdateUserPortfolioInput) {
//   if (!id) return { success: false, error: "Missing id." };
//   try {
//     const { include, ...body } = patch;
//     const res = await api.patch(`/user-portfolios/${id}`, body, {
//       params: { include: toIncludeParam(include) },
//     });
//     return { success: true, data: res.data?.data as UserPortfolioDTO };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to update user-portfolio.";
//     return { success: false, error: msg };
//   }
// }

// /** Recompute all derived UserPortfolioAsset entries and refresh portfolioValue */
// export async function recomputeUserPortfolio(id: string, include?: IncludeFlags) {
//   if (!id) return { success: false, error: "Missing id." };
//   try {
//     const res = await api.post(`/user-portfolios/${id}/recompute`, null, {
//       params: { include: toIncludeParam(include) },
//     });
//     // controller returns { recompute: {...}, userPortfolio: {...} }
//     return { success: true, data: res.data?.data?.userPortfolio as UserPortfolioDTO };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to recompute user-portfolio.";
//     return { success: false, error: msg };
//   }
// }

// /** Delete user-portfolio (cascades its UPA entries) */
// export async function deleteUserPortfolio(id: string) {
//   if (!id) return { success: false, error: "Missing id." };
//   try {
//     await api.delete(`/user-portfolios/${id}`);
//     return { success: true };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to delete user-portfolio.";
//     return { success: false, error: msg };
//   }
// }

// /**
//  * ✅ NEW: Helper to create user portfolio with portfolio's default allocations
//  * Fetches portfolio assets and uses their default values
//  */
// export async function createUserPortfolioWithDefaults(
//   userId: string, 
//   portfolioId: string,
//   include?: IncludeFlags
// ) {
//   try {
//     // First, fetch the portfolio with its assets to get defaults
//     const portfolioRes = await api.get(`/portfolios/${portfolioId}`, {
//       params: { include: "assets" }
//     });

//     if (!portfolioRes.data?.data) {
//       return { success: false, error: "Portfolio not found." };
//     }

//     const portfolio = portfolioRes.data.data as PortfolioSlim;

//     if (!portfolio.assets || portfolio.assets.length === 0) {
//       return { success: false, error: "Portfolio has no assets. Please add assets first." };
//     }

//     // Use the portfolio's default allocations
//     const assetAllocations: AssetAllocation[] = portfolio.assets.map(pa => ({
//       assetId: pa.assetId,
//       allocationPercentage: pa.defaultAllocationPercentage,
//       costPerShare: pa.defaultCostPerShare,
//     }));

//     // Now create the user portfolio with these defaults
//     return createUserPortfolio({
//       userId,
//       portfolioId,
//       assetAllocations,
//       include,
//     });
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to create user-portfolio with defaults.";
//     return { success: false, error: msg };
//   }
// }





// app/(dashboard)/actions/user-portfolios.ts
"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 12000,
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

export type AssetSlim = {
  id:                  string;
  symbol:              string;
  description:         string;
  sector:              string;
  assetClass:          string;
  defaultCostPerShare: number;
  closePrice:          number;
};

export type PortfolioSlim = {
  id:                   string;
  name:                 string;
  description?:         string | null;
  timeHorizon:          string;
  riskTolerance:        string;
  allocationPercentage: number;
  assets?: Array<{
    id:                          string;
    assetId:                     string;
    portfolioId:                 string;
    defaultAllocationPercentage: number;
    defaultCostPerShare:         number;
    asset:                       AssetSlim;
  }>;
};

/** Live merged (X2) position */
export type UserPortfolioAssetDTO = {
  id:                   string;
  userPortfolioId:      string;
  assetId:              string;
  allocationPercentage: number;
  costPerShare:         number; // weighted average across all top-up slices
  costPrice:            number;
  stock:                number;
  closeValue:           number;
  lossGain:             number;
  createdAt:            string;
  updatedAt:            string;
  asset?:               AssetSlim;
};

export type PortfolioWalletSlim = {
  id:             string;
  accountNumber:  string;
  balance:        number;
  netAssetValue:  number;
  totalFees:      number;
  bankFee:        number;
  transactionFee: number;
  feeAtBank:      number;
  status:         string;
};

export type SubPortfolioSlim = {
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
};

export type UserSlim = {
  id:         string;
  firstName?: string | null;
  lastName?:  string | null;
  email:      string;
  phone?:     string | null;
  imageUrl?:  string | null;
  masterWallet?: {
    id:            string;
    accountNumber: string;
    netAssetValue: number;
    totalDeposited: number;
    totalWithdrawn: number;
  } | null;
};

export type UserPortfolioDTO = {
  id:             string;
  userId:         string;
  portfolioId:    string;
  customName:     string;           // required in new schema
  portfolioValue: number;
  totalInvested:  number;
  totalLossGain:  number;
  isActive:       boolean;
  createdAt:      string;
  updatedAt:      string;
  // optional includes
  user?:          UserSlim;
  portfolio?:     PortfolioSlim;
  userAssets?:    UserPortfolioAssetDTO[];
  wallet?:        PortfolioWalletSlim; // PortfolioWallet
  subPortfolios?: SubPortfolioSlim[];
};

/* -------------------------------------------------------------------------- */
/*  Include helpers                                                             */
/* -------------------------------------------------------------------------- */

export type IncludeFlags = {
  user?:          boolean;
  portfolio?:     boolean;
  userAssets?:    boolean;
  wallet?:        boolean;
  subPortfolios?: boolean;
};

function toIncludeParam(flags?: IncludeFlags) {
  if (!flags) return undefined;
  const parts: string[] = [];
  if (flags.user)          parts.push("user");
  if (flags.portfolio)     parts.push("portfolio");
  if (flags.userAssets)    parts.push("userAssets");
  if (flags.wallet)        parts.push("wallet");
  if (flags.subPortfolios) parts.push("subPortfolios");
  return parts.length ? parts.join(",") : undefined;
}

/* -------------------------------------------------------------------------- */
/*  Input types                                                                 */
/* -------------------------------------------------------------------------- */

export type AssetAllocation = {
  assetId:              string;
  allocationPercentage: number;
  costPerShare:         number;
};

export type CreateUserPortfolioInput = {
  userId:           string;
  portfolioId:      string;
  customName:       string;           // required — identifies this enrollment
  amountInvested:   number;           // required — used to calculate initial positions
  assetAllocations: AssetAllocation[];
  include?:         IncludeFlags;
};

export type UpdateUserPortfolioInput = {
  customName?:       string;
  assetAllocations?: AssetAllocation[];
  recompute?:        boolean;
  resetAssets?:      boolean;
  isActive?:         boolean;
  include?:          IncludeFlags;
};

export type ListUserPortfoliosQuery = {
  userId?:      string;
  portfolioId?: string;
  include?:     IncludeFlags;
};

/* -------------------------------------------------------------------------- */
/*  Actions                                                                     */
/* -------------------------------------------------------------------------- */

/** POST /user-portfolios — creates portfolio, PortfolioWallet, SubPortfolio gen=0, assets */
export async function createUserPortfolio(input: CreateUserPortfolioInput) {
  if (!input.customName?.trim()) {
    return { success: false, error: "customName is required." };
  }
  if (!input.amountInvested || input.amountInvested <= 0) {
    return { success: false, error: "amountInvested must be a positive number." };
  }
  if (!input.assetAllocations?.length) {
    return { success: false, error: "assetAllocations must have at least one asset." };
  }
  for (const a of input.assetAllocations) {
    if (!a.assetId)
      return { success: false, error: "Each allocation must have an assetId." };
    if (typeof a.allocationPercentage !== "number" || a.allocationPercentage < 0)
      return { success: false, error: "Each allocation must have a valid allocationPercentage >= 0." };
    if (typeof a.costPerShare !== "number" || a.costPerShare < 0)
      return { success: false, error: "Each allocation must have a valid costPerShare >= 0." };
  }

  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post(
      "/user-portfolios",
      {
        userId:           input.userId,
        portfolioId:      input.portfolioId,
        customName:       input.customName.trim(),
        amountInvested:   input.amountInvested,
        assetAllocations: input.assetAllocations,
      },
      { headers, params: { include: toIncludeParam(input.include) } }
    );
    return { success: true, data: res.data?.data as UserPortfolioDTO };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to create user portfolio.") };
  }
}

/** GET /user-portfolios */
export async function listUserPortfolios(q?: ListUserPortfoliosQuery) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/user-portfolios", {
      headers,
      params: {
        userId:      q?.userId,
        portfolioId: q?.portfolioId,
        include:     toIncludeParam(q?.include),
      },
    });
    return { success: true, data: (res.data?.data ?? []) as UserPortfolioDTO[] };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load user portfolios.") };
  }
}

/** GET /user-portfolios/:id */
export async function getUserPortfolioById(id: string, include?: IncludeFlags) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/user-portfolios/${id}`, {
      headers,
      params: { include: toIncludeParam(include) },
    });
    return { success: true, data: res.data?.data as UserPortfolioDTO };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load user portfolio.") };
  }
}

/** PATCH /user-portfolios/:id */
export async function updateUserPortfolio(id: string, patch: UpdateUserPortfolioInput) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const { include, ...body } = patch;
    const res = await api.patch(`/user-portfolios/${id}`, body, {
      headers,
      params: { include: toIncludeParam(include) },
    });
    return { success: true, data: res.data?.data as UserPortfolioDTO };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to update user portfolio.") };
  }
}

/** POST /user-portfolios/:id/recompute — recalculates X2 positions from PortfolioWallet NAV */
export async function recomputeUserPortfolio(id: string, include?: IncludeFlags) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post(`/user-portfolios/${id}/recompute`, null, {
      headers,
      params: { include: toIncludeParam(include) },
    });
    return { success: true, data: res.data?.data?.userPortfolio as UserPortfolioDTO };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to recompute user portfolio.") };
  }
}

/** DELETE /user-portfolios/:id */
export async function deleteUserPortfolio(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    await api.delete(`/user-portfolios/${id}`, { headers });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to delete user portfolio.") };
  }
}

/**
 * Helper: create a user portfolio using the portfolio's default allocations.
 * Fetches portfolio assets first, then calls createUserPortfolio.
 */
export async function createUserPortfolioWithDefaults(
  userId:          string,
  portfolioId:     string,
  customName:      string,
  amountInvested:  number,
  include?:        IncludeFlags
) {
  try {
    const headers = await authHeaderFromCookies();
    const portfolioRes = await api.get(`/portfolios/${portfolioId}`, {
      headers,
      params: { include: "assets" },
    });

    const portfolio = portfolioRes.data?.data as PortfolioSlim;
    if (!portfolio) return { success: false, error: "Portfolio not found." };
    if (!portfolio.assets?.length)
      return { success: false, error: "Portfolio has no assets. Add assets first." };

    const assetAllocations: AssetAllocation[] = portfolio.assets.map((pa) => ({
      assetId:              pa.assetId,
      allocationPercentage: pa.defaultAllocationPercentage,
      costPerShare:         pa.defaultCostPerShare,
    }));

    return createUserPortfolio({
      userId,
      portfolioId,
      customName,
      amountInvested,
      assetAllocations,
      include,
    });
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to create user portfolio with defaults.") };
  }
}

/** GET /portfolio-summary/:userId — full financial snapshot for a user */
export async function getPortfolioSummary(userId: string) {
  if (!userId) return { success: false, error: "Missing userId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/portfolio-summary/${userId}`, { headers });
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load portfolio summary.") };
  }
}

/** POST /portfolio-summary/:userId/refresh — recompute all positions from current close prices */
export async function refreshPortfolioSummary(userId: string) {
  if (!userId) return { success: false, error: "Missing userId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post(`/portfolio-summary/${userId}/refresh`, {}, { headers });
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to refresh portfolio summary.") };
  }
}