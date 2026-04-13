

// // app/(app)/actions/withdrawals.ts
// "use server";

// import axios from "axios";
// import { cookies } from "next/headers";

// /* ------------------------------- axios client ------------------------------- */

// const BASE_API_URL =
//   process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

// const api = axios.create({
//   baseURL: BASE_API_URL,
//   timeout: 60000,
//   headers: { "Content-Type": "application/json" },
// });

// /* --------------------------------- helpers --------------------------------- */

// function msg(e: any, fallback = "Request failed") {
//   return e?.response?.data?.error || e?.message || fallback;
// }

// async function authHeaderFromCookies() {
//   const jar = await cookies();
//   const token = jar.get("accessToken")?.value;
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

// export type WithdrawalInclude = "user" | "wallet";
// function toIncludeParam(include?: WithdrawalInclude | WithdrawalInclude[]) {
//   if (!include) return undefined;
//   const list = Array.isArray(include) ? include : [include];
//   const valid = list
//     .map((s) => String(s).trim().toLowerCase())
//     .filter((s) => s === "user" || s === "wallet");
//   return valid.length ? valid.join(",") : undefined;
// }

// /* ---------------------------------- types ---------------------------------- */

// export type TxStatus = "PENDING" | "APPROVED" | "REJECTED";

// export interface Withdrawal {
//   id: string;
//   walletId: string;
//   amount: number;
//   userId: string;
//   transactionStatus: TxStatus;

//   AccountNo?: string | null;
//   AccountName?: string | null;
//   referenceNo: string;
//   transactionId?: string | null;
//   method?: string | null;

//   bankName: string;
//   bankAccountName: string;
//   bankBranch: string;
//   description?: string | null;

//   // ✅ audit fields (align with Prisma model)
//   approvedById?: string | null;
//   approvedByName?: string | null;
//   approvedAt?: string | null;     // ISO strings are easiest in the client
//   rejectedById?: string | null;
//   rejectedByName?: string | null;
//   rejectedAt?: string | null;
//   rejectReason?: string | null;

//   createdAt: string; // ISO
//   updatedAt: string; // ISO

//   // when ?include=user,wallet
//   user?: {
//     id: string;
//     email?: string | null;
//     name?: string | null;
//     firstName?: string | null;
//     lastName?: string | null;
//   };
//   wallet?: {
//     id: string;
//     netAssetValue?: number | null;
//   };
// }

// export interface WithdrawalCreateInput {
//   walletId: string;
//   userId: string;
//   amount: number;
//   referenceNo: string;
//   method?: string | null;
//   AccountNo?: string | null;
//   AccountName?: string | null;
//   bankName: string;
//   bankAccountName: string;
//   bankBranch: string;
//   description?: string | null;
//   transactionId?: string | null; // optional until approval if you set it later
// }

// export interface WithdrawalUpdateInput {
//   amount?: number;
//   transactionId?: string | null;
//   method?: string | null;
//   AccountNo?: string | null;
//   AccountName?: string | null;
//   bankName?: string;
//   bankAccountName?: string;
//   bankBranch?: string;
//   description?: string | null;
//   // status is not settable here; use approve/reject actions
// }

// /* ------------------------------- server actions ---------------------------- */

// /** GET /withdrawals (supports q, paging, sorting, filters, include) */
// export async function listWithdrawals(params?: {
//   q?: string;
//   userId?: string;
//   walletId?: string;
//   status?: TxStatus;
//   page?: number;
//   pageSize?: number;
//   sortBy?:
//     | "createdAt"
//     | "amount"
//     | "transactionStatus"
//     | "updatedAt"
//     | "approvedAt"
//     | "rejectedAt";
//   order?: "asc" | "desc";
//   include?: WithdrawalInclude | WithdrawalInclude[];
// }) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const include = toIncludeParam(params?.include);
//     const res = await api.get("/withdrawals", {
//       headers,
//       params: { ...params, include },
//     });

//     return {
//       success: true,
//       data: (res.data?.data ?? []) as Withdrawal[],
//       meta: res.data?.meta ?? null,
//     };
//   } catch (e: any) {
//     return { success: false, error: msg(e, "Failed to load withdrawals") };
//   }
// }

