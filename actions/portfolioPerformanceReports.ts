





"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

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
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type AssetClass =
  | "EQUITIES"
  | "ETFS"
  | "REITS"
  | "BONDS"
  | "CASH"
  | "OTHERS";

export interface PortfolioAssetBreakdown {
  id?: string;
  reportId?: string;
  assetClass: AssetClass;
  holdings: number;
  totalCashValue: number;
  percentage: number;
  createdAt?: string;
}

// Asset type
export interface Asset {
  id: string;
  symbol: string;
  description: string;
  sector: string;
  assetClass: string;
  allocationPercentage: number;
  costPerShare: number;
  closePrice: number;
  createdAt?: string;
  updatedAt?: string;
}

// Portfolio Asset type
export interface PortfolioAsset {
  id: string;
  portfolioId: string;
  assetId: string;
  lossGain: number;
  closeValue: number;
  costPrice: number;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
  asset?: Asset;
}

// User Portfolio Asset type
export interface UserPortfolioAsset {
  id: string;
  userPortfolioId: string;
  portfolioAssetId: string;
  costPrice: number;
  stock: number;
  closeValue: number;
  lossGain: number;
  portfolioAsset?: PortfolioAsset;
}

// Portfolio type
export interface Portfolio {
  id: string;
  name: string;
  description?: string | null;
  timeHorizon?: string;
  riskTolerance?: string;
  allocationPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
}

// User Portfolio type with full relations
export interface UserPortfolio {
  id: string;
  userId: string;
  portfolioId: string;
  portfolioValue: number;
  createdAt?: string;
  updatedAt?: string;
  portfolio?: Portfolio | null;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;
  userAssets?: UserPortfolioAsset[];
}

// Main Portfolio Performance Report type
export interface PortfolioPerformanceReport {
  id: string;
  userPortfolioId: string;
  reportDate: string; // ISO
  totalCostPrice: number;
  totalCloseValue: number;
  totalLossGain: number;
  totalPercentage: number;
  createdAt?: string;
  updatedAt?: string;
  assetBreakdown?: PortfolioAssetBreakdown[];
  userPortfolio?: UserPortfolio | null;
}

export interface ListPerformanceReportsParams {
  userPortfolioId: string;
  period?: "daily" | "weekly" | "monthly";
  startDate?: string; // ISO
  endDate?: string;   // ISO
}

export interface GeneratePerformanceReportInput {
  userPortfolioId: string;
  reportDate?: string; // optional ISO date (defaults to today)
}

export interface PerformanceStats {
  period: "daily" | "weekly" | "monthly";
  reportCount: number;
  currentValue: number;
  startValue: number;
  totalGrowth: number;
  growthPercentage: number;
  avgDailyGain: number;
  bestDay: {
    date: string;
    gain: number;
    percentage: number;
  };
  worstDay: {
    date: string;
    loss: number;
    percentage: number;
  };
}

export interface GenerateAllReportsResult {
  success: number;
  failed: number;
  total: number;
  errors: string[];
}

export interface CleanupResult {
  deletedCount: number;
}

/* -------------------------------------------------------------------------- */
/*                              SERVER ACTIONS                                */
/* -------------------------------------------------------------------------- */

/**
 * GET /portfolio-performance-reports
 * Query reports by userPortfolioId, period, date range
 */
export async function listPerformanceReports(
  params: ListPerformanceReportsParams
) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/portfolio-performance-reports", {
      headers,
      params,
    });

    return {
      success: true,
      data: (res.data?.data ?? []) as PortfolioPerformanceReport[],
      meta: res.data?.meta,
    };
  } catch (e: any) {
    console.error("listPerformanceReports error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to load performance reports"),
    };
  }
}

/**
 * GET /portfolio-performance-reports/:id
 * Get a single report by ID
 */
export async function getPerformanceReportById(id: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/portfolio-performance-reports/${id}`, {
      headers,
    });

    return {
      success: true,
      data: res.data?.data as PortfolioPerformanceReport,
    };
  } catch (e: any) {
    console.error("getPerformanceReportById error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch performance report"),
    };
  }
}

/**
 * GET /portfolio-performance-reports/latest/:userPortfolioId
 * Get the latest report for a specific userPortfolio
 */
export async function getLatestPerformanceReport(userPortfolioId: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(
      `/portfolio-performance-reports/latest/${userPortfolioId}`,
      { headers }
    );

    return {
      success: true,
      data: res.data?.data as PortfolioPerformanceReport,
    };
  } catch (e: any) {
    console.error("getLatestPerformanceReport error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch latest performance report"),
    };
  }
}

/**
 * GET /portfolio-performance-reports/stats/:userPortfolioId?period=monthly
 * Get aggregated statistics for a portfolio over a period
 */
export async function getPerformanceStatistics(
  userPortfolioId: string,
  period: "daily" | "weekly" | "monthly" = "monthly"
) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(
      `/portfolio-performance-reports/stats/${userPortfolioId}`,
      {
        headers,
        params: { period },
      }
    );

    return {
      success: true,
      data: res.data?.data as PerformanceStats,
    };
  } catch (e: any) {
    console.error("getPerformanceStatistics error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch performance statistics"),
    };
  }
}

/**
 * POST /portfolio-performance-reports/generate
 * Manually generate a report for a specific portfolio (for a given date or today)
 */
export async function generatePerformanceReport(
  input: GeneratePerformanceReportInput
) {
  try {
    const headers = await authHeaderFromCookies();
    const payload: GeneratePerformanceReportInput = {
      userPortfolioId: input.userPortfolioId,
      ...(input.reportDate ? { reportDate: input.reportDate } : {}),
    };

    const res = await api.post(
      "/portfolio-performance-reports/generate",
      payload,
      { headers }
    );

    return {
      success: true,
      data: res.data?.data as PortfolioPerformanceReport,
    };
  } catch (e: any) {
    console.error("generatePerformanceReport error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to generate performance report"),
    };
  }
}

/**
 * POST /portfolio-performance-reports/generate-all
 * Trigger generation for all portfolios (same as cron job, but manual)
 */
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
      data: res.data?.data as GenerateAllReportsResult,
      message: res.data?.message as string | undefined,
    };
  } catch (e: any) {
    console.error("generateAllPerformanceReports error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to generate reports for all portfolios"),
    };
  }
}

/**
 * DELETE /portfolio-performance-reports/cleanup
 * Delete old reports (keep last N days, default 90)
 */
export async function cleanupPerformanceReports(daysToKeep?: number) {
  try {
    const headers = await authHeaderFromCookies();
    const payload = daysToKeep ? { daysToKeep } : {};

    const res = await api.delete("/portfolio-performance-reports/cleanup", {
      headers,
      data: payload,
    });

    return {
      success: true,
      data: res.data?.data as CleanupResult,
      message: res.data?.message as string | undefined,
    };
  } catch (e: any) {
    console.error("cleanupPerformanceReports error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to cleanup performance reports"),
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                        SMALL CONVENIENCE HELPERS                           */
/* -------------------------------------------------------------------------- */

/**
 * Convenience: get last N daily reports for a portfolio
 */
export async function getRecentDailyReports(
  userPortfolioId: string,
  days = 7
) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  return listPerformanceReports({
    userPortfolioId,
    period: "daily",
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  });
}