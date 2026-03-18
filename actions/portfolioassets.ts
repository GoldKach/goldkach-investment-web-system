

// // app/(app)/actions/portfolio-assets.ts
// "use server";

// import axios from "axios";
// import { revalidatePath } from "next/cache";

// const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// const api = axios.create({
//   baseURL: BASE_API_URL,
//   timeout: 12000,
//   headers: { "Content-Type": "application/json" },
// });

// export type PortfolioAssetDTO = {
//   id: string;
//   portfolioId: string;
//   assetId: string;
//   stock: number;
//   costPrice: number;
//   closeValue: number;
//   lossGain: number;
//   // ✅ NEW: Default values for templates
//   defaultAllocationPercentage: number;
//   defaultCostPerShare: number;
//   createdAt: string;
//   updatedAt: string;
//   asset?: {
//     id: string;
//     symbol: string;
//     description: string;
//     sector: string;
//     defaultCostPerShare: number;  // ✅ UPDATED: Field name
//     closePrice: number;
//   };
//   portfolio?: { id: string; name: string };
// };

// // ✅ UPDATED: Can now include default values
// export type CreatePortfolioAssetInput = {
//   portfolioId: string;
//   assetId: string;
//   defaultAllocationPercentage?: number;  // ✅ NEW
//   defaultCostPerShare?: number;          // ✅ NEW
// };

// // ✅ UPDATED: Can update default values
// export type UpdatePortfolioAssetInput = Partial<{
//   stock: number;
//   costPrice: number;
//   closeValue: number;
//   defaultAllocationPercentage: number;   // ✅ NEW
//   defaultCostPerShare: number;           // ✅ NEW
// }>;

// /** 
//  * Create (portfolioId + assetId + optional defaults)
//  * ✅ UPDATED: Can specify default allocation & cost per share
//  */
// export async function createPortfolioAsset(input: CreatePortfolioAssetInput) {
//   try {
//     const payload = { 
//       portfolioId: input.portfolioId, 
//       assetId: input.assetId,
//       ...(input.defaultAllocationPercentage !== undefined && { 
//         defaultAllocationPercentage: input.defaultAllocationPercentage 
//       }),
//       ...(input.defaultCostPerShare !== undefined && { 
//         defaultCostPerShare: input.defaultCostPerShare 
//       }),
//     };
//     const res = await api.post("/portfolioassets", payload);
//     return { success: true, data: res.data?.data as PortfolioAssetDTO };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to add asset to portfolio.";
//     return { success: false, error: msg };
//   }
// }

// // Handy helper if you prefer a simpler call signature
// export async function addAssetToPortfolio(
//   portfolioId: string, 
//   assetId: string,
//   defaults?: {
//     defaultAllocationPercentage?: number;
//     defaultCostPerShare?: number;
//   }
// ) {
//   return createPortfolioAsset({ 
//     portfolioId, 
//     assetId,
//     ...defaults,
//   });
// }

// /** List (optionally filter by portfolioId) */
// export async function getPortfolioAssets(portfolioId?: string) {
//   try {
//     const res = await api.get("/portfolioassets", { params: { portfolioId } });
//     return { success: true, data: (res.data?.data ?? []) as PortfolioAssetDTO[] };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to load portfolio assets.";
//     return { success: false, error: msg };
//   }
// }

// /** Read one */
// export async function getPortfolioAssetById(id: string) {
//   if (!id) return { success: false, error: "Missing id." };
//   try {
//     const res = await api.get(`/portfolioassets/${id}`);
//     return { success: true, data: res.data?.data as PortfolioAssetDTO };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to load portfolio asset.";
//     return { success: false, error: msg };
//   }
// }

// /** 
//  * Update
//  * ✅ UPDATED: Can update default values
//  */
// export async function updatePortfolioAsset(id: string, patch: UpdatePortfolioAssetInput) {
//   if (!id) return { success: false, error: "Missing id." };
//   try {
//     const res = await api.patch(`/portfolioassets/${id}`, patch);
//     return { success: true, data: res.data?.data as PortfolioAssetDTO };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to update portfolio asset.";
//     return { success: false, error: msg };
//   }
// }

// /** Delete */
// export async function deletePortfolioAsset(id: string) {
//   if (!id) return { success: false, error: "Missing id." };
//   try {
//     await api.delete(`/portfolioassets/${id}`);
//     return { success: true };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to remove portfolio asset.";
//     return { success: false, error: msg };
//   }
// }

// export type UpdateUserPayload = {
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   phone?: string;
//   role?: string;    // UserRole as string
//   status?: string;  // UserStatus as string
//   password?: string;
//   imageUrl?: string;
// };

// export async function updateUserById(userId: string, updates: UpdateUserPayload) {
//   if (!userId) throw new Error("User ID is required");

//   // Only send fields your controller accepts
//   const body: UpdateUserPayload = {
//     firstName: updates.firstName,
//     lastName: updates.lastName,
//     email: updates.email,
//     phone: updates.phone,
//     role: updates.role,
//     status: updates.status,
//     password: updates.password,
//     imageUrl: updates.imageUrl,
//   };

