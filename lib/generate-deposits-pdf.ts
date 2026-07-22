import type { Deposit } from "@/actions/deposits";

function fmtAmount(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtTime(iso?: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function clientName(d: Deposit) {
  return [d.user?.firstName, d.user?.lastName].filter(Boolean).join(" ") || "—";
}

function gkAccount(d: Deposit) {
  if (d.depositTarget === "MASTER") return d.masterWallet?.accountNumber ?? "";
  return d.portfolioWallet?.accountNumber ?? "";
}

function statusColor(s: string) {
  if (s === "APPROVED") return "#166534";
  if (s === "PENDING")  return "#92400e";
  return "#991b1b";
}

function buildHtml(deposits: Deposit[], title: string, period: string, logoUrl: string): string {
  const approved  = deposits.filter(d => d.transactionStatus === "APPROVED");
  const pending   = deposits.filter(d => d.transactionStatus === "PENDING");
  const rejected  = deposits.filter(d => d.transactionStatus === "REJECTED");
  const totalAmt  = approved.reduce((s, d) => s + d.amount, 0);
  const pendingAmt = pending.reduce((s, d) => s + d.amount, 0);
  const now = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" } as any);

  const rows = deposits.map((d, i) => `
    <tr>
      <td style="text-align:center;color:#555;">${i + 1}</td>
      <td>
        <span style="font-weight:600;">${fmtDate(d.createdAt)}</span><br/>
        <span style="font-size:9px;color:#888;">${fmtTime(d.createdAt)}</span>
      </td>
      <td>
        <span style="font-weight:600;">${clientName(d)}</span><br/>
        <span style="font-size:9px;color:#888;">${d.user?.email ?? ""}</span>
        ${gkAccount(d) ? `<br/><span style="font-size:9px;font-family:monospace;font-weight:700;color:#1e40af;">${gkAccount(d)}</span>` : ""}
      </td>
      <td>
        <span style="background:${d.depositTarget === "MASTER" ? "#dbeafe" : "#ede9fe"};color:${d.depositTarget === "MASTER" ? "#1e40af" : "#5b21b6"};padding:2px 7px;border-radius:999px;font-size:9px;font-weight:700;">
          ${d.depositTarget === "MASTER" ? "External" : "Allocation"}
        </span>
      </td>
      <td style="font-family:monospace;font-size:9.5px;color:#374151;">${d.transactionId ?? "—"}</td>
      <td style="text-align:right;font-weight:700;font-size:12px;">${fmtAmount(d.amount)}</td>
      <td style="font-weight:700;color:${statusColor(d.transactionStatus)};">${d.transactionStatus}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>${title} — ${period}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#111;padding:28px 32px;}
    @media print{
      body{padding:16px 18px;}
      @page{margin:12mm 10mm;size:A4 landscape;}
    }
    .watermark{
      position:fixed;
      top:50%;left:50%;
      transform:translate(-50%,-50%) rotate(-35deg);
      width:380px;
      opacity:0.07;
      pointer-events:none;
      z-index:-1;
    }
    @media print{
      .watermark{opacity:0.09;}
    }
    table{width:100%;border-collapse:collapse;margin-top:0;}
    thead th{
      background:#1e3a8a;color:#fff;padding:8px 10px;
      text-align:left;font-size:10.5px;font-weight:700;
    }
    thead th:last-child{text-align:center;}
    tbody td{padding:7px 10px;border-bottom:1px solid #e5e7eb;vertical-align:middle;}
    tbody tr:nth-child(even) td{background:#f8faff;}
    tbody tr:hover td{background:#eef2ff;}
    .logo-img{height:48px;display:block;}
    .header-grid{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;padding-bottom:14px;border-bottom:3px solid #1e3a8a;}
    .report-title{font-size:20px;font-weight:700;color:#1e3a8a;margin-bottom:3px;}
    .report-period{font-size:12px;color:#4b5563;font-weight:500;}
    .gen-label{font-size:9px;color:#888;text-transform:uppercase;letter-spacing:0.5px;}
    .gen-val{font-size:11px;font-weight:600;color:#111;margin-top:2px;}
    .summary-bar{display:flex;gap:0;margin-bottom:18px;border:1px solid #c7d2fe;border-radius:8px;overflow:hidden;}
    .summary-item{flex:1;padding:10px 14px;border-right:1px solid #c7d2fe;background:#f0f4ff;}
    .summary-item:last-child{border-right:none;}
    .s-label{font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;}
    .s-val{font-size:16px;font-weight:700;color:#1e3a8a;}
    .s-val.green{color:#166534;}
    .s-val.amber{color:#92400e;}
    .s-val.red{color:#991b1b;}
    .footer{margin-top:18px;font-size:9px;color:#9ca3af;text-align:center;border-top:1px solid #e5e7eb;padding-top:10px;}
  </style>
</head>
<body>

  <img class="watermark" src="${logoUrl}" alt="" onerror="this.style.display='none'" />

  <div class="header-grid">
    <div>
      <img class="logo-img" src="${logoUrl}" alt="GoldKach" onerror="this.style.display='none'"/>
      <div class="report-title" style="margin-top:8px;">${title}</div>
      <div class="report-period">${period}</div>
    </div>
    <div style="text-align:right;">
      <div class="gen-label">Generated</div>
      <div class="gen-val">${now}</div>
      <div class="gen-label" style="margin-top:6px;">Total Records</div>
      <div class="gen-val">${deposits.length}</div>
    </div>
  </div>

  <div class="summary-bar">
    <div class="summary-item">
      <div class="s-label">Total Deposits</div>
      <div class="s-val">${deposits.length}</div>
    </div>
    <div class="summary-item">
      <div class="s-label">Approved Amount</div>
      <div class="s-val green">${fmtAmount(totalAmt)}</div>
    </div>
    <div class="summary-item">
      <div class="s-label">Approved</div>
      <div class="s-val green">${approved.length}</div>
    </div>
    <div class="summary-item">
      <div class="s-label">Pending</div>
      <div class="s-val amber">${pending.length}${pendingAmt > 0 ? ` &nbsp;<span style="font-size:10px;">(${fmtAmount(pendingAmt)})</span>` : ""}</div>
    </div>
    <div class="summary-item">
      <div class="s-label">Rejected</div>
      <div class="s-val red">${rejected.length}</div>
    </div>
  </div>

  ${deposits.length === 0 ? `<div style="text-align:center;padding:40px;color:#9ca3af;font-size:13px;">No deposits in this period.</div>` : `
  <table>
    <thead>
      <tr>
        <th style="width:36px;text-align:center;">#</th>
        <th style="width:100px;">Date</th>
        <th>Client</th>
        <th style="width:90px;">Type</th>
        <th style="width:130px;">Transaction ID</th>
        <th style="width:110px;text-align:right;">Amount</th>
        <th style="width:80px;text-align:center;">Status</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`}

  <div class="footer">
    GoldKach Limited &nbsp;•&nbsp; Confidential — Internal Use Only &nbsp;•&nbsp; ${new Date().getFullYear()}
  </div>

</body>
</html>`;
}

export interface DepositExportPeriod {
  label: string;
  period: string;
  deposits: Deposit[];
}

export function downloadDepositsPdf({ label, period, deposits }: DepositExportPeriod) {
  const logoUrl = `${window.location.origin}/logos/GoldKach-Logo-New-3.png`;
  const html = buildHtml(deposits, label, period, logoUrl);
  const win = window.open("", "_blank", "width=1200,height=900");
  if (!win) {
    alert("Popup blocked. Please allow popups for this site to export PDFs.");
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 600);
}
