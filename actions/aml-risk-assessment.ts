"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { refreshAccessToken } from "@/actions/auth";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

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
      await refreshAccessToken();
      headers = await authHeaderFromCookies();
      return await fn(headers);
    }
    throw e;
  }
}

export async function getAMLRiskAssessment(userId: string) {
  try {
    const res = await withAuthRetry((headers) =>
      api.get(`/api/v1/aml-risk-assessment/${userId}`, { headers })
    );
    return { success: true, data: res.data?.data ?? null };
  } catch (e: any) {
    return { success: false, data: null, error: "Failed to load AML assessment." };
  }
}

export async function saveAMLRiskAssessment(
  userId: string,
  data: Record<string, any>,
  updatedBy?: string
) {
  try {
    const res = await withAuthRetry((headers) =>
      api.put(`/api/v1/aml-risk-assessment/${userId}`, { data, updatedBy }, { headers })
    );
    return { success: true, data: res.data?.data ?? null };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      error: e?.response?.data?.error || "Failed to save AML assessment.",
    };
  }
}
