export interface CashClientRow {
  name: string;
  accountNumber: string;
  pureDepositCash: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalRedemptions: number;
}

export function downloadCashClientsPdf(rows: CashClientRow[]) {
  const logoUrl = `${window.location.origin}/logos/GoldKach-Logo-New-3.png`;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const totalCash = rows.reduce((s, r) => s + r.pureDepositCash, 0);
  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const rowsHtml = rows
    .map(
      (r, i) => `
      <tr class="${i % 2 === 0 ? "even" : "odd"}">
        <td class="num">${i + 1}</td>
        <td>${r.name}</td>
        <td class="mono">${r.accountNumber || "—"}</td>
        <td class="money">${fmt(r.totalDeposited)}</td>
        <td class="money">${fmt(r.totalWithdrawn)}</td>
        <td class="money">${fmt(r.totalRedemptions)}</td>
        <td class="money cash">${fmt(r.pureDepositCash)}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Cash Clients Report — GoldKach</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#1e293b;padding:28px 32px;position:relative;}
  .watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);width:380px;opacity:0.07;pointer-events:none;z-index:-1;}
  @media print{.watermark{opacity:0.09;}}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:14px;border-bottom:2px solid #2B2F77;}
  .logo-wrap img{height:48px;object-fit:contain;}
  .header-right{text-align:right;}
  .header-right h1{font-size:15px;font-weight:700;color:#2B2F77;margin-bottom:2px;}
  .header-right p{font-size:10px;color:#64748b;}
  .section-title{font-size:12px;font-weight:700;color:#2B2F77;margin:16px 0 8px;text-transform:uppercase;letter-spacing:.5px;}
  table{width:100%;border-collapse:collapse;margin-bottom:16px;}
  th{background:#2B2F77;color:#fff;padding:7px 10px;text-align:left;font-size:10px;font-weight:600;}
  th.money,td.money{text-align:right;}
  th.num,td.num{text-align:center;width:36px;}
  td{padding:6px 10px;border-bottom:1px solid #e2e8f0;vertical-align:middle;}
  tr.even{background:#f8fafc;}
  td.cash{font-weight:700;color:#b45309;}
  td.mono{font-family:monospace;font-size:10px;color:#3b82f6;font-weight:600;}
  .total-row td{border-top:2px solid #2B2F77;font-weight:700;padding-top:8px;}
  .total-row .cash{font-size:12px;color:#b45309;}
  .summary-box{display:flex;gap:20px;margin-bottom:18px;}
  .kpi{flex:1;background:#f1f5f9;border-radius:6px;padding:10px 14px;border-left:3px solid #2B2F77;}
  .kpi.amber{border-left-color:#d97706;background:#fffbeb;}
  .kpi p.label{font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;}
  .kpi p.value{font-size:16px;font-weight:700;color:#1e293b;}
  .kpi.amber p.value{color:#b45309;}
  .footer{margin-top:20px;padding-top:10px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:9px;color:#94a3b8;}
  @media print{body{padding:12px 16px;}}
</style>
</head>
<body>
<img class="watermark" src="${logoUrl}" alt="" onerror="this.style.display='none'"/>

<div class="header">
  <div class="logo-wrap"><img src="${logoUrl}" alt="GoldKach" onerror="this.style.display='none'"/></div>
  <div class="header-right">
    <h1>Cash Clients Report</h1>
    <p>Clients with Unallocated Deposit Cash</p>
    <p>Generated: ${dateStr}</p>
  </div>
</div>

<div class="summary-box">
  <div class="kpi">
    <p class="label">Total Clients</p>
    <p class="value">${rows.length}</p>
  </div>
  <div class="kpi amber">
    <p class="label">Total Cash (Unallocated)</p>
    <p class="value">${fmt(totalCash)}</p>
  </div>
</div>

<p class="section-title">Client Cash Summary</p>
<table>
  <thead>
    <tr>
      <th class="num">#</th>
      <th>Investor Name</th>
      <th>GK Account</th>
      <th class="money">Total Deposited</th>
      <th class="money">Withdrawn</th>
      <th class="money">Redeemed</th>
      <th class="money">Cash Balance</th>
    </tr>
  </thead>
  <tbody>
    ${rowsHtml}
    <tr class="total-row">
      <td></td>
      <td colspan="2"><strong>TOTAL</strong></td>
      <td class="money">${fmt(rows.reduce((s, r) => s + r.totalDeposited, 0))}</td>
      <td class="money">${fmt(rows.reduce((s, r) => s + r.totalWithdrawn, 0))}</td>
      <td class="money">${fmt(rows.reduce((s, r) => s + r.totalRedemptions, 0))}</td>
      <td class="money cash">${fmt(totalCash)}</td>
    </tr>
  </tbody>
</table>

<p style="font-size:9px;color:#64748b;font-style:italic;">
  Cash Balance = Total Deposited − Deposit Fees − Allocated to Portfolios − Withdrawn.<br/>
  Redeemed amounts (portfolio → master wallet) are excluded from the cash balance shown above.
</p>

<div class="footer">
  <span>GoldKach Investment Management</span>
  <span>Confidential — Internal Use Only</span>
  <span>${dateStr}</span>
</div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.onload = () => {
    setTimeout(() => {
      win.focus();
      win.print();
    }, 400);
  };
}