// /** GET /withdrawals/:id (supports include=user,wallet) */
// export async function getWithdrawal(
//   id: string,
//   opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }
// ) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const include = toIncludeParam(opts?.include);
//     const res = await api.get(`/withdrawals/${id}`, {
//       headers,
//       params: { include },
//     });
//     return { success: true, data: res.data?.data as Withdrawal };
//   } catch (e: any) {
//     return { success: false, error: msg(e, "Failed to fetch withdrawal") };
//   }
// }

// /** POST /withdrawals (starts as PENDING on the API) */
// export async function createWithdrawal(
//   input: WithdrawalCreateInput,
//   opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }
// ) {
//   try {
//     const headers = await authHeaderFromCookies();

//     const amount = Number(input.amount);
//     if (!Number.isFinite(amount) || amount <= 0) {
//       return { success: false, error: "Amount must be a positive number" };
//     }

//     const payload: WithdrawalCreateInput = {
//       walletId: input.walletId,
//       userId: input.userId,
//       amount,
//       referenceNo: input.referenceNo.trim(),
//       method: input.method ?? null,
//       AccountNo: input.AccountNo ?? null,
//       AccountName: input.AccountName ?? null,
//       bankName: input.bankName.trim(),
//       bankAccountName: input.bankAccountName.trim(),
//       bankBranch: input.bankBranch.trim(),
//       description: input.description ?? null,
//       transactionId: input.transactionId ?? null,
//     };

//     const include = toIncludeParam(opts?.include);
//     const res = await api.post("/withdrawals", payload, {
//       headers,
//       params: { include },
//     });
//     return { success: true, data: res.data?.data as Withdrawal };
//   } catch (e: any) {
//     return { success: false, error: msg(e, "Failed to create withdrawal") };
//   }
// }

// /** PATCH /withdrawals/:id (only while PENDING) */
// export async function updateWithdrawal(
//   id: string,
//   input: WithdrawalUpdateInput,
//   opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }
// ) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const payload: WithdrawalUpdateInput = {
//       ...(input.amount !== undefined ? { amount: Number(input.amount) } : {}),
//       ...(input.transactionId !== undefined
//         ? { transactionId: input.transactionId }
//         : {}),
//       ...(input.method !== undefined ? { method: input.method } : {}),
//       ...(input.AccountNo !== undefined ? { AccountNo: input.AccountNo } : {}),
//       ...(input.AccountName !== undefined
//         ? { AccountName: input.AccountName }
//         : {}),
//       ...(input.bankName !== undefined ? { bankName: input.bankName } : {}),
//       ...(input.bankAccountName !== undefined
//         ? { bankAccountName: input.bankAccountName }
//         : {}),
//       ...(input.bankBranch !== undefined ? { bankBranch: input.bankBranch } : {}),
//       ...(input.description !== undefined
//         ? { description: input.description }
//         : {}),
//     };

//     const include = toIncludeParam(opts?.include);
//     const res = await api.patch(`/withdrawals/${id}`, payload, {
//       headers,
//       params: { include },
//     });
//     return { success: true, data: res.data?.data as Withdrawal };
//   } catch (e: any) {
//     return { success: false, error: msg(e, "Failed to update withdrawal") };
//   }
// }

// /** DELETE /withdrawals/:id (only while PENDING) */
// export async function deleteWithdrawal(id: string) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const res = await api.delete(`/withdrawals/${id}`, { headers });
//     return { success: true, data: res.data?.data as Withdrawal | null };
//   } catch (e: any) {
//     return { success: false, error: msg(e, "Failed to delete withdrawal") };
//   }
// }

// /** POST /withdrawals/:id/approve  (deducts wallet, marks APPROVED, records approver) */
// export async function approveWithdrawal(
//   id: string,
//   transactionId: string,
//   approver?: { approvedById?: string; approvedByName?: string /* transactionId?: string | null */ },
//   opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }
// ) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const include = toIncludeParam(opts?.include);

//        const txId = (transactionId ?? "").trim();
//     if (!txId) {
//       return { success: false, error: "transactionId is required to approve this withdrawal" };
//     }

//     const body = {
//       transactionId: txId, // REQUIRED at approval time
//       approvedById: approver?.approvedById ?? null,
//       approvedByName: approver?.approvedByName ?? null,
//       // If your API also accepts setting transactionId at approval time, uncomment:
//       // transactionId: approver?.transactionId ?? null,
//     };

//     const res = await api.post(`/withdrawals/${id}/approve`, body, {
//       headers,
//       params: { include },
//     });
//     return { success: true, data: res.data?.data as Withdrawal };
//   } catch (e: any) {
//     return { success: false, error: msg(e, "Failed to approve withdrawal") };
//   }
// }

