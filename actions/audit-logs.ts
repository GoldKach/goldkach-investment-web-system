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

function msg(e: unknown, fallback = "Request failed") {
  const err = e as { response?: { data?: { error?: string } }; message?: string };
  return err?.response?.data?.error || err?.message || fallback;
}

async function authHeaderFromCookies() {
  const jar = await cookies();
  const token = jar.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* -------------------------------------------------------------------------- */
/*  Types                                                                       */
/* -------------------------------------------------------------------------- */

export type AuditTransactionType =
  | "DEPOSIT_CREATED"
  | "DEPOSIT_APPROVED"
  | "DEPOSIT_REJECTED"
  | "DEPOSIT_REVERSED"
  | "WITHDRAWAL_CREATED"
  | "WITHDRAWAL_APPROVED"
  | "WITHDRAWAL_REJECTED"
  | "REDEMPTION_CREATED"
  | "REDEMPTION_APPROVED"
  | "REDEMPTION_REJECTED"
  | "PORTFOLIO_ALLOCATION"
  | "FEE_DEDUCTED"
  | "CLOSE_PRICE_UPDATED";

export type AuditTransactionStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "REVERSED";

export interface AuditLogRow {
  id: string;
  sequence: number;
  transactionType: AuditTransactionType;
  transactionId: string | null;
  transactionStatus: AuditTransactionStatus;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  performedById: string | null;
  performedByName: string | null;
  performedByRole: string | null;
  amount: number | null;
  currency: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  hash: string;
  previousHash: string;
  ipAddress: string | null;
  userAgent: string | null;
  systemVersion: string;
  createdAt: string;
}

export interface AuditLogListParams {
  page?: number;
  pageSize?: number;
  userId?: string;
  transactionType?: AuditTransactionType;
  transactionStatus?: AuditTransactionStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface AuditLogListResult {
  rows: AuditLogRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ChainVerificationResult {
  valid: boolean;
  totalRows: number;
  firstBrokenSequence: number | null;
  brokenAt: string | null;
  checkedAt: string;
}

/* -------------------------------------------------------------------------- */
/*  Server actions                                                              */
/* -------------------------------------------------------------------------- */

export async function listAuditLogs(params?: AuditLogListParams): Promise<{
  data: AuditLogListResult | null;
  error: string | null;
}> {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/compliance/audit-logs", {
      headers,
      params,
    });
    return { data: res.data?.data as AuditLogListResult, error: null };
  } catch (e) {
    return { data: null, error: msg(e, "Failed to load audit logs") };
  }
}

export async function getAuditLog(id: string): Promise<{
  data: AuditLogRow | null;
  error: string | null;
}> {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/compliance/audit-logs/${id}`, { headers });
    return { data: res.data?.data as AuditLogRow, error: null };
  } catch (e) {
    return { data: null, error: msg(e, "Failed to load audit log entry") };
  }
}

export async function verifyAuditChainIntegrity(): Promise<{
  data: ChainVerificationResult | null;
  error: string | null;
}> {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/compliance/audit-logs/verify-integrity", {
      headers,
    });
    return {
      data: res.data?.data as ChainVerificationResult,
      error: null,
    };
  } catch (e) {
    return { data: null, error: msg(e, "Failed to verify audit chain") };
  }
}

/* -------------------------------------------------------------------------- */
/*  PDF Report Data                                                             */
/* -------------------------------------------------------------------------- */

export interface LoginSession {
  id: string;
  createdAt: string;
  expiresAt: string;
  revoked: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string;
    role: string;
  } | null;
}

export interface ReportDeposit {
  id: string;
  amount: number;
  depositTarget: string;
  transactionStatus: string;
  transactionId: string | null;
  method: string | null;
  description: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
  rejectedByName: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  createdByName: string | null;
  createdAt: string;
  bankCost: number;
  transactionCost: number;
  cashAtBank: number;
  totalFees: number;
  isFirstDeposit: boolean;
  user: { id: string; firstName: string; lastName: string | null; email: string } | null;
}

export interface ReportWithdrawal {
  id: string;
  amount: number;
  withdrawalType: string;
  transactionStatus: string;
  transactionId: string | null;
  bankName: string;
  bankBranch: string;
  description: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
  rejectedByName: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  createdByName: string | null;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string | null; email: string } | null;
}

export interface AuditReportData {
  loginSessions: LoginSession[];
  deposits: ReportDeposit[];
  withdrawals: ReportWithdrawal[];
}

export interface AuditReportParams {
  startDate?: string;
  endDate?: string;
  include?: string; // "sessions,deposits,withdrawals"
}

export async function getAuditReportData(
  params?: AuditReportParams
): Promise<{ data: AuditReportData | null; error: string | null }> {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/compliance/audit-report-data", {
      headers,
      params,
    });
    return { data: res.data?.data as AuditReportData, error: null };
  } catch (e) {
    return { data: null, error: msg(e, "Failed to fetch audit report data") };
  }
}

/** Returns the URL for direct CSV download (called client-side via window.location) */
export async function getAuditLogExportUrl(
  params?: Omit<AuditLogListParams, "page" | "pageSize">
): Promise<{ data: string | null; error: string | null }> {
  try {
    const qs = new URLSearchParams();
    if (params?.userId) qs.set("userId", params.userId);
    if (params?.transactionType)
      qs.set("transactionType", params.transactionType);
    if (params?.transactionStatus)
      qs.set("transactionStatus", params.transactionStatus);
    if (params?.startDate) qs.set("startDate", params.startDate);
    if (params?.endDate) qs.set("endDate", params.endDate);
    if (params?.search) qs.set("search", params.search);

    const jar = await cookies();
    const token = jar.get("accessToken")?.value ?? "";
    const queryStr = qs.toString();
    const url = `${BASE_API_URL}/compliance/audit-logs/export${queryStr ? `?${queryStr}` : ""}`;

    return { data: JSON.stringify({ url, token }), error: null };
  } catch (e) {
    return { data: null, error: msg(e, "Failed to build export URL") };
  }
}
