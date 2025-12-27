"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 30000,
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

export interface ActivityLog {
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
  user?: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
    role?: string;
  };
}

export interface ActivityStats {
  summary: {
    totalActivities: number;
    successCount: number;
    failedCount: number;
    successRate: string | number;
    uniqueUsers: number;
  };
  byModule: Array<{ module: string; count: number }>;
  byAction: Array<{ action: string; count: number }>;
  trend: Array<{
    date: string;
    count: number;
    successCount: number;
    failedCount: number;
  }>;
}

export interface SystemLogStats {
  total: number;
  byModule: Array<{ module: string; count: number }>;
  byMethod: Array<{ method: string; count: number }>;
  byPlatform: Array<{ platform: string; count: number }>;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ModuleItem {
  module: string;
  count: number;
}

export interface ActionItem {
  action: string;
  count: number;
}

/* -------------------------------------------------------------------------- */
/*                              SERVER ACTIONS                                */
/* -------------------------------------------------------------------------- */

/**
 * GET /activity/recent
 * Get recent activity for current user
 */
export async function getRecentActivity(params?: {
  page?: number;
  limit?: number;
  module?: string;
  action?: string;
  status?: string;
}) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/activity/recent", { headers, params });

    return {
      success: true,
      data: res.data?.data as ActivityLog[],
      pagination: res.data?.pagination as Pagination,
    };
  } catch (e: any) {
    console.error("getRecentActivity error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch recent activity"),
    };
  }
}

/**
 * GET /activity/audit
 * Get audit trail (admin only)
 */
export async function getAuditTrail(params?: {
  page?: number;
  limit?: number;
  userId?: string;
  module?: string;
  action?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/activity/audit", { headers, params });

    return {
      success: true,
      data: res.data?.data as ActivityLog[],
      stats: res.data?.stats,
      pagination: res.data?.pagination as Pagination,
    };
  } catch (e: any) {
    console.error("getAuditTrail error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch audit trail"),
    };
  }
}

/**
 * GET /activity/system
 * Get system logs (super admin only)
 */
export async function getSystemLogs(params?: {
  page?: number;
  limit?: number;
  module?: string;
  method?: string;
  platform?: string;
  isAutomated?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  errorOnly?: string;
}) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/activity/system", { headers, params });

    return {
      success: true,
      data: res.data?.data as ActivityLog[],
      stats: res.data?.stats as SystemLogStats,
      pagination: res.data?.pagination as Pagination,
    };
  } catch (e: any) {
    console.error("getSystemLogs error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch system logs"),
    };
  }
}

/**
 * GET /activity/stats
 * Get activity statistics
 */
export async function getActivityStats(period?: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/activity/stats", {
      headers,
      params: { period },
    });

    return {
      success: true,
      data: res.data?.data as ActivityStats,
    };
  } catch (e: any) {
    console.error("getActivityStats error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch activity stats"),
    };
  }
}

/**
 * GET /activity/:id
 * Get activity detail
 */
export async function getActivityDetail(id: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/activity/${id}`, { headers });

    return {
      success: true,
      data: res.data?.data as ActivityLog,
    };
  } catch (e: any) {
    console.error("getActivityDetail error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch activity detail"),
    };
  }
}

/**
 * GET /activity/user/:userId
 * Get activity for specific user (admin only)
 */
export async function getUserActivity(
  userId: string,
  params?: { page?: number; limit?: number }
) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/activity/user/${userId}`, { headers, params });

    return {
      success: true,
      data: res.data?.data,
      pagination: res.data?.pagination as Pagination,
    };
  } catch (e: any) {
    console.error("getUserActivity error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch user activity"),
    };
  }
}

/**
 * GET /activity/modules
 * Get list of modules for filters
 */
export async function getModulesList() {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/activity/modules", { headers });

    return {
      success: true,
      data: res.data?.data as ModuleItem[],
    };
  } catch (e: any) {
    console.error("getModulesList error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch modules list"),
    };
  }
}

/**
 * GET /activity/actions
 * Get list of actions for filters
 */
export async function getActionsList() {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/activity/actions", { headers });

    return {
      success: true,
      data: res.data?.data as ActionItem[],
    };
  } catch (e: any) {
    console.error("getActionsList error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch actions list"),
    };
  }
}

/**
 * GET /activity/export
 * Export activity logs
 */
export async function exportActivityLogs(params?: {
  startDate?: string;
  endDate?: string;
  module?: string;
  format?: "json" | "csv";
}) {
  try {
    const headers = await authHeaderFromCookies();
    
    if (params?.format === "csv") {
      const res = await api.get("/activity/export", {
        headers,
        params,
        responseType: "blob",
      });
      return {
        success: true,
        data: res.data,
        isBlob: true,
      };
    }

    const res = await api.get("/activity/export", { headers, params });
    return {
      success: true,
      data: res.data?.data as ActivityLog[],
      count: res.data?.count,
    };
  } catch (e: any) {
    console.error("exportActivityLogs error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to export activity logs"),
    };
  }
}

/**
 * DELETE /activity/cleanup
 * Delete old logs (super admin only)
 */
export async function deleteOldLogs(olderThanDays: number) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.delete("/activity/cleanup", {
      headers,
      data: { olderThanDays },
    });

    return {
      success: true,
      message: res.data?.message,
      deletedCount: res.data?.deletedCount,
    };
  } catch (e: any) {
    console.error("deleteOldLogs error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to delete old logs"),
    };
  }
}