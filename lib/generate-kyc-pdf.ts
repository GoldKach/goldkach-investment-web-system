/**
 * KYC PDF Generator — GoldKach Due Diligence Questionnaire
 * Matches the official GoldKach DDQ format exactly.
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
  return `<span style="display:inline-block;width:14px;height:14px;border:1.5px solid #111;text-align:center;line-height:12px;font-size:11px;margin-right:2px;">${checked ? "X" : "&nbsp;"}</span>`;
}

function buildKycHtml(client: KycClient): string {
  const o = client.individualOnboarding || {};
  const isCompany = !!client.companyOnboarding;
  const co = client.companyOnboarding || {};

  const firstName  = val(client.firstName) || val(o.fullName?.split(" ")[0]);
  const lastName   = val(client.lastName)  || val(o.fullName?.split(" ").slice(-1)[0]);
  const middleName = val(o.fullName?.split(" ").slice(1, -1).join(" "));

  const mobile = val(client.phone) || val(o.phoneNumber);
  const email  = val(client.email) || val(o.email);

  // Address breakdown — stored as single string, display as-is
  const address = val(o.homeAddress) || val(co.companyAddress);

  const isPEP = o.isPEP === true || o.isPEP === "true" || co.isPEP === true || co.isPEP === "true";

  // Beneficiaries from onboarding if available
  const beneficiaries: Array<{ fullName: string; dob: string }> =
    (o.beneficiaries ?? []).map((b: any) => ({
      fullName: val(b.fullName || b.name),
      dob: fmtDate(b.dateOfBirth || b.dob),
    }));

  // Next of kin
  const nextOfKin: Array<{ fullName: string; dob: string }> =
    (o.nextOfKin ?? []).map((n: any) => ({
      fullName: val(n.fullName || n.name),
      dob: fmtDate(n.dateOfBirth || n.dob),
    }));

  const allBeneficiaries = [...beneficiaries, ...nextOfKin];

  const tdLabel = `style="padding:6px 8px;border:1px solid #ccc;font-size:11px;vertical-align:top;width:28%;"`;
  const tdNum   = `style="padding:6px 8px;border:1px solid #ccc;font-size:11px;vertical-align:top;width:6%;font-weight:600;"`;
  const tdVal   = `style="padding:6px 8px;border:1px solid #ccc;font-size:11px;vertical-align:top;"`;
  const thBlue  = `style="background:#1e3a8a;color:white;padding:7px 10px;font-size:11px;font-weight:700;text-align:center;border:1px solid #1e3a8a;"`;
  const thLight = `style="background:#d0d8f0;color:#111;padding:7px 10px;font-size:11px;font-weight:700;text-align:center;border:1px solid #ccc;"`;

  const beneficiaryRows = allBeneficiaries.length > 0
    ? allBeneficiaries.map(b => `
        <tr>
          <td colspan="3" ${tdVal}>
            <div style="display:flex;gap:20px;">
              <span><strong>Full Name</strong> &nbsp;${b.fullName}</span>
              <span><strong>Date of Birth</strong> &nbsp;${b.dob}</span>
            </div>
          </td>
        </tr>
        <tr><td colspan="3" style="height:30px;border:1px solid #ccc;"></td></tr>
      `).join("")
    : `<tr>
        <td colspan="3" ${tdVal} style="height:30px;"></td>
      </tr>
      <tr><td colspan="3" style="height:30px;border:1px solid #ccc;"></td></tr>`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>GoldKach Due Diligence Questionnaire</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Arial, sans-serif; font-size:11px; color:#111; padding:28px 32px; max-width:780px; margin:0 auto; }
    table { width:100%; border-collapse:collapse; margin-bottom:0; }
    .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; }
    .doc-id { font-size:9px; color:#555; }
    .logo-area { text-align:right; }
    .logo-area img { height:50px; }
    .logo-placeholder { width:80px; height:50px; border:1px solid #ccc; display:flex; align-items:center; justify-content:center; font-size:9px; color:#999; float:right; }
    h1 { text-align:center; font-size:18px; font-weight:700; margin:10px 0 14px; }
    .section-title { text-align:center; font-size:12px; font-weight:700; margin:10px 0 6px; text-transform:uppercase; }
    @media print { body { padding:16px 20px; } .no-print { display:none; } }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="page-header">
    <div class="doc-id">GoldKach Investment Platform — KYC Document</div>
    <div style="text-align:right;">
      <div style="width:70px;height:50px;border:2px solid #1e3a8a;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#1e3a8a;text-align:center;line-height:1.2;">
        GOLD<br/>KACH
      </div>
    </div>
  </div>

  <h1>GoldKach Due Diligence Questionnaire</h1>

  <div class="section-title">IDENTIFICATION</div>

  <table>
    <!-- Section 1 header -->
    <tr>
      <td ${thBlue} style="width:6%;">Section 1</td>
      <td ${thBlue} style="width:28%;"></td>
      <td ${thBlue}>NATURAL PERSONS ONLY</td>
    </tr>

    <!-- Row 1: Full Legal Name -->
    <tr>
      <td ${tdNum} rowspan="4">1</td>
      <td ${tdLabel} rowspan="4">Full Legal Name(s) both official and any aliases</td>
      <td ${tdVal}>1 First Name &nbsp;&nbsp; ${firstName}</td>
    </tr>
    <tr>
      <td ${tdVal}>2 Middle Name &nbsp;&nbsp; ${middleName}</td>
    </tr>
    <tr>
      <td ${tdVal}>3 Last Name/Family Name &nbsp;&nbsp; ${lastName}</td>
    </tr>
    <tr>
      <td ${tdVal}>4 &nbsp;</td>
    </tr>

    <!-- Blue divider -->
    <tr><td colspan="3" style="background:#1e3a8a;height:4px;border:none;"></td></tr>

    <!-- Row 2: TIN -->
    <tr>
      <td ${tdNum}>2</td>
      <td ${tdLabel}>Tax Identification Number (TIN)</td>
      <td ${tdVal}>${val(o.tin) || val(co.tin)}</td>
    </tr>

    <!-- Row 3: Contact -->
    <tr>
      <td ${tdNum} rowspan="2">3</td>
      <td ${tdLabel} rowspan="2">Contact Number(s)</td>
      <td ${tdVal}>Mobile: &nbsp;${mobile}</td>
    </tr>
    <tr>
      <td ${tdVal}>Work Number: &nbsp;${val(o.workPhone)}</td>
    </tr>

    <!-- Row 4: Nationality -->
    <tr>
      <td ${tdNum}>4</td>
      <td ${tdLabel}>Nationality</td>
      <td ${tdVal}>${val(o.nationality)}</td>
    </tr>

    <!-- Row 5: Date of Birth -->
    <tr>
      <td ${tdNum}>5</td>
      <td ${tdLabel}>Date of Birth</td>
      <td ${tdVal}>${fmtDate(o.dateOfBirth)}</td>
    </tr>

    <!-- Row 6: Email -->
    <tr>
      <td ${tdNum}>6</td>
      <td ${tdLabel}>Email</td>
      <td ${tdVal}>${email}</td>
    </tr>

    <!-- Row 7: Residential Address -->
    <tr>
      <td ${tdNum}>7</td>
      <td ${tdLabel}>Residential Address</td>
      <td ${tdVal} style="white-space:pre-wrap;">${address || "&nbsp;"}</td>
    </tr>

    <!-- Row 8: Business Address -->
    <tr>
      <td ${tdNum}>8</td>
      <td ${tdLabel}>Address of Principle Place of Business (if different from above)</td>
      <td ${tdVal} style="white-space:pre-wrap;">${val(co.companyAddress) || "&nbsp;"}</td>
    </tr>

    <!-- Row 9: Nature of Business -->
    <tr>
      <td ${tdNum}>9</td>
      <td ${tdLabel}>Intended Nature and Purpose of Business Relationship</td>
      <td ${tdVal}>${val(o.primaryGoal) || val(co.primaryGoal)}</td>
    </tr>

    <!-- Row 10: Source of Funds -->
    <tr>
      <td ${tdNum}>10</td>
      <td ${tdLabel}>Source of Funds <em style="font-size:10px;">(Please provide detailed information)</em></td>
      <td ${tdVal}>${val(o.sourceOfIncome) || val(co.sourceOfIncome)}</td>
    </tr>

    <!-- Blue divider -->
    <tr><td colspan="3" style="background:#1e3a8a;height:4px;border:none;"></td></tr>

    <!-- Question Response header -->
    <tr>
      <td colspan="2" style="border:1px solid #ccc;"></td>
      <td ${thBlue}>Question Response</td>
    </tr>

    <!-- Row 11: PEP -->
    <tr>
      <td ${tdNum}>11</td>
      <td ${tdLabel}>Are you or any party connected to you a politically exposed person (PEP)?</td>
      <td ${tdVal}>Yes ${checkbox(isPEP)} &nbsp;&nbsp;&nbsp; No ${checkbox(!isPEP)}</td>
    </tr>

    <!-- Please complete form D -->
    <tr>
      <td colspan="3" ${thLight}>Please complete form D for each PEP</td>
    </tr>

    <!-- Row 12 -->
    <tr>
      <td ${tdNum}>12</td>
      <td ${tdLabel}>Which Country is your business based</td>
      <td ${tdVal}>${val(o.countryOfResidence) || val(co.companyAddress)}</td>
    </tr>

    <!-- Row 13 -->
    <tr>
      <td ${tdNum}>13</td>
      <td ${tdLabel}>What type of products does your business sell or manufacture?</td>
      <td ${tdVal}>${val(o.businessOwnership) || val(co.businessType)}</td>
    </tr>

    <!-- Row 14 -->
    <tr>
      <td ${tdNum}>14</td>
      <td ${tdLabel}>Please provide further details in here if necessary</td>
      <td ${tdVal} style="height:50px;">${val(o.sanctionsOrLegal) || val(co.sanctionsOrLegal)}</td>
    </tr>
  </table>

  <!-- Page break before declaration -->
  <div style="page-break-before:always; padding-top:28px;">

    <!-- Header repeated -->
    <div class="page-header" style="margin-bottom:10px;">
      <div class="doc-id">GoldKach Investment Platform — KYC Document</div>
      <div style="text-align:right;">
        <div style="width:70px;height:50px;border:2px solid #1e3a8a;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#1e3a8a;text-align:center;line-height:1.2;">
          GOLD<br/>KACH
        </div>
      </div>
    </div>

    <table>
      <!-- Client/Agents Declaration -->
      <tr>
        <td colspan="3" ${thBlue}>Client/Agents Declaration</td>
      </tr>
      <tr>
        <td colspan="3" ${tdVal} style="font-size:10.5px;line-height:1.6;padding:10px 12px;">
          I declare that the information provided in these forms is true and correct. I am aware that I may be subject to prosecution and criminal sanctions under written law if I am found to have made any false statement that I know to be false or which I do not believe to be true, or if I have intentionally suppressed any material fact.
        </td>
      </tr>

      <!-- Row 15: Name -->
      <tr>
        <td ${tdNum}>15</td>
        <td ${tdLabel}>Name of Client/Agent</td>
        <td ${tdVal}>
          First name &nbsp;&nbsp; ${firstName}<br/>
          Middle name &nbsp;&nbsp; ${middleName}<br/>
          Last name/Family name &nbsp;&nbsp; ${lastName}
        </td>
      </tr>

      <!-- Row 16: ID/Passport -->
      <tr>
        <td ${tdNum}>16</td>
        <td ${tdLabel}>Identity/ Passport Number</td>
        <td ${tdVal}>${val(o.nationalIdUrl ? "See attached document" : "")}</td>
      </tr>

      <!-- Row 17: Date -->
      <tr>
        <td ${tdNum}>17</td>
        <td ${tdLabel}>Date</td>
        <td ${tdVal}>${fmtDate(o.createdAt || client.createdAt)}</td>
      </tr>

      <!-- Row 18: Signature -->
      <tr>
        <td ${tdNum}>18</td>
        <td ${tdLabel}>Signature</td>
        <td ${tdVal} style="height:60px;"></td>
      </tr>

      <!-- Verification header -->
      <tr>
        <td colspan="3" ${thBlue}>Verification (for Office Use)</td>
      </tr>
      <tr>
        <td colspan="3" ${tdVal} style="font-size:10.5px;line-height:1.6;padding:10px 12px;">
          Professional judgment must be exercised in determining if verification of identity should be that of "Normal CDD" or "Enhanced CDD" standards, depending on the risk assessment performed on the client.
        </td>
      </tr>

      <!-- Row 19: Normal CDD -->
      <tr>
        <td ${tdNum}>19</td>
        <td ${tdLabel}>For Normal CDD, the following documents can be used to verify the client's identity:</td>
        <td ${tdVal}>
          Copy of passport or identification card (for Ugandan and Ugandan Permanent Residents only) ${checkbox(!!o.nationalIdUrl)}<br/><br/>
          A document containing the address of the individual (e.g., a bank statement, a recent utility bill or tenancy agreement) ${checkbox(!!o.bankStatementUrl)}
        </td>
      </tr>

      <!-- Beneficiaries header -->
      <tr>
        <td colspan="3" ${thBlue}>Beneficiaries</td>
      </tr>
      ${beneficiaryRows}
    </table>

    <!-- Footer initials area -->
    <div style="display:flex;justify-content:space-between;margin-top:30px;padding-top:10px;">
      <div style="border:1px solid #ccc;width:120px;height:50px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:9px;color:#999;">Initial</span>
      </div>
      <div style="border:1px solid #ccc;width:120px;height:50px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:9px;color:#999;">Initial</span>
      </div>
    </div>

  </div>

</body>
</html>`;
}

/** Download KYC PDF for a single client */
export function downloadKycPdf(client: KycClient) {
  const html = buildKycHtml(client);
  const win = window.open("", "_blank", "width=1000,height=900");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 600);
}

/** Download bulk KYC PDF for multiple clients (one per client) */
export function downloadBulkKycPdf(clients: KycClient[]) {
  if (clients.length === 0) return;

  const pages = clients
    .map((c) => `<div style="page-break-after:always;">${buildKycHtml(c)}</div>`)
    .join("");

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <title>GoldKach — Bulk KYC Report (${clients.length} clients)</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;font-size:11px;color:#111;}
    @media print{body{padding:0}}
  </style></head><body>${pages}</body></html>`;

  const win = window.open("", "_blank", "width=1000,height=900");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 700);
}
