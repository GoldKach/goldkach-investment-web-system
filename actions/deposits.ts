// "use server";

// import axios from "axios";
// import { cookies } from "next/headers";

// const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";
// const api = axios.create({
//   baseURL: BASE_API_URL,
//   timeout: 60000,
//   headers: { "Content-Type": "application/json" },
// });


// function msg(e: any, fallback = "Request failed") {
//   return e?.response?.data?.error || e?.message || fallback;
// }

// async function authHeaderFromCookies() {
//   const jar = await cookies();
//   const token = jar.get("accessToken")?.value;
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

// /* ---------------------------------- types ---------------------------------- */

// export type TransactionStatus = "PENDING" | "APPROVED" | "REJECTED";

// export interface Deposit {
//   id: string;
//   walletId: string;
//   userId: string;
//   amount: number;
//   transactionId?: string | null;
//   transactionStatus: TransactionStatus;
//   mobileNo?: string | null;
//   referenceNo?: string | null;
//   AccountNo?: string | null;
//   ApprovedBy?: string | null;
//   method?: string | null;
//   description?: string | null;
//   createdAt: string;

//   // Optional relations (your API may include these on GET /deposits/:id)
//   user?: { id: string; name?: string | null; email?: string | null } | null;
//   wallet?: { id: string; netAssetValue?: number } | null;
// }

// export interface DepositCreateInput {
//   walletId: string;
//   userId: string;
//   amount: number;
//   transactionId?: string | null;
//   transactionStatus?: TransactionStatus;
//   mobileNo?: string | null;
//   referenceNo?: string | null;
//   AccountNo?: string | null;
//   ApprovedBy?: string | null;
//   method?: string | null;
//   description?: string | null;
// }

// export interface DepositUpdateInput {
//   amount?: number;
//   transactionId?: string | null;
//   transactionStatus?: TransactionStatus;
//   mobileNo?: string | null;
//   referenceNo?: string | null;
//   AccountNo?: string | null;
//   ApprovedBy?: string | null;
//   method?: string | null;
//   description?: string | null;
// }

// export interface ListDepositsParams {
//   q?: string;
//   userId?: string;
//   walletId?: string;
//   status?: TransactionStatus | string;
//   page?: number;
//   pageSize?: number;
//   sortBy?: "createdAt" | "amount" | "transactionStatus";
//   order?: "asc" | "desc";
// }

// /* ------------------------------- server actions ---------------------------- */

// /** GET /deposits */
// export async function listDeposits(params?: ListDepositsParams) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const res = await api.get("/deposits", { headers, params });
//     // API shape: { data, meta, error }
//     return {
//       success: true,
//       data: (res.data?.data ?? []) as Deposit[],
//       meta: res.data?.meta,
//     };
//   } catch (e: any) {
//     return { success: false, error: msg(e, "Failed to load deposits") };
//   }
// }

// /** GET /deposits/:id */
// export async function getDeposit(id: string) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const res = await api.get(`/deposits/${id}`, { headers });
//     return { success: true, data: res.data?.data as Deposit };
//   } catch (e: any) {
//     return { success: false, error: msg(e, "Failed to fetch deposit") };
//   }
// }

// /** Convenience wrappers */
// export async function getUserDeposits(userId: string, params?: Omit<ListDepositsParams, "userId">) {
//   return listDeposits({ ...params, userId });
// }
// export async function getWalletDeposits(walletId: string, params?: Omit<ListDepositsParams, "walletId">) {
//   return listDeposits({ ...params, walletId });
// }

// /** POST /deposits */
// export async function createDeposit(input: DepositCreateInput) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const payload: DepositCreateInput = {
//       walletId: input.walletId,
//       userId: input.userId,
//       amount: Number(input.amount),
//       transactionId: input.transactionId ?? null,
//       transactionStatus: input.transactionStatus ?? "PENDING",
//       mobileNo: input.mobileNo ?? null,
//       referenceNo: input.referenceNo ?? null,
//       AccountNo: input.AccountNo ?? null,
//       ApprovedBy: input.ApprovedBy ?? null,
//       method: input.method ?? null,
//       description: input.description ?? null,
//     };
//     const res = await api.post("/deposits", payload, { headers });
//     return { success: true, data: res.data?.data as Deposit };
//   } catch (e: any) {
//     return { success: false, error: msg(e, "Failed to create deposit") };
//   }
// }