//   try {
//     const res = await api.put(`/users/${encodeURIComponent(userId)}`, body);
//     // Optional: keep your UI fresh
//     revalidatePath(`/dashboard/users/${userId}`);
//     revalidatePath("/dashboard/users");
//     return res.data; // { data, error } as per your controller
//   } catch (err: any) {
//     console.error("updateUserById error:", err?.response?.data || err);
//     throw new Error(err?.response?.data?.error || "Failed to update user");
//   }
// }


// app/(app)/actions/portfolio-assets.ts
"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

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

export type PortfolioAssetDTO = {
  id:                          string;
  portfolioId:                 string;
  assetId:                     string;
  defaultAllocationPercentage: number;
  defaultCostPerShare:         number;
  // computed fields (derived from defaultCostPerShare × stock)
  stock:      number;
  costPrice:  number;
  closeValue: number;
  lossGain:   number;
  createdAt:  string;
  updatedAt:  string;
  asset?: {
    id:                  string;
    symbol:              string;
    description:         string;
    sector:              string;
    assetClass:          string;
    defaultCostPerShare: number;
    closePrice:          number;
  };
  portfolio?: { id: string; name: string };
};

export type CreatePortfolioAssetInput = {
  portfolioId:                  string;
  assetId:                      string;
  defaultAllocationPercentage?: number;
  defaultCostPerShare?:         number;
};

export type UpdatePortfolioAssetInput = Partial<{
  defaultAllocationPercentage: number;
  defaultCostPerShare:         number;
  stock:                       number;
  costPrice:                   number;
  closeValue:                  number;
}>;

/* -------------------------------------------------------------------------- */
/*  Portfolio Asset actions                                                     */
/* -------------------------------------------------------------------------- */

/** POST /portfolioassets */
export async function createPortfolioAsset(input: CreatePortfolioAssetInput) {
  try {
    const headers = await authHeaderFromCookies();
    const payload = {
      portfolioId: input.portfolioId,
      assetId:     input.assetId,
      ...(input.defaultAllocationPercentage !== undefined
        ? { defaultAllocationPercentage: input.defaultAllocationPercentage }
        : {}),
      ...(input.defaultCostPerShare !== undefined
        ? { defaultCostPerShare: input.defaultCostPerShare }
        : {}),
    };
    const res = await api.post("/portfolioassets", payload, { headers });
    return { success: true, data: res.data?.data as PortfolioAssetDTO };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to add asset to portfolio.") };
  }
}

/** Convenience wrapper */
export async function addAssetToPortfolio(
  portfolioId: string,
  assetId:     string,
  defaults?:   { defaultAllocationPercentage?: number; defaultCostPerShare?: number }
) {
  return createPortfolioAsset({ portfolioId, assetId, ...defaults });
}

/** GET /portfolioassets?portfolioId=... */
export async function getPortfolioAssets(portfolioId?: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/portfolioassets", {
      headers,
      params: { portfolioId },
    });
    return { success: true, data: (res.data?.data ?? []) as PortfolioAssetDTO[] };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load portfolio assets.") };
  }
}

/** GET /portfolioassets/:id */
export async function getPortfolioAssetById(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/portfolioassets/${id}`, { headers });
    return { success: true, data: res.data?.data as PortfolioAssetDTO };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load portfolio asset.") };
  }
}

/** GET /portfolios/:portfolioId/portfolioassets */
export async function getPortfolioAssetsByPortfolio(portfolioId: string) {
  if (!portfolioId) return { success: false, error: "Missing portfolioId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/portfolios/${portfolioId}/portfolioassets`, { headers });
    return { success: true, data: (res.data?.data ?? []) as PortfolioAssetDTO[] };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load portfolio assets.") };
  }
}

/** PATCH /portfolioassets/:id */
export async function updatePortfolioAsset(id: string, patch: UpdatePortfolioAssetInput) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.patch(`/portfolioassets/${id}`, patch, { headers });
    return { success: true, data: res.data?.data as PortfolioAssetDTO };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to update portfolio asset.") };
  }
}

/** DELETE /portfolioassets/:id */
export async function deletePortfolioAsset(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.delete(`/portfolioassets/${id}`, { headers });
    return { success: true, data: res.data?.data ?? null };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to remove portfolio asset.") };
  }
}

/* -------------------------------------------------------------------------- */
/*  User actions (kept here as in original — consider moving to users.ts)      */
/* -------------------------------------------------------------------------- */

export type UpdateUserPayload = {
  firstName?: string;
  lastName?:  string;
  email?:     string;
  phone?:     string;
  role?:      string;
  status?:    string;
  password?:  string;
  imageUrl?:  string;
};

export async function updateUserById(userId: string, updates: UpdateUserPayload) {
  if (!userId) throw new Error("User ID is required");
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.put(`/users/${encodeURIComponent(userId)}`, updates, { headers });
    revalidatePath(`/dashboard/users/${userId}`);
    revalidatePath("/dashboard/users");
    return res.data;
  } catch (err: any) {
    console.error("updateUserById error:", err?.response?.data || err);
    throw new Error(err?.response?.data?.error || "Failed to update user");
  }
}