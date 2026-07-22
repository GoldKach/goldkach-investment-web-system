import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { storeSnapshot } from "@/lib/snapshot-store";
import type { ClientListSnapshot } from "@/lib/aum-compute";

/**
 * Daily cron: captures and stores a dated snapshot of all registered clients.
 *
 * Vercel cron (vercel.json): { "path": "/api/cron/capture-client-list", "schedule": "0 22 * * *" }
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

  const today = new Date().toISOString().split("T")[0];

  try {
    const { data } = await axios.get(`${BASE_API_URL}/users?role=USER`, {
      headers: CRON_API_TOKEN ? { Authorization: `Bearer ${CRON_API_TOKEN}` } : {},
      timeout: 60_000,
    });

    const clients: any[] = Array.isArray(data.data)
      ? data.data
      : (data.data?.users ?? data.data?.data ?? []);

    const snapshot: ClientListSnapshot = {
      date: today,
      generatedAt: new Date().toISOString(),
      totalClients: clients.length,
      clients: clients.map((c: any) => ({
        id: c.id,
        firstName: c.firstName ?? "",
        lastName: c.lastName ?? "",
        email: c.email ?? "",
        role: c.role ?? "USER",
        status: c.status ?? "",
        isApproved: c.isApproved ?? false,
        createdAt: c.createdAt ?? "",
      })),
    };

    const url = await storeSnapshot(`clients/${today}.json`, snapshot);

    console.log(`[cron] Client list stored for ${today}: ${url} (${clients.length} clients)`);

    return NextResponse.json({
      success: true,
      date: today,
      totalClients: clients.length,
      storageUrl: url,
    });
  } catch (err: any) {
    console.error("[cron] capture-client-list error:", err?.message ?? err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
