"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 15000,
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

export type UserRole = "SUPER_ADMIN" | "MANAGER" | "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED" | "DEACTIVATED" | "BANNED";
export type AccountStatus = "ACTIVE" | "INACTIVE" | "CLOSED" | "FROZEN";

export interface UserProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imageUrl: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  entityOnboarding?: EntityOnboarding | null;
  wallet?: {
    id: string;
    accountNumber: string;
    balance: number;
    netAssetValue: number;
    status: AccountStatus;
  } | null;
}

export interface EntityOnboarding {
  id: string;
  entityType: string;
  fullName: string;
  userId: string;
  dateOfBirth: string;
  tin: string;
  avatarUrl?: string;
  idUrl?: string;
  homeAddress: string;
  email: string;
  phoneNumber: string;
  employmentStatus: string;
  occupation: string;
  companyName?: string;
  hasBusiness?: string;
  registrationNumber?: string;
  companyAddress?: string;
  businessType?: string;
  incorporationDate?: string;
  authorizedRepName?: string;
  isApproved: boolean;
  authorizedRepEmail?: string;
  authorizedRepPhone?: string;
  authorizedRepPosition?: string;
  primaryGoal: string;
  timeHorizon: string;
  riskTolerance: string;
  investmentExperience: string;
  isPEP: string;
  consentToDataCollection: boolean;
  agreeToTerms: boolean;
  sourceOfWealth: string;
  businessOwnership: string;
  employmentIncome: string;
  expectedInvestment: string;
  businessName: string;
  businessAddress: string;
  establishmentDate: string;
  ownershipPercentage: string;
  familyMemberDetails: string;
  publicPosition: string;
  relationshipToCountry: string;
  sanctionsOrLegal: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  module?: string;
  status?: string;
  description?: string;
  method?: string;
  platform?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  createdAt: string;
  expiresAt: string;
}

export interface AccountSummary {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: UserStatus;
    emailVerified: boolean;
    isApproved: boolean;
    createdAt: string;
  };
  wallet: {
    balance: number;
    netAssetValue: number;
    status: AccountStatus;
  } | null;
  transactions: {
    totalDeposits: number;
    depositCount: number;
    totalWithdrawals: number;
    withdrawalCount: number;
  };
  activityCount: number;
  accountAge: number;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  transactionAlerts: boolean;
  securityAlerts: boolean;
  weeklyDigest: boolean;
  monthlyStatement: boolean;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface UpdateEmailInput {
  newEmail: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateOnboardingInput {
  homeAddress?: string;
  phoneNumber?: string;
  employmentStatus?: string;
  occupation?: string;
  companyName?: string;
  companyAddress?: string;
  businessType?: string;
  authorizedRepName?: string;
  authorizedRepEmail?: string;
  authorizedRepPhone?: string;
  authorizedRepPosition?: string;
  primaryGoal?: string;
  timeHorizon?: string;
  riskTolerance?: string;
  sourceOfWealth?: string;
  businessOwnership?: string;
  employmentIncome?: string;
  expectedInvestment?: string;
  businessName?: string;
  businessAddress?: string;
}

/* -------------------------------------------------------------------------- */
/*                              SERVER ACTIONS                                */
/* -------------------------------------------------------------------------- */

/**
 * GET /account/me
 * Get current user profile
 */
export async function getCurrentUser() {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/account/me", { headers });

    return {
      success: true,
      data: res.data?.data as UserProfile,
    };
  } catch (e: any) {
    console.error("getCurrentUser error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch user profile"),
    };
  }
}

/**
 * GET /account/summary
 * Get account summary with statistics
 */
export async function getAccountSummary() {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/account/summary", { headers });

    return {
      success: true,
      data: res.data?.data as AccountSummary,
    };
  } catch (e: any) {
    console.error("getAccountSummary error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch account summary"),
    };
  }
}

/**
 * PATCH /account/profile
 * Update basic profile (name, phone)
 */
export async function updateBasicProfile(input: UpdateProfileInput) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.patch("/account/profile", input, { headers });

    return {
      success: true,
      data: res.data?.data,
      message: res.data?.message,
    };
  } catch (e: any) {
    console.error("updateBasicProfile error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to update profile"),
    };
  }
}

/**
 * PATCH /account/email
 * Update email address
 */
