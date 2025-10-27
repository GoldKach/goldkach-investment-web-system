// "use server"; // remove this line if you import these from Client Components

// import axios from "axios";

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
//   createdAt: string;
//   updatedAt: string;
//   asset?: {
//     id: string;
//     symbol: string;
//     description: string;
//     sector: string;
//     costPerShare: number;
//     closePrice: number;
//   };
//   portfolio?: { id: string; name: string };
// };

// export type CreatePortfolioAssetInput = {
//   portfolioId: string;
//   assetId: string;
//   stock?: number;
//   costPrice?: number;
//   closeValue?: number; // if omitted, API uses asset.closePrice
// };

// export type UpdatePortfolioAssetInput = Partial<
//   Pick<CreatePortfolioAssetInput, "stock" | "costPrice" | "closeValue">
// >;

// /** Create */
// export async function createPortfolioAsset(input: CreatePortfolioAssetInput) {
//   try {
//     const res = await api.post("/portfolioassets", input);
//     return { success: true, data: res.data?.data as PortfolioAssetDTO };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to add asset to portfolio.";
//     return { success: false, error: msg };
//   }
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

// /** Update */
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



"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
});

export type PortfolioAssetDTO = {
  id: string;
  portfolioId: string;
  assetId: string;
  stock: number;
  costPrice: number;
  closeValue: number;
  lossGain: number;
  createdAt: string;
  updatedAt: string;
  asset?: {
    id: string;
    symbol: string;
    description: string;
    sector: string;
    costPerShare: number;
    closePrice: number;
  };
  portfolio?: { id: string; name: string };
};

// ✅ Only these two needed for create
export type CreatePortfolioAssetInput = {
  portfolioId: string;
  assetId: string;
};

// (keep update flexible for editing numbers later)
export type UpdatePortfolioAssetInput = Partial<{
  stock: number;
  costPrice: number;
  closeValue: number;
}>;

/** Create (only portfolioId + assetId) */
export async function createPortfolioAsset(input: CreatePortfolioAssetInput) {
  try {
    // only send the two fields
    const payload = { portfolioId: input.portfolioId, assetId: input.assetId };
    const res = await api.post("/portfolioassets", payload);
    return { success: true, data: res.data?.data as PortfolioAssetDTO };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to add asset to portfolio.";
    return { success: false, error: msg };
  }
}

// Handy helper if you prefer a simpler call signature
export async function addAssetToPortfolio(portfolioId: string, assetId: string) {
  return createPortfolioAsset({ portfolioId, assetId });
}

/** List (optionally filter by portfolioId) */
export async function getPortfolioAssets(portfolioId?: string) {
  try {
    const res = await api.get("/portfolioassets", { params: { portfolioId } });
    return { success: true, data: (res.data?.data ?? []) as PortfolioAssetDTO[] };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to load portfolio assets.";
    return { success: false, error: msg };
  }
}

/** Read one */
export async function getPortfolioAssetById(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const res = await api.get(`/portfolioassets/${id}`);
    return { success: true, data: res.data?.data as PortfolioAssetDTO };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to load portfolio asset.";
    return { success: false, error: msg };
  }
}

/** Update */
export async function updatePortfolioAsset(id: string, patch: UpdatePortfolioAssetInput) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const res = await api.patch(`/portfolioassets/${id}`, patch);
    return { success: true, data: res.data?.data as PortfolioAssetDTO };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to update portfolio asset.";
    return { success: false, error: msg };
  }
}

/** Delete */
export async function deletePortfolioAsset(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    await api.delete(`/portfolioassets/${id}`);
    return { success: true };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to remove portfolio asset.";
    return { success: false, error: msg };
  }
}


export type UpdateUserPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;    // UserRole as string
  status?: string;  // UserStatus as string
  password?: string;
  imageUrl?: string;
};

export async function updateUserById(userId: string, updates: UpdateUserPayload) {
  if (!userId) throw new Error("User ID is required");

  // Only send fields your controller accepts
  const body: UpdateUserPayload = {
    firstName: updates.firstName,
    lastName: updates.lastName,
    email: updates.email,
    phone: updates.phone,
    role: updates.role,
    status: updates.status,
    password: updates.password,
    imageUrl: updates.imageUrl,
  };

  try {
    const res = await api.put(`/users/${encodeURIComponent(userId)}`, body);
    // Optional: keep your UI fresh
    revalidatePath(`/dashboard/users/${userId}`);
    revalidatePath("/dashboard/users");
    return res.data; // { data, error } as per your controller
  } catch (err: any) {
    console.error("updateUserById error:", err?.response?.data || err);
    throw new Error(err?.response?.data?.error || "Failed to update user");
  }
}
