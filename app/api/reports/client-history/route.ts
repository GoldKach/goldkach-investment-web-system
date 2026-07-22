import { NextRequest, NextResponse } from "next/server";
import { readSnapshot, listSnapshotDates } from "@/lib/snapshot-store";

/**
 * GET /api/reports/client-history             → list all available snapshot dates
 * GET /api/reports/client-history?date=YYYY-MM-DD → return client list for that date
 */
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");

  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
    }

    const snapshot = await readSnapshot(`clients/${date}.json`);
    if (!snapshot) {
      return NextResponse.json({ error: `No client snapshot found for ${date}.` }, { status: 404 });
    }
    return NextResponse.json(snapshot);
  }

  const dates = await listSnapshotDates("clients");
  return NextResponse.json({ dates });
}
