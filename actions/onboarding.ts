// app/(app)/actions/onboarding.ts
"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { refreshAccessToken } from "@/actions/auth";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

function msg(e: any, fallback = "Request failed") {
  return (
    e?.response?.data?.error ||
    e?.response?.data?.message ||
    e?.message ||
    fallback
  );
}

async function authHeaderFromCookies(): Promise<Record<string, string>> {
  const jar = await cookies();
  const token = jar.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function withAuthRetry<T>(fn: (headers: Record<string, string>) => Promise<T>): Promise<T> {
  let headers = await authHeaderFromCookies();
  try {
    return await fn(headers);
  } catch (e: any) {
    if (e?.digest?.startsWith("NEXT_REDIRECT")) throw e;
    if (axios.isAxiosError(e) && (e.response?.status === 401 || e.response?.status === 403)) {
      await refreshAccessToken(); // may redirect to /login — that's intentional
      headers = await authHeaderFromCookies();
      return await fn(headers);
    }
    throw e;
  }
}

// ─────────────────────────────────────────────
// Shared
// ─────────────────────────────────────────────

/** POST /onboarding/validate-tin */
export async function validateTin(tin: string, userId?: string) {
  if (!tin) return { success: false, error: "TIN is required." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post("/onboarding/validate-tin", { tin, userId }, { headers });
    return { success: true, isUnique: !!res.data?.isUnique };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to validate TIN.") };
  }
}

// ─────────────────────────────────────────────
// Individual onboarding
// ─────────────────────────────────────────────

/** POST /onboarding/individual */
export async function submitIndividualOnboarding(form: any, userId: string) {
  if (!userId) return { success: false, error: "Missing userId." };
  try {
    const res = await withAuthRetry((headers) =>
      api.post("/onboarding/individual", { ...form, userId }, { headers })
    );
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    if (e?.digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { success: false, error: msg(e, "Failed to submit individual onboarding.") };
  }
}

/** GET /onboarding/individual/me?userId=... */
export async function fetchMyIndividualOnboarding(userId: string) {
  if (!userId) return { success: true, data: null };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/onboarding/individual/me", {
      headers,
      params: { userId },
    });
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load individual onboarding.") };
  }
}

/** GET /onboarding/individual/user/:userId - fetch for any user */
export async function fetchIndividualOnboardingByUserId(userId: string) {
  if (!userId) return { success: true, data: null };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/onboarding/individual/user/${userId}`, { headers });
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load individual onboarding.") };
  }
}

// ─────────────────────────────────────────────
// Company onboarding
// ─────────────────────────────────────────────

/** POST /onboarding/company */
export async function submitCompanyOnboarding(form: any, userId: string) {
  if (!userId) return { success: false, error: "Missing userId." };
  try {
    const res = await withAuthRetry((headers) =>
      api.post("/onboarding/company", { ...form, userId }, { headers })
    );
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    if (e?.digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { success: false, error: msg(e, "Failed to submit company onboarding.") };
  }
}

/** GET /onboarding/company/me?userId=... */
export async function fetchMyCompanyOnboarding(userId: string) {
  if (!userId) return { success: true, data: null };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/onboarding/company/me", {
      headers,
      params: { userId },
    });
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load company onboarding.") };
  }
}

/** GET /onboarding/company/user/:userId - fetch for any user */
export async function fetchCompanyOnboardingByUserId(userId: string) {
  if (!userId) return { success: true, data: null };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/onboarding/company/user/${userId}`, { headers });
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load company onboarding.") };
  }
}

/** PUT /onboarding/company/directors */
export async function updateCompanyDirectors(directors: any[], userId: string) {
  if (!userId) return { success: false, error: "Missing userId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.put("/onboarding/company/directors", { directors, userId }, { headers });
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to update directors.") };
  }
}

/** GET /onboarding/company/directors?userId=... */
export async function fetchCompanyDirectors(userId: string) {
  if (!userId) return { success: true, data: [] };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/onboarding/company/directors", {
      headers,
      params: { userId },
    });
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load directors.") };
  }
}

/** PUT /onboarding/company/ubos */
export async function updateCompanyUBOs(ubos: any[], userId: string) {
  if (!userId) return { success: false, error: "Missing userId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.put("/onboarding/company/ubos", { ubos, userId }, { headers });
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to update UBOs.") };
  }
}

/** PATCH /onboarding/individual/:id/approve */
export async function approveIndividualOnboarding(id: string) {
  if (!id) return { success: false, error: "Missing onboarding ID." };
  try {
    const res = await withAuthRetry((headers) =>
      api.patch(`/onboarding/individual/${id}/approve`, {}, { headers })
    );
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    if (e?.digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { success: false, error: msg(e, "Failed to approve onboarding.") };
  }
}

/** PATCH /onboarding/company/:id/approve */
export async function approveCompanyOnboarding(id: string) {
  if (!id) return { success: false, error: "Missing onboarding ID." };
  try {
    const res = await withAuthRetry((headers) =>
      api.patch(`/onboarding/company/${id}/approve`, {}, { headers })
    );
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    if (e?.digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { success: false, error: msg(e, "Failed to approve onboarding.") };
  }
}

/** GET /onboarding/company/ubos?userId=... */
export async function fetchCompanyUBOs(userId: string) {
  if (!userId) return { success: true, data: [] };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/onboarding/company/ubos", {
      headers,
      params: { userId },
    });
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load UBOs.") };
  }
}