

// // actions/portfolio-performance-reports.ts
// "use server";

// import axios from "axios";
// import { cookies } from "next/headers";

// const BASE_API_URL =
//   process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

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

// /* -------------------------------------------------------------------------- */
// /*                                    TYPES                                   */
// /* -------------------------------------------------------------------------- */

// export type AssetClass =
//   | "EQUITIES"
//   | "ETFS"
//   | "REITS"
//   | "BONDS"
//   | "CASH"
//   | "OTHERS";

// export interface PortfolioAssetBreakdown {
//   id?: string;
//   reportId?: string;
//   assetClass: AssetClass;
//   holdings: number;
//   totalCashValue: number;
//   percentage: number;
//   createdAt?: string;
// }

// // Asset type - UPDATED SCHEMA
// export interface Asset {
//   id: string;
//   symbol: string;
//   description: string;
//   sector: string;
//   assetClass: string;
//   defaultAllocationPercentage: number;  // ✅ UPDATED: Field name
//   defaultCostPerShare: number;          // ✅ UPDATED: Field name
//   closePrice: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

// // ✅ UPDATED: User Portfolio Asset - Direct relation to Asset
// export interface UserPortfolioAsset {
//   id: string;
//   userPortfolioId: string;
//   assetId: string;                      // ✅ Direct relation
//   allocationPercentage: number;         // ✅ User-specific
//   costPerShare: number;                 // ✅ User-specific
//   costPrice: number;
//   stock: number;
//   closeValue: number;
//   lossGain: number;
//   asset?: Asset;                        // ✅ Direct asset relation
// }

// // Portfolio type
// export interface Portfolio {
//   id: string;
//   name: string;
//   description?: string | null;
//   timeHorizon?: string;
//   riskTolerance?: string;
//   allocationPercentage?: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

// // User type
// export interface User {
//   id: string;
//   name?: string | null;
//   firstName?: string | null;
//   lastName?: string | null;
//   email?: string | null;
// }

// // User Portfolio type with full relations - UPDATED
// export interface UserPortfolio {
//   id: string;
//   userId: string;
//   portfolioId: string;
//   portfolioValue: number;
//   createdAt?: string;
//   updatedAt?: string;
//   portfolio?: Portfolio | null;
//   user?: User | null;
//   userAssets?: UserPortfolioAsset[];  // ✅ UPDATED: Direct user assets
// }

// // Main Portfolio Performance Report type
// export interface PortfolioPerformanceReport {
//   id: string;
//   userPortfolioId: string;
//   reportDate: string; // ISO
//   totalCostPrice: number;
//   totalCloseValue: number;
//   totalLossGain: number;
//   totalPercentage: number;
//   createdAt?: string;
//   updatedAt?: string;
//   assetBreakdown?: PortfolioAssetBreakdown[];
//   userPortfolio?: UserPortfolio | null;
// }

// export interface ListPerformanceReportsParams {
//   userPortfolioId: string;
//   period?: "daily" | "weekly" | "monthly";
//   startDate?: string; // ISO
//   endDate?: string;   // ISO
// }

// export interface GeneratePerformanceReportInput {
//   userPortfolioId: string;
//   reportDate?: string; // optional ISO date (defaults to today)
// }

// export interface PerformanceStats {
//   period: "daily" | "weekly" | "monthly";
//   reportCount: number;
//   currentValue: number;
//   startValue: number;
//   totalGrowth: number;
//   growthPercentage: number;
//   avgDailyGain: number;
//   bestDay: {
//     date: string;
//     gain: number;
//     percentage: number;
//   };
//   worstDay: {
//     date: string;
//     loss: number;
//     percentage: number;
//   };
// }

// export interface GenerateAllReportsResult {
//   success: number;
//   failed: number;
//   total: number;
//   errors: string[];
// }

// export interface CleanupResult {
//   deletedCount: number;
// }

// /* -------------------------------------------------------------------------- */
// /*                              SERVER ACTIONS                                */
// /* -------------------------------------------------------------------------- */

// /**
//  * GET /portfolio-performance-reports
//  * Query reports by userPortfolioId, period, date range
//  */
// export async function listPerformanceReports(
//   params: ListPerformanceReportsParams
// ) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const res = await api.get("/portfolio-performance-reports", {
//       headers,
//       params,
//     });

//     return {
//       success: true,
//       data: (res.data?.data ?? []) as PortfolioPerformanceReport[],
//       meta: res.data?.meta,
//     };
//   } catch (e: any) {
//     console.error("listPerformanceReports error:", e.response?.data || e.message);
//     return {
//       success: false,
//       error: msg(e, "Failed to load performance reports"),
//     };
//   }
// }

