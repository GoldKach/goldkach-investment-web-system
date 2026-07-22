"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Save, Printer, ChevronDown, ChevronUp, ShieldAlert, Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { saveAMLRiskAssessment } from "@/actions/aml-risk-assessment";

/* ── Types ─────────────────────────────────────────────────────────── */

type Tri = true | false | null;  // yes / no / blank
type Risk = "low" | "med" | "high" | null;
type CDD = "simplified" | "standard" | "enhanced" | null;
type Rec = "approve" | "approve_conditional" | "escalate" | "decline" | null;

interface AMLData {
  date: string;
  clientType: "individual" | "corporate" | "";
  relationshipManager: string;
  assessor: string;
  assessmentRef: string;
  // s1
  s1_identity: Tri; s1_sanctions: Tri; s1_pep: Tri; s1_adverseMedia: Tri;
  s1_sourceOfFunds: Tri; s1_sourceOfWealth: Tri; s1_ubo: Tri; s1_noTerrorist: Tri;
  // s2
  s2_countryOfResidence: Risk; s2_countryOfOperations: Risk;
  s2_highRiskJurisdiction: Risk; s2_crossBorder: Risk; s2_comments: string;
  // s3
  s3_faceToFace: Tri; s3_referral: Tri; s3_referralVerified: Tri;
  s3_thirdParty: Tri; s3_authorityDocs: Tri;
  // s4
  s4_pep: Tri; s4_highRiskOcc: Tri; s4_complexOwnership: Tri;
  s4_nomineeShareholders: Tri; s4_adverseMedia: Tri;
  s4_highRiskProducts: Tri; s4_highTxVolumes: Tri;
  s4_unusualSoF: Tri; s4_highRiskJurisdictionConn: Tri; s4_otherAML: Tri;
  s4_overallRisk: "low" | "medium" | "high" | null;
  // s5
  s5_cddLevel: CDD;
  s5_seniorMgmt: boolean; s5_enhancedSoW: boolean;
  s5_enhancedSoF: boolean; s5_additionalVerification: boolean;
  // s6
  s6_recommendation: Rec; s6_reasons: string;
  // p2
  ongoingEnhancedMonitoring: boolean;
  // sign-off
  complianceName: string; compliancePosition: string;
  complianceSignature: string; complianceDate: string;
  mlroName: string; mlroSignature: string; mlroDate: string;
}

function blank(): AMLData {
  return {
    date: "", clientType: "", relationshipManager: "", assessor: "", assessmentRef: "",
    s1_identity: null, s1_sanctions: null, s1_pep: null, s1_adverseMedia: null,
    s1_sourceOfFunds: null, s1_sourceOfWealth: null, s1_ubo: null, s1_noTerrorist: null,
    s2_countryOfResidence: null, s2_countryOfOperations: null,
    s2_highRiskJurisdiction: null, s2_crossBorder: null, s2_comments: "",
    s3_faceToFace: null, s3_referral: null, s3_referralVerified: null,
    s3_thirdParty: null, s3_authorityDocs: null,
    s4_pep: null, s4_highRiskOcc: null, s4_complexOwnership: null,
    s4_nomineeShareholders: null, s4_adverseMedia: null,
    s4_highRiskProducts: null, s4_highTxVolumes: null,
    s4_unusualSoF: null, s4_highRiskJurisdictionConn: null, s4_otherAML: null,
    s4_overallRisk: null,
    s5_cddLevel: null, s5_seniorMgmt: false, s5_enhancedSoW: false,
    s5_enhancedSoF: false, s5_additionalVerification: false,
    s6_recommendation: null, s6_reasons: "",
    ongoingEnhancedMonitoring: false,
    complianceName: "", compliancePosition: "", complianceSignature: "", complianceDate: "",
    mlroName: "", mlroSignature: "", mlroDate: "",
  };
}

/* ── Sub-components ────────────────────────────────────────────────── */

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#193388] dark:bg-[#193388]/80 text-white text-xs font-bold px-3 py-1.5 rounded-t-md">
      {children}
    </div>
  );
}