// /** PATCH /deposits/:id */
// export async function updateDeposit(id: string, input: DepositUpdateInput) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const payload: DepositUpdateInput = {
//       ...(input.amount !== undefined && { amount: Number(input.amount) }),
//       ...(input.transactionId !== undefined && { transactionId: input.transactionId }),
//       ...(input.transactionStatus !== undefined && { transactionStatus: input.transactionStatus }),
//       ...(input.mobileNo !== undefined && { mobileNo: input.mobileNo }),
//       ...(input.referenceNo !== undefined && { referenceNo: input.referenceNo }),
//       ...(input.AccountNo !== undefined && { AccountNo: input.AccountNo }),
//       ...(input.ApprovedBy !== undefined && { ApprovedBy: input.ApprovedBy }),
//       ...(input.method !== undefined && { method: input.method }),
//       ...(input.description !== undefined && { description: input.description }),
//     };
//     const res = await api.patch(`/deposits/${id}`, payload, { headers });
//     return { success: true, data: res.data?.data as Deposit };
//   } catch (e: any) {
//     return { success: false, error: msg(e, "Failed to update deposit") };
//   }
// }

// /** POST /deposits/:id/approve */
// export async function approveDeposit(id: string, ApprovedBy?: string) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const res = await api.post(`/deposits/${id}/approve`, { ApprovedBy }, { headers });
//     return { success: true, data: res.data?.data as Deposit };
//   } catch (e: any) {
//     return { success: false, error: msg(e, "Failed to approve deposit") };
//   }
// }

// /** POST /deposits/:id/reverse */
// export async function reverseDeposit(id: string) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const res = await api.post(`/deposits/${id}/reverse`, {}, { headers });
//     return { success: true, data: res.data?.data as Deposit };
//   } catch (e: any) {
//     return { success: false, error: msg(e, "Failed to reverse deposit") };
//   }
// }

// /** DELETE /deposits/:id */
// export async function deleteDeposit(id: string) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const res = await api.delete(`/deposits/${id}`, { headers });
//     return { success: true, data: res.data?.data as Deposit };
//   } catch (e: any) {
//     return { success: false, error: msg(e, "Failed to delete deposit") };
//   }
// }




// app/(app)/actions/deposits.ts
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

export type TransactionStatus = "PENDING" | "APPROVED" | "REJECTED";
/** MASTER = external deposit into master wallet; ALLOCATION = internal transfer master→portfolio */
export type DepositTarget = "MASTER" | "ALLOCATION";

export type DepositInclude =
  | "user"
  | "portfolioWallet"
  | "masterWallet"
  | "userPortfolio"
  | "createdBy"
  | "approvedBy"
  | "rejectedBy";

function toIncludeParam(include?: DepositInclude | DepositInclude[]) {
  if (!include) return undefined;
  const list = Array.isArray(include) ? include : [include];
  return list.join(",") || undefined;
}

export interface Deposit {
  id:                string;
  userId:            string;
  userPortfolioId:   string;       // replaces walletId
  portfolioWalletId: string;
  masterWalletId:    string;
  depositTarget:     DepositTarget;
  amount:            number;
  transactionId?:    string | null;
  transactionStatus: TransactionStatus;
  mobileNo?:         string | null;
  referenceNo?:      string | null;
  accountNo?:        string | null;  // camelCase (was AccountNo)
  method?:           string | null;
  description?:      string | null;
  proofUrl?:         string | null;
  proofFileName?:    string | null;

  // One-time fees on first MASTER deposit
  bankCost?:        number;
  transactionCost?: number;
  cashAtBank?:      number;
  totalFees?:       number;
  isFirstDeposit?:  boolean;

  // Staff who created the deposit request
  createdById?:      string | null;
  createdByName?:    string | null;
  createdByRole?:    string | null;

  // Audit fields
  approvedById?:     string | null;
  approvedByName?:   string | null;
  approvedAt?:       string | null;
  rejectedById?:     string | null;
  rejectedByName?:   string | null;
  rejectedAt?:       string | null;
  rejectReason?:     string | null;

  createdAt: string;
  updatedAt: string;

  // Populated when included
  user?: {
    id:         string;
    firstName?: string | null;
    lastName?:  string | null;
    email?:     string | null;
  } | null;
  portfolioWallet?: {
    id:             string;
    accountNumber?: string | null;
    netAssetValue?: number | null;
    balance?:       number | null;
  } | null;
  masterWallet?: {
    id:             string;
    accountNumber?: string | null;
    netAssetValue?: number | null;
    balance?:       number | null;
  } | null;
  userPortfolio?: {
    id:          string;
    customName?: string | null;
    portfolioId: string;
  } | null;
}

