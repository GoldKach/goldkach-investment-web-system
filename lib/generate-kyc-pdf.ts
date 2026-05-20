/**
 * KYC PDF Generator — GoldKach Due Diligence Questionnaire
 * Matches the official GoldKach DDQ branding exactly.
 */

export interface KycClient {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  isApproved?: boolean | null;
  createdAt?: string | null;
  masterWallet?: { accountNumber?: string | null } | null;
  individualOnboarding?: Record<string, any> | null;
  companyOnboarding?: Record<string, any> | null;
}

function val(v?: string | null) {
  return v?.trim() || "";
}

function fmtDate(d?: string | null) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch {
    return d;
  }
}

function checkbox(checked: boolean) {
  return `<span style="display:inline-block;width:13px;height:13px;border:1.5px solid #111;text-align:center;line-height:11px;font-size:10px;font-weight:700;margin-right:2px;vertical-align:middle;">${checked ? "X" : "&nbsp;"}</span>`;
}

function buildKycHtml(client: KycClient, logoUrl: string): string {
  const o  = client.individualOnboarding  || {};
  const co = client.companyOnboarding     || {};

  const firstName  = val(client.firstName) || val(o.fullName?.split(" ")[0]);
  const lastName   = val(client.lastName)  || val(o.fullName?.split(" ").slice(-1)[0]);
  const middleName = val(o.fullName?.split(" ").slice(1, -1).join(" "));

  const mobile  = val(client.phone)  || val(o.phoneNumber);
  const email   = val(client.email)  || val(o.email);
  const address = val(o.homeAddress) || val(co.companyAddress);
  const isPEP   = o.isPEP === true || o.isPEP === "true" || co.isPEP === true || co.isPEP === "true";

  const beneficiaries: Array<{ fullName: string; dob: string }> = [
    ...(o.beneficiaries ?? []),
    ...(o.nextOfKin     ?? []),
  ].map((b: any) => ({
    fullName: val(b.fullName || b.name),
    dob:      fmtDate(b.dateOfBirth || b.dob),
  }));

  // ── Style constants ────────────────────────────────────────────────────────
  const NAVY   = "#2d2b72";
  const AMBER  = "#c47b1c";

  const tdN = `style="padding:5px 8px;border:1px solid #bbb;font-size:11px;vertical-align:top;width:6%;font-weight:700;color:#111;"`;
  const tdL = `style="padding:5px 8px;border:1px solid #bbb;font-size:11px;vertical-align:top;width:28%;color:#111;"`;
  const tdV = `style="padding:5px 8px;border:1px solid #bbb;font-size:11px;vertical-align:top;color:#111;"`;

  const thNavy  = `style="background:${NAVY};color:#fff;padding:7px 10px;font-size:11px;font-weight:700;text-align:center;border:1px solid ${NAVY};"`;
  const thAmber = `style="background:${AMBER};color:#fff;padding:6px 10px;font-size:11px;font-weight:700;text-align:center;border:1px solid ${AMBER};"`;
  const divider = `<tr><td colspan="3" style="background:${NAVY};height:5px;padding:0;border:none;"></td></tr>`;

  const logoHtml = logoUrl
    ? `<img src="${logoUrl}" alt="GoldKach" style="height:64px;display:block;"/>`
    : `<div style="font-size:11px;font-weight:700;color:${NAVY};line-height:1.2;">GoldKach<br/><span style="font-size:9px;color:#555;">Unlocking Global Investments</span></div>`;

  const headerHtml = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
      <div style="font-size:9px;color:#666;padding-top:4px;">GoldKach Investment Platform — KYC/DDQ Document</div>
      <div style="text-align:right;">${logoHtml}</div>
    </div>`;

  const beneficiaryRows = beneficiaries.length > 0
    ? beneficiaries.map(b => `
        <tr>
          <td colspan="3" ${tdV} style="padding:8px 10px;">
            <span style="margin-right:24px;"><strong>Full Name</strong>&nbsp;&nbsp;${b.fullName}</span>
            <span><strong>Date of Birth</strong>&nbsp;&nbsp;${b.dob}</span>
          </td>
        </tr>
        <tr><td colspan="3" style="height:28px;border:1px solid #bbb;"></td></tr>
      `).join("")
    : `<tr><td colspan="3" ${tdV} style="height:28px;">&nbsp;</td></tr>
       <tr><td colspan="3" style="height:28px;border:1px solid #bbb;"></td></tr>`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>GoldKach Due Diligence Questionnaire</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Arial, sans-serif; font-size:11px; color:#111; padding:28px 30px; max-width:800px; margin:0 auto; }
    table { width:100%; border-collapse:collapse; }
    h1 { text-align:center; font-size:20px; font-weight:700; margin:8px 0 6px; color:#111; letter-spacing:0.3px; }
    .section-heading { text-align:center; font-size:12px; font-weight:700; text-decoration:underline; text-transform:uppercase; margin:6px 0 8px; color:#111; }
    @media print {
      body { padding:14px 18px; }
      .page-break { page-break-before:always; }
    }
  </style>
</head>
<body>

  ${headerHtml}
  <h1>GoldKach Due Diligence Questionnaire</h1>
  <div class="section-heading">IDENTIFICATION</div>

  <table>
    <!-- Section 1 header -->
    <tr>
      <td ${thNavy} style="width:6%;">Section 1</td>
      <td ${thNavy} style="width:28%;">&nbsp;</td>
      <td ${thNavy}>NATURAL PERSONS ONLY</td>
    </tr>

    <!-- 1: Full Legal Name -->
    <tr>
      <td ${tdN} rowspan="4">1</td>
      <td ${tdL} rowspan="4">Full Legal Name(s) both<br/>official and any aliases</td>
      <td ${tdV}>1&nbsp;&nbsp;First Name&nbsp;&nbsp;&nbsp;${firstName}</td>
    </tr>
    <tr><td ${tdV}>2&nbsp;&nbsp;Middle Name&nbsp;&nbsp;&nbsp;${middleName}</td></tr>
    <tr><td ${tdV}>3&nbsp;&nbsp;Last Name/Family Name&nbsp;&nbsp;&nbsp;${lastName}</td></tr>
    <tr><td ${tdV}>4&nbsp;&nbsp;&nbsp;</td></tr>

    ${divider}

    <!-- 2: TIN -->
    <tr>
      <td ${tdN}>2</td>
      <td ${tdL}>Tax Identification Number<br/>(TIN)</td>
      <td ${tdV}>${val(o.tin) || val(co.tin)}</td>
    </tr>

    <!-- 3: Contact -->
    <tr>
      <td ${tdN} rowspan="2">3</td>
      <td ${tdL} rowspan="2">Contact Number(s)</td>
      <td ${tdV}>Mobile:&nbsp;&nbsp;${mobile}</td>
    </tr>
    <tr><td ${tdV}>Work Number:&nbsp;&nbsp;${val(o.workPhone)}</td></tr>

    <!-- 4: Nationality -->
    <tr>
      <td ${tdN}>4</td>
      <td ${tdL}>Nationality</td>
      <td ${tdV}>${val(o.nationality)}</td>
    </tr>

    <!-- 5: Date of Birth -->
    <tr>
      <td ${tdN}>5</td>
      <td ${tdL}>Date of Birth</td>
      <td ${tdV}>${fmtDate(o.dateOfBirth)}</td>
    </tr>

    <!-- 6: Email -->
    <tr>
      <td ${tdN}>6</td>
      <td ${tdL}>Email</td>
      <td ${tdV}>${email}</td>
    </tr>

    <!-- Residential Address (unnumbered) -->
    <tr>
      <td ${tdN}>&nbsp;</td>
      <td ${tdL}>Residential Address</td>
      <td ${tdV} style="white-space:pre-wrap;line-height:1.7;">${address || "&nbsp;"}</td>
    </tr>

    <!-- 7: Business Address -->
    <tr>
      <td ${tdN}>7</td>
      <td ${tdL}>Address of Principle Place of<br/>Business (if different from<br/>above)</td>
      <td ${tdV} style="white-space:pre-wrap;line-height:1.7;">${val(co.companyAddress) || "&nbsp;"}</td>
    </tr>

    <!-- 8: Nature of Business -->
    <tr>
      <td ${tdN}>8</td>
      <td ${tdL}>Intended Nature and<br/>Purpose of Business<br/>Relationship</td>
      <td ${tdV}>${val(o.primaryGoal) || val(co.primaryGoal)}</td>
    </tr>

    <!-- 9: Source of Funds -->
    <tr>
      <td ${tdN}>9</td>
      <td ${tdL}>Source of Funds <span style="font-size:9.5px;">(Please<br/>provide detailed information)</span></td>
      <td ${tdV}>${val(o.sourceOfIncome) || val(co.sourceOfIncome)}</td>
    </tr>

    ${divider}

    <!-- Question Response header (right column only) -->
    <tr>
      <td colspan="2" style="border:1px solid #bbb;background:#f9f9f9;">&nbsp;</td>
      <td ${thNavy}>Question Response</td>
    </tr>

    <!-- 10: PEP -->
    <tr>
      <td ${tdN}>10</td>
      <td ${tdL}>Are you or any party<br/>connected to you a<br/>politically exposed person<br/>(PEP)?</td>
      <td ${tdV}>Yes&nbsp;${checkbox(isPEP)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No&nbsp;${checkbox(!isPEP)}</td>
    </tr>

    <!-- Amber: Please complete form D -->
    <tr>
      <td colspan="3" ${thAmber}>Please complete form D for each PEP</td>
    </tr>

    <!-- 11 -->
    <tr>
      <td ${tdN}>11</td>
      <td ${tdL}>Which Country is your<br/>business based</td>
      <td ${tdV}>${val(o.countryOfResidence) || val(co.registrationCountry)}</td>
    </tr>

    <!-- 12 -->
    <tr>
      <td ${tdN}>12</td>
      <td ${tdL}>What type of products does<br/>your business sell or<br/>manufacture?</td>
      <td ${tdV}>${val(o.businessOwnership) || val(co.businessType)}</td>
    </tr>

    <!-- 13 -->
    <tr>
      <td ${tdN}>13</td>
      <td ${tdL}>Please provide further<br/>details in here if necessary</td>
      <td ${tdV} style="height:52px;">${val(o.sanctionsOrLegal) || val(co.sanctionsOrLegal)}</td>
    </tr>
  </table>

  <!-- ── PAGE 2 ─────────────────────────────────────────────────────────────── -->
  <div class="page-break" style="padding-top:28px;">

    ${headerHtml}

    <table>
      <!-- Client/Agents Declaration -->
      <tr><td colspan="3" ${thNavy}>Client/Agents Declaration</td></tr>
      <tr>
        <td colspan="3" ${tdV} style="font-size:10.5px;line-height:1.7;padding:10px 12px;">
          I declare that the information provided in these forms is true and correct. I am aware that I
          may be subject to prosecution and criminal sanctions under written law if I am found to have
          made any false statement that I know to be false or which I do not believe to be true, or if I
          have intentionally suppressed any material fact.
        </td>
      </tr>

      <!-- 14: Name -->
      <tr>
        <td ${tdN}>14</td>
        <td ${tdL}>Name of Client/Agent</td>
        <td ${tdV}>
          First name&nbsp;&nbsp;&nbsp;${firstName}<br/>
          Middle name&nbsp;&nbsp;&nbsp;${middleName}<br/>
          Last name/Family name&nbsp;&nbsp;&nbsp;${lastName}
        </td>
      </tr>

      <!-- 15: Passport/ID -->
      <tr>
        <td ${tdN}>15</td>
        <td ${tdL}>Identity/ Passport Number</td>
        <td ${tdV}>${val(o.passportNumber) || val(o.nationalId)}</td>
      </tr>

      <!-- 16: Date -->
      <tr>
        <td ${tdN}>16</td>
        <td ${tdL}>Date</td>
        <td ${tdV}>${fmtDate(o.createdAt || client.createdAt)}</td>
      </tr>

      <!-- 17: Signature -->
      <tr>
        <td ${tdN}>17</td>
        <td ${tdL}>Signature</td>
        <td ${tdV} style="height:65px;"></td>
      </tr>

      <!-- Amber: Verification -->
      <tr>
        <td colspan="3" ${thAmber}>Verification (for Office Use)</td>
      </tr>
      <tr>
        <td colspan="3" ${tdV} style="font-size:10.5px;line-height:1.7;padding:10px 12px;">
          Professional judgment must be exercised in determining if verification of identity should be
          that of &ldquo;Normal CDD&rdquo; or &ldquo;Enhanced CDD&rdquo; standards, depending on the risk assessment
          performed on the client.
        </td>
      </tr>

      <!-- 18: Normal CDD -->
      <tr>
        <td ${tdN}>18</td>
        <td ${tdL}>For Normal CDD, the<br/>following documents can be<br/>used to verify the client&rsquo;s<br/>identity:</td>
        <td ${tdV} style="line-height:2;">
          Copy of passport or identification card (for Ugandan and
          Ugandan Permanent Residents only)&nbsp;${checkbox(!!o.nationalIdUrl)}<br/>
          A document containing the address of the individual (e.g., a
          bank statement, a recent utility bill or tenancy agreement)&nbsp;${checkbox(!!o.bankStatementUrl)}
        </td>
      </tr>

      <!-- Beneficiaries -->
      <tr><td colspan="3" ${thNavy}>Beneficiaries</td></tr>
      ${beneficiaryRows}
    </table>

    <!-- Footer initials -->
    <div style="display:flex;justify-content:space-between;margin-top:32px;">
      <div>
        <div style="font-size:8.5px;color:#888;margin-bottom:2px;">Initial</div>
        <div style="border:1px solid #bbb;width:130px;height:52px;"></div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:8.5px;color:#888;margin-bottom:2px;">Initial</div>
        <div style="border:1px solid #bbb;width:130px;height:52px;"></div>
      </div>
    </div>

  </div>

</body>
</html>`;
}

/** Download KYC PDF for a single client */
export function downloadKycPdf(client: KycClient) {
  const logoUrl = `${window.location.origin}/logos/GoldKach-Logo-New-3.png`;
  const html = buildKycHtml(client, logoUrl);
  const win = window.open("", "_blank", "width=1050,height=950");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 700);
}

/** Download bulk KYC PDF for multiple clients (one page-set per client) */
export function downloadBulkKycPdf(clients: KycClient[]) {
  if (clients.length === 0) return;
  const logoUrl = `${window.location.origin}/logos/GoldKach-Logo-New-3.png`;

  const pages = clients
    .map((c) => `<div style="page-break-after:always;">${buildKycHtml(c, logoUrl)}</div>`)
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>GoldKach — Bulk KYC Report (${clients.length} clients)</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:Arial,sans-serif;font-size:11px;color:#111;}
    @media print{body{padding:0;}}
  </style>
</head>
<body>${pages}</body>
</html>`;

  const win = window.open("", "_blank", "width=1050,height=950");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 800);
}