export async function updateEmail(input: UpdateEmailInput) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.patch("/account/email", input, { headers });

    return {
      success: true,
      data: res.data?.data,
      message: res.data?.message,
    };
  } catch (e: any) {
    console.error("updateEmail error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to update email"),
    };
  }
}

/**
 * POST /account/change-password
 * Change password
 */
export async function changePassword(input: ChangePasswordInput) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post("/account/change-password", input, { headers });

    return {
      success: true,
      message: res.data?.message,
    };
  } catch (e: any) {
    console.error("changePassword error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to change password"),
    };
  }
}

/**
 * PATCH /account/profile-image
 * Update profile image
 */
export async function updateProfileImage(imageUrl: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.patch("/account/profile-image", { imageUrl }, { headers });

    return {
      success: true,
      data: res.data?.data,
      message: res.data?.message,
    };
  } catch (e: any) {
    console.error("updateProfileImage error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to update profile image"),
    };
  }
}

/**
 * GET /account/onboarding
 * Get onboarding information
 */
export async function getOnboardingInfo() {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/account/onboarding", { headers });

    return {
      success: true,
      data: res.data?.data as EntityOnboarding,
    };
  } catch (e: any) {
    console.error("getOnboardingInfo error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch onboarding information"),
    };
  }
}

/**
 * PATCH /account/onboarding
 * Update onboarding information
 */
export async function updateOnboardingInfo(input: UpdateOnboardingInput) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.patch("/account/onboarding", input, { headers });

    return {
      success: true,
      data: res.data?.data,
      message: res.data?.message,
    };
  } catch (e: any) {
    console.error("updateOnboardingInfo error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to update onboarding information"),
    };
  }
}

/**
 * PATCH /account/kyc-documents
 * Update KYC documents
 */
export async function updateKycDocuments(input: { avatarUrl?: string; idUrl?: string }) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.patch("/account/kyc-documents", input, { headers });

    return {
      success: true,
      data: res.data?.data,
      message: res.data?.message,
    };
  } catch (e: any) {
    console.error("updateKycDocuments error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to update KYC documents"),
    };
  }
}

/**
 * GET /account/activity
 * Get account activity log
 */
export async function getAccountActivity(params?: { page?: number; limit?: number; module?: string }) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/account/activity", {
      headers,
      params,
    });

    return {
      success: true,
      data: res.data?.data as ActivityLog[],
      pagination: res.data?.pagination,
    };
  } catch (e: any) {
    console.error("getAccountActivity error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch account activity"),
    };
  }
}

/**
 * GET /account/sessions
 * Get active sessions
 */
export async function getActiveSessions() {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/account/sessions", { headers });

    return {
      success: true,
      data: res.data?.data as Session[],
      count: res.data?.count,
    };
  } catch (e: any) {
    console.error("getActiveSessions error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch active sessions"),
    };
  }
}

/**
 * DELETE /account/sessions/:sessionId
 * Revoke a specific session
 */
export async function revokeSession(sessionId: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.delete(`/account/sessions/${sessionId}`, { headers });

    return {
      success: true,
      message: res.data?.message,
    };
  } catch (e: any) {
    console.error("revokeSession error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to revoke session"),
    };
  }
}

/**
 * DELETE /account/sessions
 * Revoke all sessions except current
 */
export async function revokeAllSessions(currentSessionId?: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.delete("/account/sessions", {
      headers,
      data: { currentSessionId },
    });

    return {
      success: true,
      message: res.data?.message,
      revokedCount: res.data?.revokedCount,
    };
  } catch (e: any) {
    console.error("revokeAllSessions error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to revoke sessions"),
    };
  }
}

/**
 * GET /account/notifications
 * Get notification preferences
 */
export async function getNotificationPreferences() {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/account/notifications", { headers });

    return {
      success: true,
      data: res.data?.data as NotificationPreferences,
    };
  } catch (e: any) {
    console.error("getNotificationPreferences error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to fetch notification preferences"),
    };
  }
}

/**
 * POST /account/deactivate
 * Deactivate account
 */
export async function deactivateAccount(password: string, reason?: string) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.post("/account/deactivate", { password, reason }, { headers });

    return {
      success: true,
      message: res.data?.message,
    };
  } catch (e: any) {
    console.error("deactivateAccount error:", e.response?.data || e.message);
    return {
      success: false,
      error: msg(e, "Failed to deactivate account"),
    };
  }
}