// /**
//  * GET /portfolio-performance-reports/:id
//  * Get a single report by ID
//  */
// export async function getPerformanceReportById(id: string) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const res = await api.get(`/portfolio-performance-reports/${id}`, {
//       headers,
//     });

//     return {
//       success: true,
//       data: res.data?.data as PortfolioPerformanceReport,
//     };
//   } catch (e: any) {
//     console.error("getPerformanceReportById error:", e.response?.data || e.message);
//     return {
//       success: false,
//       error: msg(e, "Failed to fetch performance report"),
//     };
//   }
// }

// /**
//  * GET /portfolio-performance-reports/latest/:userPortfolioId
//  * Get the latest report for a specific userPortfolio
//  */
// export async function getLatestPerformanceReport(userPortfolioId: string) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const res = await api.get(
//       `/portfolio-performance-reports/latest/${userPortfolioId}`,
//       { headers }
//     );

//     return {
//       success: true,
//       data: res.data?.data as PortfolioPerformanceReport,
//     };
//   } catch (e: any) {
//     console.error("getLatestPerformanceReport error:", e.response?.data || e.message);
//     return {
//       success: false,
//       error: msg(e, "Failed to fetch latest performance report"),
//     };
//   }
// }

// /**
//  * GET /portfolio-performance-reports/stats/:userPortfolioId?period=monthly
//  * Get aggregated statistics for a portfolio over a period
//  */
// export async function getPerformanceStatistics(
//   userPortfolioId: string,
//   period: "daily" | "weekly" | "monthly" = "monthly"
// ) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const res = await api.get(
//       `/portfolio-performance-reports/stats/${userPortfolioId}`,
//       {
//         headers,
//         params: { period },
//       }
//     );

//     return {
//       success: true,
//       data: res.data?.data as PerformanceStats,
//     };
//   } catch (e: any) {
//     console.error("getPerformanceStatistics error:", e.response?.data || e.message);
//     return {
//       success: false,
//       error: msg(e, "Failed to fetch performance statistics"),
//     };
//   }
// }

// /**
//  * POST /portfolio-performance-reports/generate
//  * Manually generate a report for a specific portfolio (for a given date or today)
//  */
// export async function generatePerformanceReport(
//   input: GeneratePerformanceReportInput
// ) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const payload: GeneratePerformanceReportInput = {
//       userPortfolioId: input.userPortfolioId,
//       ...(input.reportDate ? { reportDate: input.reportDate } : {}),
//     };

//     const res = await api.post(
//       "/portfolio-performance-reports/generate",
//       payload,
//       { headers }
//     );

//     return {
//       success: true,
//       data: res.data?.data as PortfolioPerformanceReport,
//     };
//   } catch (e: any) {
//     console.error("generatePerformanceReport error:", e.response?.data || e.message);
//     return {
//       success: false,
//       error: msg(e, "Failed to generate performance report"),
//     };
//   }
// }

// /**
//  * POST /portfolio-performance-reports/generate-all
//  * Trigger generation for all portfolios (same as cron job, but manual)
//  */
// export async function generateAllPerformanceReports() {
//   try {
//     const headers = await authHeaderFromCookies();
//     const res = await api.post(
//       "/portfolio-performance-reports/generate-all",
//       {},
//       { headers }
//     );

//     return {
//       success: true,
//       data: res.data?.data as GenerateAllReportsResult,
//       message: res.data?.message as string | undefined,
//     };
//   } catch (e: any) {
//     console.error("generateAllPerformanceReports error:", e.response?.data || e.message);
//     return {
//       success: false,
//       error: msg(e, "Failed to generate reports for all portfolios"),
//     };
//   }
// }

// /**
//  * DELETE /portfolio-performance-reports/cleanup
//  * Delete old reports (keep last N days, default 90)
//  */
// export async function cleanupPerformanceReports(daysToKeep?: number) {
//   try {
//     const headers = await authHeaderFromCookies();
//     const payload = daysToKeep ? { daysToKeep } : {};

//     const res = await api.delete("/portfolio-performance-reports/cleanup", {
//       headers,
//       data: payload,
//     });

//     return {
//       success: true,
//       data: res.data?.data as CleanupResult,
//       message: res.data?.message as string | undefined,
//     };
//   } catch (e: any) {
//     console.error("cleanupPerformanceReports error:", e.response?.data || e.message);
//     return {
//       success: false,
//       error: msg(e, "Failed to cleanup performance reports"),
//     };
//   }
// }

