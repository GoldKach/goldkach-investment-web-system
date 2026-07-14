/**
 * KYC PDF Generator — GoldKach Due Diligence Questionnaire
 * Full capture of all IndividualOnboarding & CompanyOnboarding fields.
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
  signature?: {
    signatureType?: string | null;
    imageUrl?: string | null;
    typedName?: string | null;
    signedAt?: string | null;
  } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function val(v?: string | null | boolean | number): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function fmtDate(d?: string | Date | null): string {
  if (!d) return "";
  try {
    return new Date(d as string).toLocaleDateString("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  } catch {
    return String(d);
  }
}

function yesNo(v?: string | boolean | null): string {
  if (v === true  || v === "true"  || v === "yes" || v === "Yes") return "Yes";
  if (v === false || v === "false" || v === "no"  || v === "No")  return "No";
  return "";
}

function checkbox(checked: boolean): string {
  return `<span style="display:inline-block;width:13px;height:13px;border:1.5px solid #111;text-align:center;line-height:11px;font-size:10px;font-weight:700;margin-right:2px;vertical-align:middle;">${checked ? "x" : "&nbsp;"}</span>`;
}

function docTick(url?: string | null): string {
  return checkbox(!!url?.trim());
}

function signatureHtml(sig?: KycClient["signature"]): string {
  if (!sig) return "";
  if (sig.imageUrl) {
    return `<div style="margin-bottom:2px;font-size:9px;color:#555;">Signed by:</div>
<img src="${sig.imageUrl}" alt="Signature" style="max-height:55px;max-width:260px;display:block;object-fit:contain;"/>
${sig.signedAt ? `<div style="font-size:9px;color:#555;margin-top:2px;">${fmtDate(sig.signedAt)}</div>` : ""}`;
  }
  if (sig.typedName) {
    return `<div style="margin-bottom:2px;font-size:9px;color:#555;">Signed by:</div>
<div style="font-family:Georgia,serif;font-size:18px;font-style:italic;color:#111;">${sig.typedName}</div>
${sig.signedAt ? `<div style="font-size:9px;color:#555;margin-top:2px;">${fmtDate(sig.signedAt)}</div>` : ""}`;
  }
  return "";
}

function parseAddress(addr?: string | null): { street: string; city: string; country: string } {
  const s = addr?.trim() || "";
  if (!s) return { street: "", city: "", country: "" };
  const parts = s.includes("\n")
    ? s.split("\n").map(p => p.trim()).filter(Boolean)
    : s.split(",").map(p => p.trim()).filter(Boolean);
  return { street: parts[0] || "", city: parts[1] || "", country: parts[2] || "" };
}

// ─── Common style tokens ──────────────────────────────────────────────────────

const NAVY = "#1e3a8a";
const GOLD = "#b45309";
const B    = "1px solid #bbb";

function styles() {
  const tdN = `style="padding:5px 8px;border:${B};font-size:11px;vertical-align:middle;width:5%;font-weight:700;color:#111;text-align:center;"`;
  const tdL = `style="padding:5px 10px;border:${B};font-size:11px;vertical-align:top;width:30%;color:#111;"`;
  const tdV = `style="padding:5px 10px;border:${B};font-size:11px;vertical-align:top;color:#111;"`;
  const thN = `style="background:${NAVY};color:#fff;padding:7px 10px;font-size:11.5px;font-weight:700;text-align:center;border:${B};"`;
  const thG = `style="background:${GOLD};color:#fff;padding:5px 10px;font-size:10.5px;font-weight:700;text-align:center;border:${B};"`;
  const thS = `style="background:#0284c7;color:#fff;padding:6px 10px;font-size:11px;font-weight:700;text-align:left;border:${B};"`;
  const thV = `style="background:#0284c7;color:#fff;padding:5px 10px;font-size:10.5px;font-weight:700;text-align:center;border:${B};"`;
  const div = `<tr><td colspan="3" style="background:${NAVY};height:4px;padding:0;border:none;"></td></tr>`;
  return { tdN, tdL, tdV, thN, thG, thS, thV, div };
}

function pageHeader(logoUrl: string): string {
  const logo = logoUrl
    ? `<img src="${logoUrl}" alt="GoldKach" style="height:60px;display:block;"/>`
    : `<div style="font-size:13px;font-weight:700;color:${NAVY};">GoldKach</div>`;
  return `<div style="display:flex;justify-content:flex-end;margin-bottom:4px;">${logo}</div>`;
}

function sectionTitle(text: string): string {
  return `<h2 style="font-size:13px;font-weight:700;text-align:center;margin:14px 0 6px;color:#111;text-decoration:underline;text-transform:uppercase;">${text}</h2>`;
}

function row2(tdN: string, tdL: string, tdV: string, num: string, label: string, value: string, rowspan = 1, extraV = ""): string {
  const rsAttr = rowspan > 1 ? ` rowspan="${rowspan}"` : "";
  return `<tr>
    <td ${tdN}${rsAttr}>${num}</td>
    <td ${tdL}${rsAttr}>${label}</td>
    <td ${tdV} ${extraV}>${value}</td>
  </tr>`;
}

// ─── INDIVIDUAL FORM ──────────────────────────────────────────────────────────

function buildIndividualHtml(client: KycClient, logoUrl: string): string {
  const o   = client.individualOnboarding || {};
  const sig = client.signature;
  const { tdN, tdL, tdV, thN, thG, thS, thV, div } = styles();

  const rawFull    = val(o.fullName);
  const nameParts  = rawFull ? rawFull.split(" ") : [];
  const firstName  = val(client.firstName) || nameParts[0] || "";
  const lastName   = val(client.lastName)  || (nameParts.length > 1 ? nameParts[nameParts.length - 1] : "");
  const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";
  const title      = val(o.title);
  const mobile     = val(client.phone) || val(o.phoneNumber);
  const email      = val(client.email) || val(o.email);
  const isPEP      = o.isPEP === true || o.isPEP === "true" || o.isPEP === "yes" || o.isPEP === "Yes";
  const resAddr    = parseAddress(val(o.homeAddress));

  const beneficiaries: Array<{ fullName: string; dob: string }> = (o.beneficiaries ?? []).map((b: any) => ({
    fullName: val(b.fullName || b.name), dob: fmtDate(b.dateOfBirth || b.dob),
  }));
  const nextOfKin: Array<{ fullName: string; dob: string }> = (o.nextOfKin ?? []).map((n: any) => ({
    fullName: val(n.fullName || n.name), dob: fmtDate(n.dateOfBirth || n.dob),
  }));

  function kinSlots(items: { fullName: string; dob: string }[], min = 2): string {
    const slots = items.length >= min ? items : [...items, ...Array(min - items.length).fill({ fullName: "", dob: "" })];
    return slots.map(b => `
      <tr>
        <td colspan="2" style="padding:6px 10px;border:${B};font-size:11px;width:50%;">
          Full Name&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-style:italic;">${b.fullName}</span>
        </td>
        <td style="padding:6px 10px;border:${B};font-size:11px;">
          Date of Birth&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-style:italic;">${b.dob}</span>
        </td>
      </tr>
      <tr><td colspan="3" style="height:20px;border:${B};"></td></tr>
    `).join("");
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>GoldKach Due Diligence Questionnaire</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
    body{font-family:Arial,sans-serif;font-size:11px;color:#111;padding:26px 30px;max-width:820px;margin:0 auto;}
    table{width:100%;border-collapse:collapse;}
    h1{text-align:center;font-size:21px;font-weight:700;margin:6px 0 4px;color:#111;}
    .uh{text-align:center;font-size:12px;font-weight:700;text-decoration:underline;text-transform:uppercase;margin:4px 0 8px;}
    .pb{page-break-before:always;padding-top:24px;}
    .watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-45deg);opacity:0.07;pointer-events:none;z-index:-1;}
    @media print{body{padding:14px 18px;}.pb{page-break-before:always;}}
  </style>
</head>
<body>

<!-- Watermark -->
<div class="watermark">
  ${logoUrl ? `<img src="${logoUrl}" alt="" style="width:380px;"/>` : ""}
</div>

<!-- ══════════════════════════════════════════════════════ PAGE 1: IDENTIFICATION -->
${pageHeader(logoUrl)}
<h1>GoldKach Due Diligence Questionnaire</h1>
<div class="uh">IDENTIFICATION</div>

<table>
  <tr>
    <td ${thN} style="width:5%;">Section 1</td>
    <td ${thN} style="width:30%;">&nbsp;</td>
    <td ${thN}>NATURAL PERSONS ONLY</td>
  </tr>

  <!-- 1: Full Legal Name -->
  <tr>
    <td ${tdN} rowspan="5">1</td>
    <td ${tdL} rowspan="5">Full Legal Name(s) both<br/>official and any aliases</td>
    <td ${tdV}>Title (Mr/Mrs/Ms/Dr)&nbsp;&nbsp;&nbsp;&nbsp;${title}</td>
  </tr>
  <tr><td ${tdV}>1&nbsp;&nbsp;&nbsp;First Name&nbsp;&nbsp;&nbsp;&nbsp;${firstName}</td></tr>
  <tr><td ${tdV}>2&nbsp;&nbsp;&nbsp;Middle Name&nbsp;&nbsp;&nbsp;&nbsp;${middleName}</td></tr>
  <tr><td ${tdV}>3&nbsp;&nbsp;&nbsp;Last Name/Family Name&nbsp;&nbsp;&nbsp;&nbsp;${lastName}</td></tr>
  <tr><td ${tdV}>4&nbsp;&nbsp;&nbsp;</td></tr>

  ${div}

  <!-- 2: TIN -->
  ${row2(tdN, tdL, tdV, "2", "Tax Identification Number (TIN)", val(o.tin))}

  <!-- 3: Contact -->
  <tr>
    <td ${tdN} rowspan="2">3</td>
    <td ${tdL} rowspan="2">Contact Number(s)</td>
    <td ${tdV}>Mobile:&nbsp;&nbsp;&nbsp;&nbsp;${mobile}</td>
  </tr>
  <tr><td ${tdV}>Work Number:&nbsp;&nbsp;&nbsp;&nbsp;${val(o.workPhone)}</td></tr>

  <!-- 4: Nationality -->
  ${row2(tdN, tdL, tdV, "4", "Nationality", val(o.nationality))}

  <!-- 5: DOB -->
  ${row2(tdN, tdL, tdV, "5", "Date of Birth", fmtDate(o.dateOfBirth))}

  <!-- 6: Email -->
  ${row2(tdN, tdL, tdV, "6", "Email", email)}

  <!-- Residential Address -->
  <tr>
    <td ${tdN} rowspan="3">&nbsp;</td>
    <td ${tdL} rowspan="3">Residential Address</td>
    <td ${tdV}>Street:&nbsp;&nbsp;&nbsp;&nbsp;${resAddr.street}</td>
  </tr>
  <tr><td ${tdV}>City:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${resAddr.city}</td></tr>
  <tr><td ${tdV}>Country:&nbsp;&nbsp;${resAddr.country}</td></tr>

  <!-- 7: Business Address -->
  <tr>
    <td ${tdN} rowspan="3">7</td>
    <td ${tdL} rowspan="3">Address of Principle Place of<br/>Business (if different from above)</td>
    <td ${tdV}>Street:&nbsp;&nbsp;&nbsp;&nbsp;${val(o.businessStreet)}</td>
  </tr>
  <tr><td ${tdV}>City:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${val(o.businessCity)}</td></tr>
  <tr><td ${tdV}>Country:&nbsp;&nbsp;${val(o.businessCountry)}</td></tr>

  <!-- 8: Nature of Business -->
  ${row2(tdN, tdL, tdV, "8", "Intended Nature and Purpose<br/>of Business Relationship", val(o.primaryGoal))}

  <!-- 9: Source of Funds -->
  ${row2(tdN, tdL, tdV, "9", `Source of Funds <small>(Please provide<br/>detailed information)</small>`, val(o.sourceOfIncome))}

  ${div}

  <!-- Question Response header -->
  <tr>
    <td colspan="2" style="border:${B};padding:5px 8px;">&nbsp;</td>
    <td ${thN}>Question Response</td>
  </tr>

  <!-- 10: PEP -->
  <tr>
    <td ${tdN}>10</td>
    <td ${tdL}>Are you or any party connected to you<br/>a politically exposed person (PEP)?</td>
    <td ${tdV}>Yes&nbsp;${checkbox(isPEP)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No&nbsp;${checkbox(!isPEP)}</td>
  </tr>

  <tr><td colspan="3" ${thG}>Please complete form D for each PEP</td></tr>

  <!-- 11 -->
  ${row2(tdN, tdL, tdV, "11", "Which Country is your business based", val(o.countryOfResidence))}

  <!-- 12 -->
  ${row2(tdN, tdL, tdV, "12", "What type of products does your<br/>business sell or manufacture?", val(o.businessOwnership))}

  <!-- 13 -->
  ${row2(tdN, tdL, tdV, "13", "Please provide further details<br/>in here if necessary", val(o.sanctionsOrLegal), 1, 'style="height:52px;padding:5px 10px;border:' + B + ';font-size:11px;vertical-align:top;color:#111;"')}
</table>

<!-- ══════════════════════════════════════════════════ PAGE 2: EMPLOYMENT & INVESTMENT -->
<div class="pb">
${pageHeader(logoUrl)}
${sectionTitle("Section 2 — Employment Details")}
<table>
  <tr><td colspan="3" ${thS}>Employment Information</td></tr>
  ${row2(tdN, tdL, tdV, "A", "Employment Status", val(o.employmentStatus))}
  ${row2(tdN, tdL, tdV, "B", "Occupation / Job Title", val(o.occupation))}
  ${row2(tdN, tdL, tdV, "C", "Employer / Company Name", val(o.companyName))}
  ${row2(tdN, tdL, tdV, "D", "Monthly / Annual Employment Income", val(o.employmentIncome))}
  ${row2(tdN, tdL, tdV, "E", "Do you own a business?", yesNo(o.hasBusiness))}
</table>

${sectionTitle("Section 3 — Investment Profile")}
<table>
  <tr><td colspan="3" ${thS}>Investment Goals &amp; Risk Profile</td></tr>
  ${row2(tdN, tdL, tdV, "F", "Primary Investment Goal", val(o.primaryGoal))}
  ${row2(tdN, tdL, tdV, "G", "Investment Time Horizon", val(o.timeHorizon))}
  ${row2(tdN, tdL, tdV, "H", "Risk Tolerance", val(o.riskTolerance))}
  ${row2(tdN, tdL, tdV, "I", "Investment Experience", val(o.investmentExperience))}
  ${row2(tdN, tdL, tdV, "J", "Expected Investment Amount", val(o.expectedInvestment))}
  ${row2(tdN, tdL, tdV, "K", "Source of Investment Funds", val(o.sourceOfIncome))}
</table>

${sectionTitle("Section 4 — Risk Assessment")}
<table>
  <tr><td colspan="3" ${thS}>Risk Assessment Summary (For Office Use)</td></tr>
  ${row2(tdN, tdL, tdV, "L", "Risk Score", val(o.riskScore))}
  ${row2(tdN, tdL, tdV, "M", "Risk Profile", val(o.riskProfile))}
  ${row2(tdN, tdL, tdV, "N", "Suggested Investment Strategy", val(o.suggestedStrategy))}
  <tr>
    <td ${tdN}>O</td>
    <td ${tdL}>Advisor Override Applied?</td>
    <td ${tdV}>Yes&nbsp;${checkbox(!!o.advisorOverride)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No&nbsp;${checkbox(!o.advisorOverride)}</td>
  </tr>
  ${row2(tdN, tdL, tdV, "P", "Override Profile (if applicable)", val(o.advisorOverrideProfile))}
  ${row2(tdN, tdL, tdV, "Q", "Override Reason (if applicable)", val(o.advisorOverrideReason))}
</table>
</div>

<!-- ════════════════════════════════════════════ PAGE 3: PEP DETAILS, COMPLIANCE & NEXT OF KIN -->
<div class="pb">
${pageHeader(logoUrl)}
${sectionTitle("Section 5 — PEP Details (Complete only if PEP = Yes)")}
<table>
  <tr><td colspan="3" ${thS}>Politically Exposed Person Information</td></tr>
  ${row2(tdN, tdL, tdV, "R", "Public / Official Position Held", val(o.publicPosition))}
  ${row2(tdN, tdL, tdV, "S", "Country of Public Office / Relationship", val(o.relationshipToCountry))}
  ${row2(tdN, tdL, tdV, "T", "Family Member / Associate Details", val(o.familyMemberDetails), 1, 'style="height:52px;padding:5px 10px;border:' + B + ';font-size:11px;vertical-align:top;color:#111;"')}
</table>

${sectionTitle("Section 6 — Legal & Compliance")}
<table>
  <tr><td colspan="3" ${thS}>Legal Declarations</td></tr>
  ${row2(tdN, tdL, tdV, "U", "Sanctions, Criminal or Legal Proceedings<br/>(provide details if Yes)", val(o.sanctionsOrLegal), 1, 'style="height:52px;padding:5px 10px;border:' + B + ';font-size:11px;vertical-align:top;color:#111;"')}
  <tr>
    <td ${tdN}>V</td>
    <td ${tdL}>Consent to Data Collection &amp; Processing</td>
    <td ${tdV}>Yes&nbsp;${checkbox(!!o.consentToDataCollection)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No&nbsp;${checkbox(!o.consentToDataCollection)}</td>
  </tr>
  <tr>
    <td ${tdN}>W</td>
    <td ${tdL}>Agree to Terms &amp; Conditions</td>
    <td ${tdV}>Yes&nbsp;${checkbox(!!o.agreeToTerms)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No&nbsp;${checkbox(!o.agreeToTerms)}</td>
  </tr>
</table>

${sectionTitle("Section 7 — Beneficiaries")}
<table>
  <tr><td colspan="3" ${thN}>Beneficiaries</td></tr>
  ${kinSlots(beneficiaries, 2)}
</table>

${sectionTitle("Section 8 — Next of Kin")}
<table>
  <tr><td colspan="3" ${thN}>Next of Kin</td></tr>
  ${kinSlots(nextOfKin, 2)}
</table>
</div>

<!-- ═════════════════════════════════════════════ PAGE 4: DECLARATION, DOCS & BENEFICIARIES -->
<div class="pb">
${pageHeader(logoUrl)}
<table>
  <tr><td colspan="3" ${thN}>Client / Agents Declaration</td></tr>
  <tr>
    <td colspan="3" style="padding:10px 12px;border:${B};font-size:10.5px;line-height:1.75;">
      I declare that the information provided in these forms is true and correct. I am aware that I
      may be subject to prosecution and criminal sanctions under written law if I am found to have
      made any false statement that I know to be false or which I do not believe to be true, or if I
      have intentionally suppressed any material fact.
    </td>
  </tr>

  <!-- 14: Name -->
  <tr>
    <td ${tdN}>14</td>
    <td ${tdL}>Name of Client / Agent</td>
    <td ${tdV} style="line-height:2.0;">
      First name&nbsp;&nbsp;&nbsp;&nbsp;${firstName}<br/>
      Middle name&nbsp;&nbsp;&nbsp;&nbsp;${middleName}<br/>
      Last name / Family name&nbsp;&nbsp;&nbsp;&nbsp;${lastName}
    </td>
  </tr>

  <!-- 15: Passport/ID -->
  ${row2(tdN, tdL, tdV, "15", "Identity / Passport Number", val(o.passportNumber) || val(o.nationalId) || val(o.idNumber))}

  <!-- 16: Date -->
  ${row2(tdN, tdL, tdV, "16", "Date", fmtDate(o.createdAt || client.createdAt))}

  <!-- 17: Signature -->
  <tr>
    <td ${tdN}>17</td>
    <td ${tdL}>Signature</td>
    <td ${tdV} style="height:70px;padding:6px 10px;">${signatureHtml(sig)}</td>
  </tr>

  <!-- Verification -->
  <tr><td colspan="3" ${thV}>Verification (for Office Use)</td></tr>
  <tr>
    <td colspan="3" style="padding:10px 12px;border:${B};font-size:10.5px;line-height:1.75;">
      Professional judgment must be exercised in determining if verification of identity should be
      that of &ldquo;Normal CDD&rdquo; or &ldquo;Enhanced CDD&rdquo; standards, depending on the risk assessment performed on the client.
    </td>
  </tr>

  <!-- 18: CDD docs -->
  <tr>
    <td ${tdN}>18</td>
    <td ${tdL}>For Normal CDD, the following documents can be used to verify the client&rsquo;s identity:</td>
    <td ${tdV} style="line-height:2.2;">
      Copy of passport or identification card (Ugandan / Ugandan Permanent Residents)&nbsp;${docTick(o.nationalIdUrl)}<br/>
      Passport photo&nbsp;${docTick(o.passportPhotoUrl)}<br/>
      TIN Certificate&nbsp;${docTick(o.tinCertificateUrl)}<br/>
      A document containing the address (bank statement, utility bill or tenancy agreement)&nbsp;${docTick(o.bankStatementUrl)}<br/>
      Signed Investment Management Agreement&nbsp;${docTick(o.signedAgreementUrl)}
    </td>
  </tr>

</table>
</div>

</body>
</html>`;
}

// ─── COMPANY FORM ─────────────────────────────────────────────────────────────

function buildCompanyHtml(client: KycClient, logoUrl: string): string {
  const co  = client.companyOnboarding || {};
  const sig = client.signature;
  const { tdN, tdL, tdV, thN, thG, thS, thV, div } = styles();

  const isPEP    = co.isPEP === true || co.isPEP === "true" || co.isPEP === "yes";
  const bizAddr  = parseAddress(val(co.companyAddress));
  const phones   = Array.isArray(co.phoneNumbers) ? (co.phoneNumbers as string[]).join("  |  ") : val(co.phoneNumbers);

  const directors: any[] = co.directors ?? [];
  const ubos: any[]      = co.ubos ?? [];

  function directorRow(d: any, i: number): string {
    return `
      <tr><td colspan="3" ${thS}>Director ${i + 1}</td></tr>
      ${row2(tdN, tdL, tdV, "", "Full Name", val(d.fullName))}
      ${row2(tdN, tdL, tdV, "", "Date of Birth", fmtDate(d.dateOfBirth))}
      ${row2(tdN, tdL, tdV, "", "NIN / Passport Number", val(d.ninOrPassportNumber))}
      ${row2(tdN, tdL, tdV, "", "Email", val(d.email))}
      ${row2(tdN, tdL, tdV, "", "Phone", val(d.phone))}
      ${row2(tdN, tdL, tdV, "", "Address", val(d.address))}
      <tr>
        <td style="border:${B};padding:5px 8px;font-size:11px;width:5%;text-align:center;">&nbsp;</td>
        <td style="border:${B};padding:5px 10px;font-size:11px;width:30%;">ID / Passport Document Uploaded</td>
        <td style="border:${B};padding:5px 10px;font-size:11px;">${docTick(d.documentUrl)}</td>
      </tr>
    `;
  }

  function uboRow(u: any, i: number): string {
    return `
      <tr><td colspan="3" ${thS}>UBO ${i + 1}</td></tr>
      ${row2(tdN, tdL, tdV, "", "Full Name", val(u.fullName))}
      ${row2(tdN, tdL, tdV, "", "Date of Birth", fmtDate(u.dateOfBirth))}
      ${row2(tdN, tdL, tdV, "", "NIN / Passport Number", val(u.ninOrPassportNumber))}
      ${row2(tdN, tdL, tdV, "", "Ownership Type", val(u.ownershipType))}
      ${u.ownershipTypeOther ? row2(tdN, tdL, tdV, "", "Ownership Details", val(u.ownershipTypeOther)) : ""}
      ${row2(tdN, tdL, tdV, "", "Email", val(u.email))}
      ${row2(tdN, tdL, tdV, "", "Phone", val(u.phone))}
      ${row2(tdN, tdL, tdV, "", "Address", val(u.address))}
      <tr>
        <td style="border:${B};padding:5px 8px;font-size:11px;width:5%;text-align:center;">&nbsp;</td>
        <td style="border:${B};padding:5px 10px;font-size:11px;width:30%;">ID / Passport Document Uploaded</td>
        <td style="border:${B};padding:5px 10px;font-size:11px;">${docTick(u.documentUrl)}</td>
      </tr>
    `;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>GoldKach Due Diligence Questionnaire — Company</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
    body{font-family:Arial,sans-serif;font-size:11px;color:#111;padding:26px 30px;max-width:820px;margin:0 auto;}
    table{width:100%;border-collapse:collapse;}
    h1{text-align:center;font-size:21px;font-weight:700;margin:6px 0 4px;color:#111;}
    .uh{text-align:center;font-size:12px;font-weight:700;text-decoration:underline;text-transform:uppercase;margin:4px 0 8px;}
    .pb{page-break-before:always;padding-top:24px;}
    .watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-45deg);opacity:0.07;pointer-events:none;z-index:-1;}
    @media print{body{padding:14px 18px;}.pb{page-break-before:always;}}
  </style>
</head>
<body>

<!-- Watermark -->
<div class="watermark">
  ${logoUrl ? `<img src="${logoUrl}" alt="" style="width:380px;"/>` : ""}
</div>

<!-- ═══════════════════════════════ PAGE 1: COMPANY IDENTIFICATION -->
${pageHeader(logoUrl)}
<h1>GoldKach Due Diligence Questionnaire</h1>
<div class="uh">Company / Entity Identification</div>

<table>
  <tr>
    <td ${thN} style="width:5%;">Section 1</td>
    <td ${thN} style="width:30%;">&nbsp;</td>
    <td ${thN}>COMPANY / ENTITY DETAILS</td>
  </tr>

  ${row2(tdN, tdL, tdV, "1", "Company / Entity Name", val(co.companyName))}
  ${row2(tdN, tdL, tdV, "2", "Company Type", val(co.companyType))}
  ${row2(tdN, tdL, tdV, "3", "Registration Number", val(co.registrationNumber))}
  ${row2(tdN, tdL, tdV, "4", "Tax Identification Number (TIN)", val(co.tin))}
  ${row2(tdN, tdL, tdV, "5", "Date of Incorporation", fmtDate(co.incorporationDate))}
  ${row2(tdN, tdL, tdV, "6", "Company Email", val(co.email))}
  ${row2(tdN, tdL, tdV, "7", "Phone Number(s)", phones)}

  <!-- Company Address -->
  <tr>
    <td ${tdN} rowspan="3">8</td>
    <td ${tdL} rowspan="3">Registered / Company Address</td>
    <td ${tdV}>Street:&nbsp;&nbsp;&nbsp;&nbsp;${bizAddr.street}</td>
  </tr>
  <tr><td ${tdV}>City:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${bizAddr.city}</td></tr>
  <tr><td ${tdV}>Country:&nbsp;&nbsp;${bizAddr.country}</td></tr>

  ${row2(tdN, tdL, tdV, "9", "Business Type / Products", val(co.businessType))}
  ${row2(tdN, tdL, tdV, "10", "Source of Funds / Income", val(co.sourceOfIncome))}
  ${row2(tdN, tdL, tdV, "11", "Intended Nature and Purpose<br/>of Business Relationship", val(co.primaryGoal))}

  ${div}
  <tr>
    <td colspan="2" style="border:${B};padding:5px 8px;">&nbsp;</td>
    <td ${thN}>Question Response</td>
  </tr>
  <tr>
    <td ${tdN}>12</td>
    <td ${tdL}>Is the entity or any connected party<br/>a Politically Exposed Person (PEP)?</td>
    <td ${tdV}>Yes&nbsp;${checkbox(isPEP)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No&nbsp;${checkbox(!isPEP)}</td>
  </tr>
  <tr><td colspan="3" ${thG}>Please complete form D for each PEP</td></tr>
  ${row2(tdN, tdL, tdV, "13", "Sanctions, Criminal or Legal Proceedings<br/>(provide details if Yes)", val(co.sanctionsOrLegal), 1, 'style="height:52px;padding:5px 10px;border:' + B + ';font-size:11px;vertical-align:top;color:#111;"')}
</table>

<!-- ═══════════════════════════════ PAGE 2: INVESTMENT PROFILE -->
<div class="pb">
${pageHeader(logoUrl)}
${sectionTitle("Section 2 — Investment Profile")}
<table>
  <tr><td colspan="3" ${thS}>Investment Goals &amp; Risk Profile</td></tr>
  ${row2(tdN, tdL, tdV, "A", "Primary Investment Goal", val(co.primaryGoal))}
  ${row2(tdN, tdL, tdV, "B", "Investment Time Horizon", val(co.timeHorizon))}
  ${row2(tdN, tdL, tdV, "C", "Risk Tolerance", val(co.riskTolerance))}
  ${row2(tdN, tdL, tdV, "D", "Investment Experience", val(co.investmentExperience))}
  ${row2(tdN, tdL, tdV, "E", "Expected Investment Amount", val(co.expectedInvestment))}
</table>

${sectionTitle("Section 3 — Risk Assessment (For Office Use)")}
<table>
  <tr><td colspan="3" ${thS}>Risk Assessment Summary</td></tr>
  ${row2(tdN, tdL, tdV, "F", "Risk Score", val(co.riskScore))}
  ${row2(tdN, tdL, tdV, "G", "Risk Profile", val(co.riskProfile))}
  ${row2(tdN, tdL, tdV, "H", "Suggested Investment Strategy", val(co.suggestedStrategy))}
  <tr>
    <td ${tdN}>I</td>
    <td ${tdL}>Advisor Override Applied?</td>
    <td ${tdV}>Yes&nbsp;${checkbox(!!co.advisorOverride)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No&nbsp;${checkbox(!co.advisorOverride)}</td>
  </tr>
  ${row2(tdN, tdL, tdV, "J", "Override Profile (if applicable)", val(co.advisorOverrideProfile))}
  ${row2(tdN, tdL, tdV, "K", "Override Reason (if applicable)", val(co.advisorOverrideReason))}
</table>

${sectionTitle("Section 4 — Compliance")}
<table>
  <tr><td colspan="3" ${thS}>Legal &amp; Compliance Declarations</td></tr>
  <tr>
    <td ${tdN}>L</td>
    <td ${tdL}>Consent to Data Collection &amp; Processing</td>
    <td ${tdV}>Yes&nbsp;${checkbox(!!co.consentToDataCollection)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No&nbsp;${checkbox(!co.consentToDataCollection)}</td>
  </tr>
  <tr>
    <td ${tdN}>M</td>
    <td ${tdL}>Agree to Terms &amp; Conditions</td>
    <td ${tdV}>Yes&nbsp;${checkbox(!!co.agreeToTerms)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No&nbsp;${checkbox(!co.agreeToTerms)}</td>
  </tr>
</table>
</div>

<!-- ═══════════════════════════════ PAGE 3: DIRECTORS & UBOS -->
<div class="pb">
${pageHeader(logoUrl)}
${sectionTitle("Section 5 — Directors")}
<table>
  ${directors.length > 0
    ? directors.map(directorRow).join("")
    : `<tr><td colspan="3" style="padding:20px;text-align:center;border:${B};color:#888;font-size:11px;">No directors recorded.</td></tr>`
  }
</table>

${sectionTitle("Section 6 — Ultimate Beneficial Owners (UBOs)")}
<table>
  ${ubos.length > 0
    ? ubos.map(uboRow).join("")
    : `<tr><td colspan="3" style="padding:20px;text-align:center;border:${B};color:#888;font-size:11px;">No UBOs recorded.</td></tr>`
  }
</table>
</div>

<!-- ═══════════════════════════════ PAGE 4: DECLARATION & DOCUMENTS -->
<div class="pb">
${pageHeader(logoUrl)}
<table>
  <tr><td colspan="3" ${thN}>Client / Authorised Signatory Declaration</td></tr>
  <tr>
    <td colspan="3" style="padding:10px 12px;border:${B};font-size:10.5px;line-height:1.75;">
      I/We declare that the information provided in these forms is true and correct. I/We am/are aware that I/We
      may be subject to prosecution and criminal sanctions under written law if I/We am/are found to have made any
      false statement that I/We know to be false or which I/We do not believe to be true, or if I/We have
      intentionally suppressed any material fact.
    </td>
  </tr>
  <tr>
    <td ${tdN}>14</td>
    <td ${tdL}>Name of Authorised Signatory</td>
    <td ${tdV} style="line-height:2.0;">
      First name&nbsp;&nbsp;&nbsp;&nbsp;${val(co.signatoryFirstName)}<br/>
      Last name&nbsp;&nbsp;&nbsp;&nbsp;${val(co.signatoryLastName)}<br/>
      Designation / Title&nbsp;&nbsp;&nbsp;&nbsp;${val(co.signatoryTitle)}
    </td>
  </tr>
  ${row2(tdN, tdL, tdV, "15", "Identity / Passport Number", val(co.signatoryIdNumber))}
  ${row2(tdN, tdL, tdV, "16", "Date", fmtDate(co.createdAt || client.createdAt))}
  <tr>
    <td ${tdN}>17</td>
    <td ${tdL}>Signature &amp; Company Stamp</td>
    <td ${tdV} style="height:80px;padding:6px 10px;">${signatureHtml(sig)}</td>
  </tr>

  <tr><td colspan="3" ${thG}>Verification (for Office Use)</td></tr>
  <tr>
    <td colspan="3" style="padding:10px 12px;border:${B};font-size:10.5px;line-height:1.75;">
      Professional judgment must be exercised in determining if verification of identity should be
      that of &ldquo;Normal CDD&rdquo; or &ldquo;Enhanced CDD&rdquo; standards, depending on the risk assessment performed on the entity.
    </td>
  </tr>
  <tr>
    <td ${tdN}>18</td>
    <td ${tdL}>Documents submitted for verification:</td>
    <td ${tdV} style="line-height:2.2;">
      Certificate of Incorporation / Constitution&nbsp;${docTick(co.constitutionUrl)}<br/>
      Trading / Business Licence&nbsp;${docTick(co.tradingLicenseUrl)}<br/>
      TIN Certificate&nbsp;${docTick(co.tinCertificateUrl)}<br/>
      Bank Statement (most recent 3 months)&nbsp;${docTick(co.bankStatementUrl)}<br/>
      Memorandum &amp; Articles of Association&nbsp;${docTick(co.memorandumArticlesUrl)}<br/>
      Form A1&nbsp;${docTick(co.formA1Url)}&nbsp;&nbsp;&nbsp;
      Form S18&nbsp;${docTick(co.formS18Url)}&nbsp;&nbsp;&nbsp;
      Form 18&nbsp;${docTick(co.form18Url)}&nbsp;&nbsp;&nbsp;
      Form 20&nbsp;${docTick(co.form20Url)}<br/>
      Beneficial Ownership Form&nbsp;${docTick(co.beneficialOwnershipFormUrl)}<br/>
      Official Account Documentation&nbsp;${docTick(co.officialAccountUrl)}
    </td>
  </tr>
</table>
</div>

</body>
</html>`;
}

// ─── Entry-point builder ───────────────────────────────────────────────────────

function buildKycHtml(client: KycClient, logoUrl: string): string {
  return client.companyOnboarding
    ? buildCompanyHtml(client, logoUrl)
    : buildIndividualHtml(client, logoUrl);
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
    .map(c => `<div style="page-break-after:always;">${buildKycHtml(c, logoUrl)}</div>`)
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
