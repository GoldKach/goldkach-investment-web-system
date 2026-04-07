import { NextRequest, NextResponse } from "next/server";
import { generateAllPerformanceReports } from "@/actions/portfolioPerformanceReports";

/**
 * Daily cron endpoint — generates performance reports for ALL portfolios.
 *
 * Schedule this to run once per day after market close (e.g. 11:00 PM UTC).
 *
 * Vercel Cron (vercel.json):
 *   { "crons": [{ "path": "/api/cron/generate-daily-reports", "schedule": "0 23 * * *" }] }
 *
 * External cron (cURL):
 *   curl -X POST https://yourdomain.com/api/cron/generate-daily-reports \
 *        -H "Authorization: Bearer YOUR_CRON_SECRET"
 *
 * Set CRON_SECRET in your .env to protect this endpoint.
 */

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(req: NextRequest) {
  // Verify the request is from an authorised cron caller
  if (CRON_SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await generateAllPerformanceReports();

    if (!result.success) {
      console.error("[cron] generate-daily-reports failed:", result.error);
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    console.log(`[cron] Daily reports generated: ${result.data?.success}/${result.data?.total} succeeded`);

    return NextResponse.json({
      success: true,
      date: new Date().toISOString().split("T")[0],
      generated: result.data?.success ?? 0,
      failed: result.data?.failed ?? 0,
      total: result.data?.total ?? 0,
      errors: result.data?.errors ?? [],
    });
  } catch (err: any) {
    console.error("[cron] generate-daily-reports error:", err?.message ?? err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}

// Also support GET for Vercel Cron (which uses GET by default)
export async function GET(req: NextRequest) {
  return POST(req);
}
