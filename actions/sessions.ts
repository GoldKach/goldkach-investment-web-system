"use server";

import { cookies } from "next/headers";

const BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function authHeader(): Promise<Record<string, string>> {
  const jar   = await cookies();
  const token = jar.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function apiErr(e: unknown, fallback = "Request failed") {
  const err = e as { message?: string };
  return err?.message ?? fallback;
}

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface Session {
  id:          string;
  createdAt:   string;
  expiresAt:   string;
  revoked:     boolean;
  revokedAt:   string | null;
  ipAddress:   string | null;
  userAgent:   string | null;
  location:    string | null;
  country:     string | null;
  city:        string | null;
  deviceType:  string | null;
  browser:     string | null;
  os:          string | null;
  isActive:    boolean;
  isExpired:   boolean;
  user?: {
    id:        string;
    firstName: string;
    lastName:  string | null;
    email:     string;
    role:      string;
    status:    string;
    imageUrl:  string;
  };
}

export interface SessionStats {
  total:        number;
  active:       number;
  last24h:      number;
  last7d:       number;
  topCountries: { country: string; count: number }[];
  byDeviceType: { type: string; count: number }[];
}

/* ── List all sessions (platform-wide) ─────────────────────────────────────── */

export async function listSessions(params?: {
  page?: number;
  pageSize?: number;
  userId?: string;
  active?: boolean;
  search?: string;
}): Promise<{ success: boolean; data?: Session[]; total?: number; totalPages?: number; error?: string }> {
  try {
    const qs = new URLSearchParams();
    if (params?.page)     qs.set("page",     String(params.page));
    if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
    if (params?.userId)   qs.set("userId",   params.userId);
    if (params?.active)   qs.set("active",   "true");
    if (params?.search)   qs.set("search",   params.search);

    const res = await fetch(`${BASE}/sessions?${qs}`, {
      headers: await authHeader(),
      cache:   "no-store",
    });
    const body = await res.json();
    if (!res.ok) return { success: false, error: body.error ?? "Failed to fetch sessions" };
    return { success: true, data: body.data.rows, total: body.data.total, totalPages: body.data.totalPages };
  } catch (e) {
    return { success: false, error: apiErr(e) };
  }
}

/* ── List sessions for a specific user ─────────────────────────────────────── */

export async function listUserSessions(userId: string): Promise<{ success: boolean; data?: Session[]; error?: string }> {
  try {
    const res = await fetch(`${BASE}/users/${userId}/sessions`, {
      headers: await authHeader(),
      cache:   "no-store",
    });
    const body = await res.json();
    if (!res.ok) return { success: false, error: body.error ?? "Failed to fetch sessions" };
    return { success: true, data: body.data };
  } catch (e) {
    return { success: false, error: apiErr(e) };
  }
}

/* ── Session stats ──────────────────────────────────────────────────────────── */

export async function getSessionStats(): Promise<{ success: boolean; data?: SessionStats; error?: string }> {
  try {
    const res = await fetch(`${BASE}/sessions/stats`, {
      headers: await authHeader(),
      cache:   "no-store",
    });
    const body = await res.json();
    if (!res.ok) return { success: false, error: body.error ?? "Failed" };
    return { success: true, data: body.data };
  } catch (e) {
    return { success: false, error: apiErr(e) };
  }
}

/* ── Revoke a single session ────────────────────────────────────────────────── */

export async function revokeSession(sessionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}/sessions/${sessionId}`, {
      method:  "DELETE",
      headers: await authHeader(),
    });
    const body = await res.json();
    if (!res.ok) return { success: false, error: body.error ?? "Failed to revoke" };
    return { success: true };
  } catch (e) {
    return { success: false, error: apiErr(e) };
  }
}

/* ── Revoke all sessions for a user ────────────────────────────────────────── */

export async function revokeAllUserSessions(userId: string): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const res = await fetch(`${BASE}/users/${userId}/sessions`, {
      method:  "DELETE",
      headers: await authHeader(),
    });
    const body = await res.json();
    if (!res.ok) return { success: false, error: body.error ?? "Failed to revoke" };
    return { success: true, count: body.revokedCount };
  } catch (e) {
    return { success: false, error: apiErr(e) };
  }
}
