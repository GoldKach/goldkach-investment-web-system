// app/(app)/actions/onboarding.ts
"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:8000/api/v1";

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
    const headers = await authHeaderFromCookies();
    const res = await api.post("/onboarding/individual", { ...form, userId }, { headers });
    return { success: true, data: res.data?.data };
  } catch (e: any) {
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

// ─────────────────────────────────────────────
// Company onboarding
// ─────────────────────────────────────────────

/** POST /onboarding/company */
export async function submitCompanyOnboarding(form: any, userId: string) {
  if (!userId) return { success: false, error: "Missing userId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post("/onboarding/company", { ...form, userId }, { headers });
    return { success: true, data: res.data?.data };
  } catch (e: any) {
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