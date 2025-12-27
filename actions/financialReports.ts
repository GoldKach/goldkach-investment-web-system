"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 30000, // Longer timeout for reports
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

export type TransactionStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AccountStatus = "ACTIVE" | "INACTIVE" | "CLOSED" | "FROZEN";
export type UserRole = "SUPER_ADMIN" | "MANAGER" | "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED" | "DEACTIVATED" | "BANNED";

// Filter params
export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  status?: TransactionStatus;
  userId?: string;
}

export interface TrendsFilters {
  period?: "daily" | "weekly" | "monthly";
  limit?: number;
}

export interface ActivityFilters extends ReportFilters {
  module?: string;
  action?: string;
}

// Summary types
export interface StatusBreakdown {
  count: number;
  amount: number;
}

// Deposit Report Types
export interface DepositRecord {
  id: string;
  walletId: string;
  amount: number;
  userId: string;
  transactionId?: string;
  transactionStatus: TransactionStatus;
  mobileNo?: string;
  referenceNo?: string;
  AccountNo?: string;
  ApprovedBy?: string;
  method?: string;
  description?: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  wallet: {
    id: string;
    accountNumber: string;
    balance: number;
  };
}

export interface DepositsReportSummary {
  totalCount: number;
  totalAmount: number;
  totalAmountFormatted: string;
  pending: StatusBreakdown;
  approved: StatusBreakdown;
  rejected: StatusBreakdown;
  averageDeposit: number;
}

export interface DepositsReportData {
  summary: DepositsReportSummary;
  byMethod: Record<string, { count: number; amount: number }>;
  dailyBreakdown: Record<string, { count: number; amount: number }>;
  deposits: DepositRecord[];
}

// Withdrawal Report Types
export interface WithdrawalRecord {
  id: string;
  walletId: string;
  amount: number;
  userId: string;
  transactionStatus: TransactionStatus;
  AccountNo?: string;
  AccountName?: string;
  referenceNo: string;
  transactionId?: string;
  method?: string;
  bankName: string;
  bankAccountName: string;
  bankBranch: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  wallet: {
    id: string;
    accountNumber: string;
    balance: number;
  };
}

export interface WithdrawalsReportSummary {
  totalCount: number;
  totalAmount: number;
  totalAmountFormatted: string;
  pending: StatusBreakdown;
  approved: StatusBreakdown;
  rejected: StatusBreakdown;
  averageWithdrawal: number;
}

export interface WithdrawalsReportData {
  summary: WithdrawalsReportSummary;
  byBank: Record<string, { count: number; amount: number }>;
  dailyBreakdown: Record<string, { count: number; amount: number }>;
  withdrawals: WithdrawalRecord[];
}

// Wallet Report Types
export interface WalletRecord {
  id: string;
  accountNumber: string;
  userId: string;
  balance: number;
  bankFee: number;
  transactionFee: number;
  feeAtBank: number;
  totalFees: number;
  netAssetValue: number;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: UserStatus;
  };
  _count: {
    deposits: number;
    withdrawals: number;
  };
}

export interface WalletsReportSummary {
  totalWallets: number;
  totalBalance: number;
  totalBalanceFormatted: string;
  totalNetAssetValue: number;
  totalNetAssetValueFormatted: string;
  totalFeesCollected: number;
  totalFeesCollectedFormatted: string;
  averageBalance: number;
  byStatus: {
    active: { count: number; totalBalance: number };
    inactive: { count: number; totalBalance: number };
    frozen: { count: number; totalBalance: number };
  };
}

export interface WalletsReportData {
  summary: WalletsReportSummary;
  topWallets: WalletRecord[];
  wallets: WalletRecord[];
}

// Portfolio Report Types
export interface PortfolioMetric {
  id: string;
  name: string;
  description?: string;
  riskTolerance: string;
  timeHorizon: string;
  assetCount: number;
  userCount: number;
  totalCostPrice: number;
  totalCloseValue: number;
  totalLossGain: number;
  performancePercentage: number;
  totalUserPortfolioValue: number;
}

export interface AssetPerformance {
  id: string;
  symbol: string;
  description: string;
  sector: string;
  costPerShare: number;
  closePrice: number;
  priceChange: number;
  percentageChange: number;
  portfolioCount: number;
}

export interface PortfolioReportSummary {
  totalPortfolios: number;
  totalAssets: number;
  totalUsersWithPortfolios: number;
  overallLossGain: number;
  totalPortfolioValue: number;
  bestPerformingPortfolio?: PortfolioMetric;
  worstPerformingPortfolio?: PortfolioMetric;
  bestPerformingAsset?: AssetPerformance;
  worstPerformingAsset?: AssetPerformance;
}