// /* -------------------------------------------------------------------------- */
// /*                        SMALL CONVENIENCE HELPERS                           */
// /* -------------------------------------------------------------------------- */

// /**
//  * Convenience: get last N daily reports for a portfolio
//  */
// export async function getRecentDailyReports(
//   userPortfolioId: string,
//   days = 7
// ) {
//   const end = new Date();
//   const start = new Date();
//   start.setDate(end.getDate() - days);

//   return listPerformanceReports({
//     userPortfolioId,
//     period: "daily",
//     startDate: start.toISOString(),
//     endDate: end.toISOString(),
//   });
// }



// actions/portfolio-performance-reports.ts
"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

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

export type AssetClass = "EQUITIES" | "ETFS" | "REITS" | "BONDS" | "CASH" | "OTHERS";

export interface PortfolioAssetBreakdown {
  id?:            string;
  reportId?:      string;
  assetClass:     AssetClass;
  holdings:       number;
  totalCashValue: number;
  percentage:     number;
  createdAt?:     string;
}

/** Snapshot of one slice's position within a sub-portfolio (X, X1, X2-source...) */
export interface SubPortfolioSnapshot {
  id?:             string;
  reportId?:       string;
  subPortfolioId:  string;
  generation:      number;
  label:           string;
  amountInvested:  number;
  totalCostPrice:  number;
  totalCloseValue: number;
  totalLossGain:   number;
  totalFees:       number;
  cashAtBank:      number;
}

export interface Asset {
  id:                  string;
  symbol:              string;
  description:         string;
  sector:              string;
  assetClass:          string;
  defaultCostPerShare: number;
  closePrice:          number;
  createdAt?:          string;
  updatedAt?:          string;
}

/** Live merged (X2) position */
export interface UserPortfolioAsset {
  id:                   string;
  userPortfolioId:      string;
  assetId:              string;
  allocationPercentage: number;
  costPerShare:         number; // weighted average
  costPrice:            number;
  stock:                number;
  closeValue:           number;
  lossGain:             number;
  asset?:               Asset;
}

export interface Portfolio {
  id:                   string;
  name:                 string;
  description?:         string | null;
  timeHorizon?:         string;
  riskTolerance?:       string;
  allocationPercentage?: number;
}

export interface User {
  id:         string;
  firstName?: string | null;
  lastName?:  string | null;
  email?:     string | null;
}

export interface UserPortfolio {
  id:             string;
  userId:         string;
  portfolioId:    string;
  customName:     string;
  portfolioValue: number;
  totalInvested:  number;
  totalLossGain:  number;
  isActive:       boolean;
  portfolio?:     Portfolio | null;
  user?:          User | null;
  userAssets?:    UserPortfolioAsset[];
  wallet?: {
    id:            string;
    netAssetValue: number;
    totalFees:     number;
    balance:       number;
  } | null;
}

/** Main report type — includes both asset breakdown and sub-portfolio snapshots */
export interface PortfolioPerformanceReport {
  id:              string;
  userPortfolioId: string;
  reportDate:      string; // ISO
  totalCostPrice:  number;
  totalCloseValue: number;
  totalLossGain:   number;
  totalPercentage: number;
  totalFees:       number;       // fees accumulated across all slices
  netAssetValue:   number;       // totalCloseValue - totalFees
  createdAt?:      string;
  updatedAt?:      string;
  assetBreakdown?:        PortfolioAssetBreakdown[];
  subPortfolioSnapshots?: SubPortfolioSnapshot[]; // X, X1, X2-source history
  userPortfolio?:         UserPortfolio | null;
}

export interface PerformanceStats {
  period:           "daily" | "weekly" | "monthly";
  reportCount:      number;
  currentValue:     number;
  currentNAV:       number;
  currentFees:      number;
  startValue:       number;
  totalGrowth:      number;
  growthPercentage: number;
  avgDailyGain:     number;
  bestDay:  { date: string; gain: number; percentage: number };
  worstDay: { date: string; loss: number; percentage: number };
}

export interface GenerateAllReportsResult {
  success: number;
  failed:  number;
  total:   number;
  errors:  string[];
}

export interface GenerateUserReportsResult {
  user:    { id: string; email: string };
  total:   number;
  success: number;
  skipped: number;
  failed:  number;
  errors?: string[];
}

export interface CleanupResult {
  deletedCount: number;
}

export interface ListPerformanceReportsParams {
  userPortfolioId: string;
  period?:         "daily" | "weekly" | "monthly";
  startDate?:      string; // ISO
  endDate?:        string; // ISO
}

export interface GeneratePerformanceReportInput {
  userPortfolioId: string;
  reportDate?:     string; // ISO — defaults to today
}