export interface DepositCreateInput {
  userId:           string;
  /** Required only for ALLOCATION deposits (master → portfolio transfer) */
  userPortfolioId?: string;
  amount:           number;
  /** MASTER = external deposit into master wallet; ALLOCATION = internal master→portfolio transfer. Defaults to MASTER. */
  depositTarget?:   DepositTarget;
  transactionId?:   string | null;
  mobileNo?:        string | null;
  referenceNo?:     string | null;
  accountNo?:       string | null;
  method?:          string | null;
  description?:     string | null;
  proofUrl?:        string | null;
  proofFileName?:   string | null;
  // One-time fees — only on first MASTER deposit
  bankCost?:        number;
  transactionCost?: number;
  cashAtBank?:      number;
}

export interface DepositUpdateInput {
  amount?:        number;
  transactionId?: string | null;
  mobileNo?:      string | null;
  referenceNo?:   string | null;
  accountNo?:     string | null;
  method?:        string | null;
  description?:   string | null;
  // NOTE: transactionStatus is NOT settable here — use approve/reverse
}

export interface ListDepositsParams {
  q?:              string;
  userId?:         string;
  userPortfolioId?: string;
  status?:         TransactionStatus | string;
  page?:           number;
  pageSize?:       number;
  sortBy?:         "createdAt" | "amount" | "transactionStatus" | "approvedAt" | "rejectedAt";
  order?:          "asc" | "desc";
  include?:        DepositInclude | DepositInclude[];
}

/* -------------------------------------------------------------------------- */
/*  Actions                                                                     */
/* -------------------------------------------------------------------------- */

/** GET /deposits */
export async function listDeposits(params?: ListDepositsParams) {
  try {
    const headers = await authHeaderFromCookies();
    const { include, ...rest } = params ?? {};
    const res = await api.get("/deposits", {
      headers,
      params: { ...rest, include: toIncludeParam(include) },
    });
    return {
      success: true,
      data:    (res.data?.data ?? []) as Deposit[],
      meta:    res.data?.meta,
    };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load deposits") };
  }
}

