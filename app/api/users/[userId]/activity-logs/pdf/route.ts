export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { userId } = await params;
    const { searchParams } = new URL(req.url);

    const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const base    = API_URL.endsWith("/api/v1") ? API_URL : `${API_URL}/api/v1`;

    const qs = searchParams.toString();
    const upstream = `${base}/users/${userId}/activity-logs/pdf${qs ? `?${qs}` : ""}`;

    const response = await fetch(upstream, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const body = await response.text();
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: response.status }
      );
    }

    const pdf = await response.arrayBuffer();

    const filename = response.headers.get("Content-Disposition")
      ?? `attachment; filename="activity-log-${userId}.pdf"`;

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": filename,
      },
    });
  } catch (err) {
    console.error("[activity-logs/pdf] proxy error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
