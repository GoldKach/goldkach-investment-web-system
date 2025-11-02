// app/(app)/actions/withdrawals.ts
"use server";

import axios from "axios";
import { cookies } from "next/headers";

/* ------------------------------- axios client ------------------------------- */

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

function toIncludeParam(include?: WithdrawalInclude | WithdrawalInclude[]) {
  if (!include) return undefined;
  const list = Array.isArray(include) ? include : [include];
  const valid = list
    .map((s) => String(s).trim().toLowerCase())
    .filter((s) => s === "user" || s === "wallet");
  return valid.length ? valid.join(",") : undefined;
}

/* ---------------------------------- types ---------------------------------- */

export type TxStatus = "PENDING" | "APPROVED" | "REJECTED";
export type WithdrawalInclude = "user" | "wallet";

export interface Withdrawal {
  id: string;
  walletId: string;
  amount: number;
  userId: string;
  transactionStatus: TxStatus;
  AccountNo?: string | null;
  AccountName?: string | null;
  referenceNo: string;
  transactionId?: string | null;
  method?: string | null;
  bankName: string;
  bankAccountName: string;
  bankBranch: string;
  description?: string | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  // when ?include=user,wallet
  user?: {
    id: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  };
  wallet?: {
    id: string;
    netAssetValue?: number | null;
  };
}

export interface WithdrawalCreateInput {
  walletId: string;
  userId: string;
  amount: number;
  referenceNo: string;
  method?: string | null;
  AccountNo?: string | null;
  AccountName?: string | null;
  bankName: string;
  bankAccountName: string;
  bankBranch: string;
  description?: string | null;
  transactionId?: string | null; // optional until approval
}

export interface WithdrawalUpdateInput {
  amount?: number;
  transactionId?: string | null;
  method?: string | null;
  AccountNo?: string | null;
  AccountName?: string | null;
  bankName?: string;
  bankAccountName?: string;
  bankBranch?: string;
  description?: string | null;
  // status is not settable here; use approve/reject actions
}

/* ------------------------------- server actions ---------------------------- */

/** GET /withdrawals (supports q, paging, sorting, filters, include) */
export async function listWithdrawals(params?: {
  q?: string;
  userId?: string;
  walletId?: string;
  status?: TxStatus;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "amount" | "transactionStatus" | "updatedAt";
  order?: "asc" | "desc";
  include?: WithdrawalInclude | WithdrawalInclude[];
}) {
  try {
    const headers = await authHeaderFromCookies();
    const include = toIncludeParam(params?.include);
    const res = await api.get("/withdrawals", {
      headers,
      params: { ...params, include },
    });

    return {
      success: true,
      data: (res.data?.data ?? []) as Withdrawal[],
      meta: res.data?.meta ?? null,
    };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load withdrawals") };
  }
}

/** GET /withdrawals/:id (supports include=user,wallet) */
export async function getWithdrawal(id: string, opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }) {
  try {
    const headers = await authHeaderFromCookies();
    const include = toIncludeParam(opts?.include);
    const res = await api.get(`/withdrawals/${id}`, { headers, params: { include } });
    return { success: true, data: res.data?.data as Withdrawal };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch withdrawal") };
  }
}

/** POST /withdrawals (starts as PENDING on the API) */
export async function createWithdrawal(input: WithdrawalCreateInput, opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }) {
  try {
    const headers = await authHeaderFromCookies();
    const payload: WithdrawalCreateInput = {
      walletId: input.walletId,
      userId: input.userId,
      amount: Number(input.amount),
      referenceNo: input.referenceNo.trim(),
      method: input.method ?? null,
      AccountNo: input.AccountNo ?? null,
      AccountName: input.AccountName ?? null,
      bankName: input.bankName.trim(),
      bankAccountName: input.bankAccountName.trim(),
      bankBranch: input.bankBranch.trim(),
      description: input.description ?? null,
      transactionId: input.transactionId ?? null,
    };

    const include = toIncludeParam(opts?.include);
    const res = await api.post("/withdrawals", payload, { headers, params: { include } });
    return { success: true, data: res.data?.data as Withdrawal };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to create withdrawal") };
  }
}

/** PATCH /withdrawals/:id (only while PENDING) */
export async function updateWithdrawal(id: string, input: WithdrawalUpdateInput, opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }) {
  try {
    const headers = await authHeaderFromCookies();
    const payload: WithdrawalUpdateInput = {
      ...(input.amount !== undefined ? { amount: Number(input.amount) } : {}),
      ...(input.transactionId !== undefined ? { transactionId: input.transactionId } : {}),
      ...(input.method !== undefined ? { method: input.method } : {}),
      ...(input.AccountNo !== undefined ? { AccountNo: input.AccountNo } : {}),
      ...(input.AccountName !== undefined ? { AccountName: input.AccountName } : {}),
      ...(input.bankName !== undefined ? { bankName: input.bankName } : {}),
      ...(input.bankAccountName !== undefined ? { bankAccountName: input.bankAccountName } : {}),
      ...(input.bankBranch !== undefined ? { bankBranch: input.bankBranch } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
    };

    const include = toIncludeParam(opts?.include);
    const res = await api.patch(`/withdrawals/${id}`, payload, { headers, params: { include } });
    return { success: true, data: res.data?.data as Withdrawal };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to update withdrawal") };
  }
}

/** DELETE /withdrawals/:id (only while PENDING) */
export async function deleteWithdrawal(id: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.delete(`/withdrawals/${id}`, { headers });
    return { success: true, data: res.data?.data as Withdrawal | null };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to delete withdrawal") };
  }
}

/** POST /withdrawals/:id/approve  (deducts wallet & marks APPROVED) */
export async function approveWithdrawal(id: string, args?: { transactionId?: string | null }, opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }) {
  try {
    const headers = await authHeaderFromCookies();
    const include = toIncludeParam(opts?.include);
    const res = await api.post(
      `/withdrawals/${id}/approve`,
      { transactionId: args?.transactionId ?? null },
      { headers, params: { include } }
    );
    return { success: true, data: res.data?.data as Withdrawal };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to approve withdrawal") };
  }
}

/** POST /withdrawals/:id/reject (marks REJECTED, no wallet change) */
export async function rejectWithdrawal(id: string, opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }) {
  try {
    const headers = await authHeaderFromCookies();
    const include = toIncludeParam(opts?.include);
    const res = await api.post(`/withdrawals/${id}/reject`, {}, { headers, params: { include } });
    return { success: true, data: res.data?.data as Withdrawal };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to reject withdrawal") };
  }
}
 