// app/(dashboard)/actions/user-portfolios.ts
"use server";

import axios from "axios";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
});

/* ======================
   Types
====================== */
export type UserSlim = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email: string;
  phone: string;
  imageUrl?: string | null;
  // often useful when included:
  wallet?: { id: string; accountNumber: string; netAssetValue: number } | null;
};

export type AssetSlim = {
  id: string;
  symbol: string;
  description: string;
  sector: string;
  costPerShare: number;
  closePrice: number;
};

export type PortfolioSlim = {
  id: string;
  name: string;
  description?: string | null;
  timeHorizon: string;
  riskTolerance: string;
  allocationPercentage: number;
  assets?: Array<{
    id: string; // PortfolioAsset id
    assetId: string;
    portfolioId: string;
    asset: AssetSlim;
  }>;
};

export type UserPortfolioAssetDTO = {
  id: string;
  userPortfolioId: string;
  portfolioAssetId: string;
  costPrice: number;
  stock: number;
  closeValue: number;
  lossGain: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  // when included via controller parseInclude:
  portfolioAsset?: { id: string; asset: AssetSlim; portfolio: PortfolioSlim };
};

export type UserPortfolioDTO = {
  id: string;
  userId: string;
  portfolioId: string;
  portfolioValue: number;
  createdAt: string; // ISO strings from API
  updatedAt: string;
  // optional includes:
  user?: UserSlim;
  portfolio?: PortfolioSlim;
  userAssets?: UserPortfolioAssetDTO[];
};

/* ======================
   Include helpers
====================== */
export type IncludeFlags = {
  user?: boolean;
  portfolio?: boolean;
  userAssets?: boolean;
};

function toIncludeParam(flags?: IncludeFlags) {
  if (!flags) return undefined;
  const parts: string[] = [];
  if (flags.user) parts.push("user");
  if (flags.portfolio) parts.push("portfolio");
  if (flags.userAssets) parts.push("userAssets");
  return parts.length ? parts.join(",") : undefined;
}

/* ======================
   Inputs
====================== */
export type CreateUserPortfolioInput = {
  userId: string;
  portfolioId: string;
  include?: IncludeFlags; // e.g. { user: true, portfolio: true, userAssets: true }
};

export type ListUserPortfoliosQuery = {
  userId?: string;
  portfolioId?: string;
  include?: IncludeFlags;
};

export type UpdateUserPortfolioInput = {
  // move to another model portfolio (controller enforces uniqueness and existence)
  portfolioId?: string;
  // If you want to drive recomputation via PATCH instead of dedicated endpoint:
  recompute?: boolean;
  // Drop & rebuild UPA entries from model portfolio
  resetAssets?: boolean;
  include?: IncludeFlags;
};

/* ======================
   Actions
====================== */

/** Create a user-portfolio (also creates UserPortfolioAsset entries on the backend) */
export async function createUserPortfolio(input: CreateUserPortfolioInput) {
  try {
    const params = {
      include: toIncludeParam(input.include),
    };
    const res = await api.post("/user-portfolios", {
      userId: input.userId,
      portfolioId: input.portfolioId,
    }, { params });

    return { success: true, data: res.data?.data as UserPortfolioDTO };
  } catch (e: any) {
    const msg =
      e?.response?.data?.error ??
      (e?.code === "ERR_NETWORK" ? "Network error creating user-portfolio." : "Failed to create user-portfolio.");
    return { success: false, error: msg };
  }
}

/** List user-portfolios (optionally filtered) */
export async function listUserPortfolios(q?: ListUserPortfoliosQuery) {
  try {
    const res = await api.get("/user-portfolios", {
      params: {
        userId: q?.userId,
        portfolioId: q?.portfolioId,
        include: toIncludeParam(q?.include),
      },
    });
    return { success: true, data: (res.data?.data ?? []) as UserPortfolioDTO[] };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to load user-portfolios.";
    return { success: false, error: msg };
  }
}

/** Read one user-portfolio */
export async function getUserPortfolioById(id: string, include?: IncludeFlags) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const res = await api.get(`/user-portfolios/${id}`, {
      params: { include: toIncludeParam(include) },
    });
    return { success: true, data: res.data?.data as UserPortfolioDTO };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to load user-portfolio.";
    return { success: false, error: msg };
  }
}

/** Update (move to another portfolio / recompute / resetAssets) */
export async function updateUserPortfolio(id: string, patch: UpdateUserPortfolioInput) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const { include, ...body } = patch;
    const res = await api.patch(`/user-portfolios/${id}`, body, {
      params: { include: toIncludeParam(include) },
    });
    return { success: true, data: res.data?.data as UserPortfolioDTO };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to update user-portfolio.";
    return { success: false, error: msg };
  }
}

/** Recompute all derived UserPortfolioAsset entries and refresh portfolioValue */
export async function recomputeUserPortfolio(id: string, include?: IncludeFlags) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const res = await api.post(`/user-portfolios/${id}/recompute`, null, {
      params: { include: toIncludeParam(include) },
    });
    // controller returns { recompute: {...}, userPortfolio: {...} }
    return { success: true, data: res.data?.data?.userPortfolio as UserPortfolioDTO };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to recompute user-portfolio.";
    return { success: false, error: msg };
  }
}

/** Delete user-portfolio (cascades its UPA entries) */
export async function deleteUserPortfolio(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    await api.delete(`/user-portfolios/${id}`);
    return { success: true };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to delete user-portfolio.";
    return { success: false, error: msg };
  }
}
