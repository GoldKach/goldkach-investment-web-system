import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.MAIL_FROM || "GoldKach <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://goldkach.co.ug";
const LOGO_URL = `${APP_URL}/logos/GoldKach-Logo-New-1.png`;

export async function POST(req: NextRequest) {
  try {
    const { recipients, subject, message } = await req.json();

    if (!recipients?.length || !subject || !message) {
      return NextResponse.json({ error: "recipients, subject and message are required" }, { status: 400 });
    }

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- Header with logo -->
  <tr><td style="background:linear-gradient(135deg,#1e2d5a 0%,#2d4a8a 100%);padding:28px 40px;text-align:center;">
    <img src="${LOGO_URL}" alt="GoldKach" width="80" height="80"
      style="display:block;margin:0 auto 12px;border-radius:8px;object-fit:contain;" />
    <div style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:0.5px;">GoldKach</div>
    <div style="color:#38bdf8;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;margin-top:4px;">
      Unlocking Global Investments
    </div>
  </td></tr>

  <!-- Subject banner -->
  <tr><td style="background:#f0f4ff;border-bottom:3px solid #38bdf8;padding:14px 40px;">
    <div style="font-size:14px;font-weight:700;color:#1e2d5a;">${subject.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:32px 40px;">
    <div style="font-size:15px;color:#1e293b;line-height:1.8;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#1e2d5a;padding:24px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="color:#ffffff;font-size:13px;font-weight:700;padding-bottom:10px;">
          GoldKach Investment Management
        </td>
      </tr>
      <tr>
        <td style="color:#94a3b8;font-size:11px;line-height:1.8;">
          3rd Floor, Kanjokya House, Suite F3 &ndash; F4<br/>
          Plot 90, Kanjokya Street, P.O.Box 500094<br/>
          Kampala, Uganda<br/>
          <span style="color:#38bdf8;">+256 200903314 &nbsp;/&nbsp; +256 393246074</span>
        </td>
      </tr>
      <tr><td style="padding-top:10px;border-top:1px solid #2d4a8a;margin-top:10px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:16px;">
            <a href="mailto:info@goldkach.co.ug" style="color:#38bdf8;font-size:11px;text-decoration:none;">
              info@goldkach.co.ug
            </a>
          </td>
          <td>
            <a href="mailto:itsupport@goldkach.co.ug" style="color:#38bdf8;font-size:11px;text-decoration:none;">
              itsupport@goldkach.co.ug
            </a>
          </td>
        </tr></table>
      </td></tr>
      <tr>
        <td style="color:#64748b;font-size:10px;padding-top:8px;">
          &copy; ${new Date().getFullYear()} GoldKach Investment Management. All rights reserved.
        </td>
      </tr>
    </table>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    // Resend batch — send individually to avoid exposing all recipients
    const results = await Promise.allSettled(
      recipients.map((email: string) =>
        resend.emails.send({ from: FROM, to: email, subject, html })
      )
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({ success: true, sent, failed, total: recipients.length });
  } catch (err: any) {
    console.error("send-bulk-email error:", err?.message ?? err);
    return NextResponse.json({ error: err?.message || "Failed to send emails" }, { status: 500 });
  }
}
