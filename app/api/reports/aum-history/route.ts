import { NextRequest, NextResponse } from "next/server";
import { readSnapshot, listSnapshotDates } from "@/lib/snapshot-store";

/**
 * GET /api/reports/aum-history             → list all available snapshot dates
 * GET /api/reports/aum-history?date=YYYY-MM-DD → return snapshot for that date
 */
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");

  if (date) {
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
    }

    const snapshot = await readSnapshot(`aum/${date}.json`);
    if (!snapshot) {
      return NextResponse.json({ error: `No AUM snapshot found for ${date}.` }, { status: 404 });
    }
    return NextResponse.json(snapshot);
  }

  // Return list of available dates
  const dates = await listSnapshotDates("aum");
  return NextResponse.json({ dates });
}
