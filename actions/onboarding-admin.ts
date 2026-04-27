// app/actions/onboarding-admin.ts
"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { refreshAccessToken } from "@/actions/auth";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

function msg(e: any, fallback = "Request failed") {
  return e?.response?.data?.error || e?.message || fallback;
}

async function authHeaderFromCookies(): Promise<Record<string, string>> {
  const jar = await cookies();
  const token = jar.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Retry once after refreshing the access token on 401/403 */
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

export interface IndividualOnboardingData {
  id: string;
  fullName?: string | null;
  dateOfBirth?: string | null;
  tin?: string | null;
  homeAddress?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  nationality?: string | null;
  countryOfResidence?: string | null;
  employmentStatus?: string | null;
  occupation?: string | null;
  companyName?: string | null;
  hasBusiness?: boolean | null;
  primaryGoal?: string | null;
  timeHorizon?: string | null;
  riskTolerance?: string | null;
  investmentExperience?: string | null;
  sourceOfIncome?: string | null;
  employmentIncome?: string | null;
  expectedInvestment?: string | null;
  businessOwnership?: string | null;
  isPEP?: boolean | null;
  publicPosition?: string | null;
  relationshipToCountry?: string | null;
  familyMemberDetails?: string | null;
  sanctionsOrLegal?: string | null;
  consentToDataCollection?: boolean | null;
  agreeToTerms?: boolean | null;
  isApproved?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CompanyOnboardingData {
  id: string;
  companyName?: string | null;
  email?: string | null;
  companyAddress?: string | null;
  registrationNumber?: string | null;
  tin?: string | null;
  incorporationDate?: string | null;
  businessType?: string | null;
  primaryGoal?: string | null;
  timeHorizon?: string | null;
  riskTolerance?: string | null;
  investmentExperience?: string | null;
  sourceOfIncome?: string | null;
  expectedInvestment?: string | null;
  isPEP?: boolean | null;
  sanctionsOrLegal?: string | null;
  consentToDataCollection?: boolean | null;
  agreeToTerms?: boolean | null;
  isApproved?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export async function updateIndividualOnboarding(
  id: string,
  data: Partial<IndividualOnboardingData>
) {
  if (!id) return { success: false, error: "Missing onboarding id." };
  try {
    const res = await withAuthRetry((headers) =>
      api.patch(`/onboarding/individual/${id}`, data, { headers })
    );
    return { success: true, data: res.data?.data as IndividualOnboardingData };
  } catch (e: any) {
    if (e?.digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { success: false, error: msg(e, "Failed to update individual onboarding") };
  }
}

export async function updateCompanyOnboarding(
  id: string,
  data: Partial<CompanyOnboardingData>
) {
  if (!id) return { success: false, error: "Missing onboarding id." };
  try {
    const res = await withAuthRetry((headers) =>
      api.patch(`/onboarding/company/${id}`, data, { headers })
    );
    return { success: true, data: res.data?.data as CompanyOnboardingData };
  } catch (e: any) {
    if (e?.digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { success: false, error: msg(e, "Failed to update company onboarding") };
  }
}

export async function getOnboardingByUserId(userId: string) {
  if (!userId) return { success: false, error: "Missing userId." };
  try {
    const headers = await authHeaderFromCookies();

    const [individualRes, companyRes] = await Promise.all([
      api.get(`/onboarding/individual/user/${userId}`, { headers }),
      api.get(`/onboarding/company/user/${userId}`, { headers }),
    ]);

    const individual = individualRes.data?.data;
    const company = companyRes.data?.data;

    if (individual) {
      return { success: true, data: { type: "individual" as const, data: individual } };
    } else if (company) {
      return { success: true, data: { type: "company" as const, data: company } };
    }

    return { success: true, data: null };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load onboarding") };
  }
}