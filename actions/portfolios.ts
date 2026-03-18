// // app/(dashboard)/actions/portfolio.ts
// "use server";

// import axios from "axios";

// const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// const api = axios.create({
//   baseURL: BASE_API_URL,
//   timeout: 12000,
//   headers: { "Content-Type": "application/json" },
// });

// export type PortfolioDTO = {
//   id: string;
//   name: string;
//   description?: string | null;
//   timeHorizon: string;
//   riskTolerance: string;
//   allocationPercentage: number; // defaults to 100 in schema
//   createdAt: string;            // ISO from API
//   updatedAt: string;            // ISO from API
// };

// export type CreatePortfolioInput = {
//   name: string;
//   description?: string;
//   timeHorizon: string;
//   riskTolerance: string;
//   allocationPercentage?: number; // optional; API will default to 100
// };

// export type UpdatePortfolioInput = Partial<CreatePortfolioInput>;

// /** Create */
// export async function createPortfolio(input: CreatePortfolioInput) {
//   try {
//     const res = await api.post("/portfolios", input);
//     return { success: true, data: res.data?.data as PortfolioDTO };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to create portfolio.";
//     return { success: false, error: msg };
//   }
// }

// /** List (optionally with pagination/search later) */
// export async function getPortfolios() {
//   try {
//     const res = await api.get("/portfolios");
//     return { success: true, data: (res.data?.data ?? []) as PortfolioDTO[] };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to load portfolios.";
//     return { success: false, error: msg };
//   }
// }

// /** Read one */
// export async function getPortfolioById(id: string) {
//   if (!id) return { success: false, error: "Missing id." };
//   try {
//     const res = await api.get(`/portfolios/${id}`);
//     return { success: true, data: res.data?.data as PortfolioDTO };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to load portfolio.";
//     return { success: false, error: msg };
//   }
// }

// /** Update */
// export async function updatePortfolio(id: string, patch: UpdatePortfolioInput) {
//   if (!id) return { success: false, error: "Missing id." };
//   try {
//     const res = await api.patch(`/portfolios/${id}`, patch);
//     return { success: true, data: res.data?.data as PortfolioDTO };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to update portfolio.";
//     return { success: false, error: msg };
//   }
// }

// /** Delete */
// export async function deletePortfolio(id: string) {
//   if (!id) return { success: false, error: "Missing id." };
//   try {
//     await api.delete(`/portfolios/${id}`);
//     return { success: true };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to delete portfolio.";
//     return { success: false, error: msg };
//   }
// }





// app/(dashboard)/actions/portfolio.ts
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

export type PortfolioDTO = {
  id:                   string;
  name:                 string;
  description?:         string | null;
  timeHorizon:          string;
  riskTolerance:        string;
  allocationPercentage: number;
  createdAt:            string;
  updatedAt:            string;
  // included when ?include=assets
  assets?: Array<{
    id:                          string;
    assetId:                     string;
    portfolioId:                 string;
    defaultAllocationPercentage: number;
    defaultCostPerShare:         number;
    asset: {
      id:                  string;
      symbol:              string;
      description:         string;
      sector:              string;
      assetClass:          string;
      defaultCostPerShare: number;
      closePrice:          number;
    };
  }>;
  // included when ?include=userPortfolios
  userPortfolios?: Array<{
    id:             string;
    customName:     string;
    userId:         string;
    portfolioValue: number;
    totalInvested:  number;
    totalLossGain:  number;
    isActive:       boolean;
    wallet?: {
      id:            string;
      netAssetValue: number;
      totalFees:     number;
    };
  }>;
};

export type CreatePortfolioInput = {
  name:                  string;
  description?:          string;
  timeHorizon:           string;
  riskTolerance:         string;
  allocationPercentage?: number; // defaults to 100
};

export type UpdatePortfolioInput = Partial<CreatePortfolioInput>;

/* -------------------------------------------------------------------------- */
/*  Actions                                                                     */
/* -------------------------------------------------------------------------- */

/** POST /portfolios */
export async function createPortfolio(input: CreatePortfolioInput) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post("/portfolios", input, { headers });
    return { success: true, data: res.data?.data as PortfolioDTO };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to create portfolio.") };
  }
}

/** GET /portfolios */
export async function getPortfolios(opts?: { include?: "assets" | "userPortfolios" }) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/portfolios", {
      headers,
      params: { include: opts?.include },
    });
    return { success: true, data: (res.data?.data ?? []) as PortfolioDTO[] };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load portfolios.") };
  }
}

/** GET /portfolios/:id */
export async function getPortfolioById(
  id:    string,
  opts?: { include?: "assets" | "userPortfolios" }
) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/portfolios/${id}`, {
      headers,
      params: { include: opts?.include },
    });
    return { success: true, data: res.data?.data as PortfolioDTO };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load portfolio.") };
  }
}

/** PATCH /portfolios/:id */
export async function updatePortfolio(id: string, patch: UpdatePortfolioInput) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.patch(`/portfolios/${id}`, patch, { headers });
    return { success: true, data: res.data?.data as PortfolioDTO };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to update portfolio.") };
  }
}

/** DELETE /portfolios/:id */
export async function deletePortfolio(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    await api.delete(`/portfolios/${id}`, { headers });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to delete portfolio.") };
  }
}