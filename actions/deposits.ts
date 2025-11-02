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

/* ---------------------------------- types ---------------------------------- */

export type TransactionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Deposit {
  id: string;
  walletId: string;
  userId: string;
  amount: number;
  transactionId?: string | null;
  transactionStatus: TransactionStatus;
  mobileNo?: string | null;
  referenceNo?: string | null;
  AccountNo?: string | null;
  ApprovedBy?: string | null;
  method?: string | null;
  description?: string | null;
  createdAt: string;

  // Optional relations (your API may include these on GET /deposits/:id)
  user?: { id: string; name?: string | null; email?: string | null } | null;
  wallet?: { id: string; netAssetValue?: number } | null;
}

export interface DepositCreateInput {
  walletId: string;
  userId: string;
  amount: number;
  transactionId?: string | null;
  transactionStatus?: TransactionStatus;
  mobileNo?: string | null;
  referenceNo?: string | null;
  AccountNo?: string | null;
  ApprovedBy?: string | null;
  method?: string | null;
  description?: string | null;
}

export interface DepositUpdateInput {
  amount?: number;
  transactionId?: string | null;
  transactionStatus?: TransactionStatus;
  mobileNo?: string | null;
  referenceNo?: string | null;
  AccountNo?: string | null;
  ApprovedBy?: string | null;
  method?: string | null;
  description?: string | null;
}

export interface ListDepositsParams {
  q?: string;
  userId?: string;
  walletId?: string;
  status?: TransactionStatus | string;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "amount" | "transactionStatus";
  order?: "asc" | "desc";
}

/* ------------------------------- server actions ---------------------------- */

/** GET /deposits */
export async function listDeposits(params?: ListDepositsParams) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/deposits", { headers, params });
    // API shape: { data, meta, error }
    return {
      success: true,
      data: (res.data?.data ?? []) as Deposit[],
      meta: res.data?.meta,
    };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load deposits") };
  }
}

/** GET /deposits/:id */
export async function getDeposit(id: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/deposits/${id}`, { headers });
    return { success: true, data: res.data?.data as Deposit };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch deposit") };
  }
}

/** Convenience wrappers */
export async function getUserDeposits(userId: string, params?: Omit<ListDepositsParams, "userId">) {
  return listDeposits({ ...params, userId });
}
export async function getWalletDeposits(walletId: string, params?: Omit<ListDepositsParams, "walletId">) {
  return listDeposits({ ...params, walletId });
}

/** POST /deposits */
export async function createDeposit(input: DepositCreateInput) {
  try {
    const headers = await authHeaderFromCookies();
    const payload: DepositCreateInput = {
      walletId: input.walletId,
      userId: input.userId,
      amount: Number(input.amount),
      transactionId: input.transactionId ?? null,
      transactionStatus: input.transactionStatus ?? "PENDING",
      mobileNo: input.mobileNo ?? null,
      referenceNo: input.referenceNo ?? null,
      AccountNo: input.AccountNo ?? null,
      ApprovedBy: input.ApprovedBy ?? null,
      method: input.method ?? null,
      description: input.description ?? null,
    };
    const res = await api.post("/deposits", payload, { headers });
    return { success: true, data: res.data?.data as Deposit };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to create deposit") };
  }
}

/** PATCH /deposits/:id */
export async function updateDeposit(id: string, input: DepositUpdateInput) {
  try {
    const headers = await authHeaderFromCookies();
    const payload: DepositUpdateInput = {
      ...(input.amount !== undefined && { amount: Number(input.amount) }),
      ...(input.transactionId !== undefined && { transactionId: input.transactionId }),
      ...(input.transactionStatus !== undefined && { transactionStatus: input.transactionStatus }),
      ...(input.mobileNo !== undefined && { mobileNo: input.mobileNo }),
      ...(input.referenceNo !== undefined && { referenceNo: input.referenceNo }),
      ...(input.AccountNo !== undefined && { AccountNo: input.AccountNo }),
      ...(input.ApprovedBy !== undefined && { ApprovedBy: input.ApprovedBy }),
      ...(input.method !== undefined && { method: input.method }),
      ...(input.description !== undefined && { description: input.description }),
    };
    const res = await api.patch(`/deposits/${id}`, payload, { headers });
    return { success: true, data: res.data?.data as Deposit };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to update deposit") };
  }
}

/** POST /deposits/:id/approve */
export async function approveDeposit(id: string, ApprovedBy?: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post(`/deposits/${id}/approve`, { ApprovedBy }, { headers });
    return { success: true, data: res.data?.data as Deposit };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to approve deposit") };
  }
}

/** POST /deposits/:id/reverse */
export async function reverseDeposit(id: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post(`/deposits/${id}/reverse`, {}, { headers });
    return { success: true, data: res.data?.data as Deposit };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to reverse deposit") };
  }
}

/** DELETE /deposits/:id */
export async function deleteDeposit(id: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.delete(`/deposits/${id}`, { headers });
    return { success: true, data: res.data?.data as Deposit };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to delete deposit") };
  }
}