// /** POST /withdrawals/:id/reject (marks REJECTED, records rejector & reason; no wallet change) */
// export async function rejectWithdrawal(
//   id: string,
//   args?: { reason?: string; rejectedById?: string; rejectedByName?: string },
//   opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }
// ) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const include = toIncludeParam(opts?.include);

    

//     const body = {
//       reason: args?.reason ?? null,
//       rejectedById: args?.rejectedById ?? null,
//       rejectedByName: args?.rejectedByName ?? null,
//     };

//     const res = await api.post(`/withdrawals/${id}/reject`, body, {
//       headers,
//       params: { include },
//     });
//     return { success: true, data: res.data?.data as Withdrawal };
//   } catch (e: any) {
//     return { success: false, error: msg(e, "Failed to reject withdrawal") };
//   }
// }





// app/(app)/actions/withdrawals.ts
"use server";

import axios from "axios";
import { cookies } from "next/headers";

/* -------------------------------------------------------------------------- */
/*  Axios client                                                                */
/* -------------------------------------------------------------------------- */

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function msg(e: any, fallback = "Request failed") {
  return e?.response?.data?.error || e?.message || fallback;
}

async function authHeaderFromCookies() {
  const jar = await cookies();
  const token = jar.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type WithdrawalInclude =
  | "user"
  | "portfolioWallet"
  | "masterWallet"
  | "userPortfolio"
  | "createdBy"
  | "approvedBy"
  | "rejectedBy"
  | "wallet";

function toIncludeParam(include?: WithdrawalInclude | WithdrawalInclude[]) {
  if (!include) return undefined;
  const list = Array.isArray(include) ? include : [include];
  return list.map((s) => String(s).trim().toLowerCase()).join(",") || undefined;
}

/* -------------------------------------------------------------------------- */
/*  Types                                                                       */
/* -------------------------------------------------------------------------- */

export type TxStatus = "PENDING" | "APPROVED" | "REJECTED";
/** HARD_WITHDRAWAL = cash out master wallet → client bank; REDEMPTION = portfolio → master wallet */
export type WithdrawalType = "HARD_WITHDRAWAL" | "REDEMPTION";

export interface Withdrawal {
  id:                string;
  userId:            string;
  /** Only populated for REDEMPTION withdrawals */
  userPortfolioId?:  string | null;
  portfolioWalletId?: string | null;
  masterWalletId:    string;
  /** @deprecated use masterWalletId */
  walletId?:         string;
  /** @deprecated use masterWallet */
  wallet?:           { netAssetValue?: number | null } | null;
  withdrawalType:    WithdrawalType;
  amount:            number;
  transactionStatus: TxStatus;

  // renamed from AccountNo/AccountName (camelCase in new schema)
  accountNo?:        string | null;
  accountName?:      string | null;
  referenceNo?:      string | null;
  transactionId?:    string | null;
  method?:           string | null;

  /** Only applicable for HARD_WITHDRAWAL */
  bankName?:         string | null;
  bankAccountName?:  string | null;
  bankBranch?:       string | null;
  description?:      string | null;

  // Staff who created the withdrawal request
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
    email?:     string | null;
    firstName?: string | null;
    lastName?:  string | null;
    name?:      string | null;
  };
  portfolioWallet?: {
    id:             string;
    accountNumber?: string | null;
    netAssetValue?: number | null;
    balance?:       number | null;
  };
  masterWallet?: {
    id:             string;
    accountNumber?: string | null;
    netAssetValue?: number | null;
    balance?:       number | null;
  };
  userPortfolio?: {
    id:          string;
    customName?: string | null;
    portfolioId: string;
  };
}

export interface WithdrawalCreateInput {
  userId:           string;
  withdrawalType:   WithdrawalType;
  amount:           number;
  /** Required for REDEMPTION — identifies which portfolio to deduct from */
  userPortfolioId?: string | null;
  referenceNo?:     string | null;
  method?:          string | null;
  accountNo?:       string | null;
  accountName?:     string | null;
  /** Required for HARD_WITHDRAWAL */
  bankName?:        string | null;
  bankAccountName?: string | null;
  bankBranch?:      string | null;
  description?:     string | null;
  transactionId?:   string | null;
}

