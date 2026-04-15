export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { approvedById, approvedByName, assetPrices } = body

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    const response = await fetch(`${apiUrl}/deposits/${id}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": req.headers.get("Cookie") || "",
      },
      body: JSON.stringify({
        approvedById,
        approvedByName,
        assetPrices,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Failed to approve deposit" }))
      return NextResponse.json({ error: error.message || "Failed to approve deposit" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data: data.data })
  } catch (error) {
    console.error("Approve deposit error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}