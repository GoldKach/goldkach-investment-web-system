// app/(dashboard)/actions/migrations.ts
"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 60000, // migrations can take a while
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

export interface MigrationPortfolioResult {
  userPortfolioId: string;
  userEmail:       string;
  portfolioName:   string;
  actions:         string[];
  status:          "migrated" | "already_up_to_date" | "failed";
  error?:          string;
}

export interface MigrationSummary {
  total:               number;
  migrated:            number;
  already_up_to_date:  number;
  failed:              number;
  dryRun:              boolean;
}

export interface MigrationResult {
  summary: MigrationSummary;
  results: MigrationPortfolioResult[];
}

export interface BackfillInput {
  dryRun?:               boolean; // true = preview only, no DB writes
  defaultBankFee?:       number;  // default: 30
  defaultTransactionFee?: number; // default: 10
  defaultFeeAtBank?:     number;  // default: 10
}

/* -------------------------------------------------------------------------- */
/*  Actions                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * POST /migrations/backfill-portfolios
 *
 * Migrates all existing UserPortfolios to the new structure:
 * - Sets customName from portfolio.name if missing
 * - Creates PortfolioWallet if missing
 * - Creates SubPortfolio generation=0 (X slice) if missing
 * - Creates SubPortfolioAsset snapshots
 * - Creates MasterWallet if missing
 * - Syncs all MasterWallet NAVs
 *
 * Always run with dryRun=true first to preview what will change.
 */
export async function backfillPortfolios(input?: BackfillInput) {
  try {
    const headers = await authHeaderFromCookies();
    const payload: BackfillInput = {
      dryRun:               input?.dryRun               ?? true, // safe default
      defaultBankFee:       input?.defaultBankFee       ?? 30,
      defaultTransactionFee: input?.defaultTransactionFee ?? 10,
      defaultFeeAtBank:     input?.defaultFeeAtBank     ?? 10,
    };
    const res = await api.post("/migrations/backfill-portfolios", payload, { headers });
    return {
      success:    res.status < 300,
      data:       res.data?.data as MigrationResult,
      error:      res.data?.error ?? null,
      partialFail: res.status === 207,
    };
  } catch (e: any) {
    return { success: false, error: msg(e, "Migration failed.") };
  }
}

/* -------------------------------------------------------------------------- */
/*  Convenience helpers                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Run a dry-run preview — no DB writes.
 * Returns what would be created per portfolio.
 */
export async function previewBackfill(fees?: {
  bankFee?: number;
  transactionFee?: number;
  feeAtBank?: number;
}) {
  return backfillPortfolios({
    dryRun:               true,
    defaultBankFee:       fees?.bankFee,
    defaultTransactionFee: fees?.transactionFee,
    defaultFeeAtBank:     fees?.feeAtBank,
  });
}

/**
 * Run the actual migration.
 * Call previewBackfill() first to confirm what will change.
 */
export async function runBackfill(fees?: {
  bankFee?: number;
  transactionFee?: number;
  feeAtBank?: number;
}) {
  return backfillPortfolios({
    dryRun:               false,
    defaultBankFee:       fees?.bankFee,
    defaultTransactionFee: fees?.transactionFee,
    defaultFeeAtBank:     fees?.feeAtBank,
  });
}