/** GET /deposits/:id */
export async function getDeposit(
  id:    string,
  opts?: { include?: DepositInclude | DepositInclude[] }
) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/deposits/${id}`, {
      headers,
      params: { include: toIncludeParam(opts?.include) },
    });
    return { success: true, data: res.data?.data as Deposit };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch deposit") };
  }
}

/** Convenience wrappers */
export async function getUserDeposits(
  userId: string,
  params?: Omit<ListDepositsParams, "userId">
) {
  return listDeposits({ ...params, userId });
}

export async function getPortfolioDeposits(
  userPortfolioId: string,
  params?: Omit<ListDepositsParams, "userPortfolioId">
) {
  return listDeposits({ ...params, userPortfolioId });
}

/**
 * POST /deposits — external deposit landing on master wallet (MASTER target).
 * Always starts as PENDING; staff approves to credit master wallet balance.
 */
export async function createDeposit(
  input: DepositCreateInput,
  opts?: { include?: DepositInclude | DepositInclude[] }
) {
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Amount must be a positive number." };
  }
  const target = input.depositTarget ?? "MASTER";
  if (target === "ALLOCATION" && !input.userPortfolioId) {
    return { success: false, error: "userPortfolioId is required for ALLOCATION deposits." };
  }
  try {
    const headers = await authHeaderFromCookies();
    const payload: DepositCreateInput = {
      userId:          input.userId,
      ...(input.userPortfolioId ? { userPortfolioId: input.userPortfolioId } : {}),
      amount,
      depositTarget:   target,
      transactionId:   input.transactionId   ?? null,
      mobileNo:        input.mobileNo        ?? null,
      referenceNo:     input.referenceNo     ?? null,
      accountNo:       input.accountNo       ?? null,
      method:          input.method          ?? null,
      description:     input.description     ?? null,
      proofUrl:        input.proofUrl        ?? null,
      proofFileName:   input.proofFileName   ?? null,
      ...(input.bankCost        !== undefined ? { bankCost:        input.bankCost }        : {}),
      ...(input.transactionCost !== undefined ? { transactionCost: input.transactionCost } : {}),
      ...(input.cashAtBank      !== undefined ? { cashAtBank:      input.cashAtBank }      : {}),
    };
    const res = await api.post("/deposits", payload, {
      headers,
      params: { include: toIncludeParam(opts?.include) },
    });
    return { success: true, data: res.data?.data as Deposit };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to create deposit") };
  }
}

/**
 * POST /deposits — internal allocation from master wallet → portfolio wallet.
 * Convenience wrapper around createDeposit with depositTarget: "ALLOCATION".
 * Approval deducts master wallet balance and triggers top-up / SubPortfolio logic.
 */
export async function createAllocation(
  input: Omit<DepositCreateInput, "depositTarget"> & { userPortfolioId: string },
  opts?: { include?: DepositInclude | DepositInclude[] }
) {
  return createDeposit({ ...input, depositTarget: "ALLOCATION" }, opts);
}

/** PATCH /deposits/:id — only while PENDING */
export async function updateDeposit(
  id:    string,
  input: DepositUpdateInput,
  opts?: { include?: DepositInclude | DepositInclude[] }
) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const payload: DepositUpdateInput = {
      ...(input.amount        !== undefined ? { amount: Number(input.amount) } : {}),
      ...(input.transactionId !== undefined ? { transactionId: input.transactionId } : {}),
      ...(input.mobileNo      !== undefined ? { mobileNo:      input.mobileNo }      : {}),
      ...(input.referenceNo   !== undefined ? { referenceNo:   input.referenceNo }   : {}),
      ...(input.accountNo     !== undefined ? { accountNo:     input.accountNo }     : {}),
      ...(input.method        !== undefined ? { method:        input.method }        : {}),
      ...(input.description   !== undefined ? { description:   input.description }   : {}),
    };
    const res = await api.patch(`/deposits/${id}`, payload, {
      headers,
      params: { include: toIncludeParam(opts?.include) },
    });
    return { success: true, data: res.data?.data as Deposit };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to update deposit") };
  }
}

/**
 * POST /deposits/:id/approve
 * Triggers: SubPortfolio creation (top-up), UserPortfolioAsset recompute,
 * PortfolioWallet + MasterWallet sync, TopupEvent creation.
 */
export async function approveDeposit(
  id:       string,
  approver: { approvedById?: string; approvedByName?: string },
  /** For ALLOCATION (top-up) deposits: map of assetId → { costPerShare, closePrice } at approval time */
  assetPrices?: Record<string, { costPerShare: number; closePrice: number }>,
  opts?:    { include?: DepositInclude | DepositInclude[] }
) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post(
      `/deposits/${id}/approve`,
      {
        approvedById:   approver.approvedById   ?? null,
        approvedByName: approver.approvedByName ?? null,
        assetPrices:    assetPrices ?? null,
      },
      { headers, params: { include: toIncludeParam(opts?.include) } }
    );
    return { success: true, data: res.data?.data as Deposit };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to approve deposit") };
  }
}

/**
 * POST /deposits/:id/reverse
 * Undoes an approved deposit:
 *   MASTER     → decrements masterWallet.balance + totalDeposited
 *   ALLOCATION → refunds masterWallet.balance, decrements portfolioWallet
 */
export async function reverseDeposit(
  id:       string,
  rejector: { rejectedById?: string; rejectedByName?: string; reason?: string },
  opts?:    { include?: DepositInclude | DepositInclude[] }
) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post(
      `/deposits/${id}/reverse`,
      {
        rejectedById:   rejector.rejectedById   ?? null,
        rejectedByName: rejector.rejectedByName ?? null,
        rejectReason:   rejector.reason         ?? null,
      },
      { headers, params: { include: toIncludeParam(opts?.include) } }
    );
    return { success: true, data: res.data?.data as Deposit };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to reverse deposit") };
  }
}

/** POST /deposits/:id/reject — rejects a PENDING deposit, no wallet changes */
export async function rejectDeposit(
  id:    string,
  args?: { reason?: string; rejectedById?: string; rejectedByName?: string },
  opts?: { include?: DepositInclude | DepositInclude[] }
) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post(
      `/deposits/${id}/reject`,
      {
        rejectReason:   args?.reason          ?? null,
        rejectedById:   args?.rejectedById    ?? null,
        rejectedByName: args?.rejectedByName  ?? null,
      },
      { headers, params: { include: toIncludeParam(opts?.include) } }
    );
    return { success: true, data: res.data?.data as Deposit };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to reject deposit") };
  }
}

/** DELETE /deposits/:id — only while PENDING */
export async function deleteDeposit(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.delete(`/deposits/${id}`, { headers });
    return { success: true, data: res.data?.data as Deposit };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to delete deposit") };
  }
}

export interface DepositFeeSummary {
  totalBankCost: number;
  totalTransactionCost: number;
  totalCashAtBank: number;
  totalFees: number;
  depositCount: number;
}

/** GET /deposits/summary/:userId — get fee summary for all approved deposits */
export async function getDepositFeeSummary(userId: string) {
  if (!userId) return { success: false, error: "Missing userId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/deposits/summary/${userId}`, { headers });
    return { success: true, data: res.data?.data as DepositFeeSummary };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to get deposit fee summary") };
  }
}