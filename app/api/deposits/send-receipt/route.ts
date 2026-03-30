import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
// Use verified sender — Resend requires a verified domain.
// "onboarding@resend.dev" works for testing without domain verification.
const FROM = process.env.MAIL_FROM || "GoldKach <onboarding@resend.dev>"

function row(label: string, value: string) {
  return `<div style="display:flex;justify-content:space-between;margin-bottom:7px;gap:8px;">
    <span style="font-size:11px;color:#64748b;flex-shrink:0;">${label}</span>
    <span style="font-size:11px;color:#1e293b;font-weight:600;text-align:right;">${value}</span>
  </div>`
}

function sectionTitle(title: string) {
  return `<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#2d4a8a;border-bottom:2px solid #38bdf8;padding-bottom:4px;margin-bottom:10px;">${title}</div>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { deposit } = body

    if (!deposit?.user?.email) {
      return NextResponse.json({ error: "No recipient email" }, { status: 400 })
    }

    const clientName =
      [deposit.user?.firstName, deposit.user?.lastName].filter(Boolean).join(" ") ||
      deposit.user?.email

    const accountNo =
      deposit.masterWallet?.accountNumber ||
      deposit.portfolioWallet?.accountNumber ||
      "N/A"

    const fmt      = (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    const fmtDate  = (d: string) => new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })

    const methodLabel: Record<string, string> = {
      BANK_TRANSFER: "Bank Transfer",
      CASH:          "Cash Deposit",
      CHEQUE:        "Cheque",
      OTHER:         "Other",
    }

    const statusColor: Record<string, string> = {
      PENDING:  "#d97706",
      APPROVED: "#16a34a",
      REJECTED: "#dc2626",
    }

    const approvalBlock = deposit.transactionStatus === "APPROVED" ? `
      ${sectionTitle("Approval Details")}
      ${row("Approved By", deposit.approvedByName || "N/A")}
      ${row("Approved At", deposit.approvedAt ? fmtDate(deposit.approvedAt) : "N/A")}
    ` : ""

    const rejectionBlock = deposit.transactionStatus === "REJECTED" ? `
      ${sectionTitle("Rejection Details")}
      ${row("Rejected By", deposit.rejectedByName || "N/A")}
      ${row("Rejected At", deposit.rejectedAt ? fmtDate(deposit.rejectedAt) : "N/A")}
      ${deposit.rejectReason ? `<div style="font-size:11px;color:#dc2626;background:#fef2f2;padding:8px 10px;border-radius:6px;border:1px solid #fecaca;margin-top:4px;">${deposit.rejectReason}</div>` : ""}
    ` : ""

    const notesBlock = deposit.description ? `
      ${sectionTitle("Notes")}
      <div style="font-size:11px;color:#475569;line-height:1.6;background:#f8fafc;padding:10px 12px;border-radius:6px;border:1px solid #e2e8f0;">${deposit.description}</div>
    ` : ""

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

<tr><td style="background:linear-gradient(135deg,#1e2d5a 0%,#2d4a8a 100%);padding:32px 40px;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td>
  <div style="color:#ffffff;font-size:24px;font-weight:800;letter-spacing:0.5px;">GoldKach</div>
  <div style="color:#38bdf8;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;">Unlocking Global Investments</div>
</td>
<td align="right" style="vertical-align:top;">
  <div style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Deposit Receipt</div>
  <div style="color:#ffffff;font-size:14px;font-weight:700;margin-top:4px;">#${deposit.id.slice(0, 8).toUpperCase()}</div>
  <div style="color:#94a3b8;font-size:11px;margin-top:2px;">${fmtDate(deposit.createdAt)}</div>
</td>
</tr></table>
</td></tr>

<tr><td style="background:#f0f4ff;border-bottom:3px solid #38bdf8;padding:12px 40px;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Status</td>
<td align="right" style="font-size:13px;font-weight:700;color:${statusColor[deposit.transactionStatus] ?? "#64748b"};text-transform:uppercase;letter-spacing:1px;">
  &#9679; ${deposit.transactionStatus}
</td>
</tr></table>
</td></tr>

<tr><td style="background:#f8fafc;padding:28px 40px;text-align:center;border-bottom:1px solid #e2e8f0;">
  <div style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Deposit Amount</div>
  <div style="color:#1e2d5a;font-size:40px;font-weight:800;letter-spacing:-1px;">${fmt(deposit.amount)}</div>
</td></tr>

<tr><td style="padding:28px 40px;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="48%" style="vertical-align:top;padding-right:16px;">
  ${sectionTitle("Client Information")}
  ${row("Client Name", clientName)}
  ${row("Email",       deposit.user?.email || "N/A")}
  ${row("Account No",  accountNo)}
  <div style="margin-top:16px;"></div>
  ${sectionTitle("Transaction Details")}
  ${row("Transaction ID", deposit.transactionId || "N/A")}
  ${row("Reference No",   deposit.referenceNo   || "N/A")}
  ${row("Payment Method", methodLabel[deposit.method ?? ""] || deposit.method || "N/A")}
  ${row("Account No",     deposit.accountNo     || "N/A")}
</td>
<td width="4%"></td>
<td width="48%" style="vertical-align:top;">
  ${sectionTitle("Deposited By")}
  ${row("Staff Name", deposit.createdByName || "N/A")}
  ${row("Created At", fmtDate(deposit.createdAt))}
  <div style="margin-top:16px;"></div>
  ${approvalBlock}
  ${rejectionBlock}
  ${notesBlock}
</td>
</tr></table>
</td></tr>

<tr><td style="background:#1e2d5a;padding:16px 40px;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="color:#94a3b8;font-size:10px;">GoldKach Investment Management &middot; info@goldkach.co.ug &middot; goldkach.co.ug</td>
<td align="right" style="color:#38bdf8;font-size:10px;font-weight:600;">Unlocking Global Investments</td>
</tr></table>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

    const result = await resend.emails.send({
      from:    FROM,
      to:      deposit.user.email,
      subject: `GoldKach Deposit ${deposit.transactionStatus === "REJECTED" ? "Rejected" : "Receipt"} - $${deposit.amount.toLocaleString()} (#${deposit.id.slice(0, 8).toUpperCase()})`,
      html,
    })

    if (result.error) {
      console.error("Resend error:", JSON.stringify(result.error))
      return NextResponse.json({ error: result.error.message || "Email provider rejected the request" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("send-receipt error:", err?.message ?? err)
    return NextResponse.json({ error: err?.message || "Failed to send email" }, { status: 500 })
  }
}