export interface PortfolioReportData {
  summary: PortfolioReportSummary;
  portfolioMetrics: PortfolioMetric[];
  assetPerformance: AssetPerformance[];
  sectorBreakdown: Record<string, { count: number; totalValue: number }>;
}

// Activity Report Types
export interface ActivityRecord {
  id: string;
  userId: string;
  action: string;
  module?: string;
  status?: string;
  description?: string;
  method?: string;
  platform?: string;
  performedByRole?: string;
  entityId?: string;
  entityType?: string;
  referrerUrl?: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  isAutomated?: boolean;
  durationMs?: number;
  errorMessage?: string;
  metadata?: any;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  };
}

export interface TopActiveUser {
  user: ActivityRecord["user"];
  count: number;
}

export interface ActivityReportSummary {
  totalActivities: number;
  successRate: number;
  failureRate: number;
  uniqueUsers: number;
  averageResponseTime: number;
}

export interface ActivityReportData {
  summary: ActivityReportSummary;
  byAction: Record<string, number>;
  byModule: Record<string, number>;
  byStatus: Record<string, number>;
  byPlatform: Record<string, number>;
  dailyActivity: Record<string, number>;
  topActiveUsers: TopActiveUser[];
  recentActivities: ActivityRecord[];
}

// Comprehensive Report Types
export interface ComprehensiveReportData {
  overview: {
    reportPeriod: {
      startDate: string;
      endDate: string;
    };
    generatedAt: string;
  };
  financialSummary: {
    deposits: {
      total: number;
      totalFormatted: string;
      approved: number;
      approvedFormatted: string;
      count: number;
      approvedCount: number;
    };
    withdrawals: {
      total: number;
      totalFormatted: string;
      approved: number;
      approvedFormatted: string;
      count: number;
      approvedCount: number;
    };
    netCashFlow: {
      amount: number;
      amountFormatted: string;
      status: "POSITIVE" | "NEGATIVE";
    };
    fees: {
      total: number;
      totalFormatted: string;
    };
  };
  walletMetrics: {
    totalWallets: number;
    totalBalance: number;
    totalBalanceFormatted: string;
    totalNetAssetValue: number;
    totalNetAssetValueFormatted: string;
    averageBalance: number;
    activeWallets: number;
    inactiveWallets: number;
    frozenWallets: number;
  };
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
    suspendedUsers: number;
    usersByRole: {
      superAdmin: number;
      admin: number;
      manager: number;
      user: number;
    };
  };
  portfolioMetrics: {
    totalPortfolios: number;
    totalAssets: number;
    totalUserPortfolios: number;
    totalPortfolioValue: number;
    totalPortfolioValueFormatted: string;
  };
  growthMetrics?: {
    depositGrowth?: number;
    withdrawalGrowth?: number;
  } | null;
  keyInsights: string[];
}

// Trends Report Types
export interface TrendDataPoint {
  date: string;
  deposits: number;
  withdrawals: number;
  netFlow: number;
  depositCount: number;
  withdrawalCount: number;
}

export interface TrendsStatistics {
  totalDeposits: number;
  totalWithdrawals: number;
  netFlow: number;
  averageDeposits: number;
  averageWithdrawals: number;
  peakDepositDay?: TrendDataPoint;
  peakWithdrawalDay?: TrendDataPoint;
  dataPoints: number;
}

export interface TrendsReportData {
  period: string;
  trends: TrendDataPoint[];
  statistics: TrendsStatistics;
}

/* -------------------------------------------------------------------------- */
/*                              SERVER ACTIONS                                */
/* -------------------------------------------------------------------------- */

/**
 * GET /reports/deposits
 * Get deposits report with filters
 */
export async function getDepositsReport(filters?: ReportFilters) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/reports/deposits", {
      headers,
      params: filters,
    });

    return {
      success: true,
      data: res.data?.data as DepositsReportData,
      generatedAt: res.data?.generatedAt as string,
    };
  } catch (e: any) {
    console.error("getDepositsReport error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to load deposits report"),
    };
  }
}

/**
 * GET /reports/withdrawals
 * Get withdrawals report with filters
 */
export async function getWithdrawalsReport(filters?: ReportFilters) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/reports/withdrawals", {
      headers,
      params: filters,
    });

    return {
      success: true,
      data: res.data?.data as WithdrawalsReportData,
      generatedAt: res.data?.generatedAt as string,
    };
  } catch (e: any) {
    console.error("getWithdrawalsReport error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to load withdrawals report"),
    };
  }
}

/**
 * GET /reports/wallets
 * Get wallets overview report
 */
export async function getWalletsReport(status?: AccountStatus) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/reports/wallets", {
      headers,
      params: status ? { status } : undefined,
    });

    return {
      success: true,
      data: res.data?.data as WalletsReportData,
      generatedAt: res.data?.generatedAt as string,
    };
  } catch (e: any) {
    console.error("getWalletsReport error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to load wallets report"),
    };
  }
}