function YesNoRow({
  label, value, onChange, colSpan,
}: {
  label: string; value: Tri; onChange: (v: Tri) => void; colSpan?: boolean;
}) {
  return (
    <div className={`flex items-start gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800 ${colSpan ? "col-span-2" : ""}`}>
      <span className="flex-1 text-xs text-slate-700 dark:text-slate-300 leading-tight">{label}</span>
      <div className="flex gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onChange(value === true ? null : true)}
          className={`w-5 h-5 rounded border text-[10px] font-bold transition-colors ${
            value === true
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-slate-300 dark:border-slate-600 text-slate-400 hover:border-emerald-400"
          }`}
        >
          Y
        </button>
        <button
          type="button"
          onClick={() => onChange(value === false ? null : false)}
          className={`w-5 h-5 rounded border text-[10px] font-bold transition-colors ${
            value === false
              ? "bg-rose-500 border-rose-500 text-white"
              : "border-slate-300 dark:border-slate-600 text-slate-400 hover:border-rose-400"
          }`}
        >
          N
        </button>
      </div>
    </div>
  );
}

function RiskRow({
  label, value, onChange,
}: {
  label: string; value: Risk; onChange: (v: Risk) => void;
}) {
  const btn = (v: "low" | "med" | "high", label: string, active: string, hover: string) => (
    <button
      type="button"
      onClick={() => onChange(value === v ? null : v)}
      className={`w-8 h-5 rounded border text-[9px] font-bold transition-colors ${
        value === v ? `${active} text-white` : `border-slate-300 dark:border-slate-600 text-slate-400 ${hover}`
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
      <span className="flex-1 text-xs text-slate-700 dark:text-slate-300">{label}</span>
      <div className="flex gap-1 shrink-0">
        {btn("low", "L", "bg-emerald-500 border-emerald-500", "hover:border-emerald-400")}
        {btn("med", "M", "bg-amber-500 border-amber-500", "hover:border-amber-400")}
        {btn("high", "H", "bg-rose-500 border-rose-500", "hover:border-rose-400")}
      </div>
    </div>
  );
}

function CheckItem({
  label, checked, onChange,
}: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-start gap-2 text-left py-1 w-full"
    >
      <span className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
        checked
          ? "bg-[#193388] border-[#193388] text-white"
          : "border-slate-300 dark:border-slate-600"
      }`}>
        {checked && <svg className="h-2.5 w-2.5" viewBox="0 0 10 10" fill="currentColor"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
      </span>
      <span className="text-xs text-slate-700 dark:text-slate-300 leading-tight">{label}</span>
    </button>
  );
}

function RadioGroup<T extends string>({
  options, value, onChange, label,
}: {
  options: { value: T; label: string; color?: string }[];
  value: T | null;
  onChange: (v: T) => void;
  label?: string;
}) {
  return (
    <div className="space-y-1">
      {label && <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
              value === o.value
                ? o.color ?? "bg-[#193388] border-[#193388] text-white"
                : "border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-[#193388]"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Print generator ───────────────────────────────────────────────── */

function printAML(d: AMLData, clientName: string) {
  const tri = (v: Tri) => v === true ? "☑ Yes  ☐ No" : v === false ? "☐ Yes  ☑ No" : "☐ Yes  ☐ No";
  const risk = (v: Risk) =>
    `${v === "low" ? "☑" : "☐"} Low  ${v === "med" ? "☑" : "☐"} Med  ${v === "high" ? "☑" : "☐"} High`;
  const chk = (v: boolean) => v ? "☑" : "☐";

  const recLabels: Record<string, string> = {
    approve: "Approve Client",
    approve_conditional: "Approve — Subject to Additional Information",
    escalate: "Escalate to MLRO",
    decline: "Decline Relationship",
  };

  const logoUrl = `${window.location.origin}/logos/GoldKach-Logo-New-3.png`;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>AML/CFT Risk Assessment — ${clientName}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 10px; color: #111; background: white; position: relative; }
  .page { padding: 20mm 18mm; max-width: 210mm; margin: 0 auto; position: relative; z-index: 1; }

  /* ── Watermark ── */
  .watermark-logo {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    width: 260px;
    opacity: 0.045;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Header ── */
  .hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 2px solid #1a3388; padding-bottom: 8px; }
  .hdr-left { display: flex; align-items: center; gap: 10px; }
  .hdr-left img { height: 44px; width: auto; object-fit: contain; }
  .hdr-left h1 { font-size: 20px; font-weight: 900; color: #1a3388; letter-spacing: -0.5px; }
  .hdr-right { text-align: right; }
  .hdr-right .title { font-size: 11px; font-weight: bold; color: #1a3388; }
  .hdr-right .sub { font-size: 9px; color: #e53e3e; margin-top: 2px; }

  /* ── Tables ── */
  table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
  th { background: #1a3388; color: white; font-size: 9px; font-weight: bold; padding: 4px 6px; text-align: left; }
  td { padding: 3px 6px; border: 1px solid #ddd; font-size: 9px; vertical-align: top; }
  .info-table td { border: none; padding: 2px 6px; }
  .info-table { border: 1px solid #ddd; margin-bottom: 10px; }
  .info-label { color: #1a3388; font-weight: bold; width: 120px; }
  .risk-low { background: #d4edda; font-weight: bold; text-align: center; padding: 4px 10px; border: 2px solid #28a745; display: inline-block; }
  .risk-med { background: #fff3cd; font-weight: bold; text-align: center; padding: 4px 10px; border: 2px solid #ffc107; display: inline-block; }
  .risk-high { background: #f8d7da; font-weight: bold; text-align: center; padding: 4px 10px; border: 2px solid #dc3545; display: inline-block; }
  .risk-blank { background: #f0f0f0; font-weight: bold; text-align: center; padding: 4px 10px; border: 2px dashed #ccc; display: inline-block; }
  .footer { margin-top: 6px; font-size: 8px; color: #888; text-align: center; border-top: 1px solid #ddd; padding-top: 4px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  .two-col > div { padding: 3px 6px; border: 1px solid #ddd; font-size: 9px; }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    th { background: #1a3388 !important; color: white !important; }
    .watermark-logo { position: fixed !important; }
  }
</style>
</head>
<body>

  <!-- Watermark logo -->
  <img class="watermark-logo" src="${logoUrl}" alt="" onerror="this.style.display='none'" />

<div class="page">
  <div class="hdr">
    <div class="hdr-left">
      <img src="${logoUrl}" alt="GoldKach Logo" />
      <h1>GoldKach</h1>
    </div>
    <div class="hdr-right">
      <div class="title">AML/CFT RISK ASSESSMENT &amp; INITIAL CDD</div>
      <div class="sub">CONFIDENTIAL &nbsp;│&nbsp; For Compliance Use Only &nbsp;│&nbsp; Ref: ${d.assessmentRef || "AML-CDD-001"}</div>
    </div>
  </div>

  <table class="info-table">
    <thead><tr><th colspan="4">CLIENT INFORMATION</th></tr></thead>
    <tbody>
      <tr>
        <td class="info-label">Client Name</td><td><strong>${clientName}</strong></td>
        <td class="info-label">Date</td><td>${d.date || ""}</td>
      </tr>
      <tr>
        <td class="info-label">Client Type</td>
        <td>${d.clientType === "individual" ? "☑ Individual  ☐ Corporate" : d.clientType === "corporate" ? "☐ Individual  ☑ Corporate" : "☐ Individual  ☐ Corporate"}</td>
        <td class="info-label">Relationship Manager</td><td>${d.relationshipManager || ""}</td>
      </tr>
      <tr>
        <td class="info-label">Assessor</td><td>${d.assessor || ""}</td>
        <td class="info-label">Assessment Ref.</td><td>${d.assessmentRef || "AML-CDD-001"}</td>
      </tr>
    </tbody>
  </table>

  <div class="two-col" style="margin-bottom:10px;">
    <div>
      <table>
        <thead><tr><th>1. AML Screening</th><th style="width:80px;">Yes  No</th></tr></thead>
        <tbody>
          <tr><td>Identity and beneficial ownership verified</td><td>${tri(d.s1_identity)}</td></tr>
          <tr><td>Sanctions screening completed (UN, OFAC, UK, EU, Local Lists)</td><td>${tri(d.s1_sanctions)}</td></tr>
          <tr><td>PEP screening completed</td><td>${tri(d.s1_pep)}</td></tr>
          <tr><td>Adverse media screening completed</td><td>${tri(d.s1_adverseMedia)}</td></tr>
          <tr><td>Source of Funds obtained and verified</td><td>${tri(d.s1_sourceOfFunds)}</td></tr>
          <tr><td>Source of Wealth obtained (where applicable)</td><td>${tri(d.s1_sourceOfWealth)}</td></tr>
          <tr><td>Ultimate Beneficial Owner(s) identified</td><td>${tri(d.s1_ubo)}</td></tr>
          <tr><td>No terrorist financing / sanctions matches identified</td><td>${tri(d.s1_noTerrorist)}</td></tr>
        </tbody>
      </table>
    </div>
    <div>
      <table>
        <thead><tr><th>2. Client Location</th><th style="width:100px;">Low  Med  High</th></tr></thead>
        <tbody>
          <tr><td>Country of Residence / Incorporation</td><td>${risk(d.s2_countryOfResidence)}</td></tr>
          <tr><td>Country of Operations</td><td>${risk(d.s2_countryOfOperations)}</td></tr>
          <tr><td>Connected to High-Risk Jurisdiction (FATF)</td><td>${risk(d.s2_highRiskJurisdiction)}</td></tr>
          <tr><td>Cross-border investment activity</td><td>${risk(d.s2_crossBorder)}</td></tr>
          <tr><td colspan="2"><strong>Comments:</strong> ${d.s2_comments || ""}</td></tr>
        </tbody>
      </table>
      <table style="margin-top:4px;">
        <thead><tr><th>3. Client Relationship</th><th style="width:80px;">Yes  No</th></tr></thead>
        <tbody>
          <tr><td>Client met face-to-face (physical or secure video)</td><td>${tri(d.s3_faceToFace)}</td></tr>
          <tr><td>Relationship established through referral</td><td>${tri(d.s3_referral)}</td></tr>
          <tr><td>Referral source independently verified</td><td>${tri(d.s3_referralVerified)}</td></tr>
          <tr><td>Third-party acting on behalf of client</td><td>${tri(d.s3_thirdParty)}</td></tr>
          <tr><td>Appropriate authority documents obtained</td><td>${tri(d.s3_authorityDocs)}</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <table style="margin-bottom:10px;">
    <thead><tr><th colspan="4">4. INITIAL RISK EVALUATION — Tick all that apply</th></tr>
    <tr style="background:#e8edf7;"><td><strong>Risk Indicator</strong></td><td style="width:80px;"><strong>Yes  No</strong></td><td><strong>Risk Indicator</strong></td><td style="width:80px;"><strong>Yes  No</strong></td></tr>
    </thead>
    <tbody>
      <tr><td>Politically Exposed Person (PEP)</td><td>${tri(d.s4_pep)}</td><td>High-risk products or services</td><td>${tri(d.s4_highRiskProducts)}</td></tr>
      <tr><td>High-risk occupation / industry</td><td>${tri(d.s4_highRiskOcc)}</td><td>High transaction volumes expected</td><td>${tri(d.s4_highTxVolumes)}</td></tr>
      <tr><td>Complex ownership structure</td><td>${tri(d.s4_complexOwnership)}</td><td>Unusual source of funds</td><td>${tri(d.s4_unusualSoF)}</td></tr>
      <tr><td>Nominee shareholders or directors</td><td>${tri(d.s4_nomineeShareholders)}</td><td>High-risk jurisdiction connection</td><td>${tri(d.s4_highRiskJurisdictionConn)}</td></tr>
      <tr><td>Adverse media identified</td><td>${tri(d.s4_adverseMedia)}</td><td>Other significant AML concern</td><td>${tri(d.s4_otherAML)}</td></tr>
    </tbody>
  </table>

  <div style="display:flex;gap:8px;margin-bottom:10px;">
    <span class="${d.s4_overallRisk === "low" ? "risk-low" : "risk-blank"}">☐ LOW RISK</span>
    <span class="${d.s4_overallRisk === "medium" ? "risk-med" : "risk-blank"}">☐ MEDIUM RISK</span>
    <span class="${d.s4_overallRisk === "high" ? "risk-high" : "risk-blank"}">☐ HIGH RISK</span>
  </div>

  <div class="two-col" style="margin-bottom:10px;">
    <div>
      <table>
        <thead><tr><th>5. CDD Level Required</th></tr></thead>
        <tbody>
          <tr><td>${chk(d.s5_cddLevel === "simplified")} Simplified CDD</td></tr>
          <tr><td>${chk(d.s5_cddLevel === "standard")} Standard CDD</td></tr>
          <tr><td>${chk(d.s5_cddLevel === "enhanced")} Enhanced CDD</td></tr>
          <tr><td style="color:#1a3388;font-weight:bold;">If Enhanced CDD — also obtain:</td></tr>
          <tr><td>${chk(d.s5_seniorMgmt)} Senior Management Approval</td></tr>
          <tr><td>${chk(d.s5_enhancedSoW)} Enhanced Source of Wealth Verification</td></tr>
          <tr><td>${chk(d.s5_enhancedSoF)} Enhanced Source of Funds Verification</td></tr>
          <tr><td>${chk(d.s5_additionalVerification)} Additional Independent Verification</td></tr>
        </tbody>
      </table>
    </div>
    <div>
      <table>
        <thead><tr><th>6. Compliance Recommendation</th></tr></thead>
        <tbody>
          ${(["approve","approve_conditional","escalate","decline"] as const).map((k) => `<tr><td>${chk(d.s6_recommendation === k)} ${recLabels[k]}</td></tr>`).join("")}
          <tr><td><strong>Reason(s):</strong> ${d.s6_reasons || ""}</td></tr>
          <tr><td>${chk(d.ongoingEnhancedMonitoring)} Ongoing Enhanced Monitoring</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="two-col">
    <div>
      <table>
        <thead><tr><th colspan="2">COMPLIANCE SIGN-OFF</th></tr></thead>
        <tbody>
          <tr><td class="info-label">Name</td><td>${d.complianceName || ""}</td></tr>
          <tr><td class="info-label">Position</td><td>${d.compliancePosition || ""}</td></tr>
          <tr><td class="info-label">Signature</td><td>${d.complianceSignature || ""}</td></tr>
          <tr><td class="info-label">Date</td><td>${d.complianceDate || ""}</td></tr>
        </tbody>
      </table>
    </div>
    <div>
      <table>
        <thead><tr><th colspan="2">MLRO APPROVAL (High-Risk Clients Only)</th></tr></thead>
        <tbody>
          <tr><td class="info-label">Name</td><td>${d.mlroName || ""}</td></tr>
          <tr><td class="info-label">Signature</td><td>${d.mlroSignature || ""}</td></tr>
          <tr><td class="info-label">Date</td><td>${d.mlroDate || ""}</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="footer">
    <img src="${logoUrl}" alt="" style="height:14px;width:auto;vertical-align:middle;opacity:0.6;margin-right:6px;" />
    GoldKach &mdash; AML/CFT Risk Assessment &nbsp;|&nbsp; CONFIDENTIAL &nbsp;|&nbsp; Page 1
  </div>
</div>
<script>window.onload = () => window.print();</script>
</body>
</html>`;

  const w = window.open("", "_blank");
  if (w) { w.document.write(html); w.document.close(); }
}

function formatRole(role: string): string {
  const map: Record<string, string> = {
    ONBOARDING_OFFICER: "Onboarding Officer",
    SUPER_ADMIN: "Super Administrator",
    ADMIN: "Administrator",
    MANAGER: "Manager",
    COMPLIANCE_OFFICER: "Compliance Officer",
    AGENT: "Agent",
    ACCOUNT_MANAGER: "Account Manager",
    CLIENT_RELATIONS: "Client Relations Officer",
    STAFF: "Staff",
  };
  return map[role] ?? role;
}

/* ── Main component ────────────────────────────────────────────────── */

export function AMLRiskAssessmentForm({
  userId,
  clientName,
  initialData,
  currentUser,
}: {
  userId: string;
  clientName: string;
  initialData?: Record<string, any> | null;
  currentUser?: { name?: string; role?: string } | null;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [d, setD] = useState<AMLData>(() => {
    const base = blank();
    if (initialData && Object.keys(initialData).length > 0) {
      return { ...base, ...initialData };
    }
    // Pre-fill compliance sign-off with the current user's details
    if (currentUser) {
      base.complianceName = currentUser.name ?? "";
      base.compliancePosition = currentUser.role ? formatRole(currentUser.role) : "";
    }
    return base;
  });

  function set<K extends keyof AMLData>(key: K, val: AMLData[K]) {
    setD((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await saveAMLRiskAssessment(userId, d as unknown as Record<string, any>);
      if (res.success) {
        // Sync the auto-generated ref back into local state
        const savedRef = (res.data as any)?.data?.assessmentRef;
        if (savedRef && savedRef !== d.assessmentRef) {
          setD((prev) => ({ ...prev, assessmentRef: savedRef }));
        }
        toast.success("AML assessment saved.");
      } else {
        toast.error(res.error ?? "Failed to save.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const hasData = Object.entries(d).some(([k, v]) => {
    if (k === "assessmentRef") return false;
    return v !== null && v !== "" && v !== false;
  });

  return (
    <Card className="border-amber-200 dark:border-amber-900/30">
      <CardHeader className="pb-3 cursor-pointer select-none" onClick={() => setOpen((v) => !v)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-white">
              AML/CFT Risk Assessment & Initial CDD
            </CardTitle>
            {hasData && (
              <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 rounded-full px-2 py-0.5 font-medium">
                Saved
              </span>
            )}
          </div>
          {open ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          CONFIDENTIAL — For Compliance Use Only.{d.assessmentRef ? ` Ref: ${d.assessmentRef}` : " Ref: Auto-assigned on first save"}
        </p>
      </CardHeader>

      {open && (
        <>
          <Separator />
          <CardContent className="pt-5 space-y-6">

            {/* ── Client Information ─────────────────────────────── */}
            <div>
              <SectionHeader>CLIENT INFORMATION</SectionHeader>
              <div className="border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-md p-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-[#193388] dark:text-blue-400 font-semibold">Client Name</Label>
                    <Input value={clientName} disabled className="mt-1 h-8 text-xs bg-slate-50 dark:bg-slate-900" />
                  </div>
                  <div>
                    <Label className="text-xs text-[#193388] dark:text-blue-400 font-semibold">Date</Label>
                    <Input
                      type="date"
                      value={d.date}
                      onChange={(e) => set("date", e.target.value)}
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-[#193388] dark:text-blue-400 font-semibold">Client Type</Label>
                    <div className="flex gap-2 mt-1">
                      {(["individual", "corporate"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => set("clientType", d.clientType === t ? "" : t)}
                          className={`flex items-center gap-1.5 text-xs px-3 h-8 rounded border transition-colors ${
                            d.clientType === t
                              ? "bg-[#193388] border-[#193388] text-white"
                              : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-[#193388]"
                          }`}
                        >
                          <span className={`h-3 w-3 rounded-full border-2 flex items-center justify-center ${d.clientType === t ? "border-white" : "border-current"}`}>
                            {d.clientType === t && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </span>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-[#193388] dark:text-blue-400 font-semibold">Relationship Manager</Label>
                    <Input
                      value={d.relationshipManager}
                      onChange={(e) => set("relationshipManager", e.target.value)}
                      className="mt-1 h-8 text-xs"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-[#193388] dark:text-blue-400 font-semibold">Assessor</Label>
                    <Input
                      value={d.assessor}
                      onChange={(e) => set("assessor", e.target.value)}
                      className="mt-1 h-8 text-xs"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-[#193388] dark:text-blue-400 font-semibold">Assessment Ref.</Label>
                    <div className="mt-1 h-8 flex items-center px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xs font-mono text-slate-700 dark:text-slate-300 select-all">
                      {d.assessmentRef || (
                        <span className="text-slate-400 italic font-sans">Auto-assigned on first save</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Sections 1 & 2 ────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Section 1 */}
              <div>
                <SectionHeader>1. AML Screening</SectionHeader>
                <div className="border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-md px-3 py-1">
                  <div className="flex justify-end gap-2 py-1 text-[10px] font-bold text-slate-500">
                    <span className="w-5 text-center">Y</span>
                    <span className="w-5 text-center">N</span>
                  </div>
                  <YesNoRow label="Identity and beneficial ownership verified" value={d.s1_identity} onChange={(v) => set("s1_identity", v)} />
                  <YesNoRow label="Sanctions screening completed (UN, OFAC, UK, EU, Local Lists)" value={d.s1_sanctions} onChange={(v) => set("s1_sanctions", v)} />
                  <YesNoRow label="PEP screening completed" value={d.s1_pep} onChange={(v) => set("s1_pep", v)} />
                  <YesNoRow label="Adverse media screening completed" value={d.s1_adverseMedia} onChange={(v) => set("s1_adverseMedia", v)} />
                  <YesNoRow label="Source of Funds obtained and verified" value={d.s1_sourceOfFunds} onChange={(v) => set("s1_sourceOfFunds", v)} />
                  <YesNoRow label="Source of Wealth obtained (where applicable)" value={d.s1_sourceOfWealth} onChange={(v) => set("s1_sourceOfWealth", v)} />
                  <YesNoRow label="Ultimate Beneficial Owner(s) identified" value={d.s1_ubo} onChange={(v) => set("s1_ubo", v)} />
                  <YesNoRow label="No terrorist financing / sanctions matches identified" value={d.s1_noTerrorist} onChange={(v) => set("s1_noTerrorist", v)} />
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-4">
                <div>
                  <SectionHeader>2. Client Location</SectionHeader>
                  <div className="border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-md px-3 py-1">
                    <div className="flex justify-end gap-1 py-1 text-[10px] font-bold text-slate-500">
                      <span className="w-8 text-center">L</span>
                      <span className="w-8 text-center">M</span>
                      <span className="w-8 text-center">H</span>
                    </div>
                    <RiskRow label="Country of Residence / Incorporation" value={d.s2_countryOfResidence} onChange={(v) => set("s2_countryOfResidence", v)} />
                    <RiskRow label="Country of Operations" value={d.s2_countryOfOperations} onChange={(v) => set("s2_countryOfOperations", v)} />
                    <RiskRow label="Connected to High-Risk Jurisdiction (FATF)" value={d.s2_highRiskJurisdiction} onChange={(v) => set("s2_highRiskJurisdiction", v)} />
                    <RiskRow label="Cross-border investment activity" value={d.s2_crossBorder} onChange={(v) => set("s2_crossBorder", v)} />
                    <div className="pt-2 pb-1">
                      <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">Comments</Label>
                      <Textarea
                        value={d.s2_comments}
                        onChange={(e) => set("s2_comments", e.target.value)}
                        rows={2}
                        className="mt-1 text-xs resize-none"
                        placeholder="Additional comments..."
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3 */}
                <div>
                  <SectionHeader>3. Client Relationship</SectionHeader>
                  <div className="border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-md px-3 py-1">
                    <div className="flex justify-end gap-2 py-1 text-[10px] font-bold text-slate-500">
                      <span className="w-5 text-center">Y</span>
                      <span className="w-5 text-center">N</span>
                    </div>
                    <YesNoRow label="Client met face-to-face (physical or secure video)" value={d.s3_faceToFace} onChange={(v) => set("s3_faceToFace", v)} />
                    <YesNoRow label="Relationship established through referral" value={d.s3_referral} onChange={(v) => set("s3_referral", v)} />
                    <YesNoRow label="Referral source independently verified" value={d.s3_referralVerified} onChange={(v) => set("s3_referralVerified", v)} />
                    <YesNoRow label="Third-party acting on behalf of client" value={d.s3_thirdParty} onChange={(v) => set("s3_thirdParty", v)} />
                    <YesNoRow label="Appropriate authority documents obtained" value={d.s3_authorityDocs} onChange={(v) => set("s3_authorityDocs", v)} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 4 ─────────────────────────────────────── */}
            <div>
              <SectionHeader>4. INITIAL RISK EVALUATION — Tick all that apply</SectionHeader>
              <div className="border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-md p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div>
                    <div className="flex justify-end gap-2 pb-1 text-[10px] font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800">
                      <span className="w-5 text-center">Y</span><span className="w-5 text-center">N</span>
                    </div>
                    <YesNoRow label="Politically Exposed Person (PEP)" value={d.s4_pep} onChange={(v) => set("s4_pep", v)} />
                    <YesNoRow label="High-risk occupation / industry" value={d.s4_highRiskOcc} onChange={(v) => set("s4_highRiskOcc", v)} />
                    <YesNoRow label="Complex ownership structure" value={d.s4_complexOwnership} onChange={(v) => set("s4_complexOwnership", v)} />
                    <YesNoRow label="Nominee shareholders or directors" value={d.s4_nomineeShareholders} onChange={(v) => set("s4_nomineeShareholders", v)} />
                    <YesNoRow label="Adverse media identified" value={d.s4_adverseMedia} onChange={(v) => set("s4_adverseMedia", v)} />
                  </div>
                  <div className="md:pl-4 md:border-l border-slate-100 dark:border-slate-800">
                    <div className="flex justify-end gap-2 pb-1 text-[10px] font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800">
                      <span className="w-5 text-center">Y</span><span className="w-5 text-center">N</span>
                    </div>
                    <YesNoRow label="High-risk products or services" value={d.s4_highRiskProducts} onChange={(v) => set("s4_highRiskProducts", v)} />
                    <YesNoRow label="High transaction volumes expected" value={d.s4_highTxVolumes} onChange={(v) => set("s4_highTxVolumes", v)} />
                    <YesNoRow label="Unusual source of funds" value={d.s4_unusualSoF} onChange={(v) => set("s4_unusualSoF", v)} />
                    <YesNoRow label="High-risk jurisdiction connection" value={d.s4_highRiskJurisdictionConn} onChange={(v) => set("s4_highRiskJurisdictionConn", v)} />
                    <YesNoRow label="Other significant AML concern" value={d.s4_otherAML} onChange={(v) => set("s4_otherAML", v)} />
                  </div>
                </div>

                {/* Overall risk */}
                <div className="mt-3 flex gap-3 justify-center">
                  {([
                    { v: "low" as const, label: "LOW RISK", cls: "bg-emerald-500 border-emerald-500" },
                    { v: "medium" as const, label: "MEDIUM RISK", cls: "bg-amber-500 border-amber-500" },
                    { v: "high" as const, label: "HIGH RISK", cls: "bg-rose-500 border-rose-500" },
                  ]).map(({ v, label, cls }) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => set("s4_overallRisk", d.s4_overallRisk === v ? null : v)}
                      className={`flex-1 py-2 rounded border-2 text-xs font-bold transition-colors ${
                        d.s4_overallRisk === v
                          ? `${cls} text-white`
                          : "border-slate-300 dark:border-slate-600 text-slate-500 hover:border-current"
                      }`}
                    >
                      ☐ {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Sections 5 & 6 ────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Section 5 */}
              <div>
                <SectionHeader>5. CDD Level Required</SectionHeader>
                <div className="border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-md p-3 space-y-1">
                  {([
                    { v: "simplified" as CDD, l: "Simplified CDD" },
                    { v: "standard" as CDD, l: "Standard CDD" },
                    { v: "enhanced" as CDD, l: "Enhanced CDD" },
                  ]).map(({ v, l }) => (
                    <CheckItem
                      key={v!}
                      label={l}
                      checked={d.s5_cddLevel === v}
                      onChange={() => set("s5_cddLevel", d.s5_cddLevel === v ? null : v)}
                    />
                  ))}
                  <p className="text-xs font-semibold text-[#193388] dark:text-blue-400 pt-2">If Enhanced CDD — also obtain:</p>
                  <CheckItem label="Senior Management Approval" checked={d.s5_seniorMgmt} onChange={(v) => set("s5_seniorMgmt", v)} />
                  <CheckItem label="Enhanced Source of Wealth Verification" checked={d.s5_enhancedSoW} onChange={(v) => set("s5_enhancedSoW", v)} />
                  <CheckItem label="Enhanced Source of Funds Verification" checked={d.s5_enhancedSoF} onChange={(v) => set("s5_enhancedSoF", v)} />
                  <CheckItem label="Additional Independent Verification" checked={d.s5_additionalVerification} onChange={(v) => set("s5_additionalVerification", v)} />
                </div>
              </div>

              {/* Section 6 */}
              <div>
                <SectionHeader>6. Compliance Recommendation</SectionHeader>
                <div className="border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-md p-3 space-y-1">
                  {([
                    { v: "approve" as Rec, l: "Approve Client" },
                    { v: "approve_conditional" as Rec, l: "Approve — Subject to Additional Information" },
                    { v: "escalate" as Rec, l: "Escalate to MLRO" },
                    { v: "decline" as Rec, l: "Decline Relationship" },
                  ]).map(({ v, l }) => (
                    <CheckItem
                      key={v!}
                      label={l}
                      checked={d.s6_recommendation === v}
                      onChange={() => set("s6_recommendation", d.s6_recommendation === v ? null : v)}
                    />
                  ))}
                  <div className="pt-2">
                    <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">Reason(s)</Label>
                    <Textarea
                      value={d.s6_reasons}
                      onChange={(e) => set("s6_reasons", e.target.value)}
                      rows={3}
                      className="mt-1 text-xs resize-none"
                      placeholder="Reason for recommendation..."
                    />
                  </div>
                  <CheckItem
                    label="Ongoing Enhanced Monitoring"
                    checked={d.ongoingEnhancedMonitoring}
                    onChange={(v) => set("ongoingEnhancedMonitoring", v)}
                  />
                </div>
              </div>
            </div>

            {/* ── Sign-off ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Compliance */}
              <div>
                <SectionHeader>COMPLIANCE SIGN-OFF</SectionHeader>
                <div className="border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-md p-3 space-y-2">
                  {([
                    { k: "complianceName" as const, l: "Name" },
                    { k: "compliancePosition" as const, l: "Position" },
                    { k: "complianceSignature" as const, l: "Signature" },
                    { k: "complianceDate" as const, l: "Date", type: "date" },
                  ]).map(({ k, l, type }) => (
                    <div key={k}>
                      <Label className="text-xs text-[#193388] dark:text-blue-400 font-semibold">{l}</Label>
                      <Input
                        type={type ?? "text"}
                        value={d[k] as string}
                        onChange={(e) => set(k, e.target.value)}
                        className="mt-1 h-8 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* MLRO */}
              <div>
                <SectionHeader>MLRO APPROVAL (High-Risk Clients Only)</SectionHeader>
                <div className="border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-md p-3 space-y-2">
                  {([
                    { k: "mlroName" as const, l: "Name" },
                    { k: "mlroSignature" as const, l: "Signature" },
                    { k: "mlroDate" as const, l: "Date", type: "date" },
                  ]).map(({ k, l, type }) => (
                    <div key={k}>
                      <Label className="text-xs text-[#193388] dark:text-blue-400 font-semibold">{l}</Label>
                      <Input
                        type={type ?? "text"}
                        value={d[k] as string}
                        onChange={(e) => set(k, e.target.value)}
                        className="mt-1 h-8 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Action buttons ─────────────────────────────────── */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 gap-2 bg-[#193388] hover:bg-[#142a80] text-white"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving…" : "Save Assessment"}
              </Button>
              <Button
                variant="outline"
                onClick={() => printAML(d, clientName)}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Print / PDF
              </Button>
            </div>

          </CardContent>
        </>
      )}
    </Card>
  );
}