/* -------------------------------------------------------------------------- */
/*  Actions                                                                     */
/* -------------------------------------------------------------------------- */

/** GET /portfolio-performance-reports?userPortfolioId=...&period=... */
export async function listPerformanceReports(params: ListPerformanceReportsParams) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/portfolio-performance-reports", { headers, params });
    return {
      success: true,
      data:    (res.data?.data ?? []) as PortfolioPerformanceReport[],
      meta:    res.data?.meta,
    };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load performance reports") };
  }
}

/** GET /portfolio-performance-reports/:id */
export async function getPerformanceReportById(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/portfolio-performance-reports/${id}`, { headers });
    return { success: true, data: res.data?.data as PortfolioPerformanceReport };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch performance report") };
  }
}

/** GET /portfolio-performance-reports/latest/:userPortfolioId */
export async function getLatestPerformanceReport(userPortfolioId: string) {
  if (!userPortfolioId) return { success: false, error: "Missing userPortfolioId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(
      `/portfolio-performance-reports/latest/${userPortfolioId}`,
      { headers }
    );
    return { success: true, data: res.data?.data as PortfolioPerformanceReport };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch latest performance report") };
  }
}

/** GET /portfolio-performance-reports/stats/:userPortfolioId?period=... */
export async function getPerformanceStatistics(
  userPortfolioId: string,
  period: "daily" | "weekly" | "monthly" = "monthly"
) {
  if (!userPortfolioId) return { success: false, error: "Missing userPortfolioId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(
      `/portfolio-performance-reports/stats/${userPortfolioId}`,
      { headers, params: { period } }
    );
    return { success: true, data: res.data?.data as PerformanceStats };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch performance statistics") };
  }
}

/** POST /portfolio-performance-reports/generate — single portfolio */
export async function generatePerformanceReport(input: GeneratePerformanceReportInput) {
  if (!input.userPortfolioId) return { success: false, error: "userPortfolioId is required." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post(
      "/portfolio-performance-reports/generate",
      {
        userPortfolioId: input.userPortfolioId,
        ...(input.reportDate ? { reportDate: input.reportDate } : {}),
      },
      { headers }
    );
    return { success: true, data: res.data?.data as PortfolioPerformanceReport };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to generate performance report") };
  }
}

/**
 * POST /portfolio-performance-reports/generate-for-user
 * Generates reports for ALL active portfolios of a single user.
 */
export async function generateUserPerformanceReports(
  userId:      string,
  reportDate?: string
) {
  if (!userId) return { success: false, error: "userId is required." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post(
      "/portfolio-performance-reports/generate-for-user",
      { userId, ...(reportDate ? { reportDate } : {}) },
      { headers }
    );
    return { success: true, data: res.data?.data as GenerateUserReportsResult };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to generate user performance reports") };
  }
}

/** POST /portfolio-performance-reports/generate-all — system-wide (cron equivalent) */
export async function generateAllPerformanceReports() {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post(
      "/portfolio-performance-reports/generate-all",
      {},
      { headers }
    );
    return {
      success: true,
      data:    res.data?.data as GenerateAllReportsResult,
      message: res.data?.message as string | undefined,
    };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to generate reports for all portfolios") };
  }
}

/** DELETE /portfolio-performance-reports/cleanup */
export async function cleanupPerformanceReports(daysToKeep?: number) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.delete("/portfolio-performance-reports/cleanup", {
      headers,
      data: daysToKeep ? { daysToKeep } : {},
    });
    return {
      success: true,
      data:    res.data?.data as CleanupResult,
      message: res.data?.message as string | undefined,
    };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to cleanup performance reports") };
  }
}

/* -------------------------------------------------------------------------- */
/*  Convenience helpers                                                         */
/* -------------------------------------------------------------------------- */

/** Last N days of daily reports for a portfolio */
export async function getRecentDailyReports(userPortfolioId: string, days = 7) {
  const end   = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  return listPerformanceReports({
    userPortfolioId,
    period:    "daily",
    startDate: start.toISOString(),
    endDate:   end.toISOString(),
  });
}

/**
 * Fetch the latest report for each portfolio in an array.
 * Useful for dashboard cards where you need one snapshot per portfolio.
 */
export async function getLatestReportsForPortfolios(userPortfolioIds: string[]) {
  const results = await Promise.allSettled(
    userPortfolioIds.map((id) => getLatestPerformanceReport(id))
  );
  return results.map((r, i) => ({
    userPortfolioId: userPortfolioIds[i],
    ...(r.status === "fulfilled" ? r.value : { success: false, error: "Failed" }),
  }));
}