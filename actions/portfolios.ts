// app/(dashboard)/actions/portfolio.ts
"use server";

import axios from "axios";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
});

export type PortfolioDTO = {
  id: string;
  name: string;
  description?: string | null;
  timeHorizon: string;
  riskTolerance: string;
  allocationPercentage: number; // defaults to 100 in schema
  createdAt: string;            // ISO from API
  updatedAt: string;            // ISO from API
};

export type CreatePortfolioInput = {
  name: string;
  description?: string;
  timeHorizon: string;
  riskTolerance: string;
  allocationPercentage?: number; // optional; API will default to 100
};

export type UpdatePortfolioInput = Partial<CreatePortfolioInput>;

/** Create */
export async function createPortfolio(input: CreatePortfolioInput) {
  try {
    const res = await api.post("/portfolios", input);
    return { success: true, data: res.data?.data as PortfolioDTO };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to create portfolio.";
    return { success: false, error: msg };
  }
}

/** List (optionally with pagination/search later) */
export async function getPortfolios() {
  try {
    const res = await api.get("/portfolios");
    return { success: true, data: (res.data?.data ?? []) as PortfolioDTO[] };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to load portfolios.";
    return { success: false, error: msg };
  }
}

/** Read one */
export async function getPortfolioById(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const res = await api.get(`/portfolios/${id}`);
    return { success: true, data: res.data?.data as PortfolioDTO };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to load portfolio.";
    return { success: false, error: msg };
  }
}

/** Update */
export async function updatePortfolio(id: string, patch: UpdatePortfolioInput) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const res = await api.patch(`/portfolios/${id}`, patch);
    return { success: true, data: res.data?.data as PortfolioDTO };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to update portfolio.";
    return { success: false, error: msg };
  }
}

/** Delete */
export async function deletePortfolio(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    await api.delete(`/portfolios/${id}`);
    return { success: true };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to delete portfolio.";
    return { success: false, error: msg };
  }
}
