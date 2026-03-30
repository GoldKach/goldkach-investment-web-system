// app/(dashboard)/actions/topup-events.ts
"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 60000,
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
/*  Types                                                                       */
/* -------------------------------------------------------------------------- */

export type TopupStatus = "PENDING" | "MERGED";

export interface TopupEvent {
  id:               string;
  userPortfolioId:  string;
  depositId?:       string | null;
  topupAmount:      number;
  previousTotal:    number;
  newTotalInvested: number;
  newTotalCloseValue: number;
  newTotalLossGain: number;
  newTotalFees:     number;
  newNetAssetValue: number;
  status:           TopupStatus;
  mergedAt?:        string | null;
  createdAt:        string;
  deposit?: {
    id:             string;
    amount:         number;
    transactionStatus: string;
    createdByName?:  string | null;
    approvedByName?: string | null;
    createdAt:      string;
  } | null;
  userPortfolio?: {
    id:          string;
    customName:  string;
    userId:      string;
    portfolio?: { id: string; name: string } | null;
  } | null;
  mergedSubPortfolios?: Array<{
    id:         string;
    generation: number;
    label:      string;
    amountInvested: number;
    totalCloseValue: number;
    totalFees:  number;
  }>;
}

/** Chronological timeline entry — returned by GET /topup-events/portfolio/:id */
export interface TopupTimelineEntry {
  eventId:          string;
  topupAmount:      number;
  previousTotal:    number;
  newTotalInvested: number;
  newCloseValue:    number;
  newNAV:           number;
  gainLoss:         number;
  totalFees:        number;
  status:           TopupStatus;
  mergedAt:         string | null;
  depositDate?:     string;
  approvedAt?:      string;
  slices: Array<{
    id:              string;
    generation:      number;
    label:           string;
    amountInvested:  number;
    totalCloseValue: number;
    totalFees:       number;
  }>;
}

export interface ListTopupEventsParams {
  userPortfolioId?: string;
  userId?:          string;
  status?:          TopupStatus;
  page?:            number;
  pageSize?:        number;
}

/* -------------------------------------------------------------------------- */
/*  Actions                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * GET /topup-events?userPortfolioId=...&userId=...&status=...
 * Full paginated list of top-up events.
 */
export async function listTopupEvents(params?: ListTopupEventsParams) {
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get("/topup-events", { headers, params });
    return {
      success: true,
      data:    (res.data?.data ?? []) as TopupEvent[],
      meta:    res.data?.meta ?? null,
    };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to load top-up events.") };
  }
}

/** GET /topup-events/:id */
export async function getTopupEventById(id: string) {
  if (!id) return { success: false, error: "Missing id." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(`/topup-events/${id}`, { headers });
    return { success: true, data: res.data?.data as TopupEvent };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch top-up event.") };
  }
}

/**
 * GET /topup-events/portfolio/:userPortfolioId
 * Returns a chronological timeline showing before/after NAV at each top-up.
 * Best used for the portfolio history chart on the client dashboard.
 */
export async function getTopupTimeline(userPortfolioId: string) {
  if (!userPortfolioId) return { success: false, error: "Missing userPortfolioId." };
  try {
    const headers = await authHeaderFromCookies();
    const res = await api.get(
      `/topup-events/portfolio/${encodeURIComponent(userPortfolioId)}`,
      { headers }
    );
    return { success: true, data: (res.data?.data ?? []) as TopupTimelineEntry[] };
  } catch (e: any) {
    return { success: false, error: msg(e, "Failed to fetch top-up timeline.") };
  }
}

/* -------------------------------------------------------------------------- */
/*  Convenience helpers                                                         */
/* -------------------------------------------------------------------------- */

/** Get all top-up events for a specific user across all their portfolios */
export async function getUserTopupEvents(
  userId:   string,
  status?:  TopupStatus
) {
  return listTopupEvents({ userId, status });
}

/**
 * Get NAV growth history from the timeline.
 * Returns an array of { date, nav, invested, gainLoss } — ready for charts.
 */
export async function getNavGrowthHistory(userPortfolioId: string) {
  const result = await getTopupTimeline(userPortfolioId);
  if (!result.success || !result.data) return result;

  const chartData = result.data.map((entry) => ({
    date:      entry.approvedAt ?? entry.mergedAt ?? entry.depositDate,
    nav:       entry.newNAV,
    invested:  entry.newTotalInvested,
    gainLoss:  entry.gainLoss,
    topupAmount: entry.topupAmount,
  }));

  return { success: true, data: chartData };
}