import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  buildClientPortfolios,
  buildLiveAumRows,
  buildCashClientRows,
  computeAumSummary,
  type AumSnapshot,
} from "@/lib/aum-compute";
import { storeSnapshot } from "@/lib/snapshot-store";

/**
 * Daily cron: generates and stores a dated AUM + cash-clients snapshot.
 *
 * Vercel cron (vercel.json): { "path": "/api/cron/generate-aum-snapshot", "schedule": "0 22 * * *" }
 *
 * Required env vars:
 *   CRON_SECRET       — shared secret to protect this endpoint
 *   CRON_API_TOKEN    — backend bearer token for a service/admin account
 *   API_URL           — backend base URL (default http://localhost:8000/api/v1)
 *   BLOB_READ_WRITE_TOKEN — Vercel Blob token (omit to use local filesystem)
 */

const CRON_SECRET = process.env.CRON_SECRET;
const CRON_API_TOKEN = process.env.CRON_API_TOKEN;
const BASE_API_URL = process.env.API_URL || "http://localhost:8000/api/v1";

async function handler(req: NextRequest) {
  if (CRON_SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  try {
    const { data } = await axios.get(`${BASE_API_URL}/users?role=USER`, {
      headers: CRON_API_TOKEN ? { Authorization: `Bearer ${CRON_API_TOKEN}` } : {},
      timeout: 60_000,
    });

    const clients: any[] = Array.isArray(data.data)
      ? data.data
      : (data.data?.users ?? data.data?.data ?? []);

    const clientPortfolios = buildClientPortfolios(clients);
    const rows = buildLiveAumRows(clientPortfolios);
    const cashClients = buildCashClientRows(clientPortfolios);
    const summary = computeAumSummary(rows, clients.length);

    const snapshot: AumSnapshot = {
      date: today,
      generatedAt: new Date().toISOString(),
      summary,
      rows,
      cashClients,
    };

    const url = await storeSnapshot(`aum/${today}.json`, snapshot);

    console.log(`[cron] AUM snapshot stored for ${today}: ${url}`);
    console.log(`[cron] Rows: ${rows.length}, Cash clients: ${cashClients.length}, AUM: $${summary.totalAUM.toFixed(2)}`);

    return NextResponse.json({
      success: true,
      date: today,
      rowCount: rows.length,
      cashClientsCount: cashClients.length,
      summary,
      storageUrl: url,
    });
  } catch (err: any) {
    console.error("[cron] generate-aum-snapshot error:", err?.message ?? err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