/**
 * GET /reports/portfolios
 * Get portfolio performance report
 */
export async function getPortfolioPerformanceReport() {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/reports/portfolios", { headers });

    return {
      success: true,
      data: res.data?.data as PortfolioReportData,
      generatedAt: res.data?.generatedAt as string,
    };
  } catch (e: any) {
    console.error("getPortfolioPerformanceReport error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to load portfolio performance report"),
    };
  }
}

/**
 * GET /reports/activity
 * Get user activity report
 */
export async function getActivityReport(filters?: ActivityFilters) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/reports/activity", {
      headers,
      params: filters,
    });

    return {
      success: true,
      data: res.data?.data as ActivityReportData,
      generatedAt: res.data?.generatedAt as string,
    };
  } catch (e: any) {
    console.error("getActivityReport error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to load activity report"),
    };
  }
}

/**
 * GET /reports/summary
 * Get comprehensive financial summary report
 */
export async function getComprehensiveReport(filters?: { startDate?: string; endDate?: string }) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/reports/summary", {
      headers,
      params: filters,
    });

    return {
      success: true,
      data: res.data?.data as ComprehensiveReportData,
    };
  } catch (e: any) {
    console.error("getComprehensiveReport error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to load comprehensive report"),
    };
  }
}

/**
 * GET /reports/trends
 * Get transaction trends report
 */
export async function getTransactionTrends(filters?: TrendsFilters) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/reports/trends", {
      headers,
      params: filters,
    });

    return {
      success: true,
      data: res.data?.data as TrendsReportData,
      generatedAt: res.data?.generatedAt as string,
    };
  } catch (e: any) {
    console.error("getTransactionTrends error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to load transaction trends"),
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                              EXPORT ACTIONS                                */
/* -------------------------------------------------------------------------- */

/**
 * GET /reports/export/deposits
 * Export deposits report to Excel - returns download URL
 */
export async function exportDepositsReport(filters?: ReportFilters) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/reports/export/deposits", {
      headers,
      params: filters,
      responseType: "blob",
    });

    // Create blob URL for download
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return {
      success: true,
      blob,
      filename: `deposits_report_${new Date().toISOString().split("T")[0]}.xlsx`,
    };
  } catch (e: any) {
    console.error("exportDepositsReport error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to export deposits report"),
    };
  }
}

/**
 * GET /reports/export/withdrawals
 * Export withdrawals report to Excel
 */
export async function exportWithdrawalsReport(filters?: ReportFilters) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/reports/export/withdrawals", {
      headers,
      params: filters,
      responseType: "blob",
    });

    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return {
      success: true,
      blob,
      filename: `withdrawals_report_${new Date().toISOString().split("T")[0]}.xlsx`,
    };
  } catch (e: any) {
    console.error("exportWithdrawalsReport error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to export withdrawals report"),
    };
  }
}

/**
 * GET /reports/export/wallets
 * Export wallets report to Excel
 */
export async function exportWalletsReport(status?: AccountStatus) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/reports/export/wallets", {
      headers,
      params: status ? { status } : undefined,
      responseType: "blob",
    });

    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return {
      success: true,
      blob,
      filename: `wallets_report_${new Date().toISOString().split("T")[0]}.xlsx`,
    };
  } catch (e: any) {
    console.error("exportWalletsReport error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to export wallets report"),
    };
  }
}

/**
 * GET /reports/export/comprehensive
 * Export comprehensive financial report to Excel
 */
export async function exportComprehensiveReport(filters?: { startDate?: string; endDate?: string }) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/reports/export/comprehensive", {
      headers,
      params: filters,
      responseType: "blob",
    });

    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return {
      success: true,
      blob,
      filename: `comprehensive_financial_report_${new Date().toISOString().split("T")[0]}.xlsx`,
    };
  } catch (e: any) {
    console.error("exportComprehensiveReport error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to export comprehensive report"),
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                        CONVENIENCE HELPERS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Get reports for current month
 */
export async function getCurrentMonthReports() {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endDate = now.toISOString();

  return getComprehensiveReport({ startDate, endDate });
}

/**
 * Get reports for last N days
 */
export async function getReportsForLastDays(days: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  return getComprehensiveReport({
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  });
}

/**
 * Get weekly transaction trends
 */
export async function getWeeklyTrends(weeks = 4) {
  return getTransactionTrends({
    period: "weekly",
    limit: weeks * 7,
  });
}

/**
 * Get monthly transaction trends
 */
export async function getMonthlyTrends(months = 6) {
  return getTransactionTrends({
    period: "monthly",
    limit: months * 30,
  });
}

/**
 * Download helper - triggers browser download from blob
 */
export async function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}