export interface WithdrawalUpdateInput {
  amount?:         number;
  transactionId?:  string | null;
  method?:         string | null;
  accountNo?:      string | null;
  accountName?:    string | null;
  bankName?:       string | null;
  bankAccountName?: string | null;
  bankBranch?:     string | null;
  description?:    string | null;
}

/* -------------------------------------------------------------------------- */
/*  GET /withdrawals                                                            */
/* -------------------------------------------------------------------------- */
export async function listWithdrawals(params?: {
  q?:          string;
  userId?:     string;
  userPortfolioId?: string;
  status?:     TxStatus;
  page?:       number;
  pageSize?:   number;
  sortBy?:
    | "createdAt"
    | "amount"
    | "transactionStatus"
    | "updatedAt"
    | "approvedAt"
    | "rejectedAt";
  order?:      "asc" | "desc";
  include?:    WithdrawalInclude | WithdrawalInclude[];
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
      data:    (res.data?.data ?? []) as Withdrawal[],
      meta:    res.data?.meta ?? null,
    };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load withdrawals") };
  }
}

/* -------------------------------------------------------------------------- */
/*  GET /withdrawals/:id                                                        */
/* -------------------------------------------------------------------------- */
export async function getWithdrawal(
  id:    string,
  opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }
) {
  try {
    const headers = await authHeaderFromCookies();
    const include = toIncludeParam(opts?.include);
    const res = await api.get(`/withdrawals/${id}`, {
      headers,
      params: { include },
    });
    return { success: true, data: res.data?.data as Withdrawal };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch withdrawal") };
  }
}

/* -------------------------------------------------------------------------- */
/*  POST /withdrawals                                                           */
/* -------------------------------------------------------------------------- */
export async function createWithdrawal(
  input: WithdrawalCreateInput,
  opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }
) {
  try {
    const headers = await authHeaderFromCookies();

    const amount = Number(input.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return { success: false, error: "Amount must be a positive number" };
    }
    if (input.withdrawalType === "HARD_WITHDRAWAL") {
      if (!input.bankName?.trim())        return { success: false, error: "bankName is required for HARD_WITHDRAWAL" };
      if (!input.bankAccountName?.trim()) return { success: false, error: "bankAccountName is required for HARD_WITHDRAWAL" };
      if (!input.bankBranch?.trim())      return { success: false, error: "bankBranch is required for HARD_WITHDRAWAL" };
    }
    if (input.withdrawalType === "REDEMPTION" && !input.userPortfolioId) {
      return { success: false, error: "userPortfolioId is required for REDEMPTION" };
    }

    const payload: WithdrawalCreateInput = {
      userId:           input.userId,
      withdrawalType:   input.withdrawalType,
      amount,
      ...(input.userPortfolioId ? { userPortfolioId: input.userPortfolioId } : {}),
      referenceNo:      input.referenceNo     ?? null,
      method:           input.method          ?? null,
      accountNo:        input.accountNo       ?? null,
      accountName:      input.accountName     ?? null,
      bankName:         input.bankName        ?? null,
      bankAccountName:  input.bankAccountName ?? null,
      bankBranch:       input.bankBranch      ?? null,
      description:      input.description     ?? null,
      transactionId:    input.transactionId   ?? null,
    };

    const include = toIncludeParam(opts?.include);
    const res = await api.post("/withdrawals", payload, {
      headers,
      params: { include },
    });
    return { success: true, data: res.data?.data as Withdrawal };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to create withdrawal") };
  }
}

/* -------------------------------------------------------------------------- */
/*  PATCH /withdrawals/:id  (only while PENDING)                               */
/* -------------------------------------------------------------------------- */
export async function updateWithdrawal(
  id:    string,
  input: WithdrawalUpdateInput,
  opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }
) {
  try {
    const headers = await authHeaderFromCookies();

    const payload: WithdrawalUpdateInput = {
      ...(input.amount          !== undefined ? { amount:          Number(input.amount) } : {}),
      ...(input.transactionId   !== undefined ? { transactionId:   input.transactionId  } : {}),
      ...(input.method          !== undefined ? { method:          input.method          } : {}),
      ...(input.accountNo       !== undefined ? { accountNo:       input.accountNo       } : {}),
      ...(input.accountName     !== undefined ? { accountName:     input.accountName     } : {}),
      ...(input.bankName        !== undefined ? { bankName:        input.bankName        } : {}),
      ...(input.bankAccountName !== undefined ? { bankAccountName: input.bankAccountName } : {}),
      ...(input.bankBranch      !== undefined ? { bankBranch:      input.bankBranch      } : {}),
      ...(input.description     !== undefined ? { description:     input.description     } : {}),
    };

    const include = toIncludeParam(opts?.include);
    const res = await api.patch(`/withdrawals/${id}`, payload, {
      headers,
      params: { include },
    });
    return { success: true, data: res.data?.data as Withdrawal };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to update withdrawal") };
  }
}

/* -------------------------------------------------------------------------- */
/*  DELETE /withdrawals/:id  (only while PENDING)                              */
/* -------------------------------------------------------------------------- */
export async function deleteWithdrawal(id: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.delete(`/withdrawals/${id}`, { headers });
    return { success: true, data: res.data?.data as Withdrawal | null };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to delete withdrawal") };
  }
}

/* -------------------------------------------------------------------------- */
/*  POST /withdrawals/:id/approve                                               */
/*  HARD_WITHDRAWAL: deducts masterWallet.balance, records bank transaction    */
/*  REDEMPTION:      deducts portfolioWallet, credits masterWallet.balance     */
/* -------------------------------------------------------------------------- */
export async function approveWithdrawal(
  id:            string,
  /** Required for HARD_WITHDRAWAL; pass empty string or omit for REDEMPTION */
  transactionId: string,
  approver?:     { approvedById?: string; approvedByName?: string; withdrawalType?: WithdrawalType; assetPrices?: Record<string, number> },
  opts?:         { include?: WithdrawalInclude | WithdrawalInclude[] }
) {
  try {
    const headers = await authHeaderFromCookies();

    const isRedemption = approver?.withdrawalType === "REDEMPTION";
    const txId = (transactionId ?? "").trim();
    if (!isRedemption && !txId) {
      return { success: false, error: "transactionId is required to approve a HARD_WITHDRAWAL" };
    }

    const body = {
      ...(txId ? { transactionId: txId } : {}),
      approvedById:   approver?.approvedById  ?? null,
      approvedByName: approver?.approvedByName ?? null,
      ...(isRedemption && approver?.assetPrices ? { assetPrices: approver.assetPrices } : {}),
    };

    const include = toIncludeParam(opts?.include);
    const res = await api.post(`/withdrawals/${id}/approve`, body, {
      headers,
      params: { include },
    });
    return { success: true, data: res.data?.data as Withdrawal };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to approve withdrawal") };
  }
}

/* -------------------------------------------------------------------------- */
/*  Convenience wrappers                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Create a HARD_WITHDRAWAL — cash out from master wallet to client bank account.
 * Requires bank details (bankName, bankAccountName, bankBranch).
 */
export async function createHardWithdrawal(
  input: Omit<WithdrawalCreateInput, "withdrawalType"> & {
    bankName: string;
    bankAccountName: string;
    bankBranch: string;
  },
  opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }
) {
  return createWithdrawal({ ...input, withdrawalType: "HARD_WITHDRAWAL" }, opts);
}

/**
 * Create a REDEMPTION — internal transfer from portfolio wallet back to master wallet.
 * Requires userPortfolioId. No bank details needed.
 */
export async function createRedemption(
  input: Omit<WithdrawalCreateInput, "withdrawalType"> & { userPortfolioId: string },
  opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }
) {
  const referenceNo = input.referenceNo?.trim() || `RDM-${Date.now()}`;
  return createWithdrawal({ ...input, referenceNo, withdrawalType: "REDEMPTION" }, opts);
}

/* -------------------------------------------------------------------------- */
/*  POST /withdrawals/:id/reject                                                */
/* -------------------------------------------------------------------------- */
export async function rejectWithdrawal(
  id:    string,
  args?: { reason?: string; rejectedById?: string; rejectedByName?: string },
  opts?: { include?: WithdrawalInclude | WithdrawalInclude[] }
) {
  try {
    const headers = await authHeaderFromCookies();

    const body = {
      reason:          args?.reason          ?? null,
      rejectedById:    args?.rejectedById    ?? null,
      rejectedByName:  args?.rejectedByName  ?? null,
    };

    const include = toIncludeParam(opts?.include);
    const res = await api.post(`/withdrawals/${id}/reject`, body, {
      headers,
      params: { include },
    });
    return { success: true, data: res.data?.data as Withdrawal };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to reject withdrawal") };
  }
}