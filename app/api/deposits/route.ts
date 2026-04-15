import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    
    const queryString = searchParams.toString()
    const response = await fetch(`${apiUrl}/deposits${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
      headers: {
        "Cookie": req.headers.get("Cookie") || "",
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Failed to fetch deposits" }))
      return NextResponse.json({ error: error.message }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data: data.data, meta: data.meta })
  } catch (error) {
    console.error("Fetch deposits error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    const response = await fetch(`${apiUrl}/deposits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": req.headers.get("Cookie") || "",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Failed to create deposit" }))
      return NextResponse.json({ error: error.message }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data: data.data })
  } catch (error) {
    console.error("Create deposit